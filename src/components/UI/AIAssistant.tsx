import React, { useState } from 'react';

const AIAssistant = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! How can I help you with your VIP transport today?" },
  ]);
  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { sender: "user", text: input }];
    setMessages(newMessages);
    setInput("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // ✅ Required to read JSON on backend
        },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();

      setMessages([
        ...newMessages,
        { sender: "bot", text: data.reply || "Sorry, I couldn’t get that." },
      ]);
    } catch (err) {
      console.error("Error talking to AI:", err);
      setMessages([
        ...newMessages,
        { sender: "bot", text: "Sorry, something went wrong." },
      ]);
    }
  };

  return (
    <div>
      {/* Toggle Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-4 right-4 bg-black text-white p-3 rounded-full shadow-xl z-50"
      >
        💬
      </button>

      {/* Chat Box */}
      {open && (
        <div className="fixed bottom-20 right-4 w-80 h-[450px] bg-white border rounded-2xl shadow-lg z-50 flex flex-col overflow-hidden">
          <div className="bg-black text-white p-3 font-bold">VIP Assistant</div>

          {/* Chat Messages */}
          <div className="flex-1 p-2 overflow-y-auto space-y-2 text-sm">
            {messages.map((m, i) => (
              <div key={i} className={`text-${m.sender === "bot" ? "left" : "right"}`}>
                <span
                  className={`inline-block p-2 rounded-lg ${
                    m.sender === "bot" ? "bg-gray-100" : "bg-blue-100"
                  }`}
                >
                  {m.text}
                </span>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-2 border-t flex">
            <input
              className="flex-1 p-2 border rounded-l-lg text-sm"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your request..."
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button
              className="bg-black text-white px-4 rounded-r-lg text-sm"
              onClick={handleSend}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAssistant;
