import { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { ShopContext } from "../contex/ShopContext";
import Title from "../components/Title";

function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date unavailable";
  return new Intl.DateTimeFormat(undefined, {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function Orders() {
  const { orders = [], currency, user } = useContext(ShopContext);
  const location = useLocation();
  const latestOrderId = location.state?.orderId;
  const totalSpent = orders.reduce((sum, order) => sum + (order.total || 0), 0);

  return (
    <main className="border-t pt-8 pb-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-1 text-xs uppercase tracking-[0.2em] text-gray-500">Your account</p>
          <div className="text-2xl">
            <Title title1="ORDER" title2="HISTORY" />
          </div>
        </div>
        {orders.length > 0 && (
          <Link to="/Collection" className="border border-black px-5 py-2 text-sm hover:bg-black hover:text-white">
            Continue shopping
          </Link>
        )}
      </div>

      {!user && <section className="mt-8 border border-gray-200 p-8 text-center"><p className="text-gray-600">Sign in to view your orders from any device.</p><Link to="/Login" className="mt-4 inline-block bg-black px-6 py-3 text-sm text-white">Sign in</Link></section>}

      {user && latestOrderId && orders.some((order) => order.id === latestOrderId) && (
        <div className="mt-5 flex items-start gap-3 border border-green-200 bg-green-50 p-4 text-sm text-green-800" role="status">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-700 text-white">✓</span>
          <div>
            <p className="font-medium">Your order is confirmed.</p>
            <p className="mt-1">We have saved your order details and delivery address.</p>
          </div>
        </div>
      )}

      {user && orders.length === 0 ? (
        <section className="mt-8 flex min-h-72 flex-col items-center justify-center border border-dashed border-gray-300 px-6 py-12 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-2xl text-gray-500">□</div>
          <h2 className="text-lg font-medium">No orders yet</h2>
          <p className="mt-2 max-w-sm text-sm leading-6 text-gray-500">
            When you place an order, its status, items, and delivery details will appear here.
          </p>
          <Link to="/Collection" className="mt-6 bg-black px-6 py-3 text-sm text-white hover:bg-gray-800">
            Explore the collection
          </Link>
        </section>
      ) : user ? (
        <>
          <section className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="border border-gray-200 p-4">
              <p className="text-sm text-gray-500">Orders placed</p>
              <p className="mt-1 text-2xl font-medium">{orders.length}</p>
            </div>
            <div className="border border-gray-200 p-4">
              <p className="text-sm text-gray-500">Total order value</p>
              <p className="mt-1 text-2xl font-medium">{currency}{totalSpent.toFixed(2)}</p>
            </div>
          </section>

          <section className="mt-8 space-y-5" aria-label="Order history">
            {orders.map((order) => {
              const address = order.deliveryInfo || {};
              const highlighted = order.id === latestOrderId;

              return (
                <article key={order.id} className={`overflow-hidden border ${highlighted ? "border-green-300" : "border-gray-200"}`}>
                  <header className="flex flex-wrap items-center justify-between gap-4 bg-gray-50 px-4 py-4 sm:px-6">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-gray-500">Order number</p>
                      <p className="mt-1 font-medium">{order.id}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-gray-500">Placed on</p>
                      <p className="mt-1 text-sm">{formatDate(order.createdAt)}</p>
                    </div>
                    <span className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-800">
                      <span className="h-2 w-2 rounded-full bg-amber-500" />
                      {order.status || "Confirmed"}
                    </span>
                  </header>

                  <div className="divide-y px-4 sm:px-6">
                    {(order.items || []).map((item, index) => (
                      <div key={`${item.productId}-${item.size}-${index}`} className="flex items-center gap-4 py-4">
                        <img src={item.image} alt={item.name} className="h-20 w-16 bg-gray-100 object-cover" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">{item.name}</p>
                          <p className="mt-1 text-sm text-gray-500">Size {item.size} <span aria-hidden="true">|</span> Qty {item.quantity}</p>
                        </div>
                        <p className="whitespace-nowrap text-sm font-medium">{currency}{(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>

                  <footer className="grid gap-6 border-t bg-white px-4 py-5 sm:grid-cols-2 sm:px-6">
                    <div className="text-sm">
                      <p className="mb-2 font-medium">Delivery address</p>
                      <p className="text-gray-600">{address.firstName} {address.lastName}</p>
                      <p className="text-gray-600">{address.street}</p>
                      <p className="text-gray-600">{[address.city, address.state, address.postalCode].filter(Boolean).join(", ")}</p>
                      <p className="text-gray-600">{address.country}{address.phone ? ` | ${address.phone}` : ""}</p>
                    </div>
                    <div className="text-sm sm:ml-auto sm:w-full sm:max-w-xs">
                      <div className="flex justify-between py-1 text-gray-600"><span>Subtotal</span><span>{currency}{(order.subtotal || 0).toFixed(2)}</span></div>
                      <div className="flex justify-between py-1 text-gray-600"><span>Delivery</span><span>{currency}{(order.deliveryFee || 0).toFixed(2)}</span></div>
                      <div className="mt-2 flex justify-between border-t pt-3 font-medium"><span>Total</span><span>{currency}{(order.total || 0).toFixed(2)}</span></div>
                      <p className="mt-2 text-right text-xs text-gray-500">{order.paymentMethod || "Cash on delivery"}</p>
                    </div>
                  </footer>
                </article>
              );
            })}
          </section>
        </>
      ) : null}
    </main>
  );
}

export default Orders;
