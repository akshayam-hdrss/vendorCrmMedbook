import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, Modal } from "react-bootstrap";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const SERVICE_ID = 103;

export default function BillingHistory() {
    const [bills, setBills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBill, setSelectedBill] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchBills();
    }, []);

    const fetchBills = async () => {
        try {
            const res = await axios.get(
                `https://medbook-backend-1.onrender.com/api/service-billing/service/${SERVICE_ID}`
            );
            setBills(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const openModal = (bill) => {
        setSelectedBill(bill);
        setShowModal(true);
    };

    const closeModal = () => {
        setSelectedBill(null);
        setShowModal(false);
    };

    // 📄 PDF DOWNLOAD
    const downloadPDF = (bill) => {
        const doc = new jsPDF();

        doc.setFontSize(18);
        doc.setTextColor(220, 0, 0);
        doc.text("Medbook Invoice", 14, 20);

        doc.setFontSize(11);
        doc.setTextColor(0);
        doc.text(`Customer: ${bill.customerName}`, 14, 30);
        doc.text(`Contact: ${bill.contactNumber}`, 14, 36);
        doc.text(`Bill ID: ${bill.id}`, 14, 42);
        doc.text(`Date: ${new Date(bill.createdAt).toLocaleString()}`, 14, 48);

        autoTable(doc, {
            startY: 55,
            head: [["Description", "Price", "Qty", "Total"]],
            body: bill.items.map((item) => [
                item.itemName,
                item.price,
                item.quantity,
                item.price * item.quantity,
            ]),
        });

        const finalY = doc.lastAutoTable.finalY || 70;

        doc.text(`Subtotal: ₹${bill.subTotal}`, 140, finalY + 10);
        doc.text(`Tax: ₹${bill.tax}`, 140, finalY + 16);
        doc.text(`Total: ₹${bill.total}`, 140, finalY + 22);

        doc.save(`invoice_${bill.id}.pdf`);
    };

    return (
        <div className="container mt-4">
            <h3 className="mb-3">Billing History</h3>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <Table bordered hover responsive>
                    <thead className="table-dark">
                        <tr>
                            <th>#</th>
                            <th>Customer</th>
                            <th>Contact</th>
                            <th>Subtotal</th>
                            <th>Tax</th>
                            <th>Total</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bills.map((bill, index) => (
                            <tr key={bill.id}>
                                <td>{index + 1}</td>
                                <td>{bill.customerName}</td>
                                <td>{bill.contactNumber}</td>
                                <td>₹{bill.subTotal}</td>
                                <td>₹{bill.tax}</td>
                                <td><b>₹{bill.total}</b></td>
                                <td>{new Date(bill.createdAt).toLocaleDateString()}</td>
                                <td>
                                    <Button
                                        size="sm"
                                        variant="primary"
                                        onClick={() => openModal(bill)}
                                    >
                                        View
                                    </Button>{" "}
                                    {/* <Button
                                        size="sm"
                                        variant="success"
                                        onClick={() => downloadPDF(bill)}
                                    >
                                        PDF
                                    </Button> */}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}

            {/* 🔍 ITEMS MODAL */}
            <Modal show={showModal} onHide={closeModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Bill Items</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedBill && (
                        <>
                            <p><b>Customer:</b> {selectedBill.customerName}</p>

                            <Table bordered style={{ backgroundColor: "red" }}>
                                <thead>
                                    <tr>
                                        <th>Description</th>
                                        <th>Price</th>
                                        <th>Qty</th>
                                        <th>Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedBill.items.map((item, i) => (
                                        <tr key={i}>
                                            <td>{item.itemName}</td>
                                            <td>₹{item.price}</td>
                                            <td>{item.quantity}</td>
                                            <td>₹{item.price * item.quantity}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>

                            <div className="text-end">
                                <p>Subtotal: ₹{selectedBill.subTotal}</p>
                                <p>Tax: ₹{selectedBill.tax}</p>
                                <h5>Total: ₹{selectedBill.total}</h5>
                            </div>
                        </>
                    )}
                </Modal.Body>
            </Modal>
        </div>
    );
}
