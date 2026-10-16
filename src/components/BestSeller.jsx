import React, { useContext } from "react";
import { ShopContext } from "../contex/ShopContext";
import Productitem from "./Productitem";
import Title from "./Title";

const BestSeller = () => {
  const { products } = useContext(ShopContext);
  const bestSellerProducts = products
    .filter((product) => product.bestseller)
    .slice(0, 5);

  return (
    <section className="my-10">
      <div className="text-center py-8 text-3xl">
        <Title title1="Best" title2="Seller" />
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
          Explore our most popular products.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 px-5 md:grid-cols-4 md:px-10">
        {bestSellerProducts.map((product) => (
          <Productitem
            key={product._id}
            id={product._id}
            image={product.image}
            name={product.name}
            price={product.price}
          />
        ))}
      </div>
    </section>
  );
};

export default BestSeller;