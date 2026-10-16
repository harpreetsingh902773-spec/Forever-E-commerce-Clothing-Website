import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../contex/ShopContext";
import Title from "./Title";
import Productitem from "./Productitem";

const LatestCollection = () => {
  const { products } = useContext(ShopContext);
  const [latestProducts, setLatestProducts] = useState([]);

  useEffect(() => {
    setLatestProducts(products.slice(0, 10));
  }, [products]);

  return (
    <div className="my-10">
      <div className="text-center py-8 text-3xl">
        <Title title1="Latest" title2="Collection" />

        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
          Discover our latest collection of products.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 px-5 md:px-10">
        {latestProducts.map((product) => (
          <Productitem
            key={product._id}
            id={product._id}
            image={product.image}
            name={product.name}
            price={product.price}
          />
        ))}
      </div>
    </div>
  );
};

export default LatestCollection;