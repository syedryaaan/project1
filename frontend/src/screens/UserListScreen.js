// NexaStore — Admin User List Screen (RRD v6)
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiEdit, FiTrash2, FiShield } from "react-icons/fi";
import { toast } from "react-toastify";

import Message from "../components/Message";
import Loader from "../components/Loader";
import AdminNav from "../components/AdminNav";
import Meta from "../components/Meta";
import { listUsers, deleteUser } from "../actions/userActions";

const UserListScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userList = useSelector((state) => state.userList);
  const { loading, error, users } = userList;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userDelete = useSelector((state) => state.userDelete);
  const { success: successDelete, error: errorDelete } = userDelete;

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      dispatch(listUsers());
    } else {
      navigate("/login");
    }
  }, [dispatch, navigate, userInfo, successDelete]);

  useEffect(() => {
    if (successDelete) toast.success("User removed successfully");
    if (errorDelete) toast.error(errorDelete);
  }, [successDelete, errorDelete]);

  const deleteHandler = (id, name) => {
    if (window.confirm(`Are you sure you want to remove user "${name}"?`)) {
      dispatch(deleteUser(id));
    }
  };

  return (
    <>
      <Meta title="Admin User Management" />
      <div className="container-custom" style={{ paddingTop: "2rem", paddingBottom: "4rem" }}>
        <AdminNav />

        <div style={{ marginBottom: "1.5rem" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800 }}>Customer & User Management</h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
            View accounts, promote administrators, and manage user authorizations.
          </p>
        </div>

        {loading ? (
          <Loader message="Loading registered users..." />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users && users.length > 0 ? (
                  users.map((u) => (
                    <tr key={u._id}>
                      <td style={{ fontFamily: "monospace", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                        {u._id.substring(0, 8)}
                      </td>
                      <td style={{ fontWeight: 600 }}>{u.name}</td>
                      <td>
                        <a href={`mailto:${u.email}`} style={{ color: "var(--brand-primary)" }}>
                          {u.email}
                        </a>
                      </td>
                      <td>
                        {u.isAdmin ? (
                          <span className="status-badge" style={{ background: "rgba(108,99,255,0.15)", color: "var(--brand-primary-light)", gap: "0.3rem" }}>
                            <FiShield size={12} /> Administrator
                          </span>
                        ) : (
                          <span className="status-badge" style={{ background: "var(--bg-secondary)", color: "var(--text-muted)" }}>
                            Customer
                          </span>
                        )}
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                          <Link
                            to={`/admin/user/${u._id}/edit`}
                            className="btn-secondary btn-sm"
                            style={{ padding: "0.35rem 0.65rem", display: "inline-flex", alignItems: "center" }}
                            title={`Edit ${u.name}`}
                            aria-label={`Edit ${u.name}`}
                          >
                            <FiEdit size={14} aria-hidden="true" />
                          </Link>
                          {!u.isAdmin && (
                            <button
                              type="button"
                              onClick={() => deleteHandler(u._id, u.name)}
                              className="btn-danger"
                              style={{ padding: "0.35rem 0.65rem" }}
                              title={`Delete ${u.name}`}
                              aria-label={`Delete ${u.name}`}
                            >
                              <FiTrash2 size={14} aria-hidden="true" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: "center", padding: "2rem" }}>
                      No registered users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default UserListScreen;
