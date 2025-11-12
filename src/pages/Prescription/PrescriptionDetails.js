import React, { Component } from "react";
import axios from "axios";
import "./PrescriptionDetails.css";

export default class PrescriptionDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      prescriptions: [],
      loading: true,
    };
  }

  componentDidMount() {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const userId = storedUser?.id; // ✅ Safely access ID

    if (!userId) {
      console.error("User ID not found in localStorage");
      this.setState({ loading: false });
      return;
    }

    axios
      .get(`https://medbook-backend-1.onrender.com/api/prescription/${userId}`)
      .then((res) => {
        this.setState({ prescriptions: res.data, loading: false });
      })
      .catch((err) => {
        console.error(err);
        this.setState({ loading: false });
      });
  }

  render() {
    const { prescriptions, loading } = this.state;

    return (
      <div className="prescription-container">
        <h2 className="page-title">Prescription Details</h2>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="prescription-grid">
            {prescriptions.map((item) => (
              <div className="prescription-card" key={item.id}>
                <h3>{item.patientName}</h3>
                <p><strong>Age:</strong> {item.age}</p>
                {/* <p><strong>Address:</strong> {item.address}</p> */}
                <p><strong>Description:</strong> {item.description}</p>
                <p><strong>Date:</strong> {new Date(item.date).toLocaleDateString()}</p>

                {/* ✅ Table sits correctly inside the card */}
                <table className="medicine-table">
                  <thead>
                    <tr>
                      <th>Medicine</th>
                      <th>Qty</th>
                      <th>Breakfast</th>
                      <th>Lunch</th>
                      <th>Dinner</th>
                      <th>Food Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {item.prescription.map((med, index) => (
                      <tr key={index}>
                        <td>{med.medicine}</td>
                        <td>{med.quantity}</td>
                        <td>{med.breakfast ? "✔" : "-"}</td>
                        <td>{med.lunch ? "✔" : "-"}</td>
                        <td>{med.dinner ? "✔" : "-"}</td>
                        <td>{med.beforeAfterFood}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <p className="visit">
                  <strong>Next Visit:</strong>{" "}
                  {new Date(item.nextVisit).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
}
