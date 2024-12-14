import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./Messages.css";

const Messages = () => {
  const { id } = useParams();
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        if (!userId) {
          throw new Error(
            "User ID is missing. Please log in or connect Telegram."
          );
        }

        const response = await fetch(
          `http://localhost:8000/messages/${userId}?dialog_name=${id}&offset=0`
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

    fetchMessages();
  }, [userId, id]);

  if (loading) {
    return <div className="loading">Loading messages...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="messages-container">
      <h2>Messages</h2>
      {messages.length > 0 ? (
        messages.map((message, index) => (
          <div className="message-card" key={index}>
            <p className="message-content">{message.text || "No content"}</p>
            <p className="message-info">
              Sent by: {message.sender_id || "Unknown"} |{" "}
              {new Date(message.date).toLocaleString()}
            </p>
          </div>
        ))
      ) : (
        <p className="no-messages">No messages available.</p>
      )}
    </div>
  );
};

export default Messages;
