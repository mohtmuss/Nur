import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import ReactMarkdown from "react-markdown"
import { Star, Trash2, ChevronDown, Plus, MessageSquare } from "lucide-react"

function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      className="flex gap-3"
    >
      <div className="w-8 h-8 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center flex-shrink-0">
        <Star className="w-3.5 h-3.5 text-yellow-500" />
      </div>
      <div className="px-4 py-3.5 rounded-2xl rounded-tl-sm bg-gray-800 border border-gray-700 flex items-center gap-1.5">
        {[0, 150, 300].map((delay) => (
          <motion.div
            key={delay}
            className="w-1.5 h-1.5 rounded-full bg-yellow-500/50"
            animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1, repeat: Infinity, delay: delay / 1000 }}
          />
        ))}
      </div>
    </motion.div>
  )
}

function ScrollToBottom({ onClick, visible }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={onClick}
          className="absolute bottom-4 right-4 w-8 h-8 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center shadow-lg hover:border-yellow-500/30 transition-colors"
        >
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </motion.button>
      )}
    </AnimatePresence>
  )
}

function EmptyState({ onNew }) {
  const suggestions = [
    "What is the significance of Surah Al-Fatiha?",
    "Explain the concept of Tawheed in Islam",
    "What are the conditions for a valid prayer?",
    "Tell me about the Night of Power (Laylatul Qadr)",
  ]
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
      <div className="w-16 h-16 rounded-3xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center mb-6">
        <Star className="w-7 h-7 text-yellow-500" />
      </div>
      <h2 className="text-3xl font-bold text-yellow-500 mb-1">نور</h2>
      <p className="text-gray-400 text-sm mb-8">Your AI Islamic Scholar — ask anything</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg px-4">
        {suggestions.map((s, i) => (
          <motion.button
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => onNew(s)}
            className="text-left p-3 rounded-xl bg-gray-800/50 border border-gray-700 hover:border-yellow-500/40 hover:bg-gray-800 transition-all text-sm text-gray-300"
          >
            {s}
          </motion.button>
        ))}
      </div>
    </div>
  )
}

