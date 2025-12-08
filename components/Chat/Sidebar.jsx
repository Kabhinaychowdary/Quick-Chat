"use client"

import { useState } from "react"
import ConversationItem from "./ConversationItem"

export default function Sidebar({
  currentUser,
  conversations,
  selectedConversation,
  onSelectConversation,
  onNewChat,
  onNewGroup,
  onLogout,
  isOpen,
  onToggle,
  users,
}) {
  const [searchQuery, setSearchQuery] = useState("")
  const [showMenu, setShowMenu] = useState(false)

  const filteredConversations = conversations.filter((conv) => {
    const name = conv.type === "group" ? conv.name : users.find((u) => conv.participants.includes(u.id))?.name || ""
    return name.toLowerCase().includes(searchQuery.toLowerCase())
  })

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-20 md:hidden" onClick={onToggle} />}

      <div
        className={`
        fixed md:relative inset-y-0 left-0 z-30
        w-80 bg-sidebar border-r border-sidebar-border flex flex-col
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
      >
        {/* Header */}
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-primary rounded-xl flex items-center justify-center text-primary-foreground font-bold text-lg shadow-lg shadow-primary/20">
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="font-semibold text-sidebar-foreground">{currentUser.name}</h2>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 bg-online rounded-full online-pulse"></div>
                  <p className="text-xs text-online">Online</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-2.5 hover:bg-sidebar-accent rounded-xl transition"
              >
                <svg className="w-5 h-5 text-sidebar-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                  />
                </svg>
              </button>
              {showMenu && (
                <div className="absolute right-0 mt-2 w-52 bg-popover rounded-xl shadow-xl border border-border py-2 z-50">
                  <button
                    onClick={() => {
                      onNewChat()
                      setShowMenu(false)
                    }}
                    className="w-full px-4 py-2.5 text-left text-popover-foreground hover:bg-accent/50 flex items-center gap-3 transition"
                  >
                    <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                    New Chat
                  </button>
                  <button
                    onClick={() => {
                      onNewGroup()
                      setShowMenu(false)
                    }}
                    className="w-full px-4 py-2.5 text-left text-popover-foreground hover:bg-accent/50 flex items-center gap-3 transition"
                  >
                    <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    New Group
                  </button>
                  <hr className="my-2 border-border" />
                  <button
                    onClick={() => {
                      onLogout()
                      setShowMenu(false)
                    }}
                    className="w-full px-4 py-2.5 text-left text-destructive hover:bg-destructive/10 flex items-center gap-3 transition"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <svg
              className="w-5 h-5 text-muted-foreground absolute left-3.5 top-1/2 transform -translate-y-1/2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-sidebar-accent rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-sm text-sidebar-foreground placeholder:text-muted-foreground"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-3 flex gap-2">
          <button
            onClick={onNewChat}
            className="flex-1 bg-primary text-primary-foreground py-2.5 px-3 rounded-xl text-sm font-medium hover:opacity-90 transition flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Chat
          </button>
          <button
            onClick={onNewGroup}
            className="flex-1 bg-sidebar-accent text-sidebar-foreground py-2.5 px-3 rounded-xl text-sm font-medium hover:bg-accent transition flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            Group
          </button>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-sidebar-accent rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <p className="text-sm text-muted-foreground">No conversations yet</p>
              <p className="text-xs text-muted-foreground mt-1">Start a new chat to begin messaging</p>
            </div>
          ) : (
            filteredConversations.map((conversation) => (
              <ConversationItem
                key={conversation.id}
                conversation={conversation}
                isSelected={selectedConversation?.id === conversation.id}
                onClick={() => onSelectConversation(conversation)}
                currentUserId={currentUser.id}
                users={users}
              />
            ))
          )}
        </div>
      </div>
    </>
  )
}
