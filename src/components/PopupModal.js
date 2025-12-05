import React from "react";
import ReactDOM from "react-dom";
import "./PopupModal.css";

const PopupModal = ({ open, onClose }) => {
  if (!open) return null;

  return ReactDOM.createPortal(
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-box" onClick={(e) => e.stopPropagation()}>
        <h2>Upcoming Events 🎉</h2>
        <p>Exciting features & events are coming soon! Stay tuned — we'll update this area with dates and registration soon.</p>

        <div className="modal-actions">
          <button className="close-btn" onClick={onClose}>Close</button>
          {/* <button
            className="view-btn"
            onClick={() => alert("Events page coming soon 🚀")}
          >
            View Events
          </button> */}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default PopupModal;