function ChatMessage({ msg, index }) {
  const [copied, setCopied] = useState(false)
  const isUser = msg.role === "user"

  const copy = () => {
    navigator.clipboard.writeText(msg.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}
    >
      {!isUser && (
        <div className="w-8 h-8 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center flex-shrink-0 mt-1">
          <Star className="w-3.5 h-3.5 text-yellow-500" />
        </div>
      )}

      <div className={`group max-w-[80%] ${isUser ? "items-end" : "items-start"} flex flex-col gap-1`}>
        <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
          isUser
            ? "bg-yellow-500 text-black rounded-tr-sm font-medium"
            : "bg-gray-800 border border-gray-700 text-gray-100 rounded-tl-sm"
        }`}>
          {isUser ? msg.content : <ReactMarkdown>{msg.content}</ReactMarkdown>}
        </div>

        {!isUser && (
          <button
            onClick={copy}
            className="text-xs text-gray-600 hover:text-yellow-500 opacity-0 group-hover:opacity-100 transition-all ml-1"
          >
            {copied ? "✓ Copied" : "Copy"}
          </button>
        )}
      </div>
    </motion.div>
  )
}

export default function App() {
  const [conversations, setConversations] = useState([])
  const [activeConv, setActiveConv] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [showScroll, setShowScroll] = useState(false)
  const scrollRef = useRef(null)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => { fetchConversations() }, [])
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }) }, [messages, loading])

  const handleScroll = () => {
    const el = scrollRef.current
    if (!el) return
    setShowScroll(el.scrollHeight - el.scrollTop - el.clientHeight > 120)
  }

  const fetchConversations = async () => {
    const res = await fetch("http://127.0.0.1:5000/api/conversations")
    const data = await res.json()
    setConversations(data)
  }

  const newConversation = async (prefill = "") => {
    const res = await fetch("http://127.0.0.1:5000/api/conversations", { method: "POST" })
    const data = await res.json()
    setActiveConv(data)
    setMessages([])
    await fetchConversations()
    if (prefill) {
      setInput(prefill)
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }

  const selectConversation = async (conv) => {
    setActiveConv(conv)
    const res = await fetch(`http://127.0.0.1:5000/api/conversations/${conv.id}/messages`)
    const data = await res.json()
    setMessages(data)
  }

  const deleteConversation = async (e, convId) => {
    e.stopPropagation()
    await fetch(`http://127.0.0.1:5000/api/conversations/${convId}`, { method: "DELETE" })
    if (activeConv?.id === convId) { setActiveConv(null); setMessages([]) }
    await fetchConversations()
  }

  const sendMessage = async (overrideInput) => {
    const content = overrideInput || input
    if (!content.trim()) return
    if (!activeConv) { await newConversation(); return }

    const userMessage = { role: "user", content }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setLoading(true)

    const res = await fetch(`http://127.0.0.1:5000/api/conversations/${activeConv.id}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: content }),
    })

    const data = await res.json()
    setMessages((prev) => [...prev, { role: "assistant", content: data.reply }])
    setLoading(false)
    await fetchConversations()
  }

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-white overflow-hidden">

      {/* Sidebar */}
      <div className="w-60 flex-shrink-0 bg-[#111111] border-r border-gray-800/50 flex flex-col">
        <div className="p-4 border-b border-gray-800/50">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
              <Star className="w-3.5 h-3.5 text-yellow-500" />
            </div>
            <span className="font-bold text-yellow-500 text-lg">نور</span>
          </div>
          <button
            onClick={() => newConversation()}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-black text-sm font-bold transition-all"
          >
            <Plus className="w-4 h-4" /> New Chat
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
          {conversations.length === 0 && (
            <p className="text-xs text-gray-600 text-center mt-4">No conversations yet</p>
          )}
          {conversations.map((conv) => (
            <div
              key={conv.id}
              onClick={() => selectConversation(conv)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer group text-sm transition-all ${
                activeConv?.id === conv.id
                  ? "bg-gray-800 text-white"
                  : "text-gray-500 hover:bg-gray-800/50 hover:text-gray-300"
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate flex-1 text-xs">{conv.title}</span>
              <button
                onClick={(e) => deleteConversation(e, conv.id)}
                className="hidden group-hover:flex text-gray-600 hover:text-red-400 transition-colors"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Topbar */}
        <div className="flex-shrink-0 flex items-center justify-between px-5 py-3 border-b border-gray-800/50 bg-[#0a0a0a]/80 backdrop-blur-xl">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-200">AI Islamic Scholar</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-gray-500">Online</span>
          </div>
        </div>

        {/* Messages or Empty */}
        {!activeConv ? (
          <EmptyState onNew={newConversation} />
        ) : (
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto relative"
          >
            <div className="sticky top-0 h-6 bg-gradient-to-b from-[#0a0a0a] to-transparent pointer-events-none z-10" />
            <div className="max-w-2xl mx-auto px-4 pb-6 space-y-5">
              <AnimatePresence initial={false}>
                {messages.map((msg, i) => <ChatMessage key={i} msg={msg} index={i} />)}
                {loading && <TypingIndicator key="typing" />}
              </AnimatePresence>
              <div ref={bottomRef} />
            </div>
            <ScrollToBottom visible={showScroll} onClick={() => bottomRef.current?.scrollIntoView({ behavior: "smooth" })} />
          </div>
        )}

        {/* Input */}
        {activeConv && (
          <div className="flex-shrink-0 px-4 pb-4">
            <div className="h-4 bg-gradient-to-t from-[#0a0a0a] to-transparent pointer-events-none" />
            <div className="max-w-2xl mx-auto flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Ask about Quran, Hadith, Fiqh..."
                className="flex-1 bg-gray-800/50 border border-gray-700 hover:border-gray-600 focus:border-yellow-500/50 text-white rounded-2xl px-4 py-3 text-sm outline-none transition-all placeholder-gray-600"
              />
              <button
                onClick={() => sendMessage()}
                disabled={loading}
                className="bg-yellow-500 hover:bg-yellow-400 disabled:opacity-40 text-black font-bold px-5 py-3 rounded-2xl text-sm transition-all"
              >
                Send
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}