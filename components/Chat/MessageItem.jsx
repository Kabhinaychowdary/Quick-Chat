"use client"

export default function MessageItem({ message, isOwn, sender, showAvatar, isGroup }) {
  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"} message-animate`}>
      <div className={`flex gap-2.5 max-w-[75%] ${isOwn ? "flex-row-reverse" : "flex-row"}`}>
        {!isOwn && showAvatar && (
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-accent-foreground text-sm font-bold flex-shrink-0 shadow">
            {sender?.name?.charAt(0).toUpperCase() || "?"}
          </div>
        )}
        {!isOwn && !showAvatar && <div className="w-8 flex-shrink-0" />}

        <div>
          {!isOwn && showAvatar && isGroup && (
            <p className="text-xs text-muted-foreground mb-1.5 ml-1 font-medium">{sender?.name}</p>
          )}
          <div
            className={`px-4 py-2.5 rounded-2xl ${
              isOwn
                ? "bg-message-sent text-white rounded-br-md shadow-lg shadow-message-sent/20"
                : "bg-message-received text-foreground rounded-bl-md border border-border"
            }`}
          >
            <p className="text-sm break-words leading-relaxed">{message.content}</p>
          </div>
          <p className={`text-xs text-muted-foreground mt-1.5 ${isOwn ? "text-right" : "text-left"} px-1`}>
            {formatTime(message.timestamp)}
          </p>
        </div>
      </div>
    </div>
  )
}
