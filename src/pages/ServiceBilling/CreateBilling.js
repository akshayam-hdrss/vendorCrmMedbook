import React, { useState } from "react";
import axios from "axios";
import "./CreateBilling.css"; // We'll create this CSS file
import { useLocation } from "react-router-dom";


const CreateBilling = () => {
    // 🔐 Local storage
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const shopDetails = JSON.parse(localStorage.getItem("shopdetails"));
    const serviceId = storedUser?.id || "";
    const serviceName = shopDetails?.serviceName || "";

    const location = useLocation();
    const appointment = location.state?.appointment;
    console.log(appointment);
    const userId = appointment?.userId || "";

    // 🧾 Form
    const [form, setForm] = useState({
        bookingId: appointment?.id || "",
        taxPercent: "",
    });

    // 🛒 Items
    const [items, setItems] = useState([
        { itemName: "", quantity: 1, price: 0 },
    ]);

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState(""); // success/error

    // Handle basic input
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Handle item change
    const handleItemChange = (index, field, value) => {
        const updatedItems = [...items];
        updatedItems[index][field] = field === 'itemName' ? value : Number(value);
        setItems(updatedItems);
    };

    // Add item
    const addItem = () => {
        setItems([...items, { itemName: "", quantity: 1, price: 0 }]);
    };

    // Remove item
    const removeItem = (index) => {
        if (items.length === 1) return;
        setItems(items.filter((_, i) => i !== index));
    };

    // 💰 Calculations
    const subTotal = items.reduce(
        (sum, item) => sum + Number(item.quantity) * Number(item.price),
        0
    );

    const taxPercent = Number(form.taxPercent || 0);
    const taxAmount = (subTotal * taxPercent) / 100;
    const total = subTotal + taxAmount;

    // 🚀 Submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            await axios.post(
                "https://medbook-backend-1.onrender.com/api/service-billing/create-bill",
                {
                    bookingId: Number(form.bookingId),
                    serviceId: Number(serviceId),
                    userId: Number(userId),
                    subTotal: Number(subTotal),
                    tax: Number(taxAmount),
                    total: Number(total),
                    items: items.map(item => ({
                        itemName: item.itemName,
                        quantity: Number(item.quantity),
                        price: Number(item.price),
                    })),
                }
            );

            setMessage("✅ Bill created successfully!");
            setMessageType("success");
            setItems([{ itemName: "", quantity: 1, price: 0 }]);
            setForm({ bookingId: "", taxPercent: "" });

            // Clear message after 3 seconds
            setTimeout(() => {
                setMessage("");
                setMessageType("");
            }, 3000);
        } catch (error) {
            setMessage("❌ Failed to create bill. Please try again.");
            setMessageType("error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="billing-container">
            {/* Header */}
            <div className="billing-header">
                <h1>Medbook</h1>
                <div className="service-info-card">
                    <div className="service-info">
                        <span className="service-label"></span>
                        <span className="service-name">{serviceName}</span>
                    </div>
                    <div className="service-id">
                        <span className="service-label">Service ID:</span>
                        <span className="service-value">{serviceId}</span>
                    </div>
                </div>
            </div>

            {/* Form Section */}
            <div className="billing-card">
                <form onSubmit={handleSubmit}>
                    {/* Booking ID Section */}
                    <div className="form-section">
                        <h3 className="section-title">Booking Information</h3>
                        <div className="input-group">
                            <label htmlFor="bookingId" className="form-label">
                                Booking ID *
                            </label>
                            <input
                                id="bookingId"
                                name="bookingId"
                                type="text"
                                placeholder="Enter booking ID"
                                value={form.bookingId}
                                onChange={handleChange}
                                required
                                className="form-input"
                            />
                        </div>
                    </div>

                    {/* Items Section */}
                    <div className="form-section">
                        <div className="section-header">
                            <h3 className="section-title">Bill Items</h3>
                            <button
                                type="button"
                                onClick={addItem}
                                className="btn-add-item"
                            >
                                <span className="plus-icon">+</span> Add Item
                            </button>
                        </div>

                        {/* Table for Desktop */}
                        <div className="items-table desktop-view">
                            <div className="table-header">
                                <div className="table-col col-name">Item Name</div>
                                <div className="table-col col-qty">Quantity</div>
                                <div className="table-col col-price">Price (₹)</div>
                                <div className="table-col col-total">Total (₹)</div>
                                <div className="table-col col-action">Action</div>
                            </div>

                            {items.map((item, index) => (
                                <div key={index} className="table-row">
                                    <div className="table-col col-name">
                                        <input
                                            type="text"
                                            placeholder="Item name"
                                            value={item.itemName}
                                            onChange={(e) =>
                                                handleItemChange(index, "itemName", e.target.value)
                                            }
                                            required
                                            className="table-input"
                                        />
                                    </div>
                                    <div className="table-col col-qty">
                                        <input
                                            type="number"
                                            min="1"
                                            value={item.quantity}
                                            onChange={(e) =>
                                                handleItemChange(index, "quantity", e.target.value)
                                            }
                                            required
                                            className="table-input"
                                        />
                                    </div>
                                    <div className="table-col col-price">
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            placeholder="0.00"
                                            value={item.price}
                                            onChange={(e) =>
                                                handleItemChange(index, "price", e.target.value)
                                            }
                                            required
                                            className="table-input"
                                        />
                                    </div>
                                    <div className="table-col col-total">
                                        <span className="item-total">
                                            ₹{(item.quantity * item.price).toFixed(2)}
                                        </span>
                                    </div>
                                    <div className="table-col col-action">
                                        {items.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeItem(index)}
                                                className="btn-remove"
                                            >
                                                ✕
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Mobile View for Items */}
                        <div className="items-list mobile-view">
                            {items.map((item, index) => (
                                <div key={index} className="item-card">
                                    <div className="item-card-header">
                                        <span>Item #{index + 1}</span>
                                        {items.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeItem(index)}
                                                className="btn-remove"
                                            >
                                                ✕
                                            </button>
                                        )}
                                    </div>
                                    <div className="item-card-body">
                                        <div className="mobile-input-group">
                                            <label>Item Name</label>
                                            <input
                                                type="text"
                                                placeholder="Item name"
                                                value={item.itemName}
                                                onChange={(e) =>
                                                    handleItemChange(index, "itemName", e.target.value)
                                                }
                                                required
                                                className="mobile-input"
                                            />
                                        </div>
                                        <div className="mobile-row">
                                            <div className="mobile-input-group">
                                                <label>Quantity</label>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={item.quantity}
                                                    onChange={(e) =>
                                                        handleItemChange(index, "quantity", e.target.value)
                                                    }
                                                    required
                                                    className="mobile-input"
                                                />
                                            </div>
                                            <div className="mobile-input-group">
                                                <label>Price (₹)</label>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    step="0.01"
                                                    placeholder="0.00"
                                                    value={item.price}
                                                    onChange={(e) =>
                                                        handleItemChange(index, "price", e.target.value)
                                                    }
                                                    required
                                                    className="mobile-input"
                                                />
                                            </div>
                                        </div>
                                        <div className="item-total-mobile">
                                            Total: ₹{(item.quantity * item.price).toFixed(2)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Summary Section */}
                    <div className="form-section summary-section">
                        <h3 className="section-title">Bill Summary</h3>

                        <div className="summary-grid">
                            <div className="summary-row">
                                <span className="summary-label">Subtotal</span>
                                <span className="summary-value">₹{subTotal.toFixed(2)}</span>
                            </div>

                            <div className="summary-row tax-row">
                                <div className="tax-input-group">
                                    <label htmlFor="taxPercent" className="summary-label">
                                        Tax (%)
                                    </label>
                                    <input
                                        id="taxPercent"
                                        name="taxPercent"
                                        type="number"
                                        placeholder="Enter tax %"
                                        value={form.taxPercent}
                                        onChange={handleChange}
                                        min="0"
                                        step="0.01"
                                        className="tax-input"
                                    />
                                </div>
                                <span className="summary-value">₹{taxAmount.toFixed(2)}</span>
                            </div>

                            <div className="summary-row total-row">
                                <span className="total-label">Total Amount</span>
                                <span className="total-value">₹{total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="form-actions">
                        <button
                            type="button"
                            className="btn-secondary"
                            onClick={() => {
                                setItems([{ itemName: "", quantity: 1, price: 0 }]);
                                setForm({ bookingId: "", taxPercent: "" });
                            }}
                        >
                            Clear All
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary"
                        >
                            {loading ? (
                                <>
                                    <span className="spinner"></span>
                                    Creating Bill...
                                </>
                            ) : (
                                "Create Bill"
                            )}
                        </button>
                    </div>

                    {/* Message */}
                    {message && (
                        <div className={`message ${messageType}`}>
                            {message}
                        </div>
                    )}
                </form>
            </div>

            {/* Help Text */}
            <div className="help-text">
                <p>💡 <strong>Tips:</strong> Add multiple items, set tax percentage, and review total before submission.</p>
            </div>
        </div>
    );
};

export default CreateBilling;