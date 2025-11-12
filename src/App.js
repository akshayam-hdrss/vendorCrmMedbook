import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import DoctorSchedulePage from "./pages/Schedules/Schedules";
import Prescription from "./pages/Prescription/Prescription";
import LoginPage from "./pages/Auth/login";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";
import PrescriptionDetails from "./pages/Prescription/PrescriptionDetails";
import Manage from "./pages/Manage/Manage";
import Medicalproduct from "./pages/Manage/Medicalproduct";
import Productpage3 from "./pages/Products/Products3/ProductPage3";
import ProductPage4 from "./pages/Products/Products4/ProductPage4";
import Productpage2 from "./pages/Products/Products2/Productpage2";
import PrescriptionDetails1 from "./pages/Schedules/PrescriptionDetails1";

function App() {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <div className="main-content">
          <Routes>
            {/* Protected Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/schedule"
              element={
                <ProtectedRoute>
                  <DoctorSchedulePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/prescription"
              element={
                <ProtectedRoute>
                  <Prescription />
                </ProtectedRoute>
              }
            />
            <Route
              path="/prescriptionDetails"
              element={
                <ProtectedRoute>
                  <PrescriptionDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/manage"
              element={
                <ProtectedRoute>
                  <Manage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/products"
              element={
                <ProtectedRoute>
                  <Manage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/medicalproducts"
              element={
                <ProtectedRoute>
                  <Medicalproduct />
                </ProtectedRoute>
              }
            />
            <Route
              path="/product/:productId"
              element={
                <ProtectedRoute>
                  <Productpage2 />
                </ProtectedRoute>
              }
            />

            <Route
              path="/product/:productId/:productTypeId"
              element={
                <ProtectedRoute>
                  <Productpage3 />
                </ProtectedRoute>
              }
            />
            <Route
              path="/productdetails/:productId"
              element={
                <ProtectedRoute>
                  <ProductPage4 />
                </ProtectedRoute>
              }
            />
            <Route
              path="/prescription-details1"
              element={
                <ProtectedRoute>
                  <PrescriptionDetails1 />
                </ProtectedRoute>
              }
            />

            {/* Public Route */}
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
