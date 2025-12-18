import React, { useState } from "react";
import axios from "axios";

const CreateBilling = () => {
    // 🔐 Local storage
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const shopDetails = JSON.parse(localStorage.getItem("shopdetails"));
    const serviceId = shopDetails?.id || "";
    const serviceName = shopDetails?.serviceName || "";
    const userId = 0;

    // 🧾 Form
    const [form, setForm] = useState({
        bookingId: "",
        taxPercent: "",
    });

    // 🛒 Items
    const [items, setItems] = useState([
        { itemName: "", quantity: 1, price: 0 },
    ]);

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    // Handle basic input
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Handle item change
    const handleItemChange = (index, field, value) => {
        const updatedItems = [...items];
        updatedItems[index][field] = value;
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
                "http://localhost:5000/api/service-billing/create-bill",
                {
                    bookingId: Number(form.bookingId),
                    serviceId: Number(serviceId),
                    userId: Number(userId),
                    taxPercent,
                    taxAmount,
                    items,
                }
            );

            setMessage("✅ Bill created successfully");
            setItems([{ itemName: "", quantity: 1, price: 0 }]);
            setForm({ bookingId: "", taxPercent: "" });
        } catch (error) {
            setMessage("❌ Failed to create bill");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: 900, margin: "auto", padding: 20 }}>
            <h2>Create Billing</h2>

            {/* Service Info */}
            <div style={{ marginBottom: 15 }}>
                <strong>Service:</strong> {serviceName} (ID: {serviceId})
            </div>

            <form onSubmit={handleSubmit}>
                {/* Booking */}
                <div style={{ display: "flex", gap: 10, marginBottom: 15 }}>
                    <input
                        name="bookingId"
                        placeholder="Booking ID"
                        value={form.bookingId}
                        onChange={handleChange}
                        required
                    />
                </div>

                <hr />

                {/* Items */}
                <h4>Items</h4>
                {items.map((item, index) => (
                    <div
                        key={index}
                        style={{ display: "flex", gap: 10, marginBottom: 10 }}
                    >
                        <input
                            placeholder="Item Name"
                            value={item.itemName}
                            onChange={(e) =>
                                handleItemChange(index, "itemName", e.target.value)
                            }
                            required
                        />
                        <input
                            type="number"
                            placeholder="Qty"
                            value={item.quantity}
                            onChange={(e) =>
                                handleItemChange(index, "quantity", e.target.value)
                            }
                            required
                        />
                        <input
                            type="number"
                            placeholder="Price"
                            value={item.price}
                            onChange={(e) =>
                                handleItemChange(index, "price", e.target.value)
                            }
                            required
                        />
                        <button type="button" onClick={() => removeItem(index)}>
                            ❌
                        </button>
                    </div>
                ))}

                <button type="button" onClick={addItem}>
                    ➕ Add Item
                </button>

                <hr />

                {/* Totals */}
                <p>
                    <strong>Subtotal:</strong> ₹{subTotal.toFixed(2)}
                </p>

                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <label>
                        <strong>Tax (%):</strong>
                    </label>
                    <input
                        type="number"
                        name="taxPercent"
                        placeholder="Enter tax %"
                        value={form.taxPercent}
                        onChange={handleChange}
                        min="0"
                        step="0.01"
                    />
                </div>

                <p>
                    <strong>Tax Amount:</strong> ₹{taxAmount.toFixed(2)}
                </p>

                <p>
                    <strong>Total:</strong> ₹{total.toFixed(2)}
                </p>

                <button type="submit" disabled={loading}>
                    {loading ? "Saving..." : "Create Bill"}
                </button>
            </form>

            {message && <p style={{ marginTop: 15 }}>{message}</p>}
        </div>
    );
};

export default CreateBilling;
