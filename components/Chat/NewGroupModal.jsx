"use client"

import { useState } from "react"

export default function NewGroupModal({ users, onClose, onCreateGroup }) {
  const [groupName, setGroupName] = useState("")
  const [selectedUsers, setSelectedUsers] = useState([])
  const [searchQuery, setSearchQuery] = useState("")

  const filteredUsers = users.filter((user) => user.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const toggleUser = (userId) => {
    setSelectedUsers((prev) => (prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]))
  }

  const handleCreate = () => {
    if (groupName.trim() && selectedUsers.length > 0) {
      onCreateGroup(groupName.trim(), selectedUsers)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-2xl w-full max-w-md max-h-[80vh] flex flex-col border border-border shadow-2xl">
        <div className="p-5 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-foreground">New Group</h2>
            <button onClick={onClose} className="p-2 hover:bg-accent rounded-xl transition">
              <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <input
            type="text"
            placeholder="Group name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="w-full px-4 py-3 bg-input border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary mb-3 text-foreground placeholder:text-muted-foreground"
          />

          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 bg-input border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder:text-muted-foreground"
          />
        </div>

        {selectedUsers.length > 0 && (
          <div className="px-5 py-3 border-b border-border">
            <p className="text-sm text-muted-foreground mb-2">
              {selectedUsers.length} user{selectedUsers.length > 1 ? "s" : ""} selected
            </p>
            <div className="flex flex-wrap gap-2">
              {selectedUsers.map((userId) => {
                const user = users.find((u) => u.id === userId)
                return (
                  <span
                    key={userId}
                    className="bg-primary/10 text-primary px-3 py-1.5 rounded-lg text-sm flex items-center gap-1.5 font-medium"
                  >
                    {user?.name}
                    <button onClick={() => toggleUser(userId)} className="ml-1 hover:text-primary/70">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                )
              })}
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-3">
          {filteredUsers.map((user) => (
            <button
              key={user.id}
              onClick={() => toggleUser(user.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition text-left mb-1 ${
                selectedUsers.includes(user.id) ? "bg-primary/10 border border-primary/20" : "hover:bg-accent"
              }`}
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold shadow-lg ${
                  selectedUsers.includes(user.id) ? "bg-primary shadow-primary/20" : "bg-muted-foreground shadow-none"
                }`}
              >
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">{user.name}</h3>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
              {selectedUsers.includes(user.id) && (
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-primary-foreground" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>

        <div className="p-4 border-t border-border">
          <button
            onClick={handleCreate}
            disabled={!groupName.trim() || selectedUsers.length === 0}
            className="w-full bg-primary text-primary-foreground py-3.5 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/25"
          >
            Create Group
          </button>
        </div>
      </div>
    </div>
  )
}
