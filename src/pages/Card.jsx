import { useContext } from "react";
import { Link } from "react-router-dom";
import { ShopContext } from "../contex/ShopContext";
import Title from "../components/Title";
import { assets } from "../assets/assets/frontend_assets/assets";

function Card() {
  const { products, cartItems, currency, delivery_fee, updateCartQuantity } = useContext(ShopContext);
  const cartRows = products.flatMap((product) =>
    Object.entries(cartItems[product._id] || {})
      .filter(([, quantity]) => quantity > 0)
      .map(([size, quantity]) => ({ product, size, quantity })),
  );
  const total = cartRows.reduce(
    (sum, { product, quantity }) => sum + product.price * quantity,
    0,
  );

  return (
    <div className="border-t pt-8">
      <div className="mb-6 text-2xl">
        <Title title1="YOUR" title2="CART" />
      </div>

      {cartRows.length === 0 ? (
        <p className="py-10 text-gray-500">Your cart is empty.</p>
      ) : (
        <>
          <div>
            {cartRows.map(({ product, size, quantity }) => (
              <div
                key={`${product._id}-${size}`}
                className="flex items-center gap-4 border-t py-4 text-gray-700"
              >
                <img
                  src={product.image[0]}
                  alt={product.name}
                  className="h-20 w-16 object-cover"
                />
                <div className="flex-1">
                  <p className="font-medium">{product.name}</p>
                  <p className="mt-1">{currency}{product.price.toFixed(2)}</p>
                  <p className="mt-1 text-sm text-gray-500">Size: {size}</p>
                </div>
                <div className="flex items-center border">
                  <button
                    type="button"
                    onClick={() => updateCartQuantity(product._id, size, quantity - 1)}
                    className="px-3 py-1 hover:bg-gray-100"
                    aria-label={`Decrease ${product.name}, size ${size}`}
                  >
                    -
                  </button>
                  <span className="min-w-8 px-2 text-center" aria-label={`Quantity: ${quantity}`}>
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateCartQuantity(product._id, size, quantity + 1)}
                    className="px-3 py-1 hover:bg-gray-100"
                    aria-label={`Increase ${product.name}, size ${size}`}
                  >
                    +
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => updateCartQuantity(product._id, size, 0)}
                  className="p-2"
                  aria-label={`Remove ${product.name}, size ${size}`}
                >
                  <img src={assets.bin_icon} alt="" className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="ml-auto my-12 w-full sm:w-[450px]">
            <div className="mb-4 text-2xl">
              <Title title1="CART" title2="TOTALS" />
            </div>
            <div className="flex justify-between border-b py-3">
              <p>Subtotal</p>
              <p>{currency}{total.toFixed(2)}</p>
            </div>
            <div className="flex justify-between border-b py-3">
              <p>Delivery fee</p>
              <p>{currency}{delivery_fee.toFixed(2)}</p>
            </div>
            <div className="flex justify-between py-3 font-medium">
              <p>Total</p>
              <p>{currency}{(total + delivery_fee).toFixed(2)}</p>
            </div>
            <Link
              to="/PlaceOrders"
              className="mt-5 block bg-black px-6 py-3 text-center text-sm text-white hover:bg-gray-800"
            >
              PROCEED TO CHECKOUT
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

export default Card;
