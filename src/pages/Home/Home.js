// import React, { useState, useEffect } from "react";
// import "./Home.css";
// import { useNavigate } from "react-router-dom";
// import PopupModal from "../../components/PopupModal";

// // Team images
// import dinesh from "../../assets/team/dinesh.jpg";
// // barcode qr code image
// import barcodeImage from "../../assets/team/Medbook.png";

// const Home = () => {
//   const navigate = useNavigate();
//   const [showPopup, setShowPopup] = useState(false);

//   // prevent background scroll while modal is open
//   useEffect(() => {
//     if (showPopup) {
//       document.body.classList.add("modal-open-no-scroll");
//     } else {
//       document.body.classList.remove("modal-open-no-scroll");
//     }
//     return () => document.body.classList.remove("modal-open-no-scroll");
//   }, [showPopup]);

//   const openPopup = () => setShowPopup(true);
//   const closePopup = () => setShowPopup(false);

//   return (
//     <div className="med-home-container">
//       {/* Hero Section */}
//       <section className="med-hero">
//         <header className="med-home-header">
//           <h1 className="med-home-logo">Medbook</h1>
//           <p className="med-tagline">Healthcare Management Simplified</p>
//         </header>

//         <div className="hero-content">
//           <h2>Your Complete Doctor & Clinic Management Platform</h2>
//           <p>
//             Streamline appointments, prescriptions, patient records, and clinic
//             workflow in one secure platform
//           </p>

//           <div className="hero-buttons">
//             <button
//               className="med-btn med-btn-red"
//               onClick={() => navigate("/login")}
//             >
//               Partner Login
//             </button>

//             {/* Download App Section */}
//             <div className="download-section">
//               <h3>Get Medbook App</h3>
//               <div className="download-container">
//                 <div className="qr-code">
//                   <div className="barcode-container">
//                     <img
//                       src={barcodeImage}
//                       className="barcode-image"
//                       alt="Medbook QR"
//                     />
//                   </div>
//                   <p>Scan to Download</p>
//                 </div>

//                 <div className="store-buttons">
//                   <a
//                     className="play-store-btn"
//                     href="https://play.google.com/store/apps/details?id=com.mdqualityappssolutions.medbook"
//                     target="_blank"
//                     rel="noopener noreferrer"
//                   >
//                     <div className="store-icon" aria-hidden>
//                       <svg viewBox="0 0 24 24" width="24" height="24">
//                         <path
//                           fill="currentColor"
//                           d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.5,12.92 20.16,13.19L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"
//                         />
//                       </svg>
//                     </div>
//                     <div className="store-text">
//                       <div className="get-text">GET IT ON</div>
//                       <div className="store-name">Google Play</div>
//                     </div>
//                   </a>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* About Section */}
//       <section className="med-section med-about">
//         <div className="section-header">
//           <h3>About Medbook</h3>
//           <div className="section-divider"></div>
//         </div>
//         <div className="about-content">
//           <div className="about-text">
//             <p>
//               Medbook is a modern healthcare CRM built for doctors and clinics
//               to manage schedules, prescriptions, patients and workflow
//               seamlessly.
//             </p>
//             <ul>
//               <li>✓ Digital patient records management</li>
//               <li>✓ Automated appointment scheduling</li>
//               <li>✓ Electronic prescription system</li>
//               <li>✓ Billing and payment processing</li>
//               <li>✓ Secure data storage and compliance</li>
//             </ul>
//           </div>
//           <div className="about-image">
//             <img
//               src="https://wide-peach-3hgy7hxyo0.edgeone.app/medbook1.jpg"
//               alt="Medical Technology"
//             />
//           </div>
//         </div>
//       </section>

//       {/* Team Section */}
//       <section className="med-section med-team">
//         <div className="section-header">
//           <h3>Our Development Team</h3>
//           <div className="section-divider"></div>
//         </div>
//         <div className="med-team-grid">
//           {[1, 2, 3, 4].map((id) => (
//             <div key={id} className="med-team-card">
//               <div className="team-img-container">
//                 <img src={dinesh} className="med-team-img" alt="Team" />
//               </div>
//               <h4>Dinesh M</h4>
//               <p>Developer</p>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* CTA Section */}
//       <section className="med-section med-cta">
//         <div className="cta-content">
//           <h3>Ready to Transform Your Practice?</h3>
//           <p>Join thousands of healthcare providers using Medbook</p>
//           <div className="cta-buttons">
//             <button
//               className="med-btn med-btn-red"
//               onClick={() => navigate("/login")}
//             >
//               Partner Login
//             </button>
//             <a
//               className="med-btn med-btn-black"
//               href="https://play.google.com/store/apps/details?id=com.mdqualityappssolutions.medbook"
//               target="_blank"
//               rel="noopener noreferrer"
//             >
//               Download App
//             </a>

//             <button className="med-btn med-btn-outline" onClick={openPopup}>
//               Upcoming Events
//             </button>
//           </div>
//         </div>
//       </section>

//       {/* Global Popup Modal Component */}
//       <PopupModal open={showPopup} onClose={closePopup} />

//       {/* Footer */}
//       <footer className="med-footer">
//         <div className="footer-content">
//           <div className="footer-logo">
//             <h3>Medbook</h3>
//             <p>Healthcare Management Simplified</p>
//           </div>
//           <div className="footer-links">
//             <a href="#">Privacy Policy</a>
//             <a href="#">Terms of Service</a>
//             <a href="#">Contact Us</a>
//           </div>
//           <p>© 2023 Medbook. All rights reserved.</p>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default Home;





















