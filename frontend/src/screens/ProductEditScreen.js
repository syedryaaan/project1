// NexaStore — Admin Product Edit Screen (RRD v6)
import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiArrowLeft, FiUpload, FiSave, FiBox } from "react-icons/fi";
import { toast } from "react-toastify";

import Message from "../components/Message";
import Loader from "../components/Loader";
import AdminNav from "../components/AdminNav";
import Meta from "../components/Meta";
import { listProductDetails, updateProduct } from "../actions/productActions";
import { PRODUCT_UPDATE_RESET } from "../constants/productConstants";

const ProductEditScreen = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [image, setImage] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);

  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;

  const productUpdate = useSelector((state) => state.productUpdate);
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = productUpdate;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      navigate("/login");
      return;
    }

    if (successUpdate) {
      dispatch({ type: PRODUCT_UPDATE_RESET });
      toast.success("Product updated successfully!");
      navigate("/admin/productlist");
    } else if (!error) {
      if (!product?.name || product._id !== productId) {
        dispatch(listProductDetails(productId));
      } else {
        setName(product.name);
        setPrice(product.price);
        setDiscount(product.discount || 0);
        setImage(product.image);
        setBrand(product.brand);
        setCategory(product.category);
        setCountInStock(product.countInStock);
        setDescription(product.description);
      }
    }
  }, [dispatch, navigate, product, productId, successUpdate, userInfo, error]);

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);
    setUploading(true);

    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };
      const { data } = await axios.post("/api/upload", formData, config);
      setImage(data);
      setUploading(false);
      toast.success("Image uploaded successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Image upload failed");
      setUploading(false);
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      updateProduct({
        _id: productId,
        name,
        price,
        discount,
        image,
        brand,
        category,
        countInStock,
        description,
      })
    );
  };

  return (
    <>
      <Meta title={`Edit: ${name || "Product"}`} />
      <div className="container-custom" style={{ paddingTop: "2rem", paddingBottom: "4rem" }}>
        <AdminNav />

        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <Link
            to="/admin/productlist"
            className="btn-secondary btn-sm"
            style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", marginBottom: "1.5rem" }}
          >
            <FiArrowLeft size={14} /> Back to Products
          </Link>

          <div className="form-card">
            <h2 style={{ display: "flex", alignItems: "center", gap: "0.75rem", fontWeight: 800, marginBottom: "0.5rem" }}>
              <FiBox color="var(--brand-primary)" /> Edit Product
            </h2>
            <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginBottom: "2rem" }}>
              Update product specs, inventory, pricing, and visual media.
            </p>

            {loadingUpdate && <Loader message="Saving changes..." />}
            {errorUpdate && <Message variant="danger">{errorUpdate}</Message>}

            {loading ? (
              <Loader message="Loading product data..." />
            ) : error ? (
              <Message variant="danger">{error}</Message>
            ) : (
              <form onSubmit={submitHandler} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {/* Product Name */}
                <div className="form-group">
                  <label htmlFor="prod-name" className="form-label">Product Title</label>
                  <input
                    id="prod-name"
                    type="text"
                    className="form-control"
                    placeholder="Enter product title"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                {/* Price & Discount */}
                <div className="form-two-col">
                  <div className="form-group">
                    <label htmlFor="prod-price" className="form-label">Price ($)</label>
                    <input
                      id="prod-price"
                      type="number"
                      step="0.01"
                      className="form-control"
                      placeholder="0.00"
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="prod-discount" className="form-label">Discount (%)</label>
                    <input
                      id="prod-discount"
                      type="number"
                      min="0"
                      max="100"
                      className="form-control"
                      placeholder="0"
                      value={discount}
                      onChange={(e) => setDiscount(Number(e.target.value))}
                    />
                  </div>
                </div>

                {/* Brand & Category */}
                <div className="form-two-col">
                  <div className="form-group">
                    <label htmlFor="prod-brand" className="form-label">Brand</label>
                    <input
                      id="prod-brand"
                      type="text"
                      className="form-control"
                      placeholder="Enter brand name"
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="prod-category" className="form-label">Category</label>
                    <input
                      id="prod-category"
                      type="text"
                      className="form-control"
                      placeholder="Electronics, Audio, Gaming..."
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Stock Count */}
                <div className="form-group">
                  <label htmlFor="prod-stock" className="form-label">Units in Stock</label>
                  <input
                    id="prod-stock"
                    type="number"
                    min="0"
                    className="form-control"
                    placeholder="Enter inventory quantity"
                    value={countInStock}
                    onChange={(e) => setCountInStock(Number(e.target.value))}
                    required
                  />
                </div>

                {/* Image URL & Upload */}
                <div className="form-group">
                  <label htmlFor="prod-image" className="form-label">Image Path / URL</label>
                  <input
                    id="prod-image"
                    type="text"
                    className="form-control"
                    placeholder="/images/sample.jpg or https://..."
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    required
                  />

                  <div style={{ marginTop: "0.75rem", display: "flex", alignItems: "center", gap: "1rem" }}>
                    <label
                      className="btn-secondary btn-sm"
                      style={{ cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
                    >
                      <FiUpload size={14} aria-hidden="true" /> Upload Image File
                      <input
                        type="file"
                        onChange={uploadFileHandler}
                        style={{ display: "none" }}
                        accept="image/*"
                      />
                    </label>
                    {uploading && <span style={{ fontSize: "0.85rem", color: "var(--brand-primary)" }}>Uploading...</span>}
                  </div>
                </div>

                {/* Description */}
                <div className="form-group">
                  <label htmlFor="prod-desc" className="form-label">Product Description</label>
                  <textarea
                    id="prod-desc"
                    rows="5"
                    className="form-control"
                    placeholder="Detailed specs, features, and selling points..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn-primary btn-block"
                  style={{ marginTop: "1rem" }}
                  disabled={loadingUpdate}
                >
                  <FiSave size={16} /> Save Product Changes
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductEditScreen;
