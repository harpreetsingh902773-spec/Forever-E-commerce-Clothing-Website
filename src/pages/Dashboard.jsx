import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ShopContext } from "../contex/ShopContext";
import Title from "../components/Title";
import { assets } from "../assets/assets/frontend_assets/assets";

const availableSizes = ["S", "M", "L", "XL", "XXL"];
const inputClass = "w-full border border-gray-300 px-3 py-2.5 outline-none focus:border-black";

function Dashboard() {
  const { products, customProducts, addProduct, updateProduct, removeProduct, user, orders, updateOrderStatus, coupons, loadCoupons, saveCoupon, deleteCoupon } = useContext(ShopContext);
  const [sizes, setSizes] = useState([]);
  const [images, setImages] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user?.isAdmin) loadCoupons().catch(() => {});
  }, [user, loadCoupons]);

  const handleImage = (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;
    if (images.length + files.length > 4) {
      toast.error("Choose up to 4 product photos.");
      event.target.value = "";
      return;
    }
    if (files.some((file) => !file.type.startsWith("image/"))) {
      toast.error("Choose image files only.");
      event.target.value = "";
      return;
    }
    if (files.some((file) => file.size > 1_000_000)) {
      toast.error("Keep each photo under 1 MB so it fits in browser storage.");
      event.target.value = "";
      return;
    }

    Promise.all(files.map((file) => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = reject;
      reader.readAsDataURL(file);
    })))
      .then((selectedImages) => setImages((current) => [...current, ...selectedImages]))
      .catch(() => toast.error("Could not read the selected photos."))
      .finally(() => { event.target.value = ""; });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (images.length === 0) {
      toast.error("Add at least one product photo.");
      return;
    }
    if (sizes.length === 0) {
      toast.error("Choose at least one available size.");
      return;
    }

    const form = new FormData(event.currentTarget);
    const price = Number(form.get("price"));
    if (!Number.isFinite(price) || price <= 0) {
      toast.error("Enter a price greater than zero.");
      return;
    }

    setIsSaving(true);
    try {
      const stock = Object.fromEntries(sizes.map((size) => [size, Number(form.get(`stock_${size}`) || 0)]));
      await addProduct({
        name: String(form.get("name")).trim(),
        description: String(form.get("description")).trim(),
        price,
        image: images,
        category: String(form.get("category")),
        subCategory: String(form.get("subCategory")),
        sizes,
        stock,
        date: Date.now(),
        bestseller: form.get("bestseller") === "on",
      });
      event.currentTarget.reset();
      setSizes([]);
      setImages([]);
      toast.success("Product added to your collection.");
    } catch {
      toast.error("Could not save the product. Browser storage may be full.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!user?.isAdmin) return (
    <main className="border-t py-16 text-center">
      <h1 className="text-xl font-medium">Admin access required</h1>
      <p className="mt-2 text-sm text-gray-500">Sign in with the store admin account to manage products and orders.</p>
    </main>
  );

  return (
    <main className="border-t pt-8 pb-16">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-1 text-xs uppercase tracking-[0.2em] text-gray-500">Store tools</p>
          <div className="text-2xl"><Title title1="PRODUCT" title2="DASHBOARD" /></div>
        </div>
        <div className="border border-gray-200 px-5 py-3 text-sm">
          <span className="text-gray-500">Products in collection</span>
          <strong className="ml-3 text-lg">{products.length}</strong>
        </div>
      </div>

      <div className="mb-7 border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">
        Products and orders are stored by the store server. Online payment becomes available after valid Razorpay API keys are configured.
      </div>

      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.85fr)]">
        <section className="border border-gray-200 p-5 sm:p-7">
          <h1 className="mb-5 text-lg font-medium">Add a product</h1>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <label className="block text-sm">
              <span className="mb-1.5 block">Product name</span>
              <input className={inputClass} name="name" minLength={2} maxLength={100} required />
            </label>
            <label className="block text-sm">
              <span className="mb-1.5 block">Description</span>
              <textarea className={`${inputClass} min-h-24 resize-y`} name="description" maxLength={1000} required />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm">
                <span className="mb-1.5 block">Price (INR)</span>
                <input className={inputClass} name="price" type="number" min="0.01" step="0.01" required />
              </label>
              <label className="block text-sm">
                <span className="mb-1.5 block">Category</span>
                <select className={inputClass} name="category" required defaultValue="">
                  <option value="" disabled>Select category</option>
                  <option value="Men">Men</option>
                  <option value="Women">Women</option>
                  <option value="Kids">Kids</option>
                </select>
              </label>
            </div>
            <label className="block text-sm">
              <span className="mb-1.5 block">Subcategory</span>
              <select className={inputClass} name="subCategory" required defaultValue="">
                <option value="" disabled>Select subcategory</option>
                <option value="Topwear">Topwear</option>
                <option value="Bottomwear">Bottomwear</option>
                <option value="Winterwear">Winterwear</option>
              </select>
            </label>
            <fieldset>
              <legend className="mb-2 text-sm">Available sizes</legend>
              <div className="flex flex-wrap gap-2">
                {availableSizes.map((size) => (
                  <label key={size} className={`cursor-pointer border px-3 py-2 text-sm ${sizes.includes(size) ? "border-black bg-black text-white" : "border-gray-300"}`}>
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={sizes.includes(size)}
                      onChange={() => setSizes((current) => current.includes(size) ? current.filter((value) => value !== size) : [...current, size])}
                    />
                    {size}
                  </label>
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend className="mb-2 text-sm">Stock quantity by selected size</legend>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {sizes.map((size) => <label key={size} className="text-xs text-gray-600">Size {size}<input className={`${inputClass} mt-1`} name={`stock_${size}`} type="number" min="0" step="1" defaultValue="10" required /></label>)}
              </div>
            </fieldset>
            <label className="block text-sm">
              <span className="mb-1.5 block">Product photos (up to 4; select multiple together or add them one at a time, max 1 MB each)</span>
              <input className="block w-full text-sm text-gray-600 file:mr-4 file:border-0 file:bg-gray-100 file:px-4 file:py-2 file:text-sm" type="file" accept="image/*" multiple onChange={handleImage} />
            </label>
            {images.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {images.map((preview, index) => (
                  <div key={index} className="relative">
                    <img
                      src={preview}
                      alt={`Product photo ${index + 1}`}
                      className="h-32 w-24 border border-gray-200 bg-gray-50 p-1 object-contain"
                    />
                    <button
                      type="button"
                      onClick={() => setImages((current) => current.filter((_, imageIndex) => imageIndex !== index))}
                      className="absolute right-1 top-1 bg-white px-1.5 text-sm shadow"
                      aria-label={`Remove photo ${index + 1}`}
                    >×</button>
                  </div>
                ))}
              </div>
            )}
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="bestseller" className="accent-black" />
              Mark as bestseller
            </label>
            <button type="submit" disabled={isSaving} className="bg-black px-6 py-3 text-sm text-white hover:bg-gray-800 disabled:opacity-60">
              {isSaving ? "SAVING..." : "ADD PRODUCT"}
            </button>
          </form>
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-medium">Your added products</h2>
            <span className="text-sm text-gray-500">{customProducts.length} total</span>
          </div>
          {customProducts.length === 0 ? (
            <div className="border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500">
              Products you add will appear here and in the collection.
            </div>
          ) : (
            <div className="divide-y border-y border-gray-200">
              {customProducts.map((product) => (
                <article key={product._id} className="flex items-center gap-4 py-4">
                  <div className="flex shrink-0 gap-1">
                    {product.image.slice(0, 4).map((photo, index) => (
                      <img key={index} src={photo} alt={`${product.name} photo ${index + 1}`} className="h-20 w-16 border border-gray-100 bg-gray-50 p-1 object-contain" />
                    ))}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{product.name}</p>
                    <p className="mt-1 text-xs text-gray-500">{product.category} / {product.subCategory}</p>
                    <p className="mt-1 text-sm">₹{product.price.toFixed(2)}</p>
                  </div>
                  <button
                    type="button"
                    onClick={async () => {
                      const name = window.prompt("Product name", product.name);
                      if (name === null) return;
                      const priceText = window.prompt("Price", String(product.price));
                      if (priceText === null) return;
                      const price = Number(priceText);
                      if (name.trim().length < 2 || !Number.isFinite(price) || price <= 0) return toast.error("Enter a valid name and price.");
                      const description = window.prompt("Description", product.description || "");
                      if (description === null) return;
                      const sizeText = window.prompt("Available sizes separated by commas (S, M, L, XL, XXL)", product.sizes.join(", "));
                      if (sizeText === null) return;
                      const nextSizes = [...new Set(sizeText.split(",").map((value) => value.trim().toUpperCase()).filter((value) => availableSizes.includes(value)))];
                      if (!nextSizes.length) return toast.error("Keep at least one valid size.");
                      const nextStock = { ...product.stock };
                      for (const size of nextSizes) {
                        const quantity = window.prompt(`Stock for size ${size}`, String(nextStock[size] ?? 0));
                        if (quantity === null || !/^\d+$/.test(quantity)) return toast.error("Stock must be a whole number of zero or more.");
                        nextStock[size] = Number(quantity);
                      }
                      try {
                        await updateProduct(product._id, { ...product, name: name.trim(), description, price, sizes: nextSizes, stock: nextStock });
                        toast.success("Product updated.");
                      } catch (error) { toast.error(error.message); }
                    }}
                    className="border px-3 py-2 text-xs hover:bg-gray-100"
                  >Edit</button>
                  <label className="cursor-pointer border px-3 py-2 text-xs hover:bg-gray-100">
                    Photos
                    <input className="hidden" type="file" accept="image/*" multiple onChange={async (event) => {
                      const files = Array.from(event.target.files || []);
                      event.target.value = "";
                      if (!files.length) return;
                      if (files.length > 4 || files.some((file) => !file.type.startsWith("image/") || file.size > 1_000_000)) return toast.error("Select up to 4 image files, each under 1 MB.");
                      try {
                        const photos = await Promise.all(files.map((file) => new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result)); reader.onerror = reject; reader.readAsDataURL(file); })));
                        await updateProduct(product._id, { ...product, image: photos });
                        toast.success("Product photos updated.");
                      } catch (error) { toast.error(error.message || "Could not update photos."); }
                    }} />
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm(`Delete ${product.name} from your products?`)) {
                        removeProduct(product._id).then(() => toast.success("Product deleted.")).catch((error) => toast.error(error.message));
                      }
                    }}
                    className="p-2 hover:bg-gray-100"
                    aria-label={`Delete ${product.name}`}
                    title="Delete product"
                  >
                    <img src={assets.bin_icon} alt="" className="h-4 w-4" />
                  </button>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>

      <section className="mt-10 border border-gray-200 p-5 sm:p-7">
        <h2 className="mb-4 text-lg font-medium">Order management</h2>
        {orders.length === 0 ? <p className="text-sm text-gray-500">No customer orders yet.</p> : <div className="divide-y">{orders.map((order) => <article key={order.id} className="flex flex-wrap items-center justify-between gap-3 py-4 text-sm"><div><p className="font-medium">{order.id} · {order.customer?.name || order.deliveryInfo?.firstName}</p><p className="mt-1 text-gray-500">{order.items?.length || 0} items · ₹{Number(order.total).toFixed(2)}</p></div><select className="border px-3 py-2" value={order.status} onChange={(event) => updateOrderStatus(order.id, event.target.value).catch((error) => toast.error(error.message))}>{["Confirmed", "Processing", "Shipped", "Delivered", "Cancelled"].map((status) => <option key={status}>{status}</option>)}</select></article>)}</div>}
      </section>

      <section className="mt-8 border border-gray-200 p-5 sm:p-7">
        <h2 className="mb-4 text-lg font-medium">Discount coupons</h2>
        <form className="grid gap-3 sm:grid-cols-[1fr_140px_150px_auto]" onSubmit={async (event) => { event.preventDefault(); const form = new FormData(event.currentTarget); try { await saveCoupon({ code: form.get("code"), type: form.get("type"), value: Number(form.get("value")) }); event.currentTarget.reset(); toast.success("Coupon saved."); } catch (error) { toast.error(error.message); } }}>
          <input className={inputClass} name="code" placeholder="Coupon code" minLength="3" maxLength="24" required />
          <select className={inputClass} name="type"><option value="percent">Percent</option><option value="fixed">Fixed INR</option></select>
          <input className={inputClass} name="value" type="number" min="1" step="0.01" placeholder="Discount" required />
          <button className="bg-black px-5 py-2 text-sm text-white">Save coupon</button>
        </form>
        <p className="mt-2 text-xs text-gray-500">Use 3–24 letters or numbers for the code. Percentage discounts must be 1–100; fixed INR discounts must be greater than 0. `WELCOME10` is already saved and gives 10% off.</p>
        {coupons.length > 0 && <div className="mt-4 divide-y">{coupons.map((coupon) => <div key={coupon.code} className="flex justify-between py-3 text-sm"><span><strong>{coupon.code}</strong> · {coupon.type === "percent" ? `${coupon.value}%` : `₹${coupon.value}`}</span><button onClick={() => deleteCoupon(coupon.code).catch((error) => toast.error(error.message))} className="text-red-700">Delete</button></div>)}</div>}
      </section>
    </main>
  );
}

export default Dashboard;
