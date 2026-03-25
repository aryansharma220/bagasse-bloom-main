
/*import { useState } from "react";

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

  const sendMessage = async () => {
    if (!message.trim()) return;

    const newChat = [...chat, { role: "user", text: message }];
    setChat(newChat);
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3001/api/ai/chat", {
      
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          inputs,
          results,
        }),
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

  // 🎤 Voice Input
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
      {/* Floating Button 
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg z-[9999]"
      >
        💬 Chat
      </button>
        
        {open && (
  <div className="fixed bottom-16 right-4 w-[90%] sm:w-80 max-h-[70vh] bg-gray-900 text-white rounded-xl shadow-xl flex flex-col z-[9999]">

    {/* Header 
    <div className="p-3 border-b border-gray-700 font-semibold flex justify-between items-center">
      <span>AI Assistant</span>

      <button
        onClick={() => setOpen(false)}
        className="text-gray-400 hover:text-white text-lg"
      >
        ✖
      </button>
    </div>

    {/* Suggestions 
    <div className="p-2 flex flex-wrap gap-2">
      {[
        "Is this profitable?",
        "How to increase ROI?",
        "Explain my results",
        "What are risks?"
      ].map((q) => (
        <button
          key={q}
          onClick={() => setMessage(q)}
          className="bg-gray-700 px-2 py-1 rounded text-xs"
        >
          {q}
        </button>
      ))}
    </div>

    {/* Messages 
    <div className="flex-1 p-3 overflow-y-auto space-y-2">
      {chat.map((msg, i) => (
        <div
          key={i}
          className={`p-2 rounded-lg text-sm max-w-[75%] ${
            msg.role === "user"
              ? "bg-blue-500 ml-auto"
              : "bg-gray-800"
          }`}
        >
          {msg.text}
        </div>
      ))}

      {loading && (
        <div className="text-gray-400 text-sm animate-pulse">
          AI is typing...
        </div>
      )}
    </div>

    {/* Input 
    <div className="p-2 border-t border-gray-700 flex gap-2">
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Ask something..."
        className="flex-1 p-2 rounded bg-gray-800 text-white outline-none"
      />

      <button onClick={startVoice}>🎤</button>

      <button
        onClick={sendMessage}
        className="bg-blue-600 px-3 rounded"
      >
        Send
      </button>
    </div>
  </div>

       )}
    </>
  );
}*/