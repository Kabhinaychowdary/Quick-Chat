"use client"

import { useState } from "react"

export default function NewChatModal({ users, currentUser, onClose, onStartChat, onSendFriendRequest, friendRequests = [] }) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Check if user is a friend
  const isFriend = (userId) => {
    return currentUser.friends && currentUser.friends.includes(userId)
  }

  // Check if friend request is pending
  const hasPendingRequest = (userId) => {
    return friendRequests.some(
      req => (req.senderId === currentUser.id && req.receiverId === userId) ||
        (req.senderId === userId && req.receiverId === currentUser.id)
    )
  }

  const handleUserClick = (userId) => {
    if (isFriend(userId)) {
      onStartChat(userId)
    } else if (!hasPendingRequest(userId)) {
      onSendFriendRequest(userId)
    }
  }

  const getButtonText = (userId) => {
    if (isFriend(userId)) return "Start Chat"
    if (hasPendingRequest(userId)) return "Request Pending"
    return "Send Friend Request"
  }

  const getButtonClass = (userId) => {
    if (isFriend(userId)) return "bg-primary text-primary-foreground"
    if (hasPendingRequest(userId)) return "bg-muted text-muted-foreground cursor-not-allowed"
    return "bg-accent text-accent-foreground hover:bg-accent/80"
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-2xl w-full max-w-md max-h-[80vh] flex flex-col border border-border shadow-2xl">
        <div className="p-5 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-foreground">New Chat</h2>
            <button onClick={onClose} className="p-2 hover:bg-accent rounded-xl transition">
              <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 bg-input border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder:text-muted-foreground"
          />
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          {filteredUsers.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <p>No users found</p>
            </div>
          ) : (
            filteredUsers.map((user) => (
              <div
                key={user.id}
                className="w-full flex items-center justify-between gap-3 p-3 rounded-xl hover:bg-accent transition mb-1"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-primary-foreground font-bold shadow-lg shadow-primary/20">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{user.name}</h3>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleUserClick(user.id)}
                  disabled={hasPendingRequest(user.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${getButtonClass(user.id)}`}
                >
                  {getButtonText(user.id)}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
