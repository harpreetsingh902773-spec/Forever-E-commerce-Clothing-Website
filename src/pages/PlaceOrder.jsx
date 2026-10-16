import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ShopContext } from "../contex/ShopContext";
import Title from "../components/Title";

const PAYMENT_API = import.meta.env.VITE_PAYMENT_API || (import.meta.env.PROD ? window.location.origin : "http://localhost:4000");

function loadRazorpay() {
  if (window.Razorpay) return Promise.resolve(true);
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

function PlaceOrder() {
  const { products, cartItems, currency, delivery_fee, placeOrder, user, validateCoupon } = useContext(ShopContext);
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("Cash on delivery");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const [razorpayEnabled, setRazorpayEnabled] = useState(false);
  const [checkingPaymentConfig, setCheckingPaymentConfig] = useState(true);
  const cartRows = products.flatMap((product) =>
    Object.entries(cartItems[product._id] || {})
      .filter(([, quantity]) => quantity > 0)
      .map(([size, quantity]) => ({ product, size, quantity })),
  );
  const subtotal = cartRows.reduce(
    (sum, { product, quantity }) => sum + product.price * quantity,
    0,
  );
  useEffect(() => {
    fetch(`${PAYMENT_API}/api/payments/config`)
      .then((response) => response.ok ? response.json() : null)
      .then((config) => setRazorpayEnabled(Boolean(config?.razorpayEnabled)))
      .catch(() => setRazorpayEnabled(false))
      .finally(() => setCheckingPaymentConfig(false));
  }, []);

  const activePaymentMethod = razorpayEnabled ? paymentMethod : "Cash on delivery";

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;
    if (!user) {
      toast.error("Please sign in before placing an order.");
      navigate("/Login");
      return;
    }
    setIsSubmitting(true);
    const deliveryInfo = Object.fromEntries(new FormData(event.currentTarget));

    if (activePaymentMethod === "Cash on delivery") {
      try {
        const order = await placeOrder(deliveryInfo, activePaymentMethod, {}, appliedCoupon);
        if (order) navigate("/Orders", { state: { orderId: order.id } });
        else setIsSubmitting(false);
      } catch (error) { toast.error(error.message); setIsSubmitting(false); }
      return;
    }

    try {
      const loaded = await loadRazorpay();
      if (!loaded) throw new Error("Razorpay Checkout could not be loaded. Check your connection and try again.");

      const orderResponse = await fetch(`${PAYMENT_API}/api/payments/create-order`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          couponCode: appliedCoupon,
          items: cartRows.map(({ product, size, quantity }) => ({
            productId: product._id,
            size,
            quantity,
          })),
        }),
      });
      const paymentOrder = await orderResponse.json();
      if (!orderResponse.ok) throw new Error(paymentOrder.error || "Could not start payment.");

      const checkout = new window.Razorpay({
        key: paymentOrder.keyId,
        amount: paymentOrder.amount,
        currency: paymentOrder.currency,
        name: "Forever Store",
        description: "Complete your order",
        order_id: paymentOrder.orderId,
        prefill: {
          name: `${deliveryInfo.firstName} ${deliveryInfo.lastName}`,
          email: deliveryInfo.email,
          contact: deliveryInfo.phone,
        },
        theme: { color: "#111827" },
        handler: async (paymentResult) => {
          try {
            const verifyResponse = await fetch(`${PAYMENT_API}/api/payments/verify`, {
              method: "POST",
              credentials: "include",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(paymentResult),
            });
            const verification = await verifyResponse.json();
            if (!verifyResponse.ok || !verification.verified) {
              throw new Error(verification.error || "Payment could not be verified.");
            }
            const order = await placeOrder(deliveryInfo, "Razorpay", {
              paymentId: verification.paymentId,
              paymentOrderId: verification.orderId,
            }, appliedCoupon);
            if (!order) throw new Error("Your cart is empty. Please add the items again.");
            navigate("/Orders", { state: { orderId: order.id } });
          } catch (error) {
            toast.error(error.message || "Payment verification failed.");
            setIsSubmitting(false);
          }
        },
        modal: { ondismiss: () => setIsSubmitting(false) },
      });
      checkout.on("payment.failed", (failure) => {
        toast.error(failure.error?.description || "Payment failed. Please try again.");
        setIsSubmitting(false);
      });
      checkout.open();
    } catch (error) {
      toast.error(error.message || "Could not start payment.");
      setIsSubmitting(false);
    }
  };

  if (cartRows.length === 0) {
    return (
      <div className="border-t py-12">
        <p className="mb-4 text-gray-600">Your cart is empty.</p>
        <Link to="/Collection" className="underline">Continue shopping</Link>
      </div>
    );
  }

  const inputClass = "w-full border border-gray-300 px-3 py-3 outline-none focus:border-gray-600";
  const payableTotal = Math.max(0, subtotal - couponDiscount) + delivery_fee;

  return (
    <div className="border-t pt-8">
      <div className="mb-8 text-2xl">
        <Title title1="CHECKOUT" title2="DETAILS" />
      </div>

      <div className="flex flex-col-reverse gap-12 md:flex-row md:items-start">
        <form className="flex-1" onSubmit={handleSubmit}>
          <h2 className="mb-5 text-lg font-medium">Delivery information</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <input className={inputClass} name="firstName" placeholder="First name" autoComplete="given-name" required />
            <input className={inputClass} name="lastName" placeholder="Last name" autoComplete="family-name" required />
            <input className={`${inputClass} sm:col-span-2`} name="email" type="email" placeholder="Email address" autoComplete="email" required />
            <input className={`${inputClass} sm:col-span-2`} name="street" placeholder="Street address" autoComplete="street-address" required />
            <input className={inputClass} name="city" placeholder="City" autoComplete="address-level2" required />
            <input className={inputClass} name="state" placeholder="State / Province" autoComplete="address-level1" required />
            <input className={inputClass} name="postalCode" placeholder="Postal code" autoComplete="postal-code" required />
            <input className={inputClass} name="country" placeholder="Country" autoComplete="country-name" required />
            <input className={`${inputClass} sm:col-span-2`} name="phone" type="tel" placeholder="Phone number" autoComplete="tel" required />
          </div>

          <div className="mt-7 border p-4">
            <label className="mb-2 block text-sm font-medium" htmlFor="coupon-code">Discount coupon</label>
            <div className="flex gap-2"><input id="coupon-code" className="min-w-0 flex-1 border px-3 py-2 text-sm uppercase" value={couponCode} onChange={(event) => setCouponCode(event.target.value.toUpperCase())} placeholder="Enter code" disabled={Boolean(appliedCoupon)} /><button type="button" disabled={Boolean(appliedCoupon) || !couponCode.trim()} onClick={async () => { try { const result = await validateCoupon(couponCode, subtotal); setCouponDiscount(result.discount); setAppliedCoupon(result.code); toast.success("Coupon applied."); } catch (error) { toast.error(error.message); } }} className="border px-4 text-sm disabled:opacity-50">{appliedCoupon ? "APPLIED" : "APPLY"}</button>{appliedCoupon && <button type="button" onClick={() => { setAppliedCoupon(""); setCouponDiscount(0); }} className="text-sm underline">Remove</button>}</div>
            {appliedCoupon && <p className="mt-2 text-sm text-green-700">{appliedCoupon} applied · save {currency}{couponDiscount.toFixed(2)}</p>}
          </div>

          <fieldset className="mt-8">
            <legend className="mb-4 text-lg font-medium">Payment method</legend>
            <label className="flex cursor-pointer items-start gap-3 border border-gray-300 p-4">
              <input
                type="radio"
                name="paymentMethod"
                value="Cash on delivery"
                checked={activePaymentMethod === "Cash on delivery"}
                onChange={(event) => setPaymentMethod(event.target.value)}
                className="mt-1 accent-black"
              />
              <span>
                <span className="block text-sm font-medium">Cash on delivery</span>
                <span className="mt-1 block text-xs text-gray-500">Pay when your order arrives.</span>
              </span>
            </label>
            <label className="mt-3 flex cursor-pointer items-start gap-3 border border-gray-300 p-4">
              <input
                type="radio"
                name="paymentMethod"
                value="Razorpay"
                disabled={!razorpayEnabled || checkingPaymentConfig}
                checked={activePaymentMethod === "Razorpay"}
                onChange={(event) => setPaymentMethod(event.target.value)}
                className="mt-1 accent-black disabled:cursor-not-allowed"
              />
              <span>
                <span className="block text-sm font-medium">Pay online with Razorpay</span>
                <span className="mt-1 block text-xs text-gray-500">
                  {razorpayEnabled
                    ? "Cards, UPI, and other methods available in Razorpay Checkout."
                    : "Online payment is unavailable until Razorpay test keys are set in server/.env."}
                </span>
              </span>
            </label>
          </fieldset>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-7 bg-black px-8 py-3 text-sm text-white hover:bg-gray-800 disabled:cursor-wait disabled:opacity-60"
          >
            {isSubmitting
              ? "PROCESSING..."
              : activePaymentMethod === "Razorpay"
                ? `PAY ${currency}${payableTotal.toFixed(2)} WITH RAZORPAY`
                : `PLACE ORDER - ${currency}${payableTotal.toFixed(2)}`}
          </button>
        </form>

        <aside className="w-full border p-5 md:w-[360px]">
          <h2 className="mb-4 text-lg font-medium">Order summary</h2>
          <div className="max-h-72 space-y-4 overflow-y-auto">
            {cartRows.map(({ product, size, quantity }) => (
              <div key={`${product._id}-${size}`} className="flex justify-between gap-4 text-sm">
                <div>
                  <p className="font-medium">{product.name}</p>
                  <p className="mt-1 text-gray-500">Size {size} | Qty {quantity}</p>
                </div>
                <p className="whitespace-nowrap">{currency}{(product.price * quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 space-y-3 border-t pt-4 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>{currency}{subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Delivery</span><span>{currency}{delivery_fee.toFixed(2)}</span></div>
            {couponDiscount > 0 && <div className="flex justify-between text-green-700"><span>Discount</span><span>-{currency}{couponDiscount.toFixed(2)}</span></div>}
            <div className="flex justify-between border-t pt-3 font-medium"><span>Total</span><span>{currency}{payableTotal.toFixed(2)}</span></div>
            <p className="pt-1 text-right text-xs text-gray-500">{activePaymentMethod}</p>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default PlaceOrder;
