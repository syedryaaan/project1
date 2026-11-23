// NexaStore — Login Screen (RRD v6)
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiMail, FiLock, FiArrowRight } from "react-icons/fi";
import { toast } from "react-toastify";

import Message from "../components/Message";
import Loader from "../components/Loader";
import Meta from "../components/Meta";
import { login } from "../actions/userActions";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { loading, error, userInfo } = useSelector((s) => s.userLogin);

  const redirect = new URLSearchParams(location.search).get("redirect") || "/";

  useEffect(() => {
    if (userInfo) navigate(redirect === "shipping" ? "/shipping" : redirect);
  }, [userInfo, navigate, redirect]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) { toast.error("Please fill in all fields"); return; }
    dispatch(login(email, password));
  };

  return (
    <>
      <Meta title="Sign In" />
      <div className="form-container">
        <div className="form-card">
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <div className="nexa-logo" style={{ fontSize: "1.75rem", justifyContent: "center", display: "flex" }}>
              Nexa<span style={{ color: "var(--brand-secondary)" }}>Store</span>
            </div>
            <h1 className="form-title" style={{ marginTop: "1.5rem" }}>Welcome back</h1>
            <p className="form-subtitle">Sign in to your account to continue shopping</p>
          </div>

          {loading && <Loader message="Signing in..." />}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0" }}>
            <div className="form-group">
              <label className="form-label">
                <FiMail size={14} style={{ marginRight: "0.4rem", verticalAlign: "middle" }} />
                Email Address
              </label>
              <input
                type="email"
                className="form-control"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <FiLock size={14} style={{ marginRight: "0.4rem", verticalAlign: "middle" }} />
                Password
              </label>
              <input
                type="password"
                className="form-control"
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>

            <button type="submit" className="btn-primary btn-block" style={{ marginTop: "1rem" }} disabled={loading}>
              Sign In <FiArrowRight size={16} />
            </button>
          </form>

          <div style={{ textAlign: "center", marginTop: "1.5rem", color: "var(--text-secondary)", fontSize: "0.875rem" }}>
            New to NexaStore?{" "}
            <Link
              to={redirect ? `/register?redirect=${redirect}` : "/register"}
              style={{ color: "var(--brand-primary)", fontWeight: 600 }}
            >
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginScreen;
