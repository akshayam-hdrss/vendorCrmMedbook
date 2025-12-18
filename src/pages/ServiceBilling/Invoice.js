import React, { useEffect, useState } from "react";
import "./Invoice.css";
import { getBillByBookingId } from "./billingApi";

const Invoice = ({ bookingId }) => {
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchInvoice();
  }, [bookingId]);

  const fetchInvoice = async () => {
    try {
      const res = await getBillByBookingId(bookingId);
      const data = res.data;

      setInvoice({
        invoiceNo: `INV-${data.id}`,
        dueDate: new Date(data.createdAt).toDateString(),
        customerName: data.customerName || "Customer",
        customerAddress: "—",
        customerZip: "",
        items: JSON.parse(data.items),
        total: data.total,
        bankName: "Think Unlimited Bank",
        accountNumber: "123-456-7890",
        companyAddress: "123 Anywhere St, Any City",
        phone: "+91 9876543210",
        email: "support@yourapp.com",
        website: "www.yourapp.com"
      });

      setLoading(false);
    } catch (err) {
      setError("Failed to load invoice");
      setLoading(false);
    }
  };

  if (loading) return <p>Loading invoice...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="invoice-container">
      {/* Header */}
      <div className="invoice-header">
        <div>
          <h1>INVOICE</h1>
          <p className="company-name">FAUGET CO.</p>
          <p className="muted">No: {invoice.invoiceNo}</p>
          <p className="muted">Due: {invoice.dueDate}</p>
        </div>
      </div>

      {/* Invoice To */}
      <div className="invoice-to">
        <h4>INVOICE TO :</h4>
        <p><strong>{invoice.customerName}</strong></p>
        <p>{invoice.customerAddress}</p>
        <p>{invoice.customerZip}</p>
      </div>

      {/* Items Table */}
      <table className="invoice-table">
        <thead>
          <tr>
            <th>Description</th>
            <th>Price</th>
            <th>Qty</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((item, index) => (
            <tr key={index}>
              <td>{item.itemName}</td>
              <td>₹{item.price}</td>
              <td>{item.quantity}</td>
              <td>₹{item.price * item.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Total */}
      <div className="invoice-total">
        <span>GRAND TOTAL</span>
        <span>₹{invoice.total}</span>
      </div>

      {/* Payment */}
      <div className="payment-info">
        <h4>PAYMENT METHOD</h4>
        <p>Bank Name: {invoice.bankName}</p>
        <p>Account No: {invoice.accountNumber}</p>
      </div>

      {/* Footer */}
      <div className="invoice-footer">
        <div>
          <strong>FAUGET CO.</strong>
          <p>{invoice.companyAddress}</p>
        </div>
        <div className="contact">
          <p>{invoice.phone}</p>
          <p>{invoice.email}</p>
          <p>{invoice.website}</p>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
