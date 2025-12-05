import React, { useState, useRef, useEffect } from "react";
import {
  Form,
  Button,
  Table,
  Modal,
  Card,
  Row,
  Col,
  Alert,
} from "react-bootstrap";
import {
  FaPlus,
  FaMinus,
  FaPrescription,
  FaFlask,
  FaPills,
  FaMapMarkerAlt,
  FaPhone,
  FaBuilding,
  FaSearch,
  FaHeart,
  FaRegHeart,
} from "react-icons/fa";

import axios from "axios";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useLocation } from "react-router-dom"; // ✅ FIXED
import "./Prescription.css";

const Prescription = () => {
  const routerLocation = useLocation(); // ✅ safe variable name
  const appointment = routerLocation.state?.appointment; // ✅ receives data

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const doctorId = storedUser?.id;
  const IsDoctor = storedUser?.isDoctor;
  console.log(IsDoctor);
  const islab = storedUser?.isLab;
  const ispharmacy = storedUser?.isPharmacy;
  const shouldShowPrices = IsDoctor !== 1;
  console.log(shouldShowPrices);

  const prescriptionRef = useRef(null);

  const [search, setSearch] = useState("");
  const [medicineList, setMedicineList] = useState([]);
  const [nextVisitDate, setNextVisitDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [availableMedicines, setavailableMedicines] = useState([]);
  const [showSendOptions, setShowSendOptions] = useState(false);
  const [sendingTo, setSendingTo] = useState("");
  const [labs, setLabs] = useState([]);
  const [pharmacies, setPharmacies] = useState([]);
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [currentStep, setCurrentStep] = useState("pharmacy"); // "main", "pharmacy", "lab"
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [favorites, setFavorites] = useState({});
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [savePrescriptionId, setsavePrescriptionId] = useState(0);

  // ✅ Autofill patient data from appointment
  const [patientDetails, setPatientDetails] = useState({
    name: appointment?.patientName || appointment?.username || "",
    // address: "",
    age: appointment?.patientAge || "",
    date: appointment?.date
      ? new Date(appointment.date).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
    diagnosis: appointment?.description || "",
  });

  useEffect(() => {
    fetchMedicineSuggestions();
    fetchLabs();
    fetchPharmacies();
    fetchFavorites();

    // If this page was opened from a received prescription card, prefill medicines
    if (appointment?.prescription && appointment.prescription.length) {
      const mapped = appointment.prescription.map((p) => ({
        name: p.medicine,
        breakfast: !!p.breakfast,
        lunch: !!p.lunch,
        dinner: !!p.dinner,
        beforeFood: p.beforeAfterFood === "before",
        quantity: p.quantity || 1,
        price: p.price || 0,
      }));
      setMedicineList(mapped);
    }
  }, [appointment]);

  // When available medicine suggestions load, fill any missing prices
  useEffect(() => {
    if (availableMedicines.length > 0 && medicineList.length > 0) {
      setMedicineList((prev) =>
        prev.map((m) => {
          // if price already present and non-zero, keep it
          if (m.price && m.price > 0) return m;
          const found = availableMedicines.find((a) => a.name === m.name);
          return found ? { ...m, price: found.price } : m;
        })
      );
    }
    // we intentionally do not include medicineList in deps to avoid looping
  }, [availableMedicines]);

  const fetchMedicineSuggestions = async () => {
    try {
      const response = await axios.get(
        `https://medbook-backend-1.onrender.com/api/medical-product/${doctorId}`
      );

      // Only pick name + price
      const products = response.data.map((item) => ({
        name: item.productName,
        price: item.price,
      }));

      setavailableMedicines(products);
      console.log(products);
    } catch (error) {
      console.error("Error fetching medicine suggestions:", error);
    }
  };

  const fetchLabs = async () => {
    try {
      const response = await axios.get(
        "https://medbook-backend-1.onrender.com/api/user/users-by-role?isLab=true"
      );
      setLabs(response.data.users || []);
    } catch (error) {
      console.error("Error fetching labs:", error);
      setLabs([]);
    }
  };

  const fetchPharmacies = async () => {
    try {
      const response = await axios.get(
        "https://medbook-backend-1.onrender.com/api/user/users-by-role?isPharmacy=true"
      );
      setPharmacies(response.data.users || []);
    } catch (error) {
      console.error("Error fetching pharmacies:", error);
      setPharmacies([]);
    }
  };

  const handleSelectMedicine = (medicine) => {
    if (!medicineList.find((m) => m.name === medicine.name)) {
      setMedicineList([
        ...medicineList,
        {
          name: medicine.name,
          breakfast: false,
          lunch: false,
          dinner: false,
          beforeFood: true,
          quantity: 1,
          price: medicine.price,
        },
      ]);
    }
    setSearch("");
  };

  const fetchFavorites = async () => {
    try {
      const response = await axios.get(
        `https://medbook-backend-1.onrender.com/api/medical-favourites/${doctorId}`
      );
      // Convert array to object: { serviceId: id }
      const favMap = {};
      response.data.forEach((fav) => {
        favMap[fav.serviceId] = fav.id;
      });
      setFavorites(favMap);
    } catch (error) {
      console.error("Error fetching favorites:", error);
    }
  };

  const submitPrescription = async () => {
    if (!patientDetails.name || !patientDetails.age) {
      setMessage("⚠️ Required: Patient Name & Age");
      return;
    }
    if (medicineList.length === 0) {
      setMessage("⚠️ Add at least one medicine");
      return;
    }

    const payload = {
      doctorId: doctorId,
      userId: appointment?.userId, // ✅ link prescription to patient
      patientName: patientDetails.name,
      age: patientDetails.age,
      date: patientDetails.date,
      address: patientDetails.address,
      description: patientDetails.diagnosis,
      prescription: medicineList.map((med) => ({
        medicine: med.name,
        breakfast: med.breakfast,
        lunch: med.lunch,
        dinner: med.dinner,
        beforeAfterFood: med.beforeFood ? "before" : "after",
        quantity: med.quantity,
      })),
      nextVisit: nextVisitDate,
    };

    try {
      setMessage("");
      setLoading(true);

      const res = await axios.post(
        "https://medbook-backend-1.onrender.com/api/prescription",
        payload
      );

      console.log("Prescription saved:", res.data);

      console.log("Appointment ID:", appointment?.id);

      setsavePrescriptionId(res.data.id);
      console.log("prescriptionId:  ", res.data.id);

      if (appointment?.id) {
        await axios.put(
          `https://medbook-backend-1.onrender.com/api/bookings/addprescription/${appointment?.id}`,
          {
            prescriptionId: res.data.id,
          }
        );
      }

      setMessage("✅ Saved Successfully! Downloading PDF...");
      await generatePDF();

      // Show send options popup after PDF download
      setShowSendOptions(true);
      if (ispharmacy || islab) {
        setShowSendOptions(false); // Hide if user is pharmacy or lab
      }
      // setCurrentStep("main");

      setMedicineList([]);
    } catch (error) {
      setMessage("❌ Failed to Save Prescription");
    } finally {
      setLoading(false);
    }
  };

  const handlePatientDetailChange = (field, value) => {
    setPatientDetails((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleChange = (index, field, value) => {
    const updatedList = [...medicineList];
    updatedList[index][field] = value;
    setMedicineList(updatedList);
  };

  const handleQuantity = (index, increment) => {
    const updatedList = [...medicineList];
    const newQty = updatedList[index].quantity + increment;
    updatedList[index].quantity = newQty > 0 ? newQty : 1;
    setMedicineList(updatedList);
  };

  const removeMedicine = (index) => {
    const updatedList = medicineList.filter((_, i) => i !== index);
    setMedicineList(updatedList);
  };

  const handleToggleFavorite = async (serviceId) => {
    try {
      // If already a favorite → DELETE it
      if (favorites[serviceId]) {
        const favoriteId = favorites[serviceId];
        await axios.delete(
          `https://medbook-backend-1.onrender.com/api/medical-favourites/${favoriteId}`
        );

        // Remove from state
        const updatedFavorites = { ...favorites };
        delete updatedFavorites[serviceId];
        setFavorites(updatedFavorites);
      }
      // Otherwise → POST to add it
      else {
        const payload = {
          doctorId: doctorId,
          serviceId: serviceId,
        };
        const response = await axios.post(
          "https://medbook-backend-1.onrender.com/api/medical-favourites",
          payload
        );

        // response.data.id is the new favorite record ID
        setFavorites((prev) => ({
          ...prev,
          [serviceId]: response.data.id,
        }));
      }
    } catch (error) {
      console.error("❌ Error toggling favorite:", error);
    }
  };

  /* ✅ PDF Generator - High Resolution */
  const generatePDF = async () => {
    const input = prescriptionRef.current;
    if (!input) return;

    // Store original styles
    const originalDisplay = input.style.display;
    const originalPosition = input.style.position;
    const originalLeft = input.style.left;
    const originalTop = input.style.top;

    // Show and prepare the printable section
    input.style.display = "block";
    input.style.position = "fixed";
    input.style.left = "0";
    input.style.top = "0";
    input.style.zIndex = "9999";
    input.style.background = "#fff";

    // Wait for DOM update
    await new Promise((resolve) => setTimeout(resolve, 500));

    try {
      const canvas = await html2canvas(input, {
        scale: 3, // Very high scale for crystal clear PDF
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        width: input.scrollWidth,
        height: input.scrollHeight,
        windowWidth: input.scrollWidth,
        windowHeight: input.scrollHeight,
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.querySelector(".printable-section");
          if (clonedElement) {
            clonedElement.style.width = "794px";
            clonedElement.style.height = "auto";
          }
        },
      });

      const imgData = canvas.toDataURL("image/jpeg", 1.0);
      const pdf = new jsPDF("p", "mm", "a4");

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;

      // Add image to PDF
      pdf.addImage(
        imgData,
        "JPEG",
        0,
        0,
        imgWidth,
        imgHeight,
        undefined,
        "FAST"
      );

      pdf.save(`Prescription-${patientDetails.name}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      setMessage("❌ Error generating PDF");
    } finally {
      // Restore original styles
      input.style.display = originalDisplay;
      input.style.position = originalPosition;
      input.style.left = originalLeft;
      input.style.top = originalTop;
      input.style.zIndex = "";
    }
  };

  const handleSendToDestination = async () => {
    if (!selectedDestination) return;

    setSendingTo(selectedDestination.serviceName);

    try {
      const payload = {
        destinationId: selectedDestination.userId,
        destinationName: selectedDestination.serviceName,
        destinationType: currentStep,
        doctorId: doctorId,
        patientName: patientDetails.name,
        patientAge: patientDetails.age,
        diagnosis: patientDetails.diagnosis,
        ...(currentStep === "pharmacy" && {
          medicines: medicineList.map((med) => ({
            name: med.name,
            quantity: med.quantity,
            breakfast: med.breakfast,
            lunch: med.lunch,
            dinner: med.dinner,
            beforeFood: med.beforeFood,
          })),
        }),
        date: new Date().toISOString(),
      };
      const payload2 = {
        serviceId: 773,
      };
      const payload3 = {
        serviceId: 774,
      };

      const endpoint =
        currentStep === "pharmacy"
          ? "https://medbook-backend-1.onrender.com/api/prescription/send-to-pharmacy"
          : "https://medbook-backend-1.onrender.com/api/prescription/send-to-lab";

      // await axios.post(endpoint, payload);
      const results = await axios.put(
        `https://medbook-backend-1.onrender.com/api/prescription/updateserviceid/${savePrescriptionId}`,
        payload2
      );

      // Show success alert
      setShowSuccessAlert(true);

      // Auto close after 2 seconds
      setTimeout(() => {
        setShowSuccessAlert(false);
        setShowSendOptions(false);
        setSendingTo("");
        setSelectedDestination(null);
        setCurrentStep("main");
        setMessage(
          `✅ Prescription sent to ${selectedDestination.serviceName} successfully!`
        );
      }, 2000);
    } catch (error) {
      setMessage(`❌ Failed to send to ${selectedDestination.serviceName}`);
      setSendingTo("");
    }
  };

  const handleCloseSendOptions = () => {
    setShowSendOptions(false);
    setSelectedDestination(null);
    setCurrentStep("main");
    setSearchQuery("");
    setMessage("✅ Prescription completed successfully!");
  };

  const handleBackToMain = () => {
    setCurrentStep("main");
    setSelectedDestination(null);
    setSearchQuery("");
  };

  const handlePharmacySelect = () => {
    setCurrentStep("pharmacy");
    setSearchQuery("");
  };

  const handleLabSelect = () => {
    setCurrentStep("lab");
    setSearchQuery("");
  };

  // Filter destinations based on search query
  const filteredDestinations = () => {
    let destinations = currentStep === "pharmacy" ? pharmacies : labs;

    // 🩷 Filter by favorites when enabled
    if (showFavoritesOnly) {
      destinations = destinations.filter((d) => favorites[d.userId]);
    }

    // 🧠 Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      destinations = destinations.filter(
        (destination) =>
          destination.serviceName?.toLowerCase().includes(query) ||
          destination.businessName?.toLowerCase().includes(query) ||
          destination.location?.toLowerCase().includes(query) ||
          destination.district?.toLowerCase().includes(query)
      );
    }

    return destinations;
  };

  const renderMainStep = () => (
    <>
      <div className="send-options-header">
        <FaPrescription className="send-options-icon" />
        <h4>Prescription Sent Successfully!</h4>
        <p>
          Your prescription has been saved and downloaded. Where would you like
          to send it?
        </p>
      </div>

      <div className="send-options-buttons">
        <Button
          variant="outline-primary"
          size="lg"
          className="send-option-btn"
          onClick={handlePharmacySelect}
        >
          <FaPills className="option-icon" />
          <div className="option-content">
            <strong>Send to Pharmacy</strong>
            <span>For medication dispensing</span>
          </div>
        </Button>

        <Button
          variant="outline-info"
          size="lg"
          className="send-option-btn"
          onClick={handleLabSelect}
        >
          <FaFlask className="option-icon" />
          <div className="option-content">
            <strong>Send to Laboratory</strong>
            <span>For tests and analysis</span>
          </div>
        </Button>
      </div>
    </>
  );

  const renderSelectionStep = () => {
    const destinations = filteredDestinations();
    const title =
      currentStep === "pharmacy" ? "Select Pharmacy" : "Select Laboratory";
    const icon = currentStep === "pharmacy" ? FaPills : FaFlask;

    return (
      <>
        <div className="selection-header">
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={handleBackToMain}
            className="back-btn"
          >
            ← Back
          </Button>
          <h4>{title}</h4>
          <Button
            variant={showFavoritesOnly ? "danger" : "outline-danger"}
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            size="sm"
          >
            <FaHeart className="me-1" />
            {showFavoritesOnly ? "Show All" : "Show Favorites Only"}
          </Button>
        </div>

        {/* Search Bar */}
        <div className="destination-search-container">
          <div className="destination-search-input-wrapper">
            <FaSearch className="search-icon" />
            <Form.Control
              type="text"
              placeholder={`Search ${
                currentStep === "pharmacy" ? "pharmacies" : "labs"
              } by name, location, or district...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="destination-search-input"
            />
          </div>
        </div>

        <div className="destinations-grid">
          {destinations.length > 0 ? (
            destinations.map((destination) => (
              <Card
                key={destination.userId}
                className={`destination-card ${
                  selectedDestination?.userId === destination.userId
                    ? "selected"
                    : ""
                } ${favorites[destination.userId] ? "favorite" : ""}`}
                onClick={() => setSelectedDestination(destination)}
              >
                <Card.Body>
                  <div
                    className="favorite-icon"
                    onClick={(e) => {
                      e.stopPropagation(); // prevent card selection
                      handleToggleFavorite(destination.userId);
                    }}
                    style={{
                      position: "absolute",
                      top: "10px",
                      right: "15px",
                      cursor: "pointer",
                      color: favorites[destination.userId] ? "red" : "#ccc",
                      fontSize: "20px",
                    }}
                  >
                    {favorites[destination.userId] ? (
                      <FaHeart />
                    ) : (
                      <FaRegHeart />
                    )}
                  </div>
                  <div className="destination-header">
                    {React.createElement(icon, {
                      className: "destination-icon",
                    })}
                    <div className="destination-info">
                      <h6 className="destination-name">
                        {destination.serviceName}
                      </h6>
                      <p className="destination-business">
                        {destination.businessName}
                      </p>
                    </div>
                  </div>

                  <div className="destination-details">
                    <div className="detail-item">
                      <FaMapMarkerAlt className="detail-icon" />
                      <span>{destination.location}</span>
                    </div>
                    <div className="detail-item">
                      <FaPhone className="detail-icon" />
                      <span>{destination.servicePhone}</span>
                    </div>
                    <div className="detail-item">
                      <FaBuilding className="detail-icon" />
                      <span>{destination.district}</span>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            ))
          ) : (
            <div className="no-destinations">
              <p>
                No {currentStep === "pharmacy" ? "pharmacies" : "labs"} found
                matching your search
              </p>
            </div>
          )}
        </div>

        {selectedDestination && (
          <div className="selection-actions">
            <Button
              variant={currentStep === "pharmacy" ? "primary" : "info"}
              size="lg"
              className="confirm-btn"
              onClick={handleSendToDestination}
              disabled={sendingTo}
            >
              {sendingTo ? (
                <>
                  <div className="spinner-border spinner-border-sm me-2" />
                  Sending to {selectedDestination.serviceName}...
                </>
              ) : (
                `Send to ${selectedDestination.serviceName}`
              )}
            </Button>
          </div>
        )}

        {/* Success Alert */}
        {showSuccessAlert && (
          <Alert variant="success" className="success-alert">
            <div className="alert-content">
              <FaPrescription className="alert-icon" />
              <div>
                <strong>Success!</strong>
                <p>
                  Prescription sent to {selectedDestination?.serviceName}{" "}
                  successfully!
                </p>
              </div>
            </div>
          </Alert>
        )}
      </>
    );
  };

  return (
    <div className="prescription-container">
      {/* 🎯 INTERACTIVE FORM SECTION (Not in PDF) */}
      <div className="interactive-form">
        {/* Header */}
        <div className="prescription-header">
          <div className="header-left">
            <h1 className="clinic-name">MEDBOOK</h1>
            <div className="doctor-info">
              <h2>Dr. Jayasurya</h2>
              <p className="specialization">Cardiologist</p>
              <p className="qualification">
                MBBS, MD - Medicine, DM - Cardiology
              </p>
            </div>
          </div>

          <div className="header-right">
            <h1 className="hospital-name">MEDBOOK HOSPITAL</h1>
            <p className="hospital-type">Multi-Speciality Healthcare Center</p>
            <p className="accreditation">
              NABH Accredited • ISO 9001:2015 Certified
            </p>
            {/* Prescription Icon placed here */}
            <div className="prescription-icon-container">
              <FaPrescription className="prescription-icon" />
            </div>
          </div>
        </div>

        {/* Patient Details */}
        <div className="patient-section">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3 className="section-title text-danger mb-0">
              Patient Information
            </h3>
            <Form.Select
              value={currentStep}
              onChange={(e) => setCurrentStep(e.target.value)}
              style={{
                width: "220px",
                borderRadius: "8px",
                fontWeight: "500",
                border: "1px solid #dc3545",
                color: "#dc3545",
                backgroundColor: "#fff",
              }}
            >
              <option value="pharmacy">Pharmacy</option>
              <option value="lab">Lab & Diagnosis</option>
            </Form.Select>
          </div>

          <div className="patient-form">
            <div className="form-row">
              <div className="form-group">
                <label>Patient Name</label>
                <Form.Control
                  type="text"
                  placeholder="Enter patient full name"
                  value={patientDetails.name}
                  onChange={(e) =>
                    handlePatientDetailChange("name", e.target.value)
                  }
                />
              </div>

              <div className="form-group">
                <label>Age</label>
                <Form.Control
                  type="number"
                  placeholder="Age"
                  value={patientDetails.age}
                  onChange={(e) =>
                    handlePatientDetailChange("age", e.target.value)
                  }
                />
              </div>

              <div className="form-group">
                <label>Date</label>
                <Form.Control
                  type="date"
                  value={patientDetails.date}
                  onChange={(e) =>
                    handlePatientDetailChange("date", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="form-group full-width">
              <label>Description</label>
              <Form.Control
                as="textarea"
                rows={2}
                value={patientDetails.diagnosis}
                onChange={(e) =>
                  handlePatientDetailChange("diagnosis", e.target.value)
                }
              />
            </div>
          </div>
        </div>

        {/* Medicine Search */}
        <div className="medicine-search-section">
          <h3 className="section-title">Add Medications</h3>

          <Form.Control
            type="text"
            placeholder="Search medicine..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />

          {search && (
            <div className="search-suggestions">
              {availableMedicines
                .filter((m) =>
                  m.name.toLowerCase().includes(search.toLowerCase())
                )
                .map((medicine, idx) => (
                  <div
                    key={idx}
                    className="suggestion-item"
                    onClick={() => handleSelectMedicine(medicine)}
                  >
                    {medicine.name}
                    {shouldShowPrices && ` - ₹${medicine.price}`}{" "}
                    {/* Fixed: render string, not object */}
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Medicine Table */}
        {medicineList.length > 0 && (
          <Table className="prescription-table">
            <thead>
              <tr>
                <th>Medicine</th>
                <th>Breakfast</th>
                <th>Lunch</th>
                <th>Dinner</th>
                <th>Food</th>
                <th>Qty</th>
                {shouldShowPrices && <th>Price</th>}
                {shouldShowPrices && <th>Total</th>}
                <th></th>
              </tr>
            </thead>
            <tbody>
              {medicineList.map((medicine, index) => (
                <tr key={index}>
                  <td>{medicine.name}</td>

                  {["breakfast", "lunch", "dinner"].map((meal) => (
                    <td key={meal}>
                      <Form.Check
                        type="checkbox"
                        checked={medicine[meal]}
                        onChange={(e) =>
                          handleChange(index, meal, e.target.checked)
                        }
                      />
                    </td>
                  ))}
                  <td>
                    <Form.Check
                      type="radio"
                      label="Before"
                      name={`food-${index}`}
                      checked={medicine.beforeFood}
                      onChange={() => handleChange(index, "beforeFood", true)}
                    />
                    <Form.Check
                      type="radio"
                      label="After"
                      name={`food-${index}`}
                      checked={!medicine.beforeFood}
                      onChange={() => handleChange(index, "beforeFood", false)}
                    />
                  </td>

                  <td>
                    <Button size="sm" onClick={() => handleQuantity(index, -1)}>
                      <FaMinus />
                    </Button>
                    <span className="px-2">{medicine.quantity}</span>
                    <Button size="sm" onClick={() => handleQuantity(index, 1)}>
                      <FaPlus />
                    </Button>
                  </td>

                  {/* ➕ PRICE COLUMN - Simple display none for doctorId 1 */}
                  {shouldShowPrices && <td>₹{medicine.price}</td>}

                  {/* ➕ TOTAL PRICE - Simple display none for doctorId 1 */}
                  {shouldShowPrices && (
                    <td>₹{(medicine.price * medicine.quantity).toFixed(2)}</td>
                  )}

                  <td>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => removeMedicine(index)}
                    >
                      Remove
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
        {shouldShowPrices &&
          medicineList.length > 0 &&
          (() => {
            const baseAmount = medicineList.reduce(
              (total, medicine) => total + medicine.price * medicine.quantity,
              0
            );
            const gstAmount = baseAmount * 0.18;
            const totalWithGst = baseAmount + gstAmount;

            return (
              <div
                className="text-end mt-3 p-3 bg-light rounded"
                style={{ maxWidth: "300px", marginLeft: "auto" }}
              >
                <div className="d-flex justify-content-between mb-1">
                  <span>Subtotal:</span>
                  <span>₹{baseAmount.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>GST (18%):</span>
                  <span>₹{gstAmount.toFixed(2)}</span>
                </div>
                <hr className="my-2" />
                <div className="d-flex justify-content-between mb-0">
                  <strong>Grand Total:</strong>
                  <strong className="text-success fs-5">
                    ₹{totalWithGst.toFixed(2)}
                  </strong>
                </div>
              </div>
            );
          })()}

        {/* Next Visit Date */}
        <div className="treatment-section">
          <div className="form-group">
            <label>
              <strong>Next Visit Date:</strong>
            </label>
            <Form.Control
              type="date"
              value={nextVisitDate}
              onChange={(e) => setNextVisitDate(e.target.value)}
              className="form-control"
            />
          </div>
        </div>

        {/* Status Message */}
        {message && (
          <div
            className={`status-msg ${
              message.includes("✅")
                ? "success"
                : message.includes("⚠️")
                ? "warning"
                : message.includes("❌")
                ? "error"
                : ""
            }`}
          >
            {message}
          </div>
        )}

        {/* Submit Button */}
        <Button
          className="submit-btn"
          onClick={submitPrescription}
          disabled={loading}
        >
          {loading ? "Saving..." : "Submit Prescription & Download PDF"}
        </Button>
      </div>
      {/* 🎯 PRINTABLE SECTION (For PDF only - High Resolution Optimized) */}
      <div
        ref={prescriptionRef}
        className="printable-section"
        style={{ display: "none" }}
      >
        {/* Compact Header */}
        <div className="print-header">
          <div className="print-header-left">
            <h2 className="print-clinic-name">MEDBOOK</h2>
            <div className="print-doctor-info">
              <h3>Dr. Jayasurya</h3>
              <p className="print-specialization">Cardiologist</p>
              <p className="print-qualification">
                MBBS, MD - Medicine, DM - Cardiology
              </p>
            </div>
          </div>

          <div className="print-header-right">
            <h2 className="print-hospital-name">MEDBOOK HOSPITAL</h2>
            <p className="print-hospital-type">
              Multi-Speciality Healthcare Center
            </p>
            <p className="print-accreditation">
              NABH Accredited • ISO 9001:2015 Certified
            </p>
            {/* Prescription Icon in PDF */}
            <div className="print-prescription-icon-container">
              <FaPrescription className="print-prescription-icon" />
            </div>
          </div>
        </div>

        {/* Patient Details */}
        <div className="print-patient-details">
          <h3 className="print-section-title">PATIENT INFORMATION</h3>
          <div className="print-details-grid">
            <div>
              <strong>Patient Name:</strong> {patientDetails.name}
            </div>
            <div>
              <strong>Age:</strong> {patientDetails.age}
            </div>
            <div>
              <strong>Date:</strong> {patientDetails.date}
            </div>
            {/* <div>
              <strong>Address:</strong> {patientDetails.address}
            </div> */}
            <div className="full-width">
              <strong>Diagnosis:</strong> {patientDetails.diagnosis}
            </div>
          </div>
        </div>

        {/* Medicine List */}
        {medicineList.length > 0 && (
          <div className="print-medicine-section">
            <h3 className="print-section-title">MEDICATIONS</h3>
            <table className="print-medicine-table">
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Medicine Name</th>
                  <th>Breakfast</th>
                  <th>Lunch</th>
                  <th>Dinner</th>
                  <th>Food Timing</th>
                  <th>Quantity</th>
                  {shouldShowPrices && <th>Price</th>}
                </tr>
              </thead>
              <tbody>
                {medicineList.map((medicine, index) => (
                  <tr key={index}>
                    <td className="text-center">{index + 1}</td>
                    <td className="medicine-name">{medicine.name}</td>
                    <td className="text-center">
                      {medicine.breakfast ? "✓" : "-"}
                    </td>
                    <td className="text-center">
                      {medicine.lunch ? "✓" : "-"}
                    </td>
                    <td className="text-center">
                      {medicine.dinner ? "✓" : "-"}
                    </td>
                    <td className="text-center">
                      {medicine.beforeFood ? "Before Food" : "After Food"}
                    </td>
                    <td className="text-center">{medicine.quantity}</td>
                    {shouldShowPrices && (
                      <td className="text-center">₹{medicine.price}</td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>

            {/* GST Calculation for PDF */}
            {shouldShowPrices &&
              medicineList.length > 0 &&
              (() => {
                const baseAmount = medicineList.reduce(
                  (total, medicine) =>
                    total + medicine.price * medicine.quantity,
                  0
                );
                const gstAmount = baseAmount * 0.18;
                const totalWithGst = baseAmount + gstAmount;

                return (
                  <div className="print-price-summary">
                    <div className="print-price-row">
                      <span>Subtotal:</span>
                      <span>₹{baseAmount.toFixed(2)}</span>
                    </div>
                    <div className="print-price-row">
                      <span>GST (18%):</span>
                      <span>₹{gstAmount.toFixed(2)}</span>
                    </div>
                    <div className="print-price-row total">
                      <strong>Grand Total:</strong>
                      <strong>₹{totalWithGst.toFixed(2)}</strong>
                    </div>
                  </div>
                );
              })()}
          </div>
        )}

        <div className="print-next-visit">
          <strong>Next Visit Date:</strong> {nextVisitDate || "N/A"}
        </div>
      </div>{" "}
      {/* This closes the printable-section div */}
      {/* Send Options Modal */}
      <Modal
        show={showSendOptions}
        onHide={handleCloseSendOptions}
        centered
        className="send-options-modal"
        size="lg"
      >
        <Modal.Header closeButton className="send-options-modal-header">
          <Modal.Title>
            <FaPrescription className="me-2" />
            Send Prescription
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="send-options-modal-body">
          {currentStep === "main" ? renderMainStep() : renderSelectionStep()}
        </Modal.Body>
        <Modal.Footer className="send-options-modal-footer">
          <Button variant="outline-secondary" onClick={handleCloseSendOptions}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <style>
        {`.print-price-summary {
  margin-top: 20px;
  padding: 15px;
  border-top: 2px solid #333;
  text-align: right;
  font-family: Arial, sans-serif;
}

.print-price-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
  padding: 2px 0;
}

.print-price-row.total {
  border-top: 1px solid #333;
  padding-top: 8px;
  margin-top: 8px;
  font-size: 16px;
}`}
      </style>
    </div>
  );
};

export default Prescription;
