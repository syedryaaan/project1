// NexaStore — Register Screen (RRD v6)
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiUser, FiMail, FiLock, FiArrowRight } from "react-icons/fi";
import { toast } from "react-toastify";

import Loader from "../components/Loader";
import Meta from "../components/Meta";
import { register } from "../actions/userActions";

const RegisterScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { loading, error, userInfo } = useSelector((s) => s.userRegister);

  const redirect = new URLSearchParams(location.search).get("redirect") || "/";

  useEffect(() => {
    if (userInfo) navigate(redirect === "shipping" ? "/shipping" : redirect);
  }, [userInfo, navigate, redirect]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      toast.error("Please fill in all fields"); return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match"); return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters"); return;
    }
    dispatch(register(name, email, password));
  };

  return (
    <>
      <Meta title="Create Account" />
      <div className="form-container">
        <div className="form-card">
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <div className="nexa-logo" style={{ fontSize: "1.75rem", justifyContent: "center", display: "flex" }}>
              Nexa<span style={{ color: "var(--brand-secondary)" }}>Store</span>
            </div>
            <h1 className="form-title" style={{ marginTop: "1.5rem" }}>Create account</h1>
            <p className="form-subtitle">Join NexaStore and start shopping</p>
          </div>

          {loading && <Loader message="Creating account..." />}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column" }}>
            {[
              { label: "Full Name", icon: <FiUser />, value: name, setter: setName, type: "text", placeholder: "John Doe", autoComplete: "name" },
              { label: "Email Address", icon: <FiMail />, value: email, setter: setEmail, type: "email", placeholder: "you@example.com", autoComplete: "email" },
              { label: "Password", icon: <FiLock />, value: password, setter: setPassword, type: "password", placeholder: "Min. 6 characters", autoComplete: "new-password" },
              { label: "Confirm Password", icon: <FiLock />, value: confirmPassword, setter: setConfirmPassword, type: "password", placeholder: "Repeat your password", autoComplete: "new-password" },
            ].map((field) => (
              <div key={field.label} className="form-group">
                <label className="form-label">
                  <span style={{ marginRight: "0.4rem", verticalAlign: "middle" }}>{field.icon}</span>
                  {field.label}
                </label>
                <input
                  type={field.type}
                  className="form-control"
                  placeholder={field.placeholder}
                  value={field.value}
                  onChange={(e) => field.setter(e.target.value)}
                  required
                  autoComplete={field.autoComplete}
                />
              </div>
            ))}

            <button type="submit" className="btn-primary btn-block" style={{ marginTop: "0.5rem" }} disabled={loading}>
              Create Account <FiArrowRight size={16} />
            </button>
          </form>

          <div style={{ textAlign: "center", marginTop: "1.5rem", color: "var(--text-secondary)", fontSize: "0.875rem" }}>
            Already have an account?{" "}
            <Link to={redirect ? `/login?redirect=${redirect}` : "/login"} style={{ color: "var(--brand-primary)", fontWeight: 600 }}>
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterScreen;
