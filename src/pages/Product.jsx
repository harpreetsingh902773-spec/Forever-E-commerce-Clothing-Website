import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { ShopContext } from "../contex/ShopContext";
import { assets } from "../assets/assets/frontend_assets/assets";
import RelatedProduct from "../components/RelatedProduct";

function Product() {
  const { productId } = useParams();
  const { products, currency, addToCart, user, loadReviews, addReview } = useContext(ShopContext);

  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");
  const [sizeError, setSizeError] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const [reviews, setReviews] = useState([]);
  const [reviewRating, setReviewRating] = useState("5");
  const [reviewComment, setReviewComment] = useState("");

  useEffect(() => {
    loadReviews(productId).then(setReviews).catch(() => setReviews([]));
  }, [productId, loadReviews]);

  const fetchProductData = () => {
    const item = products.find((item) => item._id === productId);

    if (item) {
      setProductData(item);
      setImage(item.image[0]);
      setSize("");
      setSizeError(false);
      setAddedToCart(false);
    }
  };

  useEffect(() => {
    fetchProductData();
  }, [productId, products]);

  return productData ? (
    <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100">
      <div className="flex gap-12 flex-col sm:flex-row">
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
          <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18%] w-full">
            {productData.image.map((item, index) => (
              <img
                key={index}
                onClick={() => setImage(item)}
                src={item}
                className="aspect-[4/5] w-[24%] shrink-0 cursor-pointer border border-gray-200 bg-gray-50 object-contain sm:mb-3 sm:w-full"
                alt=""
              />
            ))}
          </div>

          <div className="aspect-[4/5] w-full overflow-hidden bg-gray-50 sm:w-[80%]">
            <img
              src={image}
              className="h-full w-full object-contain"
              alt={productData.name}
            />
          </div>
        </div>

        <div className="flex-1">
          <h1 className="text-2xl font-medium">
            {productData.name}
          </h1>

          <div className="flex items-center gap-1 mt-3">
            <img src={assets.star_icon} alt="" className="w-3.5" />
            <img src={assets.star_icon} alt="" className="w-3.5" />
            <img src={assets.star_icon} alt="" className="w-3.5" />
            <img src={assets.star_icon} alt="" className="w-3.5" />
            <img src={assets.star_icon} alt="" className="w-3.5" />
            <img src={assets.star_dull_icon} alt="" className="w-3.5" />
          </div>

          <p className="mt-5 text-2xl font-medium">
            {currency}{productData.price.toFixed(2)}
          </p>

          <p className="mt-5 text-gray-500">
            {productData.description}
          </p>

          <div className="mt-8">
            <p className="font-medium mb-4">Select Size</p>

            <div className="flex gap-3">
              {productData.sizes?.map((item, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSize(item);
                    setSizeError(false);
                    setAddedToCart(false);
                  }}
                  className={`border px-4 py-2 ${
                    size === item
                      ? "border-black bg-black text-white"
                      : "border-gray-300 bg-gray-100"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
            {size && <p className="mt-2 text-sm text-gray-500">{Number(productData.stock?.[size] ?? 99)} in stock</p>}
            {sizeError && (
              <p className="mt-2 text-sm text-red-600" role="alert">
                Please select a size.
              </p>
            )}
          </div>

          <button
            onClick={() => {
              if (!size) {
                setSizeError(true);
                return;
              }
              if (Number(productData.stock?.[size] ?? 99) <= 0) return toast.error("This size is out of stock.");
              addToCart(productData._id, size);
              setAddedToCart(true);
            }}
            className="bg-red-500 text-white px-8 py-3 mt-8 rounded-md"
          >
            ADD TO CART
          </button>
          {addedToCart && (
            <p className="mt-3 text-sm text-green-700" role="status">
              Added to cart.
            </p>
          )}

          <hr className="mt-8" />

          <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1">
            <p>100% Original Product</p>
            <p>Cash on Delivery Available</p>
            <p>Easy Return & Exchange Policy</p>
          </div>
        </div>
      </div>

      <div className="mt-20">
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab("description")}
            className={`px-5 py-3 text-sm font-medium ${
              activeTab === "description"
                ? "border-b-2 border-black"
                : "text-gray-500"
            }`}
          >
            Description
          </button>

          <button
            onClick={() => setActiveTab("reviews")}
            className={`px-5 py-3 text-sm font-medium ${
              activeTab === "reviews"
                ? "border-b-2 border-black"
                : "text-gray-500"
            }`}
          >
              Reviews ({reviews.length})
          </button>
        </div>

        <div className="border border-gray-200 p-6 text-sm text-gray-600">
          {activeTab === "description" ? (
            <div>
              <h3 className="font-medium text-gray-800 mb-3">
                Product Description
              </h3>

              <p className="leading-7">
                {productData.description}
              </p>
            </div>
          ) : (
            <div>
              <h3 className="font-medium text-gray-800 mb-3">
                Customer Reviews
              </h3>

              {reviews.length === 0 ? <p>No reviews yet. Be the first to review this product.</p> : <div className="space-y-4">{reviews.map((review) => <article key={review.id} className="border-b pb-4"><p className="font-medium">{review.name} · {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</p><p className="mt-1">{review.comment}</p></article>)}</div>}
              {user ? <form className="mt-6 grid gap-3" onSubmit={async (event) => { event.preventDefault(); try { const { review } = await addReview(productId, { rating: Number(reviewRating), comment: reviewComment }); setReviews((current) => [review, ...current]); setReviewComment(""); toast.success("Review added."); } catch (error) { toast.error(error.message); } }}><label className="text-sm">Rating<select className="ml-3 border px-2 py-1" value={reviewRating} onChange={(event) => setReviewRating(event.target.value)}>{[5, 4, 3, 2, 1].map((value) => <option key={value} value={value}>{value} stars</option>)}</select></label><textarea className="w-full border p-3" minLength="3" maxLength="1000" placeholder="Write your review" value={reviewComment} onChange={(event) => setReviewComment(event.target.value)} required /><button className="w-fit bg-black px-5 py-2 text-white">Submit review</button></form> : <p className="mt-4"><Link className="underline" to="/Login">Sign in</Link> to leave a review.</p>}
            </div>
          )}
        </div>
      </div>

      <RelatedProduct
        category={productData.category}
        subCategory={productData.subCategory}
      />
    </div>
  ) : (
    <div className="opacity-0"></div>
  );
}

export default Product;
