import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!phone || !password) {
      showError("Please fill in all fields.");
      return;
    }
    if (phone.length !== 10) {
      showError("Please enter a valid 10-digit mobile number.");
      return;
    }

    setIsLoading(true);

    try {
      const loginResponse = await fetch(
        "https://medbook-backend-1.onrender.com/api/user/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone, password }),
        }
      );

      const loginBody = await loginResponse.json();
      console.log("Login Response:", loginBody);

      if (
        loginResponse.status === 200 &&
        loginBody.message === "Login successful" &&
        loginBody.token
      ) {
        const token = loginBody.token;
        localStorage.setItem("token", token);

        // FIX: Use the same backend URL (not localhost)
        const profileResponse = await fetch(
          "https://medbook-backend-1.onrender.com/api/user/profile",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (profileResponse.status === 200) {
          const profileBody = await profileResponse.json();
          const user = profileBody.user;
          if (user.isProduct) {
            const productDetailsResponse = await axios.get(
              `https://medbook-backend-1.onrender.com/api/user/getshop?phone=${user.phone}`
            );
            console.log("Product Details Response:", productDetailsResponse.data);
            const availableProducts = productDetailsResponse.data.availableProduct;
  if (Array.isArray(availableProducts) && availableProducts.length > 0) {
    const shopDetails = availableProducts[0];
    localStorage.setItem("shopdetails", JSON.stringify(shopDetails));
  }
          }
          localStorage.setItem("user", JSON.stringify(user));
          navigate("/dashboard");
        } else {
          showError("Failed to fetch user profile.");
        }
      } else {
        showError(loginBody.message || "Login failed.");
      }
    } catch (error) {
      console.error("Login Error:", error);
      showError("Login failed. Please check your backend and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const showError = (msg) => {
    setErrorMessage(msg);
    setTimeout(() => setErrorMessage(null), 5000);
  };

  // 🧠 Responsive Inline Styles
  const styles = {
    container: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      height: "100%",
      padding: "20px 16px",
      background: "linear-gradient(to bottom right, #E93D3D, #FF7E5F)",
      fontFamily: "Poppins, sans-serif",
      boxSizing: "border-box",
    },
    box: {
      width: "100%",
      maxWidth: "400px",
      padding: "clamp(20px, 5vw, 32px)",
      backgroundColor: "rgba(255,255,255,0.1)",
      border: "1px solid rgba(255,255,255,0.3)",
      borderRadius: "20px",
      textAlign: "center",
      color: "#fff",
      backdropFilter: "blur(6px)",
      boxSizing: "border-box",
    },
    logo: { 
      width: "clamp(70px, 20vw, 90px)", 
      height: "clamp(70px, 20vw, 90px)", 
      marginBottom: "clamp(8px, 2vw, 10px)",
      objectFit: "contain" 
    },
    title: {
      fontSize: "clamp(22px, 6vw, 26px)",
      fontFamily: "Impact, sans-serif",
      color: "white",
      marginBottom: "clamp(20px, 5vw, 30px)",
      fontWeight: "bold",
    },
    input: {
      width: "100%",
      margin: "clamp(8px, 2vw, 10px) 0",
      padding: "clamp(10px, 3vw, 12px)",
      border: "none",
      borderBottom: "2px solid white",
      background: "transparent",
      color: "white",
      fontSize: "clamp(14px, 4vw, 16px)",
      outline: "none",
      boxSizing: "border-box",
    },
    placeholder: { color: "#f5f5f5" },
    forgot: {
      textAlign: "right",
      fontSize: "clamp(11px, 3vw, 12px)",
      fontWeight: "bold",
      color: "white",
      cursor: "pointer",
      marginTop: "clamp(8px, 2vw, 10px)",
    },
    error: {
      color: "#f9f9f9",
      fontSize: "clamp(12px, 3vw, 13px)",
      marginTop: "clamp(8px, 2vw, 10px)",
      padding: "0 10px",
      wordWrap: "break-word",
    },
    button: {
      width: "100%",
      marginTop: "clamp(16px, 4vw, 20px)",
      padding: "clamp(12px, 3vw, 14px)",
      backgroundColor: "white",
      color: "#E93D3D",
      border: "none",
      borderRadius: "10px",
      fontWeight: "bold",
      cursor: "pointer",
      transition: "transform 0.1s ease",
      fontSize: "clamp(14px, 4vw, 16px)",
      minHeight: "48px",
      boxSizing: "border-box",
    },
    buttonHover: { transform: "scale(0.97)" },
    extra: { 
      marginTop: "clamp(16px, 4vw, 20px)", 
      fontSize: "clamp(12px, 3vw, 13px)" 
    },
    link: { color: "white", fontWeight: "bold", cursor: "pointer" },
    spinner: {
      border: "3px solid #f3f3f3",
      borderTop: "3px solid #E93D3D",
      borderRadius: "50%",
      width: "18px",
      height: "18px",
      animation: "spin 0.8s linear infinite",
      margin: "0 auto",
    },
    "@keyframes spin": {
      "100%": { transform: "rotate(360deg)" },
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <img
          src="/medbook1.jpg"
          alt="Medbook Logo"
          style={styles.logo}
        />
        <h1 style={styles.title}>Medbook</h1>

        <input
          type="tel"
          maxLength="10"
          placeholder="Mobile Number"
          value={phone}
          onChange={(e) =>
            setPhone(e.target.value.replace(/[^0-9]/g, "").slice(0, 10))
          }
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />

        {/* <div style={styles.forgot} onClick={() => navigate("/forgot")}>
          Forgot Password?
        </div> */}

        {errorMessage && <div style={styles.error}>{errorMessage}</div>}

        <button 
          style={styles.button} 
          onClick={handleLogin} 
          disabled={isLoading}
        >
          {isLoading ? (
            <div
              style={{
                border: "3px solid #f3f3f3",
                borderTop: "3px solid #E93D3D",
                borderRadius: "50%",
                width: "18px",
                height: "18px",
                animation: "spin 0.8s linear infinite",
                margin: "0 auto",
              }}
            ></div>
          ) : (
            "LOGIN"
          )}
        </button>

        {/* <div style={styles.extra}>
          <p>
            Don't have an account?{" "}
            <span style={styles.link} onClick={() => navigate("/signup")}>
              Sign Up
            </span>
          </p>
          <p style={styles.link} onClick={() => navigate("/")}>
            ← Back to Start
          </p>
        </div> */}
      </div>
    </div>
  );
}