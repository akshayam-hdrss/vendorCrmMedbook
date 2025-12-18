import React, { useEffect, useState } from "react";
import {
    Modal,
    Button,
    Form,
    Card,
    Row,
    Col,
    Spinner,
    Badge,
    Container,
    InputGroup,
} from "react-bootstrap";
import {
    FaPhone,
    FaCalendarAlt,
    FaClock,
    FaUserMd,
    FaNotesMedical,
    FaChevronDown,
    FaChevronUp,
    FaFilter,
    FaSearch,
} from "react-icons/fa";
import { format, isToday, isTomorrow, isYesterday, parseISO } from "date-fns";
import { useNavigate } from "react-router-dom";

const BASE_URL = "https://medbook-backend-1.onrender.com/api/service-bookings";

function ServiceSchedulePage() {
    const [schedules, setSchedules] = useState([]);
    const [filteredSchedules, setFilteredSchedules] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchType, setSearchType] = useState("name");
    const [loading, setLoading] = useState(true);
    const [isDoctor, setIsDoctor] = useState(false);
    const [userId, setUserId] = useState(null);
    const [selectedSchedule, setSelectedSchedule] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showReschedule, setShowReschedule] = useState(false);
    const [showBasicTestsModal, setShowBasicTestsModal] = useState(false);
    
    const [rescheduleData, setRescheduleData] = useState({
        date: "",
        time: "",
        remarks: "",
    });
    const [basicTestsData, setBasicTestsData] = useState({
        bloodPressure: "",
        height: "",
        weight: "",
        sugar: "",
    });
    const [activeFilter, setActiveFilter] = useState("all");

    const navigate = useNavigate();

    useEffect(() => {
        loadSchedules();
        const interval = setInterval(() => loadSchedules(), 5000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        filterSchedules();
    }, [schedules, searchTerm, searchType, activeFilter]);

    const loadSchedules = async () => {
        try {
            const storedUser = JSON.parse(localStorage.getItem("userDetails"));
            const uid = storedUser?.id || 31;
            const isDoc = true;

            setUserId(uid);
            setIsDoctor(isDoc);

            const url = isDoc
                ? `${BASE_URL}/doctor/${uid}`
                : `${BASE_URL}/user/${uid}`;
            const res = await fetch(url);
            const data = await res.json();

            const schedulesArray = Array.isArray(data) ? data : data.data || [];
            setSchedules(schedulesArray);
            setLoading(false);
        } catch (error) {
            console.error("Error loading schedules:", error);
            setLoading(false);
        }
    };

    const filterSchedules = () => {
        let filtered = [...schedules];

        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter((schedule) => {
                const searchValue = searchTerm.toLowerCase();
                switch (searchType) {
                    case "name":
                        return isDoctor
                            ? (schedule.patientName || "").toLowerCase().includes(searchValue)
                            : (schedule.doctorName || "").toLowerCase().includes(searchValue);
                    case "date":
                        return schedule.date.toLowerCase().includes(searchValue);
                    default:
                        return true;
                }
            });
        }

        // Apply status/date filter
        if (activeFilter !== "all") {
            filtered = filtered.filter((schedule) => {
                const scheduleDate = new Date(schedule.date);
                switch (activeFilter) {
                    case "pending":
                        return schedule.status?.toLowerCase() === "pending";
                    case "today":
                        return isToday(scheduleDate);
                    case "future":
                        return scheduleDate > new Date();
                    default:
                        return true;
                }
            });
        }

        setFilteredSchedules(filtered);
    };

    // Statistics calculations
    const getAppointmentStats = () => {
        const today = new Date();

        const totalAppointments = schedules.length;
        const pendingAppointments = schedules.filter(
            (s) => s.status?.toLowerCase() === "pending"
        ).length;
        const todayAppointments = schedules.filter((s) =>
            isToday(new Date(s.date))
        ).length;
        const futureAppointments = schedules.filter(
            (s) => new Date(s.date) > today
        ).length;

        return {
            total: totalAppointments,
            pending: pendingAppointments,
            today: todayAppointments,
            future: futureAppointments,
        };
    };

    const getTodayAppointmentsByStatus = () => {
        const todayApps = schedules.filter((s) => isToday(new Date(s.date)));

        return {
            pending: todayApps.filter((s) => s.status?.toLowerCase() === "pending"),
            confirmed: todayApps.filter(
                (s) => s.status?.toLowerCase() === "confirmed"
            ),
            rescheduled: todayApps.filter(
                (s) => s.status?.toLowerCase() === "rescheduled"
            ),
        };
    };

    const formatDate = (dateString) => {
        try {
            const date = new Date(dateString);
            if (isToday(date)) return "Today";
            if (isTomorrow(date)) return "Tomorrow";
            if (isYesterday(date)) return "Yesterday";
            return format(date, "EEE, MMM dd, yyyy");
        } catch {
            return dateString;
        }
    };

    const formatTime = (timeString) => {
        try {
            const [hour, minute] = timeString.split(":");
            const date = new Date();
            date.setHours(hour);
            date.setMinutes(minute);
            return format(date, "hh:mm a");
        } catch {
            return timeString;
        }
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case "pending":
                return "warning";
            case "confirmed":
                return "success";
            case "rescheduled":
                return "info";
            default:
                return "secondary";
        }
    };

    const updateBooking = async (schedule, status, remarks, date, time) => {
        const formattedDate = date
            ? new Date(date).toISOString().split("T")[0]
            : schedule.date.split("T")[0];

        const formattedTime = time
            ? `${time}:00`
            : schedule.time.length === 5
                ? `${schedule.time}:00`
                : schedule.time;

        try {
            const response = await fetch(`${BASE_URL}/${schedule.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    status,
                    remarks: remarks || "",
                    date: formattedDate,
                    time: formattedTime,
                    userId: schedule.userId,
                    doctorId: schedule.doctorId,
                    editedBy: isDoctor ? "doctor" : "user",
                }),
            });

            if (response.ok) {
                loadSchedules();
                setShowModal(false);
                setShowReschedule(false);
            } else {
                const error = await response.json();
                alert("Failed: " + JSON.stringify(error));
            }
        } catch (e) {
            alert("Error updating booking: " + e);
        }
    };

    const handleRescheduleSave = () => {
        updateBooking(
            selectedSchedule,
            "rescheduled",
            rescheduleData.remarks,
            rescheduleData.date,
            rescheduleData.time
        );
    };

    const handleBasicTestsSubmit = async () => {
        if (!selectedSchedule) return;

        try {
            // Format date correctly for MySQL (YYYY-MM-DD)
            const scheduleDate = new Date(selectedSchedule.date);
            const formattedDate = scheduleDate.toISOString().split('T')[0];

            // Format time correctly (ensure HH:MM:SS format)
            let formattedTime = selectedSchedule.time;
            if (formattedTime.length === 5) {
                formattedTime = `${formattedTime}:00`;
            }

            const response = await fetch(`${BASE_URL}/${selectedSchedule.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    status: selectedSchedule.status,
                    remarks: selectedSchedule.remarks || "",
                    date: formattedDate,
                    time: formattedTime,
                    userId: selectedSchedule.userId,
                    doctorId: selectedSchedule.doctorId,
                    bloodPressure: basicTestsData.bloodPressure || selectedSchedule.bloodPressure || "",
                    height: basicTestsData.height || selectedSchedule.height || "",
                    weight: basicTestsData.weight || selectedSchedule.weight || "",
                    sugar: basicTestsData.sugar || selectedSchedule.sugar || "",
                    editedBy: isDoctor ? "doctor" : "user",
                }),
            });

            if (response.ok) {
                loadSchedules();
                setShowBasicTestsModal(false);
                setBasicTestsData({ bloodPressure: "", height: "", weight: "", sugar: "" });

                // Update selected schedule locally
                setSelectedSchedule(prev => ({
                    ...prev,
                    bloodPressure: basicTestsData.bloodPressure || prev.bloodPressure,
                    height: basicTestsData.height || prev.height,
                    weight: basicTestsData.weight || prev.weight,
                    sugar: basicTestsData.sugar || prev.sugar,
                }));
            } else {
                const error = await response.json();
                alert("Failed to save basic tests: " + JSON.stringify(error));
            }
        } catch (e) {
            alert("Error saving basic tests: " + e);
        }
    };

    const stats = getAppointmentStats();
    const todayStats = getTodayAppointmentsByStatus();

    const renderAppointmentCard = (schedule) => (
        <Col key={schedule.id} xs={12} sm={6} lg={4}>
            <Card
                className="shadow-sm border-0 h-100 schedule-card"
                onClick={() => {
                    setSelectedSchedule(schedule);
                    setShowModal(true);
                }}
            >
                <Card.Body className="card-content-mobile d-flex flex-column">
                    <div className="d-flex align-items-center mb-3">
                        <FaUserMd className="text-primary me-2" />
                        <span className="fw-semibold text-truncate">
                            {isDoctor
                                ? schedule.patientName || "Unknown Patient"
                                : schedule.doctorName || "Unknown Doctor"}
                        </span>
                    </div>

                    <div className="text-muted mb-3 flex-grow-1">
                        <div className="mb-2">
                            <FaCalendarAlt className="me-2 text-info" />
                            {formatDate(schedule.date)}
                        </div>
                        <div className="mb-2">
                            <FaClock className="me-2 text-info" />
                            {formatTime(schedule.time)}
                        </div>
                        <div className="small">
                            <FaNotesMedical className="me-2 text-success" />
                            {schedule.description || "No details"}
                        </div>
                    </div>

                    <div className="d-flex justify-content-between align-items-center mt-auto">
                        <Badge
                            bg={getStatusColor(schedule.status)}
                            className="text-uppercase"
                        >
                            {schedule.status}
                        </Badge>
                        {schedule.contactNumber && (
                            <a
                                href={`tel:${schedule.contactNumber}`}
                                className="text-success fs-5"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <FaPhone />
                            </a>
                        )}
                    </div>
                </Card.Body>
            </Card>
        </Col>
    );

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <Spinner animation="border" variant="primary" />
                <span className="ms-2">Loading schedules...</span>
            </div>
        );
    }

    return (
        <Container fluid className="doctor-schedule-container py-3">
            <style>{`
        .doctor-schedule-container {
          max-width: 100%;
          padding: 0 12px;
        }
        .schedule-card {
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-bottom: 16px;
          border: 1px solid #e9ecef;
        }
        .schedule-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
          border-color: #0d6efd;
        }
        .card-content-mobile {
          padding: 16px;
        }
        .stats-card {
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .stats-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }
        .today-status-btn {
          border-radius: 25px;
          padding: 12px 20px;
          font-weight: 600;
          transition: all 0.3s ease;
        }
        .today-status-btn:hover {
          transform: scale(1.05);
        }
        .cursor-pointer {
          cursor: pointer;
        }
        .basic-tests-box {
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          border-left: 4px solid #0d6efd;
        }
        .basic-test-item {
          transition: all 0.2s ease;
        }
        .basic-test-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        @media (max-width: 576px) {
          .today-status-btn {
            padding: 10px 15px;
            font-size: 0.875rem;
          }
          .stats-card h4 {
            font-size: 1.1rem;
          }
        }
      `}</style>

            {/* Search Bar Section */}
            <div className="search-section mb-4">
                <Row className="g-3">
                    <Col xs={12} md={6}>
                        <InputGroup>
                            <InputGroup.Text>
                                <FaSearch />
                            </InputGroup.Text>
                            <Form.Control
                                type="text"
                                placeholder={`Search by ${searchType}...`}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </InputGroup>
                    </Col>
                    <Col xs={12} md={3}>
                        <Form.Select
                            value={searchType}
                            onChange={(e) => setSearchType(e.target.value)}
                        >
                            <option value="name">Name</option>
                            <option value="date">Date</option>
                        </Form.Select>
                    </Col>
                    <Col xs={12} md={3}>
                        <Button
                            variant="outline-secondary"
                            className="w-100"
                            onClick={() => {
                                setSearchTerm("");
                                setActiveFilter("all");
                            }}
                        >
                            Clear Filters
                        </Button>
                    </Col>
                </Row>
            </div>

            {/* Appointment Statistics */}
            <div className="stats-section mb-4">
                <h5 className="text-primary mb-3">Appointment Overview</h5>
                <Row className="g-3">
                    <Col xs={6} md={3}>
                        <Card
                            className={`stats-card text-center ${activeFilter === "all" ? "border-primary" : ""
                                }`}
                            onClick={() => setActiveFilter("all")}
                        >
                            <Card.Body>
                                <h4 className="text-primary">{stats.total}</h4>
                                <p className="mb-0 text-muted">Total Appointments</p>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col xs={6} md={3}>
                        <Card
                            className={`stats-card text-center ${activeFilter === "pending" ? "border-warning" : ""
                                }`}
                            onClick={() => setActiveFilter("pending")}
                        >
                            <Card.Body>
                                <h4 className="text-warning">{stats.pending}</h4>
                                <p className="mb-0 text-muted">Pending</p>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col xs={6} md={3}>
                        <Card
                            className={`stats-card text-center ${activeFilter === "today" ? "border-info" : ""
                                }`}
                            onClick={() => setActiveFilter("today")}
                        >
                            <Card.Body>
                                <h4 className="text-info">{stats.today}</h4>
                                <p className="mb-0 text-muted">Today</p>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col xs={6} md={3}>
                        <Card
                            className={`stats-card text-center ${activeFilter === "future" ? "border-success" : ""
                                }`}
                            onClick={() => setActiveFilter("future")}
                        >
                            <Card.Body>
                                <h4 className="text-success">{stats.future}</h4>
                                <p className="mb-0 text-muted">Future</p>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </div>

            {/* Today's Appointments Section */}
            <div className="today-appointments-section mb-4">
                <h5 className="text-primary mb-3">
                    <FaCalendarAlt className="me-2" />
                    Today's Appointments
                </h5>

                <div className="d-flex flex-wrap gap-3 mb-4">
                    <Button
                        variant="warning"
                        className="today-status-btn"
                        onClick={() => setActiveFilter("pending")}
                    >
                        ⏳ Pending ({todayStats.pending.length})
                    </Button>
                    <Button
                        variant="success"
                        className="today-status-btn"
                        onClick={() => setActiveFilter("confirmed")}
                    >
                        ✅ Confirmed ({todayStats.confirmed.length})
                    </Button>
                    <Button
                        variant="info"
                        className="today-status-btn"
                        onClick={() => setActiveFilter("rescheduled")}
                    >
                        📅 Rescheduled ({todayStats.rescheduled.length})
                    </Button>
                </div>

                {/* Today's appointments list */}
                <Row className="g-3">
                    {filteredSchedules
                        .filter((schedule) => isToday(new Date(schedule.date)))
                        .map(renderAppointmentCard)}
                </Row>

                {filteredSchedules.filter((schedule) =>
                    isToday(new Date(schedule.date))
                ).length === 0 && (
                        <div className="text-center text-muted py-4">
                            <FaCalendarAlt size={48} className="mb-3" />
                            <h6>No appointments for today</h6>
                            <p className="mb-0">No appointments match your current filter.</p>
                        </div>
                    )}
            </div>

            {/* All Appointments Section */}
            <div className="all-appointments-section">
                <h5 className="text-primary mb-3">
                    <FaFilter className="me-2" />
                    All Appointments ({filteredSchedules.length})
                </h5>

                <Row className="g-3">
                    {filteredSchedules.map(renderAppointmentCard)}
                </Row>

                {filteredSchedules.length === 0 && (
                    <div className="text-center text-muted py-5">
                        <div className="mb-3">
                            <FaCalendarAlt size={48} />
                        </div>
                        <h5>No appointments found</h5>
                        <p className="mb-0">
                            No appointments match your current search criteria.
                        </p>
                        <Button
                            variant="outline-primary"
                            className="mt-3"
                            onClick={() => {
                                setSearchTerm("");
                                setActiveFilter("all");
                            }}
                        >
                            Clear Filters
                        </Button>
                    </div>
                )}
            </div>

            {/* Appointment Details Modal */}
            <Modal
                show={showModal}
                onHide={() => setShowModal(false)}
                centered
                size="lg"
            >
                {selectedSchedule && (
                    <>
                        <Modal.Header closeButton className="bg-primary text-white">
                            <Modal.Title className="w-100">
                                <div className="d-flex align-items-center">
                                    <FaUserMd className="me-2" />
                                    <span>Appointment Details</span>
                                </div>
                            </Modal.Title>
                        </Modal.Header>

                        <Modal.Body className="p-4">
                            <Row className="g-4">
                                {/* Doctor or Patient */}
                                <Col xs={12} md={6}>
                                    <div className="mb-3">
                                        <strong className="d-block text-muted small">
                                            {isDoctor ? "Patient" : "Doctor"}
                                        </strong>
                                        <span className="d-block fs-5 fw-semibold">
                                            {isDoctor
                                                ? selectedSchedule.patientName || "Unknown"
                                                : selectedSchedule.doctorName || "Unknown"}
                                        </span>
                                    </div>
                                </Col>

                                {/* Contact */}
                                <Col xs={12} md={6}>
                                    <div className="mb-3">
                                        <strong className="d-block text-muted small">
                                            Contact
                                        </strong>
                                        {selectedSchedule.contactNumber ? (
                                            <a
                                                href={`tel:${selectedSchedule.contactNumber}`}
                                                className="text-primary text-decoration-none fs-5"
                                            >
                                                <FaPhone className="me-1" />
                                                {selectedSchedule.contactNumber}
                                            </a>
                                        ) : (
                                            <span className="text-muted">N/A</span>
                                        )}
                                    </div>
                                </Col>

                                {/* Date */}
                                <Col xs={12} md={6}>
                                    <div className="mb-3">
                                        <strong className="d-block text-muted small">Date</strong>
                                        <span className="fs-5">
                                            {formatDate(selectedSchedule.date)}
                                        </span>
                                    </div>
                                </Col>

                                {/* Time with Basic Tests Button */}
                                <Col xs={12} md={6}>
                                    <div className="mb-3">
                                        <strong className="d-block text-muted small">Time</strong>
                                        <span className="fs-5 d-block mb-2">
                                            {formatTime(selectedSchedule.time)}
                                        </span>

                                        {/* Basic Tests Button */}
                                        <Button
                                            variant="outline-primary"
                                            size="sm"
                                            className="me-2 mb-2"
                                            onClick={() => {
                                                // Pre-fill existing data if available
                                                setBasicTestsData({
                                                    bloodPressure: selectedSchedule.bloodPressure || "",
                                                    height: selectedSchedule.height || "",
                                                    weight: selectedSchedule.weight || "",
                                                    sugar: selectedSchedule.sugar || "",
                                                });
                                                setShowBasicTestsModal(true);
                                            }}
                                        >
                                            <FaNotesMedical className="me-1" />
                                            Basic Tests
                                        </Button>

                                        {/* View Prescription Button */}
                                        {selectedSchedule?.prescriptionID && (
                                            <Button
                                                variant="outline-warning"
                                                size="sm"
                                                onClick={() => {
                                                    setShowModal(false);
                                                    navigate("/prescription-details1", {
                                                        state: { appointment: selectedSchedule },
                                                    });
                                                }}
                                            >
                                                View Prescription
                                            </Button>
                                        )}
                                    </div>
                                </Col>

                                {/* Status */}
                                <Col xs={12}>
                                    <div className="mb-3">
                                        <strong className="d-block text-muted small">Status</strong>
                                        <Badge
                                            bg={getStatusColor(selectedSchedule.status)}
                                            className="text-uppercase fs-6 p-2"
                                        >
                                            {selectedSchedule.status}
                                        </Badge>
                                    </div>
                                </Col>

                                {/* Basic Tests Results Display */}
                                {(selectedSchedule?.bloodPressure ||
                                    selectedSchedule?.height ||
                                    selectedSchedule?.weight ||
                                    selectedSchedule?.sugar) && (
                                        <Col xs={12}>
                                            <div className="basic-tests-box p-3 mb-3 rounded">
                                                <div className="d-flex justify-content-between align-items-center mb-3">
                                                    <strong className="text-primary">
                                                        <FaNotesMedical className="me-2" />
                                                        Basic Tests Results
                                                    </strong>
                                                    <Badge bg="success" className="small">
                                                        Recorded
                                                    </Badge>
                                                </div>
                                                <Row className="g-2">
                                                    {selectedSchedule?.bloodPressure && (
                                                        <Col xs={6} md={3}>
                                                            <div className="basic-test-item text-center p-2 border rounded bg-white">
                                                                <small className="d-block text-muted mb-1">
                                                                    Blood Pressure
                                                                </small>
                                                                <div className="fw-bold text-primary fs-5">
                                                                    {selectedSchedule.bloodPressure}
                                                                </div>
                                                                <small className="text-muted">mmHg</small>
                                                            </div>
                                                        </Col>
                                                    )}
                                                    {selectedSchedule?.sugar && (
                                                        <Col xs={6} md={3}>
                                                            <div className="basic-test-item text-center p-2 border rounded bg-white">
                                                                <small className="d-block text-muted mb-1">
                                                                    Sugar Level
                                                                </small>
                                                                <div className="fw-bold text-primary fs-5">
                                                                    {selectedSchedule.sugar}
                                                                </div>
                                                                <small className="text-muted">mg/dL</small>
                                                            </div>
                                                        </Col>
                                                    )}
                                                    {selectedSchedule?.height && (
                                                        <Col xs={6} md={3}>
                                                            <div className="basic-test-item text-center p-2 border rounded bg-white">
                                                                <small className="d-block text-muted mb-1">
                                                                    Height
                                                                </small>
                                                                <div className="fw-bold text-primary fs-5">
                                                                    {selectedSchedule.height}
                                                                </div>
                                                                <small className="text-muted">cm</small>
                                                            </div>
                                                        </Col>
                                                    )}
                                                    {selectedSchedule?.weight && (
                                                        <Col xs={6} md={3}>
                                                            <div className="basic-test-item text-center p-2 border rounded bg-white">
                                                                <small className="d-block text-muted mb-1">
                                                                    Weight
                                                                </small>
                                                                <div className="fw-bold text-primary fs-5">
                                                                    {selectedSchedule.weight}
                                                                </div>
                                                                <small className="text-muted">kg</small>
                                                            </div>
                                                        </Col>
                                                    )}
                                                </Row>
                                            </div>
                                        </Col>
                                    )}

                                {/* Remarks */}
                                <Col xs={12}>
                                    <div className="mb-2">
                                        <strong className="d-block text-muted small">
                                            Remarks
                                        </strong>
                                        <div className="p-3 bg-light rounded">
                                            {selectedSchedule.remarks || "No remarks provided"}
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </Modal.Body>

                        {/* Footer */}
                        <Modal.Footer className="flex-column flex-sm-row gap-2">
                            {/* Reschedule */}
                            {selectedSchedule.status?.toLowerCase() !== "confirmed" && (
                                <Button
                                    variant="outline-primary"
                                    className="flex-fill"
                                    onClick={() => {
                                        setShowModal(false);
                                        setShowReschedule(true);
                                    }}
                                >
                                    Reschedule
                                </Button>
                            )}

                            {/* Confirm */}
                            <Button
                                variant="success"
                                className="flex-fill"
                                disabled={selectedSchedule?.status === "Confirmed"}
                                style={{
                                    opacity: selectedSchedule?.status === "Confirmed" ? 0.6 : 1,
                                    cursor:
                                        selectedSchedule?.status === "Confirmed"
                                            ? "not-allowed"
                                            : "pointer",
                                }}
                                onClick={() => {
                                    if (selectedSchedule?.status === "Confirmed") return;
                                    updateBooking(selectedSchedule, "Confirmed");
                                    setSelectedSchedule({
                                        ...selectedSchedule,
                                        status: "Confirmed",
                                    });
                                }}
                            >
                                {selectedSchedule?.status === "Confirmed"
                                    ? "Confirmed ✅"
                                    : "Confirm"}
                            </Button>

                            {/* Prescription */}
                            <Button
                                variant="outline-info"
                                className="flex-fill"
                                onClick={() => {
                                    setShowModal(false);
                                    navigate("/prescription", {
                                        state: { appointment: selectedSchedule },
                                    });
                                }}
                            >
                                Prescription
                            </Button>

                            {/* Close */}
                            <Button
                                variant="outline-secondary"
                                className="flex-fill"
                                onClick={() => setShowModal(false)}
                            >
                                Close
                            </Button>
                        </Modal.Footer>
                    </>
                )}
            </Modal>

            {/* Reschedule Modal */}
            <Modal
                show={showReschedule}
                onHide={() => setShowReschedule(false)}
                centered
            >
                <Modal.Header closeButton className="bg-info text-white">
                    <Modal.Title>Reschedule Appointment</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Row>
                            <Col xs={12} md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Select Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={rescheduleData.date}
                                        onChange={(e) =>
                                            setRescheduleData({
                                                ...rescheduleData,
                                                date: e.target.value,
                                            })
                                        }
                                    />
                                </Form.Group>
                            </Col>

                            <Col xs={12} md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Select Time</Form.Label>
                                    <Form.Control
                                        type="time"
                                        value={rescheduleData.time}
                                        onChange={(e) =>
                                            setRescheduleData({
                                                ...rescheduleData,
                                                time: e.target.value,
                                            })
                                        }
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group>
                            <Form.Label>Remarks</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={rescheduleData.remarks}
                                onChange={(e) =>
                                    setRescheduleData({
                                        ...rescheduleData,
                                        remarks: e.target.value,
                                    })
                                }
                                placeholder="Add any additional notes..."
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>

                <Modal.Footer className="flex-column flex-sm-row gap-2">
                    <Button
                        variant="outline-secondary"
                        className="flex-fill"
                        onClick={() => setShowReschedule(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="success"
                        className="flex-fill"
                        onClick={handleRescheduleSave}
                    >
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Basic Tests Modal */}
            <Modal
                show={showBasicTestsModal}
                onHide={() => {
                    setShowBasicTestsModal(false);
                    setBasicTestsData({
                        bloodPressure: "",
                        height: "",
                        weight: "",
                        sugar: "",
                    });
                }}
                centered
                size="md"
            >
                <Modal.Header closeButton className="bg-info text-white">
                    <Modal.Title>Basic Tests</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Row>
                            <Col xs={12} md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Blood Pressure</Form.Label>
                                    <InputGroup>
                                        <Form.Control
                                            type="text"
                                            placeholder="e.g., 120/80"
                                            value={basicTestsData.bloodPressure}
                                            onChange={(e) =>
                                                setBasicTestsData({
                                                    ...basicTestsData,
                                                    bloodPressure: e.target.value,
                                                })
                                            }
                                        />
                                        <InputGroup.Text>mmHg</InputGroup.Text>
                                    </InputGroup>
                                    <Form.Text className="text-muted">
                                        Format: systolic/diastolic
                                    </Form.Text>
                                </Form.Group>
                            </Col>

                            <Col xs={12} md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Sugar Level</Form.Label>
                                    <InputGroup>
                                        <Form.Control
                                            type="text"
                                            placeholder="e.g., 110"
                                            value={basicTestsData.sugar}
                                            onChange={(e) =>
                                                setBasicTestsData({
                                                    ...basicTestsData,
                                                    sugar: e.target.value,
                                                })
                                            }
                                        />
                                        <InputGroup.Text>mg/dL</InputGroup.Text>
                                    </InputGroup>
                                    <Form.Text className="text-muted">
                                        Fasting blood sugar
                                    </Form.Text>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col xs={12} md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Height</Form.Label>
                                    <InputGroup>
                                        <Form.Control
                                            type="text"
                                            placeholder="e.g., 170"
                                            value={basicTestsData.height}
                                            onChange={(e) =>
                                                setBasicTestsData({
                                                    ...basicTestsData,
                                                    height: e.target.value,
                                                })
                                            }
                                        />
                                        <InputGroup.Text>cm</InputGroup.Text>
                                    </InputGroup>
                                </Form.Group>
                            </Col>

                            <Col xs={12} md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Weight</Form.Label>
                                    <InputGroup>
                                        <Form.Control
                                            type="text"
                                            placeholder="e.g., 70"
                                            value={basicTestsData.weight}
                                            onChange={(e) =>
                                                setBasicTestsData({
                                                    ...basicTestsData,
                                                    weight: e.target.value,
                                                })
                                            }
                                        />
                                        <InputGroup.Text>kg</InputGroup.Text>
                                    </InputGroup>
                                </Form.Group>
                            </Col>
                        </Row>

                        {/* Show existing values if available */}
                        {(selectedSchedule?.bloodPressure ||
                            selectedSchedule?.height ||
                            selectedSchedule?.weight ||
                            selectedSchedule?.sugar) && (
                                <div className="mt-3 p-3 bg-light rounded">
                                    <h6>Current Values:</h6>
                                    <Row>
                                        {selectedSchedule?.bloodPressure && (
                                            <Col xs={6}>
                                                <small className="text-muted">BP:</small>
                                                <div className="fw-semibold">
                                                    {selectedSchedule.bloodPressure} mmHg
                                                </div>
                                            </Col>
                                        )}
                                        {selectedSchedule?.sugar && (
                                            <Col xs={6}>
                                                <small className="text-muted">Sugar:</small>
                                                <div className="fw-semibold">
                                                    {selectedSchedule.sugar} mg/dL
                                                </div>
                                            </Col>
                                        )}
                                        {selectedSchedule?.height && (
                                            <Col xs={6}>
                                                <small className="text-muted">Height:</small>
                                                <div className="fw-semibold">
                                                    {selectedSchedule.height} cm
                                                </div>
                                            </Col>
                                        )}
                                        {selectedSchedule?.weight && (
                                            <Col xs={6}>
                                                <small className="text-muted">Weight:</small>
                                                <div className="fw-semibold">
                                                    {selectedSchedule.weight} kg
                                                </div>
                                            </Col>
                                        )}
                                    </Row>
                                </div>
                            )}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="outline-secondary"
                        onClick={() => {
                            setShowBasicTestsModal(false);
                            setBasicTestsData({
                                bloodPressure: "",
                                height: "",
                                weight: "",
                                sugar: "",
                            });
                        }}
                    >
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleBasicTestsSubmit}>
                        Save Tests
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default ServiceSchedulePage;
