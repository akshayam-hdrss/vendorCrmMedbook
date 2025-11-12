import React, { Component } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "../Prescription/PrescriptionDetails.css";

// HOC to inject router props
function withRouter(Component) {
  return (props) => {
    const location = useLocation();
    const navigate = useNavigate();
    return <Component {...props} location={location} navigate={navigate} />;
  };
}

class PrescriptionDetails1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      prescription: null,
      loading: true,
    };
  }

  componentDidMount() {
    // ✅ Extract appointment from location.state
    const { appointment } = this.props.location.state || {};
    const prescriptionId = appointment?.prescriptionID; // Use id from appointment

    if (!prescriptionId) {
      console.error("Prescription ID not provided");
      this.setState({ loading: false });
      return;
    }

    axios
      .get(
        `https://medbook-backend-1.onrender.com/api/prescription/getbyid/${prescriptionId}`
      )
      .then((res) => {
        // res.data matches the structure you shared
        this.setState({ prescription: res.data, loading: false });
      })
      .catch((err) => {
        console.error(err);
        this.setState({ loading: false });
      });
  }

  render() {
    const { prescription, loading } = this.state;

    if (loading) return <p>Loading...</p>;
    if (!prescription) return <p>Prescription not found.</p>;

    return (
      <div className="prescription-container">
        <h2 className="page-title">Prescription Details</h2>

        <div className="prescription-grid">
          <div className="prescription-card">
            <h3>{prescription.patientName}</h3>
            <p>
              <strong>Age:</strong> {prescription.age}
            </p>
            {/* <p>
              <strong>Address:</strong>{" "}
              {prescription.address ? prescription.address : "N/A"}
            </p> */}
            <p>
              <strong>Description:</strong>{" "}
              {prescription.description ? prescription.description : "N/A"}
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {new Date(prescription.date).toLocaleDateString()}
            </p>

            {/* Medicine Table */}
            {prescription.prescription && prescription.prescription.length > 0 && (
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
                  {prescription.prescription.map((med, index) => (
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
            )}

            {/* Next Visit */}
            {prescription.nextVisit && (
              <p className="visit">
                <strong>Next Visit:</strong>{" "}
                {new Date(prescription.nextVisit).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(PrescriptionDetails1);
