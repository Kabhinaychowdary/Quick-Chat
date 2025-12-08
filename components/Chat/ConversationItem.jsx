"use client"

export default function ConversationItem({ conversation, isSelected, onClick, currentUserId, users }) {
  const getConversationName = () => {
    if (conversation.type === "group") {
      return conversation.name
    }
    const otherUserId = conversation.participants.find((id) => id !== currentUserId)
    const otherUser = users.find((u) => u.id === otherUserId)
    return otherUser?.name || "Unknown User"
  }

  const getAvatar = () => {
    if (conversation.type === "group") {
      return (
        <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center text-accent-foreground shadow-lg shadow-accent/20">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </div>
      )
    }
    const name = getConversationName()
    const colors = [
      "bg-primary shadow-primary/20",
      "bg-accent shadow-accent/20",
      "bg-orange-500 shadow-orange-500/20",
      "bg-pink-500 shadow-pink-500/20",
      "bg-cyan-500 shadow-cyan-500/20",
    ]
    const colorIndex = name.charCodeAt(0) % colors.length
    return (
      <div
        className={`w-12 h-12 ${colors[colorIndex]} rounded-xl flex items-center justify-center text-white font-bold shadow-lg`}
      >
        {name.charAt(0).toUpperCase()}
      </div>
    )
  }

  const formatTime = (timestamp) => {
    if (!timestamp) return ""
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now - date

    if (diff < 86400000) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    } else if (diff < 604800000) {
      return date.toLocaleDateString([], { weekday: "short" })
    }
    return date.toLocaleDateString([], { month: "short", day: "numeric" })
  }

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 p-3 mx-2 my-1 cursor-pointer transition rounded-xl ${
        isSelected ? "bg-primary/10 border border-primary/20" : "hover:bg-sidebar-accent"
      }`}
    >
      {getAvatar()}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h3 className={`font-semibold truncate ${isSelected ? "text-primary" : "text-sidebar-foreground"}`}>
            {getConversationName()}
          </h3>
          <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">
            {formatTime(conversation.lastMessageTime)}
          </span>
        </div>
        <p className="text-sm text-muted-foreground truncate mt-0.5">{conversation.lastMessage || "No messages yet"}</p>
      </div>
      {conversation.unreadCount > 0 && (
        <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center shadow-lg shadow-primary/30">
          <span className="text-xs text-primary-foreground font-bold">{conversation.unreadCount}</span>
        </div>
      )}
    </div>
  )
}
