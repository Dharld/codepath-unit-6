import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./product-details.styles.scss";

export default function ProductDetails() {
  const location = useLocation();
  const [product, setProduct] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    console.log(location.state);
    if (location.state && location.state.product) {
      setProduct(location.state.product);
    }
  }, [location]);

  function handleOverlayClick() {
    navigate(-1);
  }

  return (
    <section className="product-details">
      <div className="overlay" onClick={handleOverlayClick}></div>
      {product && (
        <div className="product">
          <div className="left">
            <img src={product.image} alt={product.description} />
          </div>
          <div className="right">
            <div className="name">{product.title.slice(0, 40) + "..."}</div>
            <div className="category">
              {product.category[0].toUpperCase() + product.category.slice(1)}
            </div>

            <div className="desc">
              {product.description.slice(0, 300) + "..."}
            </div>
            <div className="price">${product.price}</div>
          </div>
        </div>
      )}
    </section>
  );
}
