import React, { useEffect, useState } from "react";
import {
  fetchProductTypes,
  addProductType,
  editProductType,
  removeProductType,
  sendImage
} from "../../../api/api";
import { useNavigate } from "react-router-dom";
import "./ProductPage0.css";

export default function ProductTypePage0() {
  const [typeList, setTypeList] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [formData, setFormData] = useState({ name: "", imageUrl: "", order_no: "" });
  const [previewImg, setPreviewImg] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateId, setUpdateId] = useState(null);
  const [loadingImage, setLoadingImage] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getAllTypes();
  }, []);

  const getAllTypes = async () => {
    try {
      const res = await fetchProductTypes();
      const sorted = (res.data.resultData || []).sort(
        (a, b) => (a.order_no || 0) - (b.order_no || 0)
      );
      setTypeList(sorted);
    } catch {
      alert("Failed to fetch product types");
    }
  };

  const onInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setPreviewImg(reader.result);
    reader.readAsDataURL(file);

    try {
      setLoadingImage(true);
      const imgForm = new FormData();
      imgForm.append("image", file);
      const response = await sendImage(imgForm);
      setFormData((prev) => ({ ...prev, imageUrl: response.data.imageUrl }));
    } catch {
      alert("Image upload failed");
    } finally {
      setLoadingImage(false);
    }
  };

  const onSubmitForm = async (e) => {
    e.preventDefault();
    try {
      if (isUpdating) {
        await editProductType(updateId, formData);
      } else {
        await addProductType(formData);
      }
      resetForm();
      getAllTypes();
    } catch {
      alert("Failed to save product type");
    }
  };

  const resetForm = () => {
    setFormData({ name: "", imageUrl: "", order_no: "" });
    setPreviewImg(null);
    setIsUpdating(false);
    setUpdateId(null);
    setFormVisible(false);
  };

  const onEditType = (item) => {
    setFormData({
      name: item.name,
      imageUrl: item.imageUrl,
      order_no: item.order_no || ""
    });
    setPreviewImg(item.imageUrl);
    setUpdateId(item.id);
    setIsUpdating(true);
    setFormVisible(true);
  };

  const onDeleteType = async (id) => {
    if (!window.confirm("Delete this product type?")) return;
    try {
      await removeProductType(id);
      getAllTypes();
    } catch {
      alert("Delete failed");
    }
  };

  const onTypeClick = (id) => {
    navigate(`/product/${id}`);
  };

  return (
    <div className="product-page">
      <div className="product-header">
        <h1>Available Product Types</h1>
        <div>
          <button className="product-btn-add" onClick={() => setFormVisible(true)}>
            + Add Product Type
          </button>
        </div>
      </div>

      {formVisible && (
        <div className="product-form-overlay">
          <div className="product-form-container">
            <h2>{isUpdating ? "Edit Product Type" : "Add New Product Type"}</h2>
            <form onSubmit={onSubmitForm}>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={onInputChange}
                placeholder="Enter product type name"
                required
              />
              <input
                type="number"
                name="order_no"
                value={formData.order_no}
                onChange={onInputChange}
                placeholder="Enter order number"
                required
              />
              <div className="product-image-upload">
                <input type="file" accept="image/*" onChange={onFileChange} />
              </div>
              {loadingImage && <p>Uploading image...</p>}
              {previewImg && <img src={previewImg} alt="Preview" className="image-preview" />}
              <div className="product-form-actions">
                <button type="button" className="product-btn-cancel" onClick={resetForm}>
                  Cancel
                </button>
                <button type="submit" className="product-btn-save">
                  {isUpdating ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ul className="product-list">
        {typeList.map((item) => (
          <li className="product-item" key={item.id}>
            <div className="product-card" onClick={() => onTypeClick(item.id)}>
              {item.imageUrl && (
                <div className="product-images">
                  <img src={item.imageUrl} alt={item.name} className="product-image" />
                </div>
              )}
              <div className="product-details">
                <h3>{item.name}</h3>
                <p>Order No: {item.order_no}</p>
              </div>
            </div>
            <div className="product-actions">
              <button className="product-btn-edit" onClick={() => onEditType(item)}>
                Edit
              </button>
              <button className="product-btn-delete" onClick={() => onDeleteType(item.id)}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
