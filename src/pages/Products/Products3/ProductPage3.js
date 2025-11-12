import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  uploadImage,
  getProductsByProductType,
  createProduct,
  deleteProduct,
  updateProduct,
} from "../../../api/api";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Productpage3() {
  const { productTypeId } = useParams();
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const initialForm = {
    productName: "",
    price: "",
    imageUrl: "",
    businessName: "",
    location: "",
    phone: "",
    whatsapp: "",
    experience: "",
    addressLine1: "",
    addressLine2: "",
    district: "",
    pincode: "",
    mapLink: "",
    about: "",
    youtubeLink: "",
    bannerUrl: "",
    gallery: [],
    order_no: "",   // ✅ Added order_no field
    productTypeId: parseInt(productTypeId),
  };

  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    fetchProducts();
  }, [productTypeId]);

  const fetchProducts = async () => {
    try {
      const res = await getProductsByProductType(productTypeId);
      let data = res.data.resultData || [];

      // ✅ Sort by order_no ascending, null last
      data = data.sort((a, b) => {
        if (a.order_no == null && b.order_no == null) return 0;
        if (a.order_no == null) return 1;
        if (b.order_no == null) return -1;
        return a.order_no - b.order_no;
      });

      setProducts(data);
    } catch (err) {
      setError(err.message || "Failed to fetch products");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("image", file);
    try {
      setUploading(true);
      const res = await uploadImage(formData);
      const imageUrl = res.data.imageUrl;

      if (type === "image") {
        setForm((prev) => ({ ...prev, imageUrl }));
        setImagePreview(imageUrl);
      } else if (type === "banner") {
        setForm((prev) => ({ ...prev, bannerUrl: imageUrl }));
      } else if (type === "gallery") {
        setForm((prev) => ({ ...prev, gallery: [...prev.gallery, imageUrl] }));
      }
    } catch (err) {
      setError(err.message || "Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleGalleryDelete = (imgUrl) => {
    setForm((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((img) => img !== imgUrl),
    }));
  };

  const handleEdit = (product) => {
    setForm({
      ...product,
      gallery: Array.isArray(product.gallery)
        ? product.gallery
        : JSON.parse(product.gallery || "[]"),
      order_no: product.order_no ?? "", // ✅ handle null as blank in input
    });
    setImagePreview(product.imageUrl);
    setEditingId(product.id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await deleteProduct(id);
      fetchProducts();
    } catch (err) {
      alert("Delete failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        order_no: form.order_no === "" ? null : parseInt(form.order_no, 10), // ✅ null if empty
        gallery: JSON.stringify(form.gallery),
      };

      if (editingId) {
        payload.id = editingId;
        await updateProduct(payload);
      } else {
        await createProduct(payload);
      }

      setForm(initialForm);
      setEditingId(null);
      setImagePreview(null);
      setShowModal(false);
      fetchProducts();
    } catch (err) {
      setError(err.message || "Product creation failed");
    }
  };

  const handleonclick = (id) => {
    navigate(`/productdetails/${id}`);
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Products</h2>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          + Add Product
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row">
        {products.map((item) => (
          <div className="col-md-4 mb-4" key={item.id}>
            <div className="card h-100 shadow-sm">
              <img
                src={item.imageUrl}
                alt={item.productName}
                className="card-img-top"
                style={{ height: "200px", objectFit: "cover" }}
                onClick={() => handleonclick(item.id)}
              />
              <div className="card-body" onClick={() => handleonclick(item.id)}>
                <h5 className="card-title">{item.productName}</h5>
                <p className="card-text">{item.businessName}</p>
                <p className="card-text">Rs. {item.price}</p>
                <p className="card-text">{item.location}</p>
                <p className="card-text">Order No: {item.order_no ?? "null"}</p> {/* ✅ display order_no */}
              </div>
              <div className="card-footer d-flex justify-content-between">
                <div>
                  <a href={`tel:${item.phone}`} className="btn btn-sm btn-outline-primary me-1">
                    <i className="fa-solid fa-phone-volume"></i>
                  </a>
                  <a
                    href={`https://wa.me/${item.whatsapp}`}
                    className="btn btn-sm btn-outline-success"
                  >
                    <i className="fa-brands fa-whatsapp"></i>
                  </a>
                </div>
                <div>
                  <button className="btn btn-sm btn-warning me-1" onClick={() => handleEdit(item)}>
                    <i className="fa-solid fa-pen"></i>
                  </button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(item.id)}>
                    🗑
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: "#00000088" }}>
          <div className="modal-dialog modal-lg modal-dialog-scrollable">
            <div className="modal-content">
              <form onSubmit={handleSubmit}>
                <div className="modal-header">
                  <h5 className="modal-title">{editingId ? "Edit" : "Add"} Product</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)} />
                </div>
                <div className="modal-body">
                  <div className="row g-3">
                    {[
                      "productName",
                      "price",
                      "businessName",
                      "location",
                      "phone",
                      "whatsapp",
                      "experience",
                      "addressLine1",
                      "addressLine2",
                      "district",
                      "pincode",
                      "mapLink",
                      "youtubeLink",
                    ].map((field) => (
                      <div className="col-md-6" key={field}>
                        <input
                          className="form-control"
                          name={field}
                          value={form[field]}
                          onChange={handleInputChange}
                          placeholder={field}
                          required={["productName", "price"].includes(field)}
                          type={field === "pincode" ? "number" : "text"}
                        />
                      </div>
                    ))}

                    {/* ✅ Order No input */}
                    <div className="col-md-6">
                      <input
                        className="form-control"
                        name="order_no"
                        value={form.order_no}
                        onChange={handleInputChange}
                        placeholder="Order No (optional)"
                        type="number"
                      />
                    </div>

                    <div className="col-12">
                      <textarea
                        name="about"
                        value={form.about}
                        onChange={handleInputChange}
                        placeholder="About the product"
                        className="form-control"
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Product Image</label>
                      <input
                        type="file"
                        className="form-control"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, "image")}
                      />
                      {imagePreview && (
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="mt-2"
                          style={{ height: 100, objectFit: "cover" }}
                        />
                      )}
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Banner Image</label>
                      <input
                        type="file"
                        className="form-control"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, "banner")}
                      />
                      {form.bannerUrl && (
                        <img
                          src={form.bannerUrl}
                          alt="Banner"
                          className="mt-2"
                          style={{ height: 100, objectFit: "cover" }}
                        />
                      )}
                    </div>

                    <div className="col-12">
                      <label className="form-label">Gallery Images</label>
                      <input
                        type="file"
                        accept="image/*"
                        className="form-control"
                        onChange={(e) => handleImageUpload(e, "gallery")}
                      />
                      <div className="d-flex flex-wrap mt-2 gap-2">
                        {form.gallery.map((img, idx) => (
                          <div key={idx} className="position-relative">
                            <img
                              src={img}
                              alt="Gallery"
                              style={{ height: 80, width: 80, objectFit: "cover" }}
                            />
                            <button
                              type="button"
                              className="btn-close btn-sm position-absolute top-0 end-0"
                              onClick={() => handleGalleryDelete(img)}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="submit" className="btn btn-success" disabled={uploading}>
                    {uploading ? "Uploading..." : "Save"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowModal(false);
                      setEditingId(null);
                      setForm(initialForm);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
