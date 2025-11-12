import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, Form, Modal } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";

export default function Medicalproduct() {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const doctorId = storedUser?.id;

  const [products, setProducts] = useState([]);
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("pharmacy"); // ✅ New field
  const [editId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const API_URL = "https://medbook-backend-1.onrender.com/api/medical-product";

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

  // ✅ Add / Update
  const handleSubmit = async () => {
    if (!productName.trim()) return alert("Product Name required!");

    try {
      if (editId) {
        await axios.put(`${API_URL}/${editId}`, {
          productName,
          category, // ✅ send category when updating
        });
      } else {
        await axios.post(API_URL, {
          doctorId,
          productName,
          category, // ✅ send category when adding
        });
      }

      // Reset modal state
      setProductName("");
      setCategory("pharmacy");
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
    setCategory(item.category || "pharmacy"); // ✅ prefill if available
    setEditId(item.id);
    setShowModal(true);
  };

  return (
    <div className="container mt-4">
      <h3 className="text-danger fw-bold mb-3">Medical Products</h3>

      <Button
        variant="success"
        className="mb-3"
        onClick={() => {
          setEditId(null);
          setProductName("");
          setCategory("pharmacy");
          setShowModal(true);
        }}
      >
        ➕ Add Product
      </Button>

      <Table striped bordered hover responsive>
        <thead className="table-dark">
          <tr>
            <th>SI NO</th>
            <th>Product Name</th>
            <th>Category</th> {/* ✅ New column */}
            <th width="150px">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.length > 0 ? (
            products.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>{item.productName}</td>
                <td>{item.category || "—"}</td> {/* ✅ Display category */}
                <td>
                  <Button
                    variant="info"
                    className="me-2"
                    onClick={() => handleEdit(item)}
                    title="Edit"
                  >
                    <FaEdit />
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleDelete(item.id)}
                    title="Delete"
                  >
                    <FaTrash />
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center text-muted">
                No Products Found
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* ✅ Modal for Add/Edit */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {editId ? "Edit Product" : "Add New Product"}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Product Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter medicine name"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
          </Form.Group>

          {/* ✅ New Dropdown for Category */}
          <Form.Group>
            <Form.Label>Category</Form.Label>
            <Form.Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="pharmacy">Pharmacy</option>
              <option value="lab-diagnosis">Lab & Diagnosis</option>
            </Form.Select>
          </Form.Group>
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
