import { useState, useEffect, useRef } from "react"
import ReactMarkdown from "react-markdown"

export default function App() {
  const [conversations, setConversations] = useState([])
  const [activeConv, setActiveConv] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(null)
  const bottomRef = useRef(null)

  // Fetch all conversations on load
  useEffect(() => {
    fetchConversations()
  }, [])

  // Scroll to bottom on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const fetchConversations = async () => {
    const res = await fetch("http://127.0.0.1:5000/api/conversations")
    const data = await res.json()
    setConversations(data)
  }

  const newConversation = async () => {
    const res = await fetch("http://127.0.0.1:5000/api/conversations", {
      method: "POST",
    })
    const data = await res.json()
    setActiveConv(data)
    setMessages([])
    await fetchConversations()
  }

  const selectConversation = async (conv) => {
    setActiveConv(conv)
    const res = await fetch(`http://127.0.0.1:5000/api/conversations/${conv.id}/messages`)
    const data = await res.json()
    setMessages(data)
  }

  const deleteConversation = async (e, convId) => {
    e.stopPropagation()
    await fetch(`http://127.0.0.1:5000/api/conversations/${convId}`, {
      method: "DELETE",
    })
    if (activeConv?.id === convId) {
      setActiveConv(null)
      setMessages([])
    }
    await fetchConversations()
  }

  const sendMessage = async () => {
    if (!input.trim() || !activeConv) return

    const userMessage = { role: "user", content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setLoading(true)

    const res = await fetch(`http://127.0.0.1:5000/api/conversations/${activeConv.id}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input }),
    })

    const data = await res.json()
    setMessages((prev) => [...prev, { role: "assistant", content: data.reply }])
    setLoading(false)
    await fetchConversations()
  }

  const copyMessage = (content, index) => {
    navigator.clipboard.writeText(content)
    setCopied(index)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="flex h-screen bg-gray-950 text-white">

      {/* Sidebar */}
      <div className="w-64 bg-gray-900 flex flex-col border-r border-gray-800">
        
        {/* Logo */}
        <div className="p-4 border-b border-gray-800 text-center">
          <h1 className="text-2xl font-bold text-yellow-500">نور</h1>
          <p className="text-gray-500 text-xs">AI Islamic Scholar</p>
        </div>

        {/* New Chat Button */}
        <div className="p-3">
          <button
            onClick={newConversation}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 rounded-xl text-sm"
          >
            + New Chat
          </button>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {conversations.map((conv) => (
            <div
              key={conv.id}
              onClick={() => selectConversation(conv)}
              className={`flex items-center justify-between p-2 rounded-lg cursor-pointer group text-sm ${
                activeConv?.id === conv.id
                  ? "bg-gray-700 text-white"
                  : "text-gray-400 hover:bg-gray-800"
              }`}
            >
              <span className="truncate flex-1">{conv.title}</span>
              <button
                onClick={(e) => deleteConversation(e, conv.id)}
                className="hidden group-hover:block text-gray-500 hover:text-red-400 ml-2"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">

        {/* Empty State */}
        {!activeConv ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <h2 className="text-5xl font-bold text-yellow-500 mb-4">نور</h2>
            <p className="text-gray-400 text-lg mb-2">AI Islamic Scholar</p>
            <p className="text-gray-600 text-sm mb-8">Ask about Quran, Hadith, Fiqh, and more</p>
            <button
              onClick={newConversation}
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-6 py-3 rounded-xl"
            >
              Start a Conversation
            </button>
          </div>
        ) : (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {messages.length === 0 && (
                <p className="text-center text-gray-600 mt-20">
                  Ask anything about Islam...
                </p>
              )}
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`relative max-w-[75%] group`}>
                    <div className={`p-4 rounded-2xl text-sm ${
                      msg.role === "user"
                        ? "bg-yellow-600 text-white"
                        : "bg-gray-800 text-gray-100"
                    }`}>
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>

                    {/* Copy Button */}
                    {msg.role === "assistant" && (
                      <button
                        onClick={() => copyMessage(msg.content, i)}
                        className="absolute -bottom-6 right-0 text-xs text-gray-600 hover:text-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        {copied === i ? "✓ Copied" : "Copy"}
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-gray-800 p-4 rounded-2xl text-gray-400 text-sm">
                    Thinking...
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-800 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Ask a question..."
                className="flex-1 bg-gray-800 text-white rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-yellow-500"
              />
              <button
                onClick={sendMessage}
                disabled={loading}
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-5 py-3 rounded-xl text-sm disabled:opacity-50"
              >
                Send
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}