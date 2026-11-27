// NexaStore — Product Detail Screen (RRD v6)
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FiShoppingCart,
  FiHeart,
  FiStar,
  FiMinus,
  FiPlus,
  FiArrowLeft,
  FiCheck,
  FiTruck,
  FiShield,
} from "react-icons/fi";

import Rating from "../components/Rating";
import {
  listProductDetails,
  createProductReview,
} from "../actions/productActions";
import { PRODUCT_CREATE_REVIEW_RESET } from "../constants/productConstants";
import { addToCart } from "../actions/cartActions";
import { isProductWishlisted, toggleWishlistItem } from "../utils/wishlist";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Meta from "../components/Meta";

const ProductScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [wishlisted, setWishlisted] = useState(() => isProductWishlisted(id));

  const { loading, error, product } = useSelector((s) => s.productDetails);
  const { error: reviewError, success: reviewSuccess } = useSelector(
    (s) => s.productReviewCreate
  );
  const { userInfo } = useSelector((s) => s.userLogin);

  useEffect(() => {
    if (reviewSuccess) {
      toast.success("Review submitted successfully!");
      setRating(0);
      setComment("");
      dispatch({ type: PRODUCT_CREATE_REVIEW_RESET });
    }
    dispatch(listProductDetails(id));
  }, [dispatch, id, reviewSuccess]);

  useEffect(() => {
    setWishlisted(isProductWishlisted(id));
  }, [id]);

  if (error) {
    return (
      <div className="container-custom" style={{ paddingTop: "2rem", paddingBottom: "4rem" }}>
        <Message variant="danger">{error}</Message>
      </div>
    );
  }
  if (loading || !product?._id) {
    return (
      <div className="container-custom">
        <Loader />
      </div>
    );
  }

  const handleAddToCart = () => {
    dispatch(addToCart(id, qty));
    const shortName =
      product.name.length > 30
        ? `${product.name.substring(0, 30)}...`
        : product.name;
    toast.success(`${shortName} added to cart!`);
  };

  const handleBuyNow = () => {
    dispatch(addToCart(id, qty));
    navigate("/cart");
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

  const handleReview = (e) => {
    e.preventDefault();
    if (!rating) {
      toast.error("Please select a rating");
      return;
    }
    if (!comment.trim()) {
      toast.error("Please write a comment");
      return;
    }
    dispatch(createProductReview(id, { rating, comment }));
  };

  const changeQty = (delta) => {
    setQty((q) =>
      Math.min(Math.max(1, q + delta), product?.countInStock || 1)
    );
  };

  const discountedPrice = product?.discount
    ? product.price * (1 - product.discount / 100)
    : null;

  return (
    <>
      <Meta title={product.name} description={product.description} />
      <div className="container-custom" style={{ paddingTop: "2rem", paddingBottom: "4rem" }}>
        {/* Back */}
        <Link
          to="/"
          className="btn-secondary btn-sm"
          style={{ display: "inline-flex", marginBottom: "2rem" }}
        >
          <FiArrowLeft size={15} aria-hidden="true" /> Back to Products
        </Link>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "3rem",
            alignItems: "start",
          }}
          className="product-detail-grid"
        >
          {/* Image */}
          <div>
            <div
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border-color)",
                borderRadius: "var(--radius-xl)",
                overflow: "hidden",
                aspectRatio: "1",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                src={product.image}
                alt={product.name}
                style={{ width: "80%", height: "80%", objectFit: "contain" }}
              />
            </div>
          </div>

          {/* Info */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div>
              <span className="product-category-tag" style={{ fontSize: "0.8rem" }}>
                {product.brand} · {product.category}
              </span>
              <h1 style={{ fontSize: "clamp(1.4rem, 3vw, 2rem)", fontWeight: 800, marginTop: "0.5rem" }}>
                {product.name}
              </h1>
            </div>

            {/* Rating */}
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <Rating value={product.rating} />
              <span style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
                {product.numReviews} reviews
              </span>
            </div>

            {/* Price */}
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
              <span style={{ fontSize: "2rem", fontWeight: 800 }}>
                ${(discountedPrice ?? product.price).toFixed(2)}
              </span>
              {discountedPrice && (
                <>
                  <span style={{ fontSize: "1.1rem", color: "var(--text-muted)", textDecoration: "line-through" }}>
                    ${product.price.toFixed(2)}
                  </span>
                  <span className="product-discount-pct">{product.discount}% off</span>
                </>
              )}
            </div>

            {/* Description */}
            <p style={{ color: "var(--text-secondary)", lineHeight: 1.8 }}>
              {product.description}
            </p>

            {/* Stock & Qty */}
            <div
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border-color)",
                borderRadius: "var(--radius-md)",
                padding: "1.25rem",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>Availability</span>
                {product.countInStock > 0 ? (
                  <span style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "#22C55E", fontWeight: 600, fontSize: "0.875rem" }}>
                    <FiCheck size={14} aria-hidden="true" /> In Stock ({product.countInStock} left)
                  </span>
                ) : (
                  <span style={{ color: "#EF4444", fontWeight: 600, fontSize: "0.875rem" }}>Out of Stock</span>
                )}
              </div>

              {product.countInStock > 0 && (
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <span style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>Quantity</span>
                  <div style={{ display: "flex", alignItems: "center", border: "1px solid var(--border-color)", borderRadius: "var(--radius-sm)", overflow: "hidden" }}>
                    <button
                      type="button"
                      onClick={() => changeQty(-1)}
                      disabled={qty <= 1}
                      aria-label="Decrease quantity"
                      style={{ padding: "0.5rem 0.75rem", background: "transparent", border: "none", color: "var(--text-primary)", cursor: qty <= 1 ? "not-allowed" : "pointer", opacity: qty <= 1 ? 0.4 : 1 }}
                    >
                      <FiMinus size={14} aria-hidden="true" />
                    </button>
                    <span style={{ padding: "0.5rem 1rem", fontWeight: 700, background: "var(--bg-secondary)", minWidth: "50px", textAlign: "center" }}>
                      {qty}
                    </span>
                    <button
                      type="button"
                      onClick={() => changeQty(1)}
                      disabled={qty >= product.countInStock}
                      aria-label="Increase quantity"
                      style={{ padding: "0.5rem 0.75rem", background: "transparent", border: "none", color: "var(--text-primary)", cursor: qty >= product.countInStock ? "not-allowed" : "pointer", opacity: qty >= product.countInStock ? 0.4 : 1 }}
                    >
                      <FiPlus size={14} aria-hidden="true" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button
                type="button"
                className="btn-primary"
                style={{ flex: 2, justifyContent: "center" }}
                onClick={handleAddToCart}
                disabled={product.countInStock === 0}
              >
                <FiShoppingCart size={16} aria-hidden="true" />
                {product.countInStock === 0 ? "Out of Stock" : "Add to Cart"}
              </button>
              <button
                type="button"
                className="btn-secondary"
                style={{ flex: 1, justifyContent: "center" }}
                onClick={handleWishlist}
                aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
                aria-pressed={wishlisted}
              >
                <FiHeart
                  size={16}
                  aria-hidden="true"
                  fill={wishlisted ? "var(--brand-secondary)" : "none"}
                  color={wishlisted ? "var(--brand-secondary)" : "currentColor"}
                />
              </button>
            </div>

            {product.countInStock > 0 && (
              <button type="button" className="btn-secondary btn-block" onClick={handleBuyNow}>
                Buy Now →
              </button>
            )}

            {/* Trust Badges */}
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              {[
                { icon: <FiTruck size={14} aria-hidden="true" />, text: "Free shipping over $100" },
                { icon: <FiShield size={14} aria-hidden="true" />, text: "2-year warranty" },
              ].map((b) => (
                <div
                  key={b.text}
                  style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "var(--text-muted)", fontSize: "0.8rem" }}
                >
                  {b.icon} {b.text}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Reviews ── */}
        <section style={{ marginTop: "4rem" }} aria-label="Customer reviews">
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "2rem" }}>
            Customer Reviews ({product.numReviews})
          </h2>

          {product.reviews?.length === 0 && (
            <Message variant="info">No reviews yet. Be the first to review!</Message>
          )}

          <div className="reviews-grid">
            {/* Review List */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {product.reviews?.map((review) => (
                <div
                  key={review._id}
                  style={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "var(--radius-md)",
                    padding: "1.25rem",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                    <strong>{review.name}</strong>
                    <span style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <Rating value={review.rating} />
                  <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", marginTop: "0.75rem", lineHeight: 1.7 }}>
                    {review.comment}
                  </p>
                </div>
              ))}
            </div>

            {/* Write Review Form */}
            <div
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border-color)",
                borderRadius: "var(--radius-md)",
                padding: "1.5rem",
              }}
            >
              <h3 style={{ fontWeight: 700, marginBottom: "1.25rem" }}>Write a Review</h3>
              {reviewError && <Message variant="danger">{reviewError}</Message>}
              {userInfo ? (
                <form onSubmit={handleReview} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div className="form-group">
                    <span className="form-label" id="review-rating-label">Rating</span>
                    <div role="radiogroup" aria-labelledby="review-rating-label" style={{ display: "flex", gap: "0.5rem" }}>
                      {[1, 2, 3, 4, 5].map((r) => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => setRating(r)}
                          aria-label={`Rate ${r} out of 5 stars`}
                          aria-pressed={rating === r}
                          style={{
                            background: "transparent",
                            border: "none",
                            cursor: "pointer",
                            fontSize: "1.5rem",
                            opacity: r <= rating ? 1 : 0.3,
                            transition: "opacity 0.15s",
                          }}
                        >
                          ⭐
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="review-comment" className="form-label">Comment</label>
                    <textarea
                      id="review-comment"
                      className="form-control"
                      rows="4"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Share your experience with this product..."
                    />
                  </div>
                  <button type="submit" className="btn-primary">
                    <FiStar size={15} aria-hidden="true" /> Submit Review
                  </button>
                </form>
              ) : (
                <Message variant="info">
                  Please{" "}
                  <Link to="/login" style={{ color: "var(--brand-primary)", fontWeight: 600 }}>
                    sign in
                  </Link>{" "}
                  to write a review.
                </Message>
              )}
            </div>
          </div>
        </section>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .product-detail-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
};

export default ProductScreen;
