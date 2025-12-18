import React, { useState } from "react";
import axios from "axios";
import "./CreateBilling.css";
import { useLocation } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const CreateBilling = () => {
  // 🔐 Local storage
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const shopDetails = JSON.parse(localStorage.getItem("shopdetails"));
  const serviceId = storedUser?.id || "";
  const serviceName = shopDetails?.serviceName || "";

  const location = useLocation();
  const appointment = location.state?.appointment;

  // Get data from appointment props
  const userId = appointment?.userId || "";
  const defaultCustomerName =
    appointment?.customerName || appointment?.username || "";
  const defaultContactNumber = appointment?.contactNumber || "";

  // 🧾 Form with editable name and number
  const [form, setForm] = useState({
    bookingId: appointment?.id || "",
    taxPercent: "",
    customerName: defaultCustomerName,
    contactNumber: defaultContactNumber,
  });

  // 🛒 Items
  const [items, setItems] = useState([{ itemName: "", quantity: 1, price: 0 }]);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [pdfPreview, setPdfPreview] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  // Handle basic input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle item change
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = field === "itemName" ? value : Number(value);
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

  // 📄 Generate PDF with better design
  const generatePDF = () => {
    const doc = new jsPDF();

    // Header with Medbook on right side in red color
    doc.setFillColor(228, 0, 0); // Red color
    doc.rect(0, 0, 210, 40, "F"); // Red header background

    // Medbook text in white
    doc.setTextColor(255, 255, 255); // White color
    doc.setFontSize(28);
    doc.setFont("helvetica", "bold");
    doc.text("Medbook", 160, 25);

    // Invoice title
    doc.setTextColor(255, 255, 255); // White
    doc.setFontSize(24);
    doc.text("INVOICE", 105, 55, { align: "center" });

    // Service Provider Info
    doc.setTextColor(0, 0, 0); // Black
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(serviceName || "Service Provider", 20, 75);

    // Line separator
    doc.setDrawColor(228, 0, 0); // Red color
    doc.setLineWidth(0.5);
    doc.line(20, 80, 190, 80);

    // Customer Info
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("INVOICE TO:", 20, 90);
    doc.setFont("helvetica", "normal");
    doc.text(`Name: ${form.customerName}`, 20, 97);
    doc.text(`Contact: ${form.contactNumber}`, 20, 104);

    // Table Headers - Improved table design
    const tableColumn = ["DESCRIPTION", "PRICE (₹)", "QTY", "SUBTOTAL (₹)"];
    const tableRows = items
      .filter((item) => item.itemName.trim() !== "" && item.price > 0)
      .map((item) => [
        item.itemName,
        item.price.toFixed(2),
        item.quantity.toString(),
        (item.price * item.quantity).toFixed(2),
      ]);

    // Add summary rows
    tableRows.push(["", "", "Subtotal", subTotal.toFixed(2)]);

    if (taxPercent > 0) {
      tableRows.push(["", "", `Tax (${taxPercent}%)`, taxAmount.toFixed(2)]);
    }

    tableRows.push(["", "", "TOTAL", total.toFixed(2)]);

    autoTable(doc, {
      startY: 110,
      head: [tableColumn],
      body: tableRows,
      theme: "grid",
      headStyles: {
        fillColor: [228, 0, 0], // Red header
        textColor: 255, // White text
        fontSize: 11,
        fontStyle: "bold",
        halign: "center",
      },
      styles: {
        fontSize: 10,
        cellPadding: 5,
        lineColor: [200, 200, 200],
        lineWidth: 0.1,
      },
      bodyStyles: {
        textColor: [0, 0, 0],
        fontSize: 10,
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
      columnStyles: {
        0: { cellWidth: 90, fontStyle: "bold" },
        1: { cellWidth: 35, halign: "right" },
        2: { cellWidth: 25, halign: "center" },
        3: { cellWidth: 40, halign: "right", fontStyle: "bold" },
      },
      margin: { left: 20, right: 20 },
    });

    // Highlight total row
    const finalY = doc.lastAutoTable.finalY || 150;

    // Total row styling
    doc.setFillColor(255, 245, 245); // Light red background
    doc.rect(20, finalY - 10, 170, 10, "F");

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(228, 0, 0); // Red color
    doc.text("Thank you for your business!", 105, finalY + 15, {
      align: "center",
    });

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text("Generated by Medbook Billing System", 105, 280, {
      align: "center",
    });

    // Save PDF and create preview
    const pdfBlob = doc.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);
    setPdfPreview(pdfUrl);
    setShowPreview(true);

    return doc;
  };

  // 🚀 Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // Validate items
    const validItems = items.filter(
      (item) => item.itemName.trim() !== "" && item.price > 0
    );
    if (validItems.length === 0) {
      setMessage("❌ Please add at least one valid item.");
      setMessageType("error");
      setLoading(false);
      return;
    }

    // Validate customer info
    if (!form.customerName.trim()) {
      setMessage("❌ Please enter customer name.");
      setMessageType("error");
      setLoading(false);
      return;
    }

    if (!form.contactNumber.trim()) {
      setMessage("❌ Please enter contact number.");
      setMessageType("error");
      setLoading(false);
      return;
    }

    // Prepare the request payload
    const payload = {
      bookingId: Number(form.bookingId),
      serviceId: Number(serviceId),
      userId: Number(userId),
      subTotal: Number(subTotal),
      tax: Number(taxAmount),
      total: Number(total),
      items: validItems.map((item) => ({
        itemName: item.itemName.trim(),
        quantity: Number(item.quantity),
        price: Number(item.price),
      })),
      customerName: form.customerName.trim(),
      contactNumber: form.contactNumber.trim(),
    };

    console.log("Sending payload:", JSON.stringify(payload, null, 2));

    try {
      const response = await axios.post(
        "https://medbook-backend-1.onrender.com/api/service-billing/create-bill",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Response:", response.data);

      setMessage("✅ Bill created successfully!");
      setMessageType("success");

      // Generate PDF after successful submission
      generatePDF();

      // Clear message after 3 seconds
      setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 3000);
    } catch (error) {
      console.error("Error creating bill:", error.response?.data || error);

      let errorMessage = "❌ Failed to create bill. Please try again.";
      if (error.response?.data?.message) {
        errorMessage = `❌ ${error.response.data.message}`;
      } else if (error.response?.data?.error) {
        errorMessage = `❌ ${error.response.data.error}`;
      }

      setMessage(errorMessage);
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  // Print PDF
  const handlePrint = () => {
    if (pdfPreview) {
      const printWindow = window.open(pdfPreview);
      printWindow.onload = () => {
        printWindow.print();
      };
    }
  };

  // Download PDF
  const handleDownload = () => {
    if (pdfPreview) {
      const link = document.createElement("a");
      link.href = pdfPreview;
      link.download = `Invoice-${form.bookingId || "bill"}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Close preview
  const closePreview = () => {
    setShowPreview(false);
    if (pdfPreview) {
      URL.revokeObjectURL(pdfPreview);
    }
  };

  // Generate preview without submitting
  const handlePreview = () => {
    const validItems = items.filter(
      (item) => item.itemName.trim() !== "" && item.price > 0
    );
    if (validItems.length === 0) {
      setMessage("❌ Please add at least one valid item before preview.");
      setMessageType("error");
      setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 3000);
      return;
    }
    if (!form.customerName.trim()) {
      setMessage("❌ Please enter customer name.");
      setMessageType("error");
      setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 3000);
      return;
    }
    if (!form.contactNumber.trim()) {
      setMessage("❌ Please enter contact number.");
      setMessageType("error");
      setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 3000);
      return;
    }
    generatePDF();
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
          {/* Customer Information Section */}
          <div className="form-section">
            <h3 className="section-title">Customer Information</h3>
            <div className="form-row">
              <div className="input-group">
                <label htmlFor="customerName" className="form-label">
                  Customer Name *
                </label>
                <input
                  id="customerName"
                  name="customerName"
                  type="text"
                  value={form.customerName}
                  onChange={handleChange}
                  required
                  className="form-input"
                  placeholder="Enter customer name"
                />
              </div>
              <div className="input-group">
                <label htmlFor="contactNumber" className="form-label">
                  Contact Number *
                </label>
                <input
                  id="contactNumber"
                  name="contactNumber"
                  type="text"
                  value={form.contactNumber}
                  onChange={handleChange}
                  required
                  className="form-input"
                  placeholder="Enter contact number"
                />
              </div>
            </div>
          </div>

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
              <button type="button" onClick={addItem} className="btn-add-item">
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
                setForm({
                  bookingId: appointment?.id || "",
                  taxPercent: "",
                  customerName: defaultCustomerName,
                  contactNumber: defaultContactNumber,
                });
                setMessage("");
                setMessageType("");
              }}
            >
              Clear All
            </button>
            <button
              type="button"
              className="btn-preview"
              onClick={handlePreview}
              disabled={loading}
            >
              Preview Bill
            </button>
            <button type="submit" disabled={loading} className="btn-primary">
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
          {message && <div className={`message ${messageType}`}>{message}</div>}
        </form>
      </div>

      {/* PDF Preview Modal - Fixed to show PDF with Print/Download buttons */}
      {showPreview && pdfPreview && (
        <div className="pdf-preview-modal">
          <div className="pdf-preview-content">
            <div className="pdf-preview-header">
              <h3 style={{ color: "white", margin: 0 }}>Invoice Preview</h3>
              <div className="pdf-preview-actions">
                <button onClick={handlePrint} className="btn-print">
                  🖨️ Print
                </button>
                <button onClick={handleDownload} className="btn-download">
                  ⬇️ Download PDF
                </button>
                <button onClick={closePreview} className="btn-close">
                  ✕ Close
                </button>
              </div>
            </div>
            <div className="pdf-preview-body">
              <iframe
                src={pdfPreview}
                title="Invoice Preview"
                className="pdf-iframe"
                style={{ width: "100%", height: "500px", border: "none" }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Help Text */}
      <div className="help-text">
        <p>
          💡 <strong>Tips:</strong> Add bill items, set tax percentage, and
          review total before submission.
        </p>
        <p>📄 Click "Preview Bill" to see PDF before creating bill.</p>
      </div>
    </div>
  );
};

export default CreateBilling;