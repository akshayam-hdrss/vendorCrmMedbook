import React, { useEffect, useState } from "react";

const ReceivedRx = () => {
  const [received, setReceived] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchReceived = async () => {
    try {
      const res = await fetch(
        "https://medbook-backend-1.onrender.com/api/prescription/serviceid/773"
      );

      if (!res.ok) throw new Error("Failed to fetch data");

      const data = await res.json();
      setReceived(data);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReceived();
  }, []);

  // ---------------- UI States ----------------
  if (loading) return <h3 style={{ textAlign: "center" }}>Loading...</h3>;
  if (error) return <h4 style={{ textAlign: "center", color: "red" }}>{error}</h4>;
  if (received.length === 0)
    return <h4 style={{ textAlign: "center" }}>No prescriptions found.</h4>;

  return (
    <>
      {/* INTERNAL CSS */}
      <style>
        {`
          .rx-container {
            padding: 20px;
            max-width: 900px;
            margin: auto;
          }

          .rx-title {
            text-align: center;
            margin-bottom: 25px;
            color: #ff3a40ff;
            font-size: 28px;
            font-weight: bold;
          }

          .rx-card {
            background: linear-gradient(135deg, #ffffff, #f2f0ff);
            padding: 20px;
            border-radius: 16px;
            box-shadow: 0 6px 15px rgba(0, 0, 0, 0.12);
            margin-bottom: 25px;
            border-left: 6px solid #b9090fff;
            transition: 0.3s ease;
          }

          .rx-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 12px 20px rgba(0, 0, 0, 0.18);
          }

          .rx-patient {
            margin-bottom: 10px;
            color: #333;
            font-size: 22px;
            font-weight: bold;
          }

          .rx-info p {
            margin: 6px 0;
            font-size: 15px;
            color: #444;
          }

          .rx-subtitle {
            margin-top: 18px;
            margin-bottom: 10px;
            color: #4A3AFF;
            font-size: 18px;
            font-weight: bold;
          }

          .rx-prescription-box {
            background: #faf8ff;
            padding: 15px;
            border-radius: 12px;
            border: 1px solid #ddd;
          }

          .rx-med-item {
            padding: 10px 0;
            border-bottom: 1px solid #e1dfff;
          }

          .rx-med-item:last-child {
            border-bottom: none;
          }

          .rx-med-item p {
            margin: 5px 0;
            font-size: 14px;
          }

          /* ---------- RESPONSIVE ---------- */
          @media (max-width: 768px) {
            .rx-card {
              padding: 15px;
            }

            .rx-title {
              font-size: 24px;
            }

            .rx-patient {
              font-size: 20px;
            }

            .rx-info p,
            .rx-med-item p {
              font-size: 14px;
            }
          }

          @media (max-width: 480px) {
            .rx-container {
              padding: 10px;
            }

            .rx-card {
              padding: 15px;
              border-radius: 12px;
            }

            .rx-title {
              font-size: 22px;
            }

            .rx-patient {
              font-size: 18px;
            }

            .rx-info p,
            .rx-med-item p {
              font-size: 13px;
            }
          }
        `}
      </style>

      {/* --------- MAIN UI --------- */}
      <div className="rx-container">
        <h1 className="rx-title">Received Rx</h1>

        {received.map((item, index) => (
          <div key={index} className="rx-card">
            <h2 className="rx-patient">{item.patientName}</h2>

            <div className="rx-info">
              <p><strong>Age:</strong> {item.age}</p>
              <p><strong>Date:</strong> {new Date(item.date).toLocaleDateString()}</p>

              {item.address && <p><strong>Address:</strong> {item.address}</p>}
              {item.description && <p><strong>Description:</strong> {item.description}</p>}

              <p>
                <strong>Next Visit:</strong>{" "}
                {new Date(item.nextVisit).toLocaleDateString()}
              </p>
            </div>

            <h3 className="rx-subtitle">Prescription</h3>

            <div className="rx-prescription-box">
              {item.prescription.map((med, i) => (
                <div key={i} className="rx-med-item">
                  <p><strong>Medicine:</strong> {med.medicine}</p>
                  <p><strong>Quantity:</strong> {med.quantity}</p>
                  <p><strong>Before/After Food:</strong> {med.beforeAfterFood}</p>

                  <p>
                    <strong>Time:</strong>{" "}
                    {[med.breakfast && "Breakfast", med.lunch && "Lunch", med.dinner && "Dinner"]
                      .filter(Boolean)
                      .join(", ") || "No specific time"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ReceivedRx;
