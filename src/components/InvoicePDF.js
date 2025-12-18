// InvoicePDF.js
import React from 'react';
import './InvoicePDF.css';

const InvoicePDF = React.forwardRef(({ 
  invoiceData, 
  serviceInfo, 
  userInfo 
}, ref) => {
  
  // Format date
  const formatDate = (dateString) => {
    const date = dateString ? new Date(dateString) : new Date();
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  // Generate invoice number
  const generateInvoiceNumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `${randomNum}-${month}`;
  };

  const {
    items = [],
    subTotal = 0,
    taxPercent = 0,
    taxAmount = 0,
    total = 0,
    dueDate
  } = invoiceData || {};

  const {
    serviceName = "Medical Service",
    address = "123 Anywhere St., Any City, ST 12346",
    contact = "",
    email = ""
  } = serviceInfo || {};

  const {
    name = "Aaron Loeb",
    address: userAddress = "123 Anywhere St., Any City, ST 12346",
    contact: userContact = ""
  } = userInfo || {};

  return (
    <div className="invoice-container" ref={ref}>
      {/* Invoice Header */}
      <div className="invoice-header">
        <div className="invoice-title">
          <h1>INVOICE</h1>
          <div className="company-name">{serviceName}</div>
        </div>
        
        <div className="invoice-meta">
          <div className="invoice-number">
            <span>NO. {generateInvoiceNumber()}</span>
          </div>
          <div className="invoice-date">
            <div className="date-label">DATE</div>
            <div className="date-value">{formatDate()}</div>
          </div>
          <div className="invoice-due">
            <div className="due-label">DUE</div>
            <div className="due-value">{dueDate || formatDate(new Date().setDate(new Date().getDate() + 30))}</div>
          </div>
        </div>
      </div>

      {/* Company and Client Info */}
      <div className="invoice-info-section">
        <div className="company-info">
          <div className="info-label">FROM</div>
          <div className="company-name-bold">{serviceName}</div>
          <div className="company-address">{address}</div>
          {contact && <div className="company-contact">Phone: {contact}</div>}
          {email && <div className="company-email">Email: {email}</div>}
        </div>

        <div className="client-info">
          <div className="info-label">INVOICE TO</div>
          <div className="client-name">{name}</div>
          <div className="client-address">{userAddress}</div>
          {userContact && <div className="client-contact">Phone: {userContact}</div>}
        </div>
      </div>

      {/* Items Table */}
      <div className="invoice-table">
        <div className="table-header">
          <div className="table-col description">DESCRIPTION</div>
          <div className="table-col price">PRICE</div>
          <div className="table-col qty">QTY</div>
          <div className="table-col subtotal">SUBTOTAL</div>
        </div>

        {items.map((item, index) => (
          <div className="table-row" key={index}>
            <div className="table-col description">{item.itemName || `Description ${index + 1}`}</div>
            <div className="table-col price">${item.price?.toFixed(2) || "0.00"}</div>
            <div className="table-col qty">{item.quantity || 1}</div>
            <div className="table-col subtotal">
              ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
            </div>
          </div>
        ))}
      </div>

      {/* Total Section */}
      <div className="invoice-total">
        <div className="total-row">
          <div className="total-label">GRAND TOTAL :</div>
          <div className="total-value">${total.toFixed(2)}</div>
        </div>
      </div>

      {/* Payment Information */}
      <div className="payment-info">
        <div className="payment-method">
          <div className="payment-title">PAYMENT METHOD</div>
          <div className="bank-details">
            <div className="bank-row">
              <span className="bank-label">Bank Name:</span>
              <span className="bank-value">Thynk Unlimited Bank</span>
            </div>
            <div className="bank-row">
              <span className="bank-label">Bank Account:</span>
              <span className="bank-value">123-456-7890</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="invoice-footer">
        <div className="footer-content">
          <div className="footer-company">{serviceName}</div>
          <div className="footer-address">{address}</div>
        </div>
      </div>
    </div>
  );
});

export default InvoicePDF;