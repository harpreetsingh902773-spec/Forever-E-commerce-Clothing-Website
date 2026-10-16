import { useContext, useMemo, useState } from "react";
import Title from "../components/Title";
import Productitem from "../components/Productitem";
import { ShopContext } from "../contex/ShopContext";
import { assets } from "../assets/assets/frontend_assets/assets";

function Collection() {
  const { products, search, showSearch } = useContext(ShopContext);

  const [showFilter, setShowFilter] = useState(false);
  const [subcategory, setSubcategory] = useState([]);
  const [category, setCategory] = useState([]);
  const [sortType, setSortType] = useState("relevant");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedSize, setSelectedSize] = useState("");

  const toggleCategory = (e) => {
    if (category.includes(e.target.value)) {
      setCategory((prev) =>
        prev.filter((item) => item !== e.target.value)
      );
    } else {
      setCategory((prev) => [...prev, e.target.value]);
    }
  };

  const toggleSubcategory = (e) => {
    if (subcategory.includes(e.target.value)) {
      setSubcategory((prev) =>
        prev.filter((item) => item !== e.target.value)
      );
    } else {
      setSubcategory((prev) => [...prev, e.target.value]);
    }
  };

  const filterProducts = useMemo(() => {
    let productsCopy = products.filter(
      (item) =>
        (category.length === 0 ||
          category.includes(item.category.toLowerCase())) &&
        (subcategory.length === 0 ||
          subcategory.includes(item.subCategory.toLowerCase()))
    );

    if (showSearch && search) {
      productsCopy = productsCopy.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    productsCopy = productsCopy.filter((item) =>
      (!minPrice || item.price >= Number(minPrice)) &&
      (!maxPrice || item.price <= Number(maxPrice)) &&
      (!selectedSize || item.sizes?.includes(selectedSize))
    );

    switch (sortType) {
      case "low-high":
        productsCopy.sort((a, b) => a.price - b.price);
        break;

      case "high-low":
        productsCopy.sort((a, b) => b.price - a.price);
        break;

      default:
        break;
    }

    return productsCopy;
  }, [
    products,
    category,
    subcategory,
    sortType,
    search,
    showSearch,
    minPrice,
    maxPrice,
    selectedSize,
  ]);

  return (
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t">
      <div className="min-w-60">
        <p
          onClick={() => setShowFilter(!showFilter)}
          className="my-2 text-xl flex items-center cursor-pointer gap-2"
        >
          FILTERS

          <img
            className={`h-3 sm:hidden ${
              showFilter ? "rotate-90" : ""
            }`}
            src={assets.dropdown_icon}
            alt=""
          />
        </p>

        <div
          className={`border border-gray-300 pl-5 py-3 mt-6 ${
            showFilter ? "" : "hidden"
          } sm:block`}
        >
          <p className="mb-3 font-medium">CATEGORIES</p>

          <div className="flex flex-col gap-2 text-sm text-gray-600">
            <p className="flex gap-2">
              <input
                className="w-3"
                type="checkbox"
                value="men"
                onChange={toggleCategory}
              />
              Men
            </p>

            <p className="flex gap-2">
              <input
                className="w-3"
                type="checkbox"
                value="women"
                onChange={toggleCategory}
              />
              Women
            </p>

            <p className="flex gap-2">
              <input
                className="w-3"
                type="checkbox"
                value="kids"
                onChange={toggleCategory}
              />
              Kids
            </p>
          </div>
        </div>

        <div className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? "" : "hidden"} sm:block`}>
          <p className="mb-3 font-medium">PRICE RANGE (INR)</p>
          <div className="flex gap-2 pr-4">
            <input aria-label="Minimum price" className="w-1/2 border px-2 py-1 text-sm" type="number" min="0" placeholder="Min" value={minPrice} onChange={(event) => setMinPrice(event.target.value)} />
            <input aria-label="Maximum price" className="w-1/2 border px-2 py-1 text-sm" type="number" min="0" placeholder="Max" value={maxPrice} onChange={(event) => setMaxPrice(event.target.value)} />
          </div>
          <label className="mt-4 block text-sm font-medium" htmlFor="size-filter">SIZE</label>
          <select id="size-filter" className="mr-4 mt-2 w-[calc(100%-1rem)] border px-2 py-2 text-sm" value={selectedSize} onChange={(event) => setSelectedSize(event.target.value)}>
            <option value="">All sizes</option>{["S", "M", "L", "XL", "XXL"].map((size) => <option key={size}>{size}</option>)}
          </select>
        </div>

        <div
          className={`border border-gray-300 pl-5 py-3 mt-6 ${
            showFilter ? "" : "hidden"
          } sm:block`}
        >
          <p className="mb-3 font-medium">TYPE</p>

          <div className="flex flex-col gap-2 text-sm text-gray-600">
            <p className="flex gap-2">
              <input
                className="w-3"
                type="checkbox"
                value="topwear"
                onChange={toggleSubcategory}
              />
              Topwear
            </p>

            <p className="flex gap-2">
              <input
                className="w-3"
                type="checkbox"
                value="bottomwear"
                onChange={toggleSubcategory}
              />
              Bottomwear
            </p>

            <p className="flex gap-2">
              <input
                className="w-3"
                type="checkbox"
                value="winterwear"
                onChange={toggleSubcategory}
              />
              Winterwear
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1">
        <div className="flex justify-between text-base sm:text-2xl mb-4">
          <Title title1="ALL" title2="COLLECTIONS" />

          <select
            value={sortType}
            onChange={(e) => setSortType(e.target.value)}
            className="border-2 border-gray-300 text-sm px-2 py-2"
          >
            <option value="relevant">Sort by: Relevant</option>
            <option value="low-high">Sort by: Low to High</option>
            <option value="high-low">Sort by: High to Low</option>
          </select>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
          {filterProducts.map((item) => (
            <Productitem
              key={item._id}
              id={item._id}
              name={item.name}
              price={item.price}
              image={item.image}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Collection;
