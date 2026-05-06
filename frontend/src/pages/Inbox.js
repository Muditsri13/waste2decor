import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Inbox() {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChats = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        toast.error("Please login to view your messages");
        navigate("/login");
        return;
      }

      try {
        const res = await axios.get(`http://localhost:5001/api/messages/user/${userId}`);
        setChats(res.data);
      } catch (err) {
        console.error("Failed to fetch chats", err);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, [navigate]);

  return (
    <div className="container mt-5" style={{ maxWidth: "800px" }}>
      <h2 className="fw-bold mb-4 text-center text-success">Messages Inbox 💬</h2>

      {loading ? (
        <h5 className="text-center text-muted mt-5">Loading your conversations...</h5>
      ) : chats.length === 0 ? (
        <div className="text-center mt-5">
          <h4 className="text-muted">No active conversations yet.</h4>
          <p>Go to the Marketplace and chat with a seller to get started!</p>
          <button className="btn btn-success rounded-pill mt-3 px-4" onClick={() => navigate("/marketplace")}>
            Browse Products
          </button>
        </div>
      ) : (
        <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
          <div className="list-group list-group-flush">
            {chats.map((chat) => (
              <button
                key={chat.room}
                className="list-group-item list-group-item-action p-4 border-bottom hover-lift"
                onClick={() => navigate(`/chat/${chat.partnerId}`)}
              >
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <div className="d-flex align-items-center">
                    <div 
                      className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold me-3" 
                      style={{ width: "50px", height: "50px", fontSize: "20px" }}
                    >
                      {chat.partnerName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h5 className="mb-0 fw-bold">{chat.partnerName}</h5>
                      <small className="text-muted">Click to open chat</small>
                    </div>
                  </div>
                  <small className="text-muted">
                    {new Date(chat.lastMessageAt).toLocaleDateString()} {new Date(chat.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </small>
                </div>
                
                <div className="mt-2 bg-light p-2 rounded-3 text-truncate">
                  <strong>{chat.lastSender}:</strong> {chat.lastMessage}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Inbox;
