import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { products as builtInProducts } from "../assets/assets/frontend_assets/assets";
import { toast } from "react-toastify";

export const ShopContext = createContext();
const API_URL = import.meta.env.VITE_PAYMENT_API || (import.meta.env.PROD ? window.location.origin : "http://localhost:4000");

export const ShopProvider = (props) => {
  const currency = "\u20B9";
  const delivery_fee = 5;

  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setcartItems] = useState({});
  const [customProducts, setCustomProducts] = useState(() => {
    try { return JSON.parse(localStorage.getItem("shop-custom-products") || "[]"); }
    catch { return []; }
  });
  const [orders, setOrders] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("shop-orders") || "[]");
    } catch {
      return [];
    }
  });
  const [user, setUser] = useState(null);
  const [coupons, setCoupons] = useState([]);
  const products = useMemo(
    () => [...customProducts, ...builtInProducts],
    [customProducts],
  );

  useEffect(() => {
    fetch(`${API_URL}/api/products`)
      .then((response) => response.json())
      .then(async (data) => {
        if (!Array.isArray(data.products)) return;
        let serverProducts = data.products;
        if (!serverProducts.length && user?.isAdmin) {
          try {
            const legacyProducts = JSON.parse(localStorage.getItem("shop-custom-products") || "[]");
            for (const product of legacyProducts) {
              const response = await fetch(`${API_URL}/api/products`, { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify(product) });
              if (!response.ok) break;
              const saved = await response.json();
              serverProducts = [...serverProducts, saved.product];
            }
            if (serverProducts.length) localStorage.removeItem("shop-custom-products");
          } catch { /* Keep the legacy products available if migration cannot reach the server. */ }
        }
        setCustomProducts(serverProducts);
      })
      .catch(() => {});
  }, [user]);

  useEffect(() => {
    fetch(`${API_URL}/api/auth/me`, { credentials: "include" })
      .then((response) => response.ok ? response.json() : null)
      .then((data) => setUser(data?.user || null))
      .catch(() => setUser(null));
  }, []);

  useEffect(() => {
    if (!user) return;
    fetch(`${API_URL}/api/orders`, { credentials: "include" })
      .then((response) => response.ok ? response.json() : null)
      .then((data) => { if (Array.isArray(data?.orders)) setOrders(data.orders); })
      .catch(() => {});
  }, [user]);

  const apiRequest = useCallback(async (path, options = {}) => {
    let response;
    try {
      response = await fetch(`${API_URL}${path}`, {
        credentials: "include",
        ...options,
        headers: { ...(options.body ? { "Content-Type": "application/json" } : {}), ...options.headers },
      });
    } catch { throw new Error("Cannot reach the store server. Start the server in the server folder."); }
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Store request failed.");
    return data;
  }, []);

  const authRequest = async (path, body) => {
    let response;
    try {
      response = await fetch(`${API_URL}/api/auth/${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });
    } catch {
      throw new Error("Cannot reach the account server. Start it with node index.js in the server folder.");
    }
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Account request failed.");
    if (data.user) setUser(data.user);
    return data;
  };

  const registerUser = (account) => authRequest("register", account);
  const loginUser = (credentials) => authRequest("login", credentials);
  const logoutUser = async () => {
    try {
      await authRequest("logout", {});
    } finally {
      setUser(null);
    }
  };

  const addToCart = (itemId, size) => {
    if (!size) {
      toast.error("Select Product Size");
        return;
    }
    setcartItems((currentCart) => ({
      ...currentCart,
      [itemId]: {
        ...currentCart[itemId],
        [size]: (currentCart[itemId]?.[size] || 0) + 1,
      },
    }));
  };

  const updateCartQuantity = (itemId, size, quantity) => {
    setcartItems((currentCart) => {
      const updatedItem = { ...currentCart[itemId] };
      if (quantity <= 0) delete updatedItem[size];
      else updatedItem[size] = quantity;

      const updatedCart = { ...currentCart };
      if (Object.keys(updatedItem).length === 0) delete updatedCart[itemId];
      else updatedCart[itemId] = updatedItem;
      return updatedCart;
    });
  };

  const placeOrder = async (deliveryInfo, paymentMethod = "Cash on delivery", paymentInfo = {}, couponCode = "") => {
    const items = products.flatMap((product) =>
      Object.entries(cartItems[product._id] || {})
        .filter(([, quantity]) => quantity > 0)
        .map(([size, quantity]) => ({
          productId: product._id,
          name: product.name,
          image: product.image[0],
          price: product.price,
          size,
          quantity,
        })),
    );

    if (items.length === 0) return null;
    const { order } = await apiRequest("/api/orders", {
      method: "POST",
      body: JSON.stringify({ deliveryInfo, paymentMethod, items, couponCode, ...paymentInfo }),
    });
    setOrders((current) => [order, ...current.filter((entry) => entry.id !== order.id)]);
    setcartItems({});
    return order;
  };

  const addProduct = async (product) => {
    const { product: newProduct } = await apiRequest("/api/products", { method: "POST", body: JSON.stringify(product) });
    setCustomProducts((current) => [newProduct, ...current]);
    return newProduct;
  };

  const updateProduct = async (productId, product) => {
    const { product: updated } = await apiRequest(`/api/products/${encodeURIComponent(productId)}`, { method: "PUT", body: JSON.stringify(product) });
    setCustomProducts((current) => current.map((item) => item._id === productId ? updated : item));
  };

  const removeProduct = async (productId) => {
    await apiRequest(`/api/products/${encodeURIComponent(productId)}`, { method: "DELETE" });
    setCustomProducts((current) => current.filter((product) => product._id !== productId));
    setcartItems((currentCart) => {
      const updatedCart = { ...currentCart };
      delete updatedCart[productId];
      return updatedCart;
    });
  };

  const updateOrderStatus = async (orderId, status) => {
    const { order } = await apiRequest(`/api/orders/${encodeURIComponent(orderId)}`, { method: "PATCH", body: JSON.stringify({ status }) });
    setOrders((current) => current.map((item) => item.id === orderId ? order : item));
  };
  const loadCoupons = useCallback(async () => {
    const data = await apiRequest("/api/coupons");
    setCoupons(data.coupons || []);
    return data.coupons || [];
  }, [apiRequest]);
  const saveCoupon = async (coupon) => {
    const { coupon: saved } = await apiRequest("/api/coupons", { method: "POST", body: JSON.stringify(coupon) });
    setCoupons((current) => [saved, ...current.filter((item) => item.code !== saved.code)]);
  };
  const deleteCoupon = async (code) => {
    await apiRequest(`/api/coupons/${encodeURIComponent(code)}`, { method: "DELETE" });
    setCoupons((current) => current.filter((item) => item.code !== code));
  };
  const validateCoupon = async (code, subtotal) => apiRequest("/api/coupons/validate", { method: "POST", body: JSON.stringify({ code, subtotal }) });
  const loadReviews = useCallback(async (productId) => {
    const data = await apiRequest(`/api/reviews/${encodeURIComponent(productId)}`);
    return data.reviews || [];
  }, [apiRequest]);
  const addReview = async (productId, review) => apiRequest(`/api/reviews/${encodeURIComponent(productId)}`, { method: "POST", body: JSON.stringify(review) });

  const cartCount = Object.values(cartItems).reduce(
    (total, sizes) => total + Object.values(sizes).reduce((sum, quantity) => sum + quantity, 0),
    0,
  );

  const value = {
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    orders,
    user,
    cartCount,
    addToCart,
    updateCartQuantity,
    placeOrder,
    customProducts,
    addProduct,
    removeProduct,
    updateProduct,
    updateOrderStatus,
    coupons,
    loadCoupons,
    saveCoupon,
    deleteCoupon,
    validateCoupon,
    loadReviews,
    addReview,
    registerUser,
    loginUser,
    logoutUser,
  };

  return (
    <ShopContext.Provider value={value}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopProvider;
