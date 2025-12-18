import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaCalendarAlt,
  FaFilePrescription,
  FaSignOutAlt,
} from "react-icons/fa";
import { MdManageAccounts } from "react-icons/md";
import { Button } from "react-bootstrap";
import "./Sidebar.css";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const shopDetails = JSON.parse(localStorage.getItem("shopdetails"));
  const isDoctor = storedUser?.isDoctor;
  const isProduct = storedUser?.isProduct;
  const isService = storedUser?.isService;
  const isLab = storedUser?.isLab;
  const isPharmacy = storedUser?.isPharmacy;

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("shopdetails");
    navigate("/login");
  };

  return (
    <>
      {/* Hamburger (mobile) */}
      <Button
        className="sidebar-toggle-btn d-block d-md-none"
        onClick={toggleSidebar}
        variant="light"
      >
        ☰
      </Button>

      {/* Sidebar */}
      <nav className={`sidebar ${isOpen ? "open" : ""}`}>
        <h3 className="sidebar-title text-center mb-4">🏥 MEDBOOK</h3>
        <ul className="sidebar-list">
          {/* ✅ Dashboard - Always visible */}
          <li>
            <NavLink
              to="/Dashboard"
              className={({ isActive }) =>
                isActive ? "sidebar-link active" : "sidebar-link"
              }
            >
              <FaHome className="me-2" /> Dashboard
            </NavLink>
          </li>

          {/* ✅ Show Product menu only if user is Product */}
          {isProduct ? (
            <>
              <li>
                <NavLink
                  to={`/product/${shopDetails?.id || ""}`}
                  className={({ isActive }) =>
                    isActive ? "sidebar-link active" : "sidebar-link"
                  }
                >
                  <FaFilePrescription className="me-2" /> Products
                </NavLink>
              </li>
            </>
          ) : (
            <>
              {/* Doctor Menu */}
              {isDoctor ? (
                <li>
                  <NavLink
                    to="/schedule"
                    className={({ isActive }) =>
                      isActive ? "sidebar-link active" : "sidebar-link"
                    }
                  >
                    <FaCalendarAlt className="me-2" /> Schedule
                  </NavLink>
                </li>
              ) :
                isService ? (
                  <>
                    <li>
                      <NavLink
                        to="/serviceschedule"
                        className={({ isActive }) =>
                          isActive ? "sidebar-link active" : "sidebar-link"
                        }
                      >
                        <FaCalendarAlt className="me-2" /> Schedule
                      </NavLink>
                    </li>

                    <li>
                      <NavLink
                        to="/ServiceBilling"
                        className={({ isActive }) =>
                          isActive ? "sidebar-link active" : "sidebar-link"
                        }
                      >
                        <FaFilePrescription className="me-2" /> Billing
                      </NavLink>
                    </li>
                  </>
                ) : null}

              {/* Prescription */}
              <li>
                <NavLink
                  to="/prescription"
                  className={({ isActive }) =>
                    isActive ? "sidebar-link active" : "sidebar-link"
                  }
                >
                  <FaFilePrescription className="me-2" /> Prescription
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/received-rx"
                  className={({ isActive }) =>
                    isActive ? "sidebar-link active" : "sidebar-link"
                  }
                >
                  <FaFilePrescription className="me-2" /> Received-Rx
                </NavLink>
              </li>
              {/* Manage */}
              <li>
                <NavLink
                  to="/manage"
                  className={({ isActive }) =>
                    isActive ? "sidebar-link active" : "sidebar-link"
                  }
                >
                  <MdManageAccounts className="me-2" /> Manage
                </NavLink>
              </li>
            </>
          )}
        </ul>

        {/* 🔴 Logout button */}
        <div className="logout-section">
          <Button
            className="w-100 d-flex align-items-center justify-content-center"
            onClick={handleLogout}
          >
            <FaSignOutAlt className="me-2" /> Logout
          </Button>
        </div>
      </nav>

      {/* Overlay (mobile only) */}
      {isOpen && (
        <div className="sidebar-overlay" onClick={toggleSidebar}></div>
      )}
    </>
  );
}
