// src/components/AIChat.js
import React, { useState } from "react";
import axios from "axios";
import Spinner from "./Spinner";
import { toast } from "react-toastify";

const API = process.env.REACT_APP_AI_PROXY || "http://localhost:5001/api/ai/chat";

export default function AIChat() {
  const [msgs, setMsgs] = useState([{from:"bot", text:"Hi — I am EcoBot. Ask me about upcycling or recycling."}]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if (!text) return;
    const userMsg = { from:"you", text };
    setMsgs(prev => [...prev, userMsg]);
    setText("");
    setLoading(true);

    try {
      const res = await axios.post(API, { prompt: text }, { timeout: 60000 });
      const reply = res.data?.reply || "Sorry, I couldn't get a reply.";
      setMsgs(prev => [...prev, { from:"bot", text: reply }]);
    } catch (err) {
      console.error("AI call failed", err);
      // fallback to small rule-based reply locally
      const fallback = text.toLowerCase().includes("plastic")
        ? "Try reusing plastic bottles as planters or lamps. Clean & cut safely."
        : "I couldn't reach the AI server — showing a helpful tip: try composting kitchen scraps with dry leaves.";
      setMsgs(prev => [...prev, { from:"bot", text: fallback }]);
      toast.error("AI service unavailable — using fallback.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3 className="text-success">EcoBot (AI)</h3>
      <div className="card p-3 mb-3" style={{height:360, overflowY:'auto'}}>
        {msgs.map((m,i)=>(
          <div key={i} className={m.from==="you" ? "text-end mb-2" : "mb-2"}>
            <div className={`d-inline-block p-2 rounded ${m.from==="you" ? "bg-success text-white" : "bg-light text-dark"}`} style={{maxWidth:'80%'}}>
              {m.text}
            </div>
          </div>
        ))}
        {loading && <div className="mt-2"><Spinner size={28} /></div>}
      </div>

      <div className="d-flex gap-2">
        <input className="form-control" value={text} onChange={e=>setText(e.target.value)} placeholder="Ask EcoBot about upcycling, recycling, composting..." />
        <button className="btn btn-success" onClick={send} disabled={loading}>Send</button>
      </div>
    </div>
  );
}
