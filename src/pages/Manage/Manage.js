import React from "react";
import { Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaNotesMedical, FaHistory } from "react-icons/fa";

const Manage = () => {
  const navigate = useNavigate();

  // 🔐 Get user
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const isDoctor = storedUser?.isDoctor;
  const isService = storedUser?.isService;

  // 🎯 Dynamic values
  const primaryBtnLabel = isDoctor
    ? "Medication Details"
    : isService
      ? "Product & Service"
      : "Medication Details";

  const primaryBtnRoute = isDoctor
    ? "/medicalproducts"
    : isService
      ? "/create-billing"
      : "/medicalproducts";

  const secondaryBtnLabel = isService
    ? "Billing History"
    : "Prescription History";

  const secondaryBtnRoute = isService
    ? "/billing-history"
    : "/prescriptionDetails";

  return (
    <>
      <style>{`
        /* Container Styling */
        .prescription-buttons-container {
          height: 80vh;
          background: linear-gradient(135deg, #e3f2fd, #ffffff);
          border-radius: 15px;
          padding: 30px;
          box-shadow: 0 8px 16px rgba(0,0,0,0.1);
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .button-group {
          display: flex;
          flex-direction: row;
          gap: 30px;
          width: 100%;
          justify-content: center;
          align-items: center;
        }

        /* Button Base Style */
        .custom-btn {
          font-size: 20px;
          padding: 16px 35px;
          border-radius: 50px;
          border: none;
          transition: all 0.3s ease;
          font-weight: bold;
          min-width: 270px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          position: relative;
          overflow: hidden;
        }

        /* Ripple Effect */
        .custom-btn::after {
          content: "";
          position: absolute;
          width: 300%;
          height: 300%;
          top: 50%;
          left: 50%;
          background: rgba(255, 255, 255, 0.4);
          transform: translate(-50%, -50%) scale(0);
          opacity: 0;
          transition: all 0.5s ease;
          border-radius: 50%;
        }

        .custom-btn:active::after {
          transform: translate(-50%, -50%) scale(1);
          opacity: 1;
          transition: 0s;
        }

        /* Primary Button Style */
        .primary-btn {
          background: linear-gradient(45deg, #006eff, #00aaff);
          color: white;
          box-shadow: 0 10px 15px rgba(0, 123, 255, 0.4);
        }

        .primary-btn:hover {
          transform: translateY(-4px);
          box-shadow: 0 15px 20px rgba(0, 123, 255, 0.6);
        }

        /* Success Button Style */
        .success-btn {
          background: linear-gradient(45deg, #27b84a, #62e065);
          color: white;
          box-shadow: 0 10px 15px rgba(40, 167, 69, 0.4);
        }

        .success-btn:hover {
          transform: translateY(-4px);
          box-shadow: 0 15px 20px rgba(40, 167, 69, 0.6);
        }

        /* Mobile Responsive Styles */
        @media (max-width: 768px) {
          .prescription-buttons-container {
            height: auto;
            min-height: 70vh;
            padding: 20px 15px;
            margin: 10px;
            border-radius: 10px;
          }

          .button-group {
            flex-direction: column;
            gap: 20px;
            width: 100%;
          }

          .custom-btn {
            font-size: 16px;
            padding: 14px 25px;
            min-width: 200px;
            width: 100%;
            max-width: 280px;
          }

          .custom-btn .mx-3 {
            margin-left: 0 !important;
            margin-right: 0 !important;
          }
        }

        /* Small Mobile Devices */
        @media (max-width: 480px) {
          .prescription-buttons-container {
            padding: 15px 10px;
            min-height: 60vh;
          }

          .button-group {
            gap: 15px;
          }

          .custom-btn {
            font-size: 14px;
            padding: 12px 20px;
            min-width: 180px;
          }

          .custom-btn svg {
            width: 18px;
            height: 18px;
          }
        }

        /* Tablet Styles */
        @media (min-width: 769px) and (max-width: 1024px) {
          .button-group {
            gap: 20px;
          }

          .custom-btn {
            font-size: 18px;
            padding: 15px 30px;
            min-width: 240px;
          }
        }
      `}</style>
      <Container className="prescription-buttons-container">
        <div className="button-group">
          {/* PRIMARY BUTTON */}
          <Button
            className="custom-btn primary-btn mx-3"
            onClick={() => navigate(primaryBtnRoute)}
          >
            <FaNotesMedical size={22} />
            {primaryBtnLabel}
          </Button>

          {/* HISTORY BUTTON */}
          <Button
            className="custom-btn success-btn mx-3"
            onClick={() => navigate(secondaryBtnRoute)}
          >
            <FaHistory size={22} />
            {secondaryBtnLabel}
          </Button>
        </div>
      </Container>
    </>
  );
};

export default Manage;
