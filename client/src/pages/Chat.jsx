import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Trash2, ChevronDown, Plus, MessageSquare, Star } from "lucide-react"
import { cn } from "../lib/utils"
import ChatMessage from "../components/chat/ChatMessage"

function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      className="flex gap-3"
    >
      <div className="w-8 h-8 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
        <Star className="w-3.5 h-3.5 text-primary" />
      </div>
      <div className="px-4 py-3.5 rounded-2xl rounded-tl-sm bg-card border border-border flex items-center gap-1.5">
        {[0, 150, 300].map((delay) => (
          <motion.div
            key={delay}
            className="w-1.5 h-1.5 rounded-full bg-primary/50"
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
          className="absolute bottom-4 right-4 w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center shadow-lg hover:border-primary/30 transition-colors"
        >
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
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
      <div className="w-16 h-16 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 gold-glow">
        <Star className="w-7 h-7 text-primary animate-float" />
      </div>
      <h2 className="font-amiri text-4xl text-primary mb-1">نور</h2>
      <p className="text-muted-foreground text-sm mb-8">Your AI Islamic Scholar — ask anything</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
        {suggestions.map((s, i) => (
          <motion.button
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => onNew(s)}
            className="text-left p-3 rounded-xl bg-card border border-border hover:border-primary/30 hover:bg-secondary transition-all text-sm text-muted-foreground hover:text-foreground"
          >
            {s}
          </motion.button>
        ))}
      </div>
    </div>
  )
}

export default function Chat() {
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
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, loading])

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
      await sendMessage(prefill, data)
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

  const sendMessage = async (overrideInput, convOverride) => {
    const content = overrideInput || input
    const conv = convOverride || activeConv
    if (!content.trim() || !conv) return

    const userMsg = { role: "user", content, timestamp: new Date().toISOString() }
    setMessages((prev) => [...prev, userMsg])
    setInput("")
    setLoading(true)

    const res = await fetch(`http://127.0.0.1:5000/api/conversations/${conv.id}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: content }),
    })

    const data = await res.json()
    setMessages((prev) => [...prev, { role: "assistant", content: data.reply, timestamp: new Date().toISOString() }])
    setLoading(false)
    await fetchConversations()
  }

  return (
    <div className="h-full flex flex-col">

      {/* Topbar */}
      <div className="flex-shrink-0 flex items-center justify-between px-5 py-3 border-b border-border bg-background/70 backdrop-blur-xl">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Star className="w-3.5 h-3.5 text-primary" />
          </div>
          <span className="text-sm font-semibold text-foreground">Nūr AI</span>
          <span className="text-xs text-muted-foreground font-amiri">عالِم</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-muted-foreground">Online</span>
          <button
            onClick={() => newConversation()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 border border-primary/20 text-primary text-xs font-medium transition-all"
          >
            <Plus className="w-3.5 h-3.5" /> New Chat
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 flex overflow-hidden">

        {/* Conversation sidebar */}
        <div className="w-56 border-r border-border flex-col bg-card/30 hidden md:flex">
          <div className="p-4 text-xs text-muted-foreground font-medium">Recent</div>
          <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
            {conversations.length === 0 && (
              <p className="text-xs text-muted-foreground text-center mt-4 px-3">No conversations yet</p>
            )}
            {conversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => selectConversation(conv)}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer group text-xs transition-all",
                  activeConv?.id === conv.id
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <MessageSquare className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="truncate flex-1">{conv.title}</span>
                <button
                  onClick={(e) => deleteConversation(e, conv.id)}
                  className="hidden group-hover:flex text-muted-foreground hover:text-destructive transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col min-w-0">
          {!activeConv ? (
            <EmptyState onNew={newConversation} />
          ) : (
            <>
              <div
                ref={scrollRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto relative"
              >
                <div className="sticky top-0 h-6 bg-gradient-to-b from-background to-transparent pointer-events-none z-10" />
                <div className="max-w-2xl mx-auto px-4 pb-6 space-y-5">
                  <AnimatePresence initial={false}>
                    {messages.map((msg, i) => (
                      <ChatMessage key={i} message={msg} />
                    ))}
                    {loading && <TypingIndicator key="typing" />}
                  </AnimatePresence>
                  <div ref={bottomRef} />
                </div>
                <ScrollToBottom
                  visible={showScroll}
                  onClick={() => bottomRef.current?.scrollIntoView({ behavior: "smooth" })}
                />
              </div>

              {/* Input */}
              <div className="flex-shrink-0 px-4 pb-4 pt-2">
                <div className="max-w-2xl mx-auto flex gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    placeholder="Ask about Quran, Hadith, Fiqh..."
                    className="flex-1 bg-card border border-border hover:border-primary/30 focus:border-primary/50 text-foreground rounded-2xl px-4 py-3 text-sm outline-none transition-all placeholder:text-muted-foreground"
                  />
                  <button
                    onClick={() => sendMessage()}
                    disabled={loading}
                    className="bg-primary hover:bg-primary/90 disabled:opacity-40 text-primary-foreground font-bold px-5 py-3 rounded-2xl text-sm transition-all"
                  >
                    Send
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}