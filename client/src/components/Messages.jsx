import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Messages.css";

const Messages = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0);

  const userId = localStorage.getItem("userId");

  const fetchMessages = async (newOffset) => {
    try {
      setLoading(true);
      if (!userId) {
        throw new Error(
          "User ID is missing. Please log in or connect Telegram."
        );
      }

      const response = await fetch(
        `http://localhost:8000/messages/${userId}?dialog_name=${id}&offset=${newOffset}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch messages.");
      }

      const data = await response.json();

      setMessages(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages(offset);
  }, [userId, id, offset]);

  const handleNext = () => {
    setOffset((prevOffset) => prevOffset + 10);
  };

  const handlePrevious = () => {
    setOffset((prevOffset) => Math.max(0, prevOffset - 10));
  };

  if (loading) {
    return <div className="loading">Loading messages...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="messages-container">
      <h2>Messages</h2>
      <button onClick={() => navigate("/dialogs")} className="back-btn">
        Dialogs
      </button>
      {messages.length > 0 ? (
        <>
          {messages.map((message, index) => (
            <div className="message-card" key={index}>
              <p className="message-content">
                {message.text || "Image/Video or Voice message"}
              </p>
              <p className="message-info">
                Sent by: {message.sender_id || "Unknown"} |{" "}
                {new Date(message.date).toLocaleString()}
              </p>
            </div>
          ))}
          <div className="pagination-buttons">
            <button
              onClick={handlePrevious}
              disabled={offset === 0}
              className="pagination-button"
            >
              Previous
            </button>
            <button onClick={handleNext} className="pagination-button">
              Next
            </button>
          </div>
        </>
      ) : (
        <p className="no-messages">No messages available.</p>
      )}
    </div>
  );
};

export default Messages;