import React, { useState, useEffect } from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";
import PopupModal from "../../components/PopupModal";

// Team images
import dinesh from "../../assets/team/dinesh.jpg";
import jayasurya from "../../assets/team/jayasurya.jpeg";
import nanthakumar from "../../assets/team/nantha.jpeg";
import rama from '../../assets/team/rama.jpeg'

// QR App Image
import barcodeImage from "../../assets/team/Medbook.png";

const Home = () => {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (showPopup) {
      document.body.classList.add("modal-open-no-scroll");
    } else {
      document.body.classList.remove("modal-open-no-scroll");
    }
    return () => document.body.classList.remove("modal-open-no-scroll");
  }, [showPopup]);

  const openPopup = () => setShowPopup(true);
  const closePopup = () => setShowPopup(false);

  // ----------------------------
  // TEAM MEMBERS DATA
  // ----------------------------
  const teamMembers = [
    {
      id: 1,
      name: "Dinesh M",
      role: "Software Engineer",
      image: dinesh,
    },
    {
      id: 2,
      name: "Jayasurya P",
      role: "Software Engineer",
      image: jayasurya,
    },
    {
      id: 3,
      name: "Nantha Kumar K",
      role: "Software Engineer",
      image: nanthakumar,
    },
  ];

  return (
    <div className="med-home-container">

      {/* Hero Section */}
      <section className="med-hero">
        <header className="med-home-header">
          <h1 className="med-home-logo">Medbook</h1>
          <p className="med-tagline">Healthcare Management Simplified</p>
        </header>

        <div className="hero-content">
          <h2>Your Complete Doctor & Clinic Management Platform</h2>
          <p>
            Streamline appointments, prescriptions, patient records, and clinic workflow in one secure platform.
          </p>

          <div className="hero-buttons">
            <button className="med-btn med-btn-red" onClick={() => navigate("/login")}>
              Partner Login
            </button>

            <div className="download-section">
              <h3>Get Medbook App</h3>
              <div className="download-container">
                <div className="qr-code">
                  <div className="barcode-container">
                    <img src={barcodeImage} className="barcode-image" alt="Medbook QR" />
                  </div>
                  <p>Scan to Download</p>
                </div>

                <div className="store-buttons">
                  <a
                    className="play-store-btn"
                    href="https://play.google.com/store/apps/details?id=com.mdqualityappssolutions.medbook"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className="store-icon" aria-hidden>
                      <svg viewBox="0 0 24 24" width="24" height="24">
                        <path
                          fill="currentColor"
                          d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.5,12.92 20.16,13.19L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"
                        />
                      </svg>
                    </div>
                    <div className="store-text">
                      <div className="get-text">GET IT ON</div>
                      <div className="store-name">Google Play</div>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="med-section med-about">
        <div className="section-header">
          <h3>About Medbook</h3>
          <div className="section-divider"></div>
        </div>

        <div className="about-content">
          <div className="about-text">
            <p>
              Medbook is a modern healthcare CRM built for doctors and clinics to manage schedules,
              prescriptions, patient records, and workflow seamlessly.
            </p>
            <ul>
              <li>✓ Digital patient records</li>
              <li>✓ Automated appointment scheduling</li>
              <li>✓ Secure data compliance</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="med-section founder-section">
        <div className="section-header">
          <h3>Founder</h3>
          <div className="section-divider"></div>
        </div>

        <div className="founder-card">
          <div className="founder-img-box">
            <img
              src={rama}
              alt="Founder"
              className="founder-img"
            />
          </div>

          <div className="founder-info">
            <h4>Rama Sandiliyan</h4>
            <p className="founder-title">Founder & CEO</p>
            <p className="founder-desc">
              Rama Sandiliyan, a visionary healthcare leader with more than 15 years of experience,
              created Medbook to modernize digital healthcare for clinics worldwide.
            </p>
            <blockquote className="founder-quote">
              "Technology should simplify healthcare, not complicate it."
            </blockquote>
          </div>
        </div>
      </section>

      {/* ----------------------------- */}
      {/*        TEAM SECTION           */}
      {/* ----------------------------- */}
      <section className="med-section med-team">
        <div className="section-header">
          <h3>Our Development Team</h3>
          <div className="section-divider"></div>
        </div>

        <div className="med-team-grid">
          {teamMembers.map((member) => (
            <div key={member.id} className="med-team-card">
              <div className="team-img-container">
                <img src={member.image} className="med-team-img" alt={member.name} />
              </div>
              <h4>{member.name}</h4>
              <p>{member.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="med-section med-cta">
        <div className="cta-content">
          <h3>Ready to Transform Your Practice?</h3>
          <p>Join thousands of healthcare providers using Medbook</p>
          <div className="cta-buttons">
            <button className="med-btn med-btn-red" onClick={() => navigate("/login")}>
              Partner Login
            </button>
            <a
              className="med-btn med-btn-black"
              href="https://play.google.com/store/apps/details?id=com.mdqualityappssolutions.medbook"
              target="_blank"
              rel="noopener noreferrer"
            >
              Download App
            </a>
            <button className="med-btn med-btn-outline" onClick={openPopup}>
              Upcoming Events
            </button>
          </div>
        </div>
      </section>

      {/* Popup */}
      <PopupModal open={showPopup} onClose={closePopup} />

      {/* Footer */}
      <footer className="med-footer">
        <div className="footer-content">
          <div className="footer-logo">
            <h3>Medbook</h3>
            <p>Healthcare Management Simplified</p>
          </div>

          <div className="footer-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Contact Us</a>
          </div>

          <p>© 2023 Medbook. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
};

export default Home;
