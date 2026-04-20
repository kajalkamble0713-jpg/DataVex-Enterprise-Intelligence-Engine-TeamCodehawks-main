"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, Bot, Minimize2, Maximize2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const CHAT_SYS = `You are VEXAR, the AI assistant for DataVex Prospect Intelligence Engine — 
an enterprise-grade multi-agent AI system for sales and strategy teams. 
Help users analyse companies, generate outreach, calculate ROI, and understand 
AI agent reasoning. Be concise, strategic, and data-driven.`

interface Message {
  role: "user" | "assistant"
  content: string
  id: number
  streaming?: boolean
}

const QUICK_ACTIONS = [
  "Analyze a company for me",
  "Generate outreach email",
  "Calculate ROI for DataVex",
  "How do AI agents work?"
]

export function VexarChatbot() {
  const [msgs, setMsgs] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm VEXAR, your AI assistant for DataVex Prospect Intelligence Engine. I can help you analyze companies, generate outreach, calculate ROI, and understand our multi-agent AI reasoning. How can I assist you today?",
      id: Date.now()
    }
  ])
  const [inp, setInp] = useState("")
  const [busy, setBusy] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  
  const inputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [msgs])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const renderBoldText = (content: string) => {
    return content.split(/(\*\*[^*]+\*\*)/).map((s, i) =>
      s.startsWith("**") && s.endsWith("**")
        ? <strong key={i} className="text-indigo font-semibold">{s.slice(2, -2)}</strong>
        : s
    )
  }

  const send = useCallback(async () => {
    if (!inp.trim() || busy) return

    const userMsg: Message = {
      role: "user",
      content: inp.trim(),
      id: Date.now()
    }

    setMsgs(prev => [...prev, userMsg])
    setInp("")
    setBusy(true)

    try {
      const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY
      
      if (!apiKey || apiKey === 'your_openai_api_key_here') {
        throw new Error('API key not configured')
      }

      const history = [...msgs, userMsg].map(m => ({
        role: m.role,
        content: m.content.replace(/\*\*/g, "")
      }))

      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4",
          max_tokens: 1000,
          messages: [
            { role: "system", content: CHAT_SYS },
            ...history
          ]
        })
      })

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error('Invalid API key')
        } else if (res.status === 429) {
          throw new Error('API rate limit exceeded')
        } else {
          throw new Error(`API call failed: ${res.status}`)
        }
      }

      const data = await res.json()
      const text = data.choices?.[0]?.message?.content || ""

      // Add blank message immediately for streaming effect
      setMsgs(prev => [...prev, { 
        role: "assistant", 
        content: "", 
        id: Date.now() + 1, 
        streaming: true 
      }])

      // Typewriter effect
      let i = 0
      const ti = setInterval(() => {
        i += 4
        setMsgs(prev => {
          const updated = [...prev]
          const lastMsg = updated[updated.length - 1]
          lastMsg.content = text.slice(0, i)
          lastMsg.streaming = i < text.length
          return updated
        })
        if (i >= text.length) {
          clearInterval(ti)
        }
      }, 18)

    } catch (error: any) {
      let errorMessage = "I apologize, but I'm having trouble processing your request right now. Please try again in a moment."
      
      if (error.message === 'API key not configured') {
        errorMessage = "The AI assistant is currently unavailable. Please contact support for assistance."
      } else if (error.message === 'Invalid API key') {
        errorMessage = "The AI assistant is currently unavailable. Please contact support for assistance."
      } else if (error.message === 'API rate limit exceeded') {
        errorMessage = "I'm receiving a high volume of requests right now. Please wait a moment before asking another question."
      }
      
      setMsgs(prev => [...prev, {
        role: "assistant",
        content: errorMessage,
        id: Date.now() + 1
      }])
    } finally {
      setBusy(false)
    }
  }, [inp, busy, msgs])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  const handleQuickAction = (action: string) => {
    setInp(action)
    inputRef.current?.focus()
  }

  if (!isOpen) {
    return (
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full shadow-lg magnetic-button premium-card bg-gradient-to-r from-indigo to-teal hover:from-indigo/90 hover:to-teal/90"
        >
          <Bot className="h-6 w-6" />
        </Button>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.8, opacity: 0, y: 20 }}
      className="fixed bottom-6 right-6 z-50 w-96 h-[500px] glass-strong rounded-xl border border-indigo/20 shadow-2xl flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-indigo/20 glass-morphism rounded-t-xl">
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <Bot className="h-5 w-5 text-indigo" />
          </motion.div>
          <h3 className="font-semibold text-gradient-cyber">VEXAR Assistant</h3>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMinimized(!isMinimized)}
            className="h-8 w-8"
          >
            {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <AnimatePresence>
              {msgs.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={cn(
                    "flex gap-3",
                    msg.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  {msg.role === "assistant" && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo to-teal flex items-center justify-center flex-shrink-0">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                  )}
                  <div
                    className={cn(
                      "max-w-[80%] rounded-lg p-3",
                      msg.role === "user"
                        ? "bg-indigo text-white"
                        : "glass-morphism border border-indigo/20"
                    )}
                  >
                    <div className="text-sm leading-relaxed">
                      {renderBoldText(msg.content)}
                      {msg.streaming && (
                        <motion.span
                          animate={{ opacity: [1, 0, 1] }}
                          transition={{ duration: 1, repeat: Infinity }}
                          className="ml-1 text-indigo"
                        >
                          ▊
                        </motion.span>
                      )}
                    </div>
                  </div>
                  {msg.role === "user" && (
                    <div className="w-8 h-8 rounded-full bg-indigo flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm font-semibold">U</span>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
            
            {/* Typing Indicator */}
            {busy && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3 justify-start"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo to-teal flex items-center justify-center flex-shrink-0">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div className="glass-morphism border border-indigo/20 rounded-lg p-3">
                  <div className="flex gap-1">
                    {[0, 1, 2].map(i => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 bg-indigo rounded-full"
                        animate={{ 
                          scale: [1, 1.2, 1],
                          opacity: [0.5, 1, 0.5]
                        }}
                        transition={{
                          duration: 1.2,
                          repeat: Infinity,
                          delay: i * 0.2
                        }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          <div className="px-4 py-2 border-t border-indigo/20">
            <div className="flex flex-wrap gap-1">
              {QUICK_ACTIONS.map((action, i) => (
                <Button
                  key={i}
                  variant="ghost"
                  size="sm"
                  onClick={() => handleQuickAction(action)}
                  className="text-xs h-7 px-2 glass-morphism hover:bg-indigo/10"
                >
                  {action}
                </Button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="p-4 border-t border-indigo/20">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inp}
                onChange={(e) => setInp(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask VEXAR anything..."
                className="flex-1 h-10 px-3 rounded-lg glass-morphism border border-indigo/20 bg-indigo/5 text-sm focus:border-indigo/50 focus:ring-2 focus:ring-indigo/20 focus:bg-indigo/10 outline-none transition-all"
                disabled={busy}
              />
              <Button
                onClick={send}
                disabled={!inp.trim() || busy}
                className="h-10 w-10 rounded-lg magnetic-button premium-card bg-gradient-to-r from-indigo to-teal hover:from-indigo/90 hover:to-teal/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      )}
    </motion.div>
  )
}
