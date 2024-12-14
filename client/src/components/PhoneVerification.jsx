import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PhoneVerification.css";

const PhoneVerification = () => {
  const [step, setStep] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [userId, setUserId] = useState(null);
  const [phoneCodeHash, setPhoneCodeHash] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handlePhoneChange = (e) => {
    setPhoneNumber(e.target.value);
  };

  const handleCodeChange = (e) => {
    setVerificationCode(e.target.value);
  };

  const sendVerificationCode = async () => {
    if (!phoneNumber) {
      setError("Please enter a valid phone number.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/send_code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone_number: phoneNumber }),
      });

      const data = await response.json();

      if (response.ok) {
        setUserId(data.user_id);
        setPhoneCodeHash(data.phone_code_hash);
        setStep(2);
        setError("");
      } else {
        setError(data.message || "Error sending code");
      }
    } catch (error) {
      setError("Error sending verification code.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!verificationCode) {
      setError("Please enter the verification code.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/sign_in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          phone_number: phoneNumber,
          code: verificationCode,
          phone_code_hash: phoneCodeHash,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log(data.message);
        localStorage.setItem("userId", userId);
        setError("");
        navigate("/");
      } else {
        setError(data.message || "Error verifying code.");
      }
    } catch (error) {
      setError("Error during sign-in.");
    }
  };

  return (
    <div className="phone-verification-container">
      <div className="phone-verification-card">
        <h2>Phone Number Verification</h2>
        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <div className="form-group">
              <label htmlFor="phoneNumber">Enter Phone Number</label>
              <input
                type="text"
                id="phoneNumber"
                name="phoneNumber"
                value={phoneNumber}
                onChange={handlePhoneChange}
                placeholder="Enter your phone number"
                required
              />
              <button
                type="button"
                className="submit-btn"
                onClick={sendVerificationCode}
              >
                Send Code
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="form-group">
              <label htmlFor="verificationCode">Enter Verification Code</label>
              <input
                type="text"
                id="verificationCode"
                name="verificationCode"
                value={verificationCode}
                onChange={handleCodeChange}
                placeholder="Enter the code sent to your phone"
                required
              />
              <button type="submit" className="submit-btn">
                Verify Code
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default PhoneVerification;
