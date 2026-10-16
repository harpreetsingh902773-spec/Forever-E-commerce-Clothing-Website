import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { ShopContext } from "../contex/ShopContext";

const Productitem = ({ id, image, name, price }) => {
  const { currency } = useContext(ShopContext);

  return (
    <Link to={`/product/${id}`} className="text-gray-700">
      <div className="aspect-[4/5] w-full overflow-hidden bg-gray-50">
        <img
          className="h-full w-full object-contain hover:scale-105 transition ease-in-out"
          src={image[0]}
          alt={name}
        />
      </div>

      <p className="pt-3 pb-1 text-sm">{name}</p>

      <p className="text-sm font-medium">
        {currency}
        {price.toFixed(2)}
      </p>
    </Link>
  );
};

export default Productitem;
