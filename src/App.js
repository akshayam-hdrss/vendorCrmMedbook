import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
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
import ReceivedRx from "./pages/Recevied-Rx/receivedRx";
import Productpage3 from "./pages/Products/Products3/ProductPage3";
import ProductPage4 from "./pages/Products/Products4/ProductPage4";
import Productpage2 from "./pages/Products/Products2/Productpage2";
import PrescriptionDetails1 from "./pages/Schedules/PrescriptionDetails1";
import Home from "./pages/Home/Home";
import Invoice from "./pages/ServiceBilling/Invoice";
import CreateBilling from "./pages/ServiceBilling/CreateBilling";

// Layout component for pages WITH sidebar
function AppLayout({ children }) {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">{children}</div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        {/* PUBLIC HOME PAGE - Full screen, no app-container layout */}
        <Route path="/" element={<Home />} />

        {/* PUBLIC LOGIN PAGE - With sidebar layout */}
        <Route
          path="/login"
          element={
            <AppLayout>
              <LoginPage />
            </AppLayout>
          }
        />

        {/* PROTECTED ROUTES - All with sidebar layout */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Dashboard />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/schedule"
          element={
            <ProtectedRoute>
              <AppLayout>
                <DoctorSchedulePage />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/prescription"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Prescription />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/prescriptionDetails"
          element={
            <ProtectedRoute>
              <AppLayout>
                <PrescriptionDetails />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/manage"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Manage />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Manage />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/medicalproducts"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Medicalproduct />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/product/:productId"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Productpage2 />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/received-rx"
          element={
            <ProtectedRoute>
              <AppLayout>
                <ReceivedRx />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/product/:productId/:productTypeId"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Productpage3 />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/productdetails/:productId"
          element={
            <ProtectedRoute>
              <AppLayout>
                <ProductPage4 />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/prescription-details1"
          element={
            <ProtectedRoute>
              <AppLayout>
                <PrescriptionDetails1 />
              </AppLayout>
            </ProtectedRoute>
          }
        />
         <Route
          path="/Invoice"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Invoice />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/ServiceBilling"
          element={
            <ProtectedRoute>
              <AppLayout>
                <CreateBilling />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        {/* REDIRECT any unknown routes to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
