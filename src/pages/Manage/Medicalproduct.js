import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, Form, Modal } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";

export default function Medicalproduct() {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const doctorId = storedUser?.id;

  const [products, setProducts] = useState([]);
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("pharmacy");
  const [price, setPrice] = useState("");
  const [editId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const API_URL = "https://medbook-backend-1.onrender.com/api/medical-product";

  // ✅ check who can see price
  const canSeePrice = storedUser?.isPharmacy || storedUser?.isLab;

  // ✅ Fetch products
  const fetchProducts = async () => {
    if (!doctorId) {
      console.error("User ID not found!");
      return;
    }

    try {
      const res = await axios.get(`${API_URL}/${doctorId}`);
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ✅ Add / Update Product
  const handleSubmit = async () => {
    if (!productName.trim()) return alert("Product Name required!");

    try {
      if (editId) {
        await axios.put(`${API_URL}/${editId}`, {
          productName,
          category,
          price,
        });
      } else {
        await axios.post(API_URL, {
          doctorId,
          productName,
          category,
          price,
        });
      }

      // reset form
      setProductName("");
      setCategory("pharmacy");
      setPrice("");
      setEditId(null);
      setShowModal(false);
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Edit
  const handleEdit = (item) => {
    setProductName(item.productName);
    setCategory(item.category || "pharmacy");
    setPrice(item.price || "");
    setEditId(item.id);
    setShowModal(true);
  };

  return (
    <div className="container mt-4 p-4 bg-white rounded shadow-sm">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="text-danger fw-bold mb-0">Medical Products</h3>

        <Button
          variant="success"
          onClick={() => {
            setEditId(null);
            setProductName("");
            setCategory("pharmacy");
            setPrice("");
            setShowModal(true);
          }}
          className="fw-semibold"
        >
          ➕ Add Product
        </Button>
      </div>

      <Table striped bordered hover responsive className="align-middle">
        <thead className="table-dark text-center">
          <tr>
            <th>SI NO</th>
            <th>Product Name</th>
            <th>Category</th>
            {canSeePrice && <th>Price</th>} {/* ✅ show heading */}
            <th style={{ width: "150px" }}>Actions</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {products.length > 0 ? (
            products.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>{item.productName}</td>
                <td>{item.category || "—"}</td>
                {canSeePrice && <td>{item.price ? `₹${item.price}` : "—"}</td>}
                <td>
                  <Button
                    variant="info"
                    size="sm"
                    className="me-2"
                    title="Edit"
                    onClick={() => handleEdit(item)}
                  >
                    <FaEdit />
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    title="Delete"
                    onClick={() => handleDelete(item.id)}
                  >
                    <FaTrash />
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={canSeePrice ? "5" : "4"}
                className="text-muted text-center py-3"
              >
                No Products Found
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* ✅ Modal for Add/Edit */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>
            {editId ? "Edit Product" : "Add New Product"}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="bg-light">
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Product Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter medicine name"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Category</Form.Label>
            <Form.Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="pharmacy">Pharmacy</option>
              <option value="lab-diagnosis">Lab & Diagnosis</option>
            </Form.Select>
          </Form.Group>

          {/* ✅ show price input only for lab/product users */}
          {canSeePrice && (
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Price</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </Form.Group>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {editId ? "Update" : "Save"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
