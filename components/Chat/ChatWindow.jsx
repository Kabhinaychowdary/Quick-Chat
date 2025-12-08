"use client"

import { useState, useRef, useEffect } from "react"
import MessageItem from "./MessageItem"

export default function ChatWindow({ conversation, messages, currentUser, onSendMessage, users, onBack }) {
  const [newMessage, setNewMessage] = useState("")
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (newMessage.trim()) {
      onSendMessage(newMessage)
      setNewMessage("")
    }
  }

  const getConversationName = () => {
    if (conversation.type === "group") {
      return conversation.name
    }
    const otherUserId = conversation.participants.find((id) => id !== currentUser.id)
    const otherUser = users.find((u) => u.id === otherUserId)
    return otherUser?.name || "Unknown User"
  }

  const getParticipantCount = () => {
    return conversation.participants.length
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 py-3.5 flex items-center gap-3 shadow-sm">
        <button onClick={onBack} className="md:hidden p-2 hover:bg-accent rounded-xl transition">
          <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div
          className={`w-11 h-11 ${conversation.type === "group" ? "bg-accent" : "bg-primary"} rounded-xl flex items-center justify-center text-white shadow-lg ${conversation.type === "group" ? "shadow-accent/20" : "shadow-primary/20"}`}
        >
          {conversation.type === "group" ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          ) : (
            <span className="font-bold">{getConversationName().charAt(0).toUpperCase()}</span>
          )}
        </div>

        <div className="flex-1">
          <h2 className="font-semibold text-foreground">{getConversationName()}</h2>
          <div className="flex items-center gap-1.5">
            {conversation.type === "group" ? (
              <p className="text-xs text-muted-foreground">{getParticipantCount()} members</p>
            ) : (
              <>
                <div className="w-1.5 h-1.5 bg-online rounded-full"></div>
                <p className="text-xs text-online">Online</p>
              </>
            )}
          </div>
        </div>

        <button className="p-2.5 hover:bg-accent rounded-xl transition">
          <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
            />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 message-container">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 bg-card rounded-2xl flex items-center justify-center mx-auto mb-4 border border-border">
                <svg className="w-10 h-10 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <p className="text-foreground font-medium">No messages yet</p>
              <p className="text-sm text-muted-foreground mt-1">Send a message to start the conversation</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((message, index) => (
              <MessageItem
                key={message.id}
                message={message}
                isOwn={message.senderId === currentUser.id}
                sender={users.find((u) => u.id === message.senderId) || currentUser}
                showAvatar={index === 0 || messages[index - 1]?.senderId !== message.senderId}
                isGroup={conversation.type === "group"}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Message Input */}
      <div className="bg-card border-t border-border p-4">
        <form onSubmit={handleSubmit} className="flex items-center gap-3">
          <button type="button" className="p-2.5 hover:bg-accent rounded-xl transition text-muted-foreground">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
              />
            </svg>
          </button>

          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-3 bg-input border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder:text-muted-foreground"
          />

          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="p-3 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/25"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  )
}
