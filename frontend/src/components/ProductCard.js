// NexaStore — Product Card Component
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiHeart, FiShoppingCart, FiStar } from "react-icons/fi";
import { toast } from "react-toastify";
import { addToCart } from "../actions/cartActions";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((s) => s.userLogin);

  const discountedPrice = product.discount
    ? product.price * (1 - product.discount / 100)
    : null;

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (product.countInStock === 0) return;
    dispatch(addToCart(product._id, 1));
    toast.success(`${product.name.substring(0, 30)}... added to cart!`);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    if (!userInfo) {
      toast.info("Sign in to add to wishlist");
      navigate("/login");
      return;
    }
    toast.success("Added to wishlist!");
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FiStar
        key={i}
        size={12}
        fill={i < Math.round(rating) ? "#FFD93D" : "none"}
        color={i < Math.round(rating) ? "#FFD93D" : "var(--text-muted)"}
      />
    ));
  };

  return (
    <Link to={`/product/${product._id}`} style={{ textDecoration: "none" }}>
      <div className="product-card">
        {/* Image */}
        <div className="product-image-wrap">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
          />

          {/* Badges */}
          <div className="product-badges">
            {product.isFeatured && <span className="badge badge-featured">Featured</span>}
            {product.discount > 0 && <span className="badge badge-sale">-{product.discount}%</span>}
            {product.countInStock === 0 && <span className="badge badge-out">Sold Out</span>}
            {!product.discount && product.countInStock > 0 && product.numReviews === 0 && (
              <span className="badge badge-new">New</span>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            className="wishlist-btn"
            onClick={handleWishlist}
            aria-label="Add to wishlist"
          >
            <FiHeart size={15} />
          </button>
        </div>

        {/* Info */}
        <div className="product-info">
          <div className="product-category-tag">{product.category}</div>
          <h3 className="product-name">{product.name}</h3>

          <div className="product-rating">
            <div className="stars" style={{ display: "flex", gap: 2 }}>
              {renderStars(product.rating)}
            </div>
            <span className="review-count">({product.numReviews})</span>
          </div>

          <div className="product-price-row">
            <span className="product-price">
              ${(discountedPrice ?? product.price).toFixed(2)}
            </span>
            {discountedPrice && (
              <>
                <span className="product-price-original">
                  ${product.price.toFixed(2)}
                </span>
                <span className="product-discount-pct">
                  {product.discount}% off
                </span>
              </>
            )}
          </div>
        </div>

        {/* Add to Cart */}
        <div className="product-card-actions">
          <button
            className="btn-primary btn-sm"
            style={{ flex: 1 }}
            onClick={handleAddToCart}
            disabled={product.countInStock === 0}
          >
            <FiShoppingCart size={14} />
            {product.countInStock === 0 ? "Out of Stock" : "Add to Cart"}
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
