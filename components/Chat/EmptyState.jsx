"use client"

export default function EmptyState({ onNewChat }) {
  return (
    <div className="flex-1 flex items-center justify-center bg-background">
      <div className="text-center max-w-md px-4">
        <div className="w-28 h-28 bg-card rounded-3xl flex items-center justify-center mx-auto mb-8 border border-border shadow-xl">
          <svg className="w-14 h-14 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-foreground mb-3">Welcome to QuickChat</h2>
        <p className="text-muted-foreground mb-8 text-lg">
          Select a conversation from the sidebar or start a new chat to begin messaging.
        </p>
        <button
          onClick={onNewChat}
          className="bg-primary text-primary-foreground px-8 py-4 rounded-xl font-semibold hover:opacity-90 transition inline-flex items-center gap-2 shadow-xl shadow-primary/25"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Start New Chat
        </button>
      </div>
    </div>
  )
}
