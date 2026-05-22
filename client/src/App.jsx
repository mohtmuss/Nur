
import { useState } from "react"
import ReactMarkdown from "react-markdown"

export default function App() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)

  const sendMessage = async () => {
    if (!input.trim()) return

    const userMessage = { role: "user", content: input }
    const updatedMessages = [...messages, userMessage]

    setMessages(updatedMessages)
    setInput("")
    setLoading(true)

    const response = await fetch("http://127.0.0.1:5000/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: updatedMessages }),
    })

    const data = await response.json()
    setMessages([...updatedMessages, { role: "assistant", content: data.reply }])
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-4">
      
      {/* Header */}
      <div className="mb-6 text-center">
        <h1 className="text-4xl font-bold text-yellow-500">نور</h1>
        <p className="text-gray-400 text-sm mt-1">AI Islamic Scholar</p>
      </div>

      {/* Chat Window */}
      <div className="w-full max-w-2xl bg-gray-900 rounded-2xl flex flex-col h-[70vh]">
        
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <p className="text-center text-gray-500 mt-20">
              Ask anything about Islam — Quran, Hadith, Fiqh...
            </p>
          )}
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] p-3 rounded-2xl text-sm whitespace-pre-wrap ${
                msg.role === "user"
                  ? "bg-yellow-600 text-white"
                  : "bg-gray-800 text-gray-100"
              }`}>
               <ReactMarkdown>{msg.content}</ReactMarkdown>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-800 p-3 rounded-2xl text-gray-400 text-sm">
                Thinking...
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-800 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Ask a question..."
            className="flex-1 bg-gray-800 text-white rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-yellow-500"
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-4 py-2 rounded-xl text-sm disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}