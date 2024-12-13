import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
const Home = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate(); // useNavigate hook to navigate between routes

  useEffect(() => {
    // Check if the token exists in localStorage
    const token = localStorage.getItem("token");
    const storedUserId = localStorage.getItem("userId");

    if (token) {
      // If token exists, set user as authenticated
      setIsAuthenticated(true);
    } else {
      // If no token, user is not authenticated
      setIsAuthenticated(false);
    }

    if (storedUserId) {
      setUserId(storedUserId); // Store userId if exists
    }
  }, []);

  const handleLogout = () => {
    // Remove the token and userId from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setIsAuthenticated(false);
    setUserId(null);
    // Redirect to login page after logout
    navigate("/login");
  };

  const handleConnectTelegram = () => {
    // Redirect to the connect Telegram page
    navigate("/connect_tg");
  };

  const handleRemoveUserId = () => {
    // Remove userId from localStorage
    localStorage.removeItem("userId");
    setUserId(null);
  };

  return (
    <div className="home-container">
      {isAuthenticated ? (
        <div>
          <h2>Welcome back, User!</h2>
          <button onClick={handleLogout} className="logout-btn">
            Log Out
          </button>

          {/* Only show Connect Telegram button if userId exists */}
          {userId ? (
            <div>
              <h3>Your userId is connected: {userId}</h3>
              <button onClick={handleRemoveUserId} className="remove-id-btn">
                Remove UserId
              </button>
            </div>
          ) : (
            <div>
              <button
                onClick={handleConnectTelegram}
                className="connect-tg-btn"
              >
                Connect Telegram
              </button>
            </div>
          )}
        </div>
      ) : (
        <div>
          <h2>Please log in to continue</h2>
          <button onClick={() => navigate("/login")} className="login-btn">
            Log In
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
