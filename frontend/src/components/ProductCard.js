// NexaStore — Product Card Component
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiHeart, FiShoppingCart, FiStar } from "react-icons/fi";
import { toast } from "react-toastify";
import { addToCart } from "../actions/cartActions";
import { isProductWishlisted, toggleWishlistItem } from "../utils/wishlist";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((s) => s.userLogin);
  const [wishlisted, setWishlisted] = useState(() =>
    isProductWishlisted(product._id)
  );

  useEffect(() => {
    const syncWishlist = () =>
      setWishlisted(isProductWishlisted(product._id));
    window.addEventListener("wishlist:updated", syncWishlist);
    return () => window.removeEventListener("wishlist:updated", syncWishlist);
  }, [product._id]);

  const discountedPrice = product.discount
    ? product.price * (1 - product.discount / 100)
    : null;

  const handleAddToCart = () => {
    if (product.countInStock === 0) return;
    dispatch(addToCart(product._id, 1));
    const displayName =
      product.name.length > 30
        ? `${product.name.substring(0, 30)}...`
        : product.name;
    toast.success(`${displayName} added to cart!`);
  };

  const handleWishlist = () => {
    if (!userInfo) {
      toast.info("Sign in to save items to your wishlist");
      navigate("/login");
      return;
    }
    const { added } = toggleWishlistItem(product);
    setWishlisted(added);
    toast.success(added ? "Added to wishlist!" : "Removed from wishlist");
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FiStar
        key={i}
        size={12}
        aria-hidden="true"
        fill={i < Math.round(rating) ? "#FFD93D" : "none"}
        color={i < Math.round(rating) ? "#FFD93D" : "var(--text-muted)"}
      />
    ));
  };

  return (
    <article className="product-card">
      {/* Image & Wishlist */}
      <div className="product-image-wrap">
        <Link
          to={`/product/${product._id}`}
          className="product-card-link"
          style={{ width: "100%", height: "100%" }}
          aria-label={`View ${product.name}`}
        >
          <img src={product.image} alt={product.name} loading="lazy" />
        </Link>

        {/* Badges */}
        <div className="product-badges">
          {product.isFeatured && (
            <span className="badge badge-featured">Featured</span>
          )}
          {product.discount > 0 && (
            <span className="badge badge-sale">-{product.discount}%</span>
          )}
          {product.countInStock === 0 && (
            <span className="badge badge-out">Sold Out</span>
          )}
          {!product.discount &&
            product.countInStock > 0 &&
            product.numReviews === 0 && (
              <span className="badge badge-new">New</span>
            )}
        </div>

        {/* Wishlist Button */}
        <button
          type="button"
          className={`wishlist-btn ${wishlisted ? "active" : ""}`}
          onClick={handleWishlist}
          aria-label={
            wishlisted
              ? `Remove ${product.name} from wishlist`
              : `Add ${product.name} to wishlist`
          }
          aria-pressed={wishlisted}
        >
          <FiHeart
            size={15}
            aria-hidden="true"
            fill={wishlisted ? "currentColor" : "none"}
          />
        </button>
      </div>

      {/* Info */}
      <div className="product-info">
        <div className="product-category-tag">{product.category}</div>
        <Link to={`/product/${product._id}`} className="product-card-link">
          <h3 className="product-name">{product.name}</h3>
        </Link>

        <div
          className="product-rating"
          aria-label={`Rated ${product.rating} out of 5 with ${product.numReviews} reviews`}
        >
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
          type="button"
          className="btn-primary btn-sm"
          style={{ flex: 1, justifyContent: "center" }}
          onClick={handleAddToCart}
          disabled={product.countInStock === 0}
        >
          <FiShoppingCart size={14} aria-hidden="true" />
          {product.countInStock === 0 ? "Out of Stock" : "Add to Cart"}
        </button>
      </div>
    </article>
  );
};

export default ProductCard;
