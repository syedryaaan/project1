// NexaStore — Admin Product List Screen (RRD v6)
import React, { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiPlus, FiEdit, FiTrash2 } from "react-icons/fi";
import { toast } from "react-toastify";

import Message from "../components/Message";
import Loader from "../components/Loader";
import Paginate from "../components/Paginate";
import AdminNav from "../components/AdminNav";
import Meta from "../components/Meta";
import {
  listProducts,
  deleteProduct,
  createProduct,
} from "../actions/productActions";
import { PRODUCT_CREATE_RESET } from "../constants/productConstants";

const ProductListScreen = () => {
  const { pageNumber = 1 } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const productList = useSelector((state) => state.productList);
  const { loading, error, products, pages, page } = productList;

  const productDelete = useSelector((state) => state.productDelete);
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = productDelete;

  const productCreate = useSelector((state) => state.productCreate);
  const {
    loading: loadingCreate,
    error: errorCreate,
    success: successCreate,
    product: createdProduct,
  } = productCreate;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    dispatch({ type: PRODUCT_CREATE_RESET });

    if (!userInfo || !userInfo.isAdmin) {
      navigate("/login");
      return;
    }

    if (successCreate) {
      toast.success("New product draft created!");
      navigate(`/admin/product/${createdProduct._id}/edit`);
    } else {
      dispatch(listProducts("", pageNumber));
    }
  }, [
    dispatch,
    navigate,
    userInfo,
    successDelete,
    successCreate,
    createdProduct,
    pageNumber,
  ]);

  const deleteHandler = (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      dispatch(deleteProduct(id));
      toast.info("Product removed");
    }
  };

  const createProductHandler = () => {
    dispatch(createProduct());
  };

  return (
    <>
      <Meta title="Admin Product Management" />
      <div className="container-custom" style={{ paddingTop: "2rem", paddingBottom: "4rem" }}>
        <AdminNav />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", marginBottom: "1.5rem" }}>
          <div>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 800 }}>Product Catalog</h2>
            <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
              Manage pricing, inventory, categories, and descriptions.
            </p>
          </div>
          <button
            type="button"
            className="btn-primary"
            onClick={createProductHandler}
            disabled={loadingCreate}
            style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}
          >
            <FiPlus size={16} aria-hidden="true" />
            {loadingCreate ? "Creating..." : "Add Product"}
          </button>
        </div>

        {loadingDelete && <Loader message="Deleting product..." />}
        {errorDelete && <Message variant="danger">{errorDelete}</Message>}
        {errorCreate && <Message variant="danger">{errorCreate}</Message>}

        {loading ? (
          <Loader message="Loading products..." />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Category</th>
                    <th>Brand</th>
                    <th>Stock</th>
                    <th>Rating</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products && products.length > 0 ? (
                    products.map((p) => (
                      <tr key={p._id}>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                            <img
                              src={p.image}
                              alt={p.name}
                              loading="lazy"
                              style={{ width: 44, height: 44, objectFit: "cover", borderRadius: "var(--radius-sm)" }}
                            />
                            <div>
                              <Link
                                to={`/product/${p._id}`}
                                style={{ fontWeight: 600, color: "var(--text-primary)", display: "block" }}
                              >
                                {p.name}
                              </Link>
                              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontFamily: "monospace" }}>
                                ID: {p._id.substring(0, 8)}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td style={{ fontWeight: 700 }}>${Number(p.price).toFixed(2)}</td>
                        <td>{p.category}</td>
                        <td>{p.brand}</td>
                        <td>
                          {p.countInStock > 0 ? (
                            <span style={{ color: "#22C55E", fontWeight: 600 }}>{p.countInStock}</span>
                          ) : (
                            <span style={{ color: "#EF4444", fontWeight: 600 }}>Out of Stock</span>
                          )}
                        </td>
                        <td>⭐ {p.rating} ({p.numReviews})</td>
                        <td>
                          <div style={{ display: "flex", gap: "0.5rem" }}>
                            <Link
                              to={`/admin/product/${p._id}/edit`}
                              className="btn-secondary btn-sm"
                              style={{ padding: "0.35rem 0.65rem", display: "inline-flex", alignItems: "center" }}
                              title={`Edit ${p.name}`}
                              aria-label={`Edit ${p.name}`}
                            >
                              <FiEdit size={14} aria-hidden="true" />
                            </Link>
                            <button
                              type="button"
                              onClick={() => deleteHandler(p._id, p.name)}
                              className="btn-danger"
                              style={{ padding: "0.35rem 0.65rem" }}
                              title={`Delete ${p.name}`}
                              aria-label={`Delete ${p.name}`}
                            >
                              <FiTrash2 size={14} aria-hidden="true" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" style={{ textAlign: "center", padding: "2rem" }}>
                        No products found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <Paginate pages={pages} page={page} isAdmin={true} />
          </>
        )}
      </div>
    </>
  );
};

export default ProductListScreen;
