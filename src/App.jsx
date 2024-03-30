/* eslint-disable react/no-unescaped-entities */
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "./App.scss";
import { CssBaseline, Rating, Slider } from "@mui/material";
import categoryIcon from "./assets/category-icon.png";
import searchPrimary from "./assets/search-primary.png";
import { useEffect, useState } from "react";
import axios from "axios";

const INITIAL_RANGE = [0, 1000];

function App() {
  const [value, setValue] = useState(INITIAL_RANGE);
  const [commitedValue, setCommitedValue] = useState(INITIAL_RANGE);
  const [loading, setLoading] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [products, setProducts] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [rating, setRating] = useState(3);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const url = `${import.meta.env.VITE_API_URL}/products/categories`;
        const categories = await axios.get(url).then((res) => res.data);
        return categories;
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    }

    async function fetchProducts() {
      try {
        const url = `${import.meta.env.VITE_API_URL}/products`;
        const products = await axios.get(url).then((res) => res.data);
        return products;
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }

    async function fetchProductAndCategories() {
      try {
        setLoading(true);
        const [categories, products] = await Promise.all([
          fetchCategories(),
          fetchProducts(),
        ]);

        setCategories(categories);
        setProducts(products);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching product and categories:", error);
        setLoading(false);
      }
    }

    fetchProductAndCategories();
  }, []);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoadingProducts(true);
        const url = `${import.meta.env.VITE_API_URL}/products`;
        const productsMatched = await axios
          .get(`${url}`)
          .then((res) => res.data)
          .then((data) => {
            let [min, max] = commitedValue;
            min = (min / 100) * INITIAL_RANGE[1];
            max = (max / 100) * INITIAL_RANGE[1];
            const newProducts = data.filter(
              (p) =>
                p.title.toLowerCase().includes(searchText.toLowerCase()) &&
                p.price >= min &&
                p.price <= max &&
                Math.round(p.rating.rate) === rating &&
                (activeCategory === "All"
                  ? true
                  : p.category === activeCategory)
            );

            return newProducts;
          });
        setProducts(productsMatched);
        setLoadingProducts(false);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }
    fetchProducts();
  }, [searchText, activeCategory, commitedValue, rating]);

  function formatPrice(percentage) {
    const maxPrice = INITIAL_RANGE[1];
    const value = (percentage / 100) * maxPrice;
    return value > maxPrice ? maxPrice : value;
  }

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleRating = (event, value) => {
    setRating(value);
  };
  const handleCommit = (event, commitedValue) => {
    setCommitedValue(commitedValue);
  };

  const handleSearchChange = async (event) => {
    setSearchText(event.target.value);
  };

  return (
    <div className="container">
      <CssBaseline />
      {loading ? (
        <div className="spinner-wrapper">
          <div className="spinner"></div>
        </div>
      ) : (
        <>
          <div className="sidebar">
            <div className="category-wrapper">
              <div className="title">
                <img src={categoryIcon} alt="" />
                <span>Category</span>
              </div>
              <ul className="categories">
                <li
                  className="category-item"
                  onClick={() => setActiveCategory("All")}
                >
                  All
                </li>
                {categories.map((c) => {
                  return (
                    <li
                      className={`category-item ${
                        c === activeCategory ? "active" : ""
                      }`}
                      key={c.id}
                      onClick={() => setActiveCategory(c)}
                    >
                      {c[0].toUpperCase() + c.slice(1)}
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className="filter-wrapper">
              <div className="title">
                <span>Filter by:</span>
              </div>
              <div className="filters">
                <div className="price-filter">
                  <div className="label">Price</div>
                  <div className="slider">
                    <Slider
                      size="small"
                      getAriaLabel={() => "Temperature range"}
                      value={value}
                      onChange={handleChange}
                      onChangeCommitted={handleCommit}
                      className="slider-widget"
                      valueLabelDisplay="off"
                    />
                    <div className="minmax">
                      <span>${formatPrice(value[0])}</span>
                      <span>${formatPrice(value[1])}</span>
                    </div>
                  </div>
                </div>
                <div className="rate-filter">
                  <div className="label">
                    <span>Rating</span>
                  </div>
                  <div className="stars">
                    <Rating
                      name="size-medium"
                      defaultValue={rating}
                      onChange={handleRating}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <main>
            <header>
              <div className="searchbar">
                <img src={searchPrimary} alt="" />
                <input
                  className="searchbar-input"
                  type="text"
                  placeholder="Search For Any Product"
                  value={searchText}
                  onChange={handleSearchChange}
                />
              </div>
              <h3 className="curr-category">
                {activeCategory[0].toUpperCase() + activeCategory.slice(1)}
              </h3>
            </header>
            <div className="body">
              {loadingProducts ? (
                <div className="spinner-wrapper">
                  <div className="spinner"></div>
                </div>
              ) : products && products.length > 0 ? (
                <>
                  <div className="stats">
                    <div className="stat">
                      <div className="label">Number of products available:</div>
                      <div className="value">{products.length}</div>
                    </div>
                    <div className="stat">
                      <div className="label">Average Price:</div>
                      <div className="value">
                        $
                        {(
                          products.reduce((a, b) => a + b.price, 0) /
                          products.length
                        ).toFixed(2)}
                      </div>
                    </div>
                    <div className="stat">
                      <div className="label">Total Price:</div>
                      <div className="value">
                        ${products.reduce((a, b) => a + b.price, 0).toFixed(2)}
                      </div>
                    </div>
                  </div>
                  <div className="main-body">
                    <div className="products">
                      {products.map((p) => (
                        <div className="product" key={p.id}>
                          <div className="product-img">
                            <img src={p.image} alt={p.description} />
                          </div>
                          <div className="product-details">
                            <div className="name">
                              {p.title.slice(0, 40) + "..."}
                            </div>
                            <div className="top">
                              <Rating
                                size="small"
                                value={p.rating.rate}
                                readOnly={true}
                              />
                              <div className="price">${p.price}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div>There's no product matching.</div>
              )}
              {}
            </div>
          </main>
        </>
      )}
    </div>
  );
}

export default App;
