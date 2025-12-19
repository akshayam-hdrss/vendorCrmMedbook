import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, Form, Modal } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";

export default function Serviceproduct() {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const doctorId = storedUser?.id;

    const [products, setProducts] = useState([]);
    const [productName, setProductName] = useState("");
    const [category, setCategory] = useState("Service");
    const [price, setPrice] = useState("");
    const [editId, setEditId] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const API_URL = "https://medbook-backend-1.onrender.com/api/medical-product";


    const canSeePrice = storedUser?.isService;

    // ✅ Fetch products
    const fetchProducts = async () => {
        if (!doctorId) return console.error("User ID not found!");

        try {
            const res = await axios.get(`${API_URL}/${doctorId}`);
            // Ensure price is always a number (avoid string issues)
            const formatted = res.data.map((p) => ({
                ...p,
                price: parseFloat(p.price) || 0,
            }));
            setProducts(formatted);
        } catch (err) {
            console.error("Error fetching products:", err);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // ✅ Add or Update product (with price conversion)
    const handleSubmit = async () => {
        if (!productName.trim()) return alert("Product Name is required!");

        try {
            const numericPrice = price ? parseFloat(price) : 0;

            if (editId) {
                // Update
                await axios.put(`${API_URL}/${editId}`, {
                    productName,
                    category: category || "Service",
                    price: numericPrice,
                });
            } else {
                // Add new
                await axios.post(API_URL, {
                    doctorId,
                    productName,
                    category: category || "Service",
                    price: numericPrice,
                });
            }

            // Reset and refresh
            setProductName("");
            setCategory("Service");
            setPrice("");
            setEditId(null);
            setShowModal(false);
            fetchProducts();
        } catch (err) {
            console.error("Error saving product:", err);
        }
    };

    // ✅ Delete product
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this product?"))
            return;

        try {
            await axios.delete(`${API_URL}/${id}`);
            fetchProducts();
        } catch (err) {
            console.error("Error deleting product:", err);
        }
    };

    // ✅ Edit product
    const handleEdit = (item) => {
        setProductName(item.productName);
        setCategory(item.category || "Service");
        setPrice(item.price || "");
        setEditId(item.id);
        setShowModal(true);
    };

    return (
        <div className="container mt-4 p-4 bg-white rounded shadow-sm">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="text-danger fw-bold mb-0">Service and Products</h3>
                <Button
                    variant="success"
                    className="fw-semibold"
                    onClick={() => {
                        setEditId(null);
                        setProductName("");
                        setCategory("Service");
                        setPrice("");
                        setShowModal(true);
                    }}
                >
                    ➕ Add Product
                </Button>
            </div>

            {/* Product Table */}
            <Table
                striped
                bordered
                hover
                responsive
                className="align-middle text-center"
            >
                <thead className="table-dark">
                    <tr>
                        <th>SI NO</th>
                        <th>Product Name</th>
                        <th>Category</th>
                        {canSeePrice && <th>Price (₹)</th>}
                        <th style={{ width: "150px" }}>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {products.length > 0 ? (
                        products.map((item, index) => (
                            <tr key={item.id || index}>
                                <td>{index + 1}</td>
                                <td>{item.productName}</td>
                                <td>{item.category || "—"}</td>

                                {canSeePrice && (
                                    <td>
                                        {item.price > 0
                                            ? `₹${parseFloat(item.price).toFixed(2)}`
                                            : "—"}
                                    </td>
                                )}

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
                                colSpan={canSeePrice ? 5 : 4}
                                className="text-muted text-center py-3"
                            >
                                No Products Found
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>

            {/* Add / Edit Modal */}
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
                            placeholder="Enter name"
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
                            <option value="Service">Service</option>
                            <option value="Product">Product</option>
                        </Form.Select>
                    </Form.Group>

                    {canSeePrice && (
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold">Price (₹)</Form.Label>
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
