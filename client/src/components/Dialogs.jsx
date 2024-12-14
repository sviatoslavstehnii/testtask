import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Dialogs.css";

const Dialogs = () => {
  const [dialogs, setDialogs] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchDialogs = async () => {
      try {
        if (!userId) {
          throw new Error(
            "User ID is missing. Please log in or connect Telegram."
          );
        }

        const response = await fetch(`http://localhost:8000/dialogs/${userId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch dialogs.");
        }

        const data = await response.json();
        setDialogs(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDialogs();
  }, [userId]);

  if (loading) {
    return <div className="loading">Loading dialogs...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="dialogs-container">
      {dialogs.length > 0 ? (
        dialogs.map((dialog) => (
          <Link
            to={`/dialogs/${dialog.id}`}
            key={dialog.id}
            className="dialog-card"
          >
            <h3 className="dialog-name">{dialog.name || "Unnamed Dialog"}</h3>
            <p className="dialog-info">
              {dialog.is_group && "Group"}
              {dialog.is_channel && "Channel"}
              {dialog.is_user && "User"}
            </p>
            <p className="unread-count">
              {dialog.unread_count > 0
                ? `Unread Messages: ${dialog.unread_count}`
                : "No unread messages"}
            </p>
          </Link>
        ))
      ) : (
        <p className="no-dialogs">No dialogs available.</p>
      )}
    </div>
  );
};

export default Dialogs;
