import React, { useEffect, useState, useContext, useRef } from "react";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const API_URL = "https://waste2decor-backend.onrender.com";
const socket = io(API_URL);

function Chat() {
  const { user } = useContext(AuthContext);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const { sellerId } = useParams();
  const userId = localStorage.getItem("userId") || (user && user._id);
  
  // Sort IDs to ensure room name is consistent regardless of who initiates
  const room = [userId, sellerId].sort().join("_");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // Fetch chat history
    const fetchHistory = async () => {
      try {
        const res = await axios.get(`http://localhost:5001/api/messages/${room}`);
        setChat(res.data);
        scrollToBottom();
      } catch (error) {
        console.error("Failed to fetch history:", error);
      }
    };
    fetchHistory();

    socket.emit("joinRoom", room);

    socket.on("receiveMessage", (data) => {
      setChat((prev) => [...prev, data]);
      scrollToBottom();
    });

    return () => socket.off("receiveMessage");

  }, [room]);

  useEffect(() => {
    scrollToBottom();
  }, [chat]);

  const sendMessage = () => {
    if (!message.trim()) return;
    
    socket.emit("sendMessage", { 
      room, 
      message,
      senderId: userId,
      senderName: user ? user.name : "User"
    });
    setMessage("");
  };

  return (
    <div className="container mt-4">
      <div className="card shadow mx-auto" style={{ maxWidth: "600px" }}>
        <div className="card-header bg-success text-white">
          <h4 className="mb-0">Chat 💬</h4>
        </div>
        
        <div className="card-body" style={{
          height: "400px",
          overflowY: "auto",
          backgroundColor: "#f8f9fa",
          display: "flex",
          flexDirection: "column"
        }}>
          {chat.length === 0 ? (
            <p className="text-center text-muted my-auto">Say hello!</p>
          ) : (
            chat.map((msg, index) => {
              const isMe = msg.senderId === userId;
              return (
                <div key={index} className={`mb-3 ${isMe ? "text-end" : "text-start"}`}>
                  <div 
                    className={`d-inline-block p-2 px-3 rounded ${isMe ? "bg-success text-white" : "bg-light border"}`}
                    style={{ maxWidth: "75%" }}
                  >
                    <small className={`d-block fw-bold ${isMe ? "text-light" : "text-success"}`} style={{ fontSize: "0.75rem" }}>
                      {isMe ? "You" : msg.senderName}
                    </small>
                    {msg.text}
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="card-footer bg-white">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              className="btn btn-success"
              onClick={sendMessage}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;