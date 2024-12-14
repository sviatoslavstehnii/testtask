import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUserId = localStorage.getItem("userId");

    setIsAuthenticated(!!token);
    if (storedUserId) setUserId(storedUserId);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setIsAuthenticated(false);
    setUserId(null);
    navigate("/login");
  };

  const handleConnectTelegram = () => navigate("/connect_tg");

  const handleRemoveUserId = () => {
    localStorage.removeItem("userId");
    setUserId(null);
  };

  return (
    <div className="home-container">
      {isAuthenticated ? (
        <div className="authenticated-section">
          <h2>Welcome back, User!</h2>
          <div className="button-group">
            <button onClick={handleLogout} className="btn logout-btn">
              Log Out
            </button>

            {userId ? (
              <div className="user-actions">
                <h3>Your UserId is: {userId}</h3>
                <button
                  onClick={handleRemoveUserId}
                  className="btn remove-id-btn"
                >
                  Remove UserId
                </button>
                <button
                  onClick={() => navigate("/dialogs")}
                  className="btn dialogs-btn"
                >
                  View Dialogs
                </button>
              </div>
            ) : (
              <button
                onClick={handleConnectTelegram}
                className="btn connect-tg-btn"
              >
                Connect Telegram
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="unauthenticated-section">
          <h2>Please log in to continue</h2>
          <button onClick={() => navigate("/login")} className="btn login-btn">
            Log In
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
