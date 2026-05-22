import React, { useState } from 'react'
import { motion } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import { Star, Copy, Check } from 'lucide-react'
import { cn } from '../../lib/utils'

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button
      onClick={handleCopy}
      className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-foreground"
      title="Copy"
    >
      {copied
        ? <Check className="w-3.5 h-3.5 text-primary" />
        : <Copy className="w-3.5 h-3.5" />}
    </button>
  )
}

export default function ChatMessage({ message }) {
  const isUser = message.role === 'user'
  const time = message.timestamp
    ? new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : ''

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn("group flex gap-3", isUser ? "flex-row-reverse" : "flex-row")}
    >
      {/* Avatar */}
      <div className={cn(
        "w-8 h-8 rounded-2xl flex-shrink-0 flex items-center justify-center mt-0.5",
        isUser
          ? "bg-foreground/10 border border-border"
          : "bg-primary/10 border border-primary/20"
      )}>
        {isUser
          ? <span className="text-[11px] font-semibold text-foreground/60">You</span>
          : <Star className="w-3.5 h-3.5 text-primary" />}
      </div>

      {/* Bubble */}
      <div className={cn("flex flex-col max-w-[82%]", isUser ? "items-end" : "items-start")}>
        {isUser ? (
          <div className="px-4 py-3 rounded-2xl rounded-tr-sm bg-foreground/10 border border-border">
            <p className="text-sm leading-relaxed text-foreground">{message.content}</p>
          </div>
        ) : (
          <div className="px-4 py-3.5 rounded-2xl rounded-tl-sm bg-card border border-border relative">
            <div className="absolute top-2 right-2">
              <CopyButton text={message.content} />
            </div>
            <ReactMarkdown
              className="text-sm leading-relaxed pr-5"
              components={{
                p: ({ children }) => <p className="my-1.5 text-foreground/90 leading-[1.75]">{children}</p>,
                strong: ({ children }) => <strong className="font-semibold text-primary/90">{children}</strong>,
                em: ({ children }) => <em className="font-amiri not-italic text-primary/75 text-base">{children}</em>,
                ul: ({ children }) => <ul className="my-2 space-y-1.5 ml-1">{children}</ul>,
                ol: ({ children }) => <ol className="my-2 space-y-1.5 ml-4 list-decimal">{children}</ol>,
                li: ({ children }) => (
                  <li className="text-foreground/80 flex gap-2 items-start">
                    <span className="mt-2 w-1 h-1 rounded-full bg-primary/50 flex-shrink-0" />
                    <span>{children}</span>
                  </li>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="my-3 pl-4 border-l-2 border-primary/30 text-foreground/70 italic">{children}</blockquote>
                ),
                h1: ({ children }) => <h1 className="text-base font-bold text-foreground mt-3 mb-1">{children}</h1>,
                h2: ({ children }) => <h2 className="text-sm font-bold text-foreground mt-3 mb-1">{children}</h2>,
                h3: ({ children }) => <h3 className="text-sm font-semibold text-primary/80 mt-2 mb-0.5">{children}</h3>,
                hr: () => <div className="my-3 border-t border-border/50" />,
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        )}
        <span className="text-[10px] text-muted-foreground/50 mt-1.5 px-1">{time}</span>
      </div>
    </motion.div>
  )
}