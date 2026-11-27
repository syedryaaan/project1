// NexaStore — Admin User Edit Screen (RRD v6)
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiArrowLeft, FiUser, FiMail, FiShield, FiSave } from "react-icons/fi";
import { toast } from "react-toastify";

import Message from "../components/Message";
import Loader from "../components/Loader";
import AdminNav from "../components/AdminNav";
import Meta from "../components/Meta";
import { getUserDetails, updateUser } from "../actions/userActions";
import { USER_UPDATE_RESET } from "../constants/userConstants";

const UserEditScreen = () => {
  const { id: userId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const userDetails = useSelector((state) => state.userDetails);
  const { loading, error, user } = userDetails;

  const userUpdate = useSelector((state) => state.userUpdate);
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = userUpdate;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      navigate("/login");
      return;
    }

    if (successUpdate) {
      dispatch({ type: USER_UPDATE_RESET });
      toast.success("User updated successfully!");
      navigate("/admin/userlist");
    } else if (!error) {
      if (!user?.name || user._id !== userId) {
        dispatch(getUserDetails(userId));
      } else {
        setName(user.name);
        setEmail(user.email);
        setIsAdmin(user.isAdmin);
      }
    }
  }, [dispatch, navigate, user, userId, successUpdate, userInfo, error]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(updateUser({ _id: userId, name, email, isAdmin }));
  };

  return (
    <>
      <Meta title={name ? `Edit User: ${name}` : "Edit User"} />
      <div className="container-custom" style={{ paddingTop: "2rem", paddingBottom: "4rem" }}>
        <AdminNav />

        <div style={{ maxWidth: 540, margin: "0 auto" }}>
          <Link
            to="/admin/userlist"
            className="btn-secondary btn-sm"
            style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", marginBottom: "1.5rem" }}
          >
            <FiArrowLeft size={14} /> Back to Users
          </Link>

          <div className="form-card">
            <h2 style={{ display: "flex", alignItems: "center", gap: "0.75rem", fontWeight: 800, marginBottom: "0.5rem" }}>
              <FiUser color="var(--brand-primary)" /> Edit User Account
            </h2>
            <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginBottom: "2rem" }}>
              Update name, email address, or administrative privileges.
            </p>

            {loadingUpdate && <Loader message="Updating user..." />}
            {errorUpdate && <Message variant="danger">{errorUpdate}</Message>}

            {loading ? (
              <Loader message="Loading user details..." />
            ) : error ? (
              <Message variant="danger">{error}</Message>
            ) : (
              <form onSubmit={submitHandler} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div className="form-group">
                  <label htmlFor="edit-user-name" className="form-label">
                    <FiUser size={14} aria-hidden="true" style={{ marginRight: "0.4rem", verticalAlign: "middle" }} />
                    Full Name
                  </label>
                  <input
                    id="edit-user-name"
                    type="text"
                    className="form-control"
                    placeholder="Enter name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="edit-user-email" className="form-label">
                    <FiMail size={14} aria-hidden="true" style={{ marginRight: "0.4rem", verticalAlign: "middle" }} />
                    Email Address
                  </label>
                  <input
                    id="edit-user-email"
                    type="email"
                    className="form-control"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group" style={{ background: "var(--bg-secondary)", padding: "1rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-color)" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "0.75rem", cursor: "pointer", fontWeight: 600 }}>
                    <input
                      type="checkbox"
                      checked={isAdmin}
                      onChange={(e) => setIsAdmin(e.target.checked)}
                      style={{ width: 18, height: 18, accentColor: "var(--brand-primary)" }}
                    />
                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                      <FiShield color="var(--brand-primary)" /> Grant Administrative Privileges
                    </div>
                  </label>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.75rem", marginTop: "0.4rem", marginLeft: "2rem" }}>
                    Administrators can manage catalog products, change order fulfillment, and edit customer accounts.
                  </p>
                </div>

                <button
                  type="submit"
                  className="btn-primary btn-block"
                  style={{ marginTop: "1rem" }}
                  disabled={loadingUpdate}
                >
                  <FiSave size={16} /> Save Changes
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default UserEditScreen;
