import React, { useEffect, useState } from "react";
import {
  getAvailableProducts,
  createAvailableProduct,
  updateAvailableProduct,
  deleteAvailableProduct,
  deleteAllAvailableProducts,
  uploadImage
} from "../../../api/api"; // ✅ imported from api.js
import { useNavigate, useParams } from "react-router-dom";
import "./ProductPage1.css";

export default function ProductPage1() {
  const [products, setProducts] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [form, setForm] = useState({ name: "", imageUrl: "", order_no: "" });
  const [imagePreview, setImagePreview] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();
  const { productTypeId } = useParams();

  useEffect(() => {
    fetchProducts(productTypeId);
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await getAvailableProducts(productTypeId);
      let data = res.data.resultData || [];

      // 🔑 Sort: numbers first (ascending), nulls at the end
      data = data.sort((a, b) => {
        if (a.order_no == null && b.order_no == null) return 0;
        if (a.order_no == null) return 1;
        if (b.order_no == null) return -1;
        return a.order_no - b.order_no;
      });

      setProducts(data);
    } catch {
      alert("Failed to fetch products");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("image", file);
      const response = await uploadImage(formData);
      setForm((prev) => ({ ...prev, imageUrl: response.data.imageUrl }));
    } catch {
      alert("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        order_no: form.order_no === "" ? null : parseInt(form.order_no, 10), // ✅ null if empty
        availableProductTypeId: parseInt(productTypeId, 10),
      };

      if (isEditing) {
        await updateAvailableProduct({ id: editId, ...payload });
      } else {
        await createAvailableProduct(payload);
      }

      resetForm();
      fetchProducts();
    } catch {
      alert("Failed to save product");
    }
  };

  const resetForm = () => {
    setForm({ name: "", imageUrl: "", order_no: "" });
    setImagePreview(null);
    setIsEditing(false);
    setEditId(null);
    setIsFormOpen(false);
  };

  const handleEdit = (item) => {
    setForm({
      name: item.name,
      imageUrl: item.imageUrl,
      order_no: item.order_no ?? "" // ✅ show blank in input if null
    });
    setImagePreview(item.imageUrl);
    setEditId(item.id);
    setIsEditing(true);
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await deleteAvailableProduct(id);
      fetchProducts();
    } catch {
      alert("Failed to delete");
    }
  };

  const handleDeleteAll = async () => {
    if (!window.confirm("Are you sure you want to delete all products?")) return;
    try {
      await deleteAllAvailableProducts(products);
      fetchProducts();
    } catch {
      alert("Failed to delete all");
    }
  };

  const handleCategoryClick = (id) => {
    navigate(`/product/${productTypeId}/${id}`);
  };

  return (
    <div className="product-page">
      <div className="product-header">
        <h1>Available Products</h1>
        <div>
          <button className="product-btn-add" onClick={() => setIsFormOpen(true)}>
            + Add Product
          </button>
          {/* <button className="product-btn-delete-all" onClick={handleDeleteAll}>
            Delete All
          </button> */}
        </div>
      </div>

      {isFormOpen && (
        <div className="product-form-overlay">
          <div className="product-form-container">
            <h2>{isEditing ? "Edit Product" : "Add New Product"}</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleInputChange}
                placeholder="Enter product name"
                required
              />
              <input
                type="number"
                name="order_no"
                value={form.order_no}
                onChange={handleInputChange}
                placeholder="Enter order number (optional)"
              />

              <div className="product-image-upload">
                <input type="file" accept="image/*" onChange={handleFileChange} />
              </div>
              {uploading && <p>Uploading image...</p>}
              {imagePreview && (
                <img src={imagePreview} alt="Preview" className="image-preview" />
              )}
              <div className="product-form-actions">
                <button
                  type="button"
                  className="product-btn-cancel"
                  onClick={resetForm}
                >
                  Cancel
                </button>
                <button type="submit" className="product-btn-save">
                  {isEditing ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ul className="product-list">
        {products.map((item) => (
          <li className="product-item" key={item.id}>
            <div className="product-card" onClick={() => handleCategoryClick(item.id)}>
              {item.imageUrl && (
                <div className="product-images">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="product-image"
                  />
                </div>
              )}
              <div className="product-details">
                <h3>{item.name}</h3>
                <p>Order No: {item.order_no ?? "null"}</p> {/* ✅ show order_no */}
              </div>
            </div>
            <div className="product-actions">
              <button
                className="product-btn-edit"
                onClick={() => handleEdit(item)}
              >
                Edit
              </button>
              <button
                className="product-btn-delete"
                onClick={() => handleDelete(item.id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
