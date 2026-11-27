// NexaStore — Cart Screen (RRD v6)
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiArrowRight } from "react-icons/fi";
import { toast } from "react-toastify";
import { addToCart, removeFromCart } from "../actions/cartActions";
import Meta from "../components/Meta";

const CartScreen = () => {
  const { id: productId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const qty = location.search ? Number(new URLSearchParams(location.search).get("qty")) || 1 : 1;

  const { cartItems } = useSelector((s) => s.cart);
  const { userInfo } = useSelector((s) => s.userLogin);

  useEffect(() => {
    if (productId) dispatch(addToCart(productId, qty));
  }, [dispatch, productId, qty]);

  const removeHandler = (id) => {
    dispatch(removeFromCart(id));
    toast.info("Item removed from cart");
  };

  const updateQty = (product, newQty) => {
    if (newQty < 1 || newQty > product.countInStock) return;
    dispatch(addToCart(product.product, newQty));
  };

  const subtotal = cartItems.reduce((acc, i) => acc + i.qty * i.price, 0);
  const shipping = subtotal > 100 ? 0 : 10;
  const tax = subtotal * 0.15;
  const total = subtotal + shipping + tax;

  return (
    <>
      <Meta title="Shopping Cart" />
      <div className="container-custom" style={{ paddingTop: "2rem", paddingBottom: "4rem" }}>
        <h1 style={{ marginBottom: "2rem" }}>Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <div style={{ textAlign: "center", padding: "5rem 1.5rem" }}>
            <div style={{ fontSize: "5rem", marginBottom: "1.5rem" }} aria-hidden="true">🛒</div>
            <h2>Your cart is empty</h2>
            <p style={{ color: "var(--text-muted)", marginTop: "0.5rem", marginBottom: "2rem" }}>
              Looks like you haven't added anything yet. Explore our products!
            </p>
            <Link to="/" className="btn-primary">
              <FiShoppingBag size={16} aria-hidden="true" /> Start Shopping
            </Link>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 340px",
              gap: "2rem",
              alignItems: "start",
            }}
            className="cart-layout"
          >
            {/* Cart Items */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {cartItems.map((item) => (
                <div key={item.product} className="cart-item-card">
                  {/* Image */}
                  <Link to={`/product/${item.product}`}>
                    <img
                      src={item.image}
                      alt={item.name}
                      loading="lazy"
                      style={{
                        width: "100%",
                        aspectRatio: "1",
                        objectFit: "cover",
                        borderRadius: "var(--radius-sm)",
                        background: "var(--bg-secondary)",
                      }}
                    />
                  </Link>

                  {/* Info */}
                  <div>
                    <Link
                      to={`/product/${item.product}`}
                      style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: "0.9rem", lineHeight: 1.4 }}
                    >
                      {item.name}
                    </Link>
                    <div style={{ color: "var(--text-muted)", fontSize: "0.8rem", marginTop: "0.25rem" }}>
                      ${item.price.toFixed(2)} each
                    </div>

                    {/* Qty Controls */}
                    <div style={{ display: "flex", alignItems: "center", marginTop: "0.75rem", border: "1px solid var(--border-color)", borderRadius: "var(--radius-sm)", width: "fit-content", overflow: "hidden" }}>
                      <button
                        type="button"
                        onClick={() => updateQty(item, item.qty - 1)}
                        disabled={item.qty <= 1}
                        aria-label={`Decrease quantity for ${item.name}`}
                        style={{ padding: "0.3rem 0.6rem", background: "transparent", border: "none", cursor: item.qty <= 1 ? "not-allowed" : "pointer", color: "var(--text-primary)", opacity: item.qty <= 1 ? 0.4 : 1 }}
                      >
                        <FiMinus size={12} aria-hidden="true" />
                      </button>
                      <span style={{ padding: "0.3rem 0.75rem", fontWeight: 700, background: "var(--bg-secondary)", fontSize: "0.875rem" }}>
                        {item.qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQty(item, item.qty + 1)}
                        disabled={item.qty >= item.countInStock}
                        aria-label={`Increase quantity for ${item.name}`}
                        style={{ padding: "0.3rem 0.6rem", background: "transparent", border: "none", cursor: item.qty >= item.countInStock ? "not-allowed" : "pointer", color: "var(--text-primary)", opacity: item.qty >= item.countInStock ? 0.4 : 1 }}
                      >
                        <FiPlus size={12} aria-hidden="true" />
                      </button>
                    </div>
                  </div>

                  {/* Price + Remove */}
                  <div className="cart-item-actions" style={{ textAlign: "right", display: "flex", flexDirection: "column", gap: "0.75rem", alignItems: "flex-end" }}>
                    <span style={{ fontWeight: 800, fontSize: "1.1rem" }}>
                      ${(item.qty * item.price).toFixed(2)}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeHandler(item.product)}
                      className="btn-danger"
                      aria-label={`Remove ${item.name} from cart`}
                      style={{ padding: "0.4rem 0.75rem", fontSize: "0.8rem" }}
                    >
                      <FiTrash2 size={13} aria-hidden="true" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border-color)",
                borderRadius: "var(--radius-lg)",
                padding: "1.75rem",
                position: "sticky",
                top: "calc(var(--header-height) + var(--announcement-height) + 1rem)",
              }}
            >
              <h2 style={{ fontWeight: 800, marginBottom: "1.5rem", fontSize: "1.25rem" }}>Order Summary</h2>

              {[
                { label: `Subtotal (${cartItems.reduce((a, i) => a + i.qty, 0)} items)`, value: `$${subtotal.toFixed(2)}` },
                { label: "Shipping", value: shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}` },
                { label: "Tax (15%)", value: `$${tax.toFixed(2)}` },
              ].map((row) => (
                <div key={row.label} style={{ display: "flex", justifyContent: "space-between", padding: "0.65rem 0", borderBottom: "1px solid var(--border-color)", fontSize: "0.9rem", color: "var(--text-secondary)" }}>
                  <span>{row.label}</span>
                  <span style={{ fontWeight: 600, color: row.value === "FREE" ? "#22C55E" : "var(--text-primary)" }}>
                    {row.value}
                  </span>
                </div>
              ))}

              <div style={{ display: "flex", justifyContent: "space-between", padding: "1rem 0", fontWeight: 800, fontSize: "1.15rem" }}>
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>

              {shipping > 0 && (
                <div style={{ background: "rgba(108,99,255,0.1)", border: "1px solid rgba(108,99,255,0.2)", borderRadius: "var(--radius-sm)", padding: "0.65rem 0.875rem", fontSize: "0.8rem", color: "var(--brand-primary-light)", marginBottom: "1rem" }}>
                  💡 Add ${(100 - subtotal).toFixed(2)} more for free shipping!
                </div>
              )}

              <button
                type="button"
                className="btn-primary btn-block"
                onClick={() =>
                  navigate(userInfo ? "/shipping" : "/login?redirect=shipping")
                }
                style={{ marginTop: "0.5rem" }}
              >
                Proceed to Checkout <FiArrowRight size={16} aria-hidden="true" />
              </button>

              <Link
                to="/"
                className="btn-secondary btn-block"
                style={{ marginTop: "0.75rem", textAlign: "center" }}
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 900px) {
          .cart-layout { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
};

export default CartScreen;
