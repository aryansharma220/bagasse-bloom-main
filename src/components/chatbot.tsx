
import { useState } from "react";
import { Mic, Send } from "lucide-react";

type ChatMessage = {
  role: "user" | "bot";
  text: string;
};

type Props = {
  inputs: any;
  results: any;
};

export default function Chatbot({ inputs, results }: Props) {
  const [chat, setChat] = useState<ChatMessage[]>([
    { role: "bot", text: "Hi 👋 Ask me anything about your project" },
  ]);
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ 🔥 IMPORTANT FIX (Dynamic API URL)
  const API_URL =
    window.location.hostname === "localhost"
      ? "http://localhost:3001"
      : "";

  const sendMessage = async () => {
    if (!message.trim()) return;

    console.log("SENDING MESSAGE...");

    const newChat = [...chat, { role: "user", text: message }];
    setChat(newChat);
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/ai/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message, inputs, results }),
      });

      const data = await res.json();

      setChat([
        ...newChat,
        {
          role: "bot",
          text: data.reply || "No response",
        },
      ]);
    } catch (error) {
      console.error("FRONTEND ERROR:", error);

      setChat([
        ...newChat,
        {
          role: "bot",
          text: "❌ Error connecting to AI",
        },
      ]);
    }

    setLoading(false);
  };

  const startVoice = () => {
    const SpeechRecognition =
      (window as any).webkitSpeechRecognition ||
      (window as any).SpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice not supported");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";

    recognition.onresult = (event: any) => {
      setMessage(event.results[0][0].transcript);
    };

    recognition.start();
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-4 right-4 bg-gradient-to-r from-[#6EE7D8] to-[#3ECFBE] text-black px-4 py-2 rounded-full shadow-lg z-[9999] hover:scale-105 transition"
      >
        💬 Chat
      </button>

      {open && (
        <div className="fixed bottom-16 right-4 w-[90%] sm:w-80 max-h-[70vh] bg-[#0B1F24] text-white rounded-2xl shadow-xl flex flex-col z-[9999] border border-[#3ECFBE]/20">

          {/* Header */}
          <div className="p-3 bg-gradient-to-r from-[#6EE7D8] to-[#3ECFBE] text-black font-semibold flex justify-between items-center">
            <span>AI Assistant</span>
            <button onClick={() => setOpen(false)} className="text-black text-lg">
              ✖
            </button>
          </div>

          {/* Suggestions */}
          <div className="p-2 flex flex-wrap gap-2">
            {[
              "Is this profitable?",
              "How to increase ROI?",
              "Explain my results",
              "What are risks?",
            ].map((q) => (
              <button
                key={q}
                onClick={() => setMessage(q)}
                className="bg-[#071418] border border-[#3ECFBE]/30 px-2 py-1 rounded text-xs hover:bg-[#0B1F24]"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Messages */}
          <div className="flex-1 p-3 overflow-y-auto space-y-2">
            {chat.map((msg, i) => (
              <div
                key={i}
                className={`p-2 rounded-xl text-sm max-w-[75%] ${
                  msg.role === "user"
                    ? "ml-auto bg-gradient-to-r from-[#6EE7D8] to-[#3ECFBE] text-black"
                    : "bg-[#071418] border border-[#3ECFBE]/30 text-white"
                }`}
              >
                {msg.text}
              </div>
            ))}

            {loading && (
              <div className="text-[#6EE7D8] text-sm animate-pulse">
                AI is typing...
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-2 border-t border-[#3ECFBE]/20 flex gap-2 items-center">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask something..."
              className="flex-1 p-2 rounded-xl bg-[#071418] text-white outline-none border border-[#3ECFBE]/30 focus:border-[#3ECFBE]"
            />

            <button
              onClick={startVoice}
              className="bg-[#071418] border border-[#3ECFBE]/40 p-2 rounded-full hover:bg-[#0B1F24]"
            >
              <Mic className="text-[#6EE7D8] w-5 h-5" />
            </button>

            <button
              onClick={sendMessage}
              className="bg-gradient-to-r from-[#6EE7D8] to-[#3ECFBE] p-2 rounded-xl hover:scale-105 transition"
            >
              <Send className="text-black w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}