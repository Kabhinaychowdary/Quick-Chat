"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { getUserSession, clearUserSession } from "@/lib/session"
import Sidebar from "../../components/Chat/Sidebar"
import ChatWindow from "../../components/Chat/ChatWindow"
import EmptyState from "../../components/Chat/EmptyState"
import NewChatModal from "../../components/Chat/NewChatModal"
import NewGroupModal from "../../components/Chat/NewGroupModal"
import FriendRequestsList from "../../components/Chat/FriendRequestsList"

export default function ChatPage() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState(null)
  const [conversations, setConversations] = useState([])
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [users, setUsers] = useState([])
  const [friendRequests, setFriendRequests] = useState({ sent: [], received: [] })
  const [showNewChat, setShowNewChat] = useState(false)
  const [showNewGroup, setShowNewGroup] = useState(false)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const pollingRef = useRef(null)

  useEffect(() => {
    const user = getUserSession()
    if (!user) {
      router.push("/login")
      return
    }
    setCurrentUser(user)
  }, [router])

  useEffect(() => {
    if (currentUser) {
      fetchConversations()
      fetchUsers()
      fetchFriendRequests()

      pollingRef.current = setInterval(() => {
        fetchConversations()
        fetchFriendRequests()
        if (selectedConversation) {
          fetchMessages(selectedConversation.id)
        }
      }, 3000)

      return () => {
        if (pollingRef.current) {
          clearInterval(pollingRef.current)
        }
      }
    }
  }, [currentUser, selectedConversation])

  const fetchConversations = async () => {
    try {
      const response = await fetch(`/api/conversations?userId=${currentUser.id}`)
      const data = await response.json()
      setConversations(data.conversations || [])
      setLoading(false)
    } catch (err) {
      console.error("Error fetching conversations:", err)
      setLoading(false)
    }
  }

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users")
      const data = await response.json()
      setUsers(data.users.filter((u) => u.id !== currentUser.id))
    } catch (err) {
      console.error("Error fetching users:", err)
    }
  }

  const fetchFriendRequests = async () => {
    try {
      const response = await fetch(`/api/friend-requests?userId=${currentUser.id}`)
      const data = await response.json()

      // Fetch all users first to get names
      const usersResponse = await fetch("/api/users")
      const usersData = await usersResponse.json()
      const allUsers = usersData.users || []

      // Enrich requests with sender names
      const enrichedReceived = data.received.map((req) => {
        const sender = allUsers.find(u => u.id === req.senderId)
        return { ...req, senderName: sender?.name || 'Unknown User' }
      })

      setFriendRequests({ sent: data.sent || [], received: enrichedReceived || [] })
    } catch (err) {
      console.error("Error fetching friend requests:", err)
    }
  }

  const fetchMessages = async (conversationId) => {
    try {
      const response = await fetch(`/api/messages?conversationId=${conversationId}`)
      const data = await response.json()
      setMessages(data.messages || [])
    } catch (err) {
      console.error("Error fetching messages:", err)
    }
  }

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation)
    fetchMessages(conversation.id)
    if (window.innerWidth < 768) {
      setSidebarOpen(false)
    }
  }

  const handleSendMessage = async (content) => {
    if (!content.trim() || !selectedConversation) return

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: selectedConversation.id,
          senderId: currentUser.id,
          content: content.trim(),
        }),
      })

      if (response.ok) {
        fetchMessages(selectedConversation.id)
        fetchConversations()
      }
    } catch (err) {
      console.error("Error sending message:", err)
    }
  }

  const handleSendFriendRequest = async (userId) => {
    try {
      const response = await fetch("/api/friend-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderId: currentUser.id,
          receiverId: userId,
        }),
      })

      if (response.ok) {
        fetchFriendRequests()
        setShowNewChat(false)
        alert("Friend request sent!")
      } else {
        const data = await response.json()
        alert(data.error || "Failed to send friend request")
      }
    } catch (err) {
      console.error("Error sending friend request:", err)
      alert("Failed to send friend request")
    }
  }

  const handleAcceptFriendRequest = async (requestId) => {
    try {
      // Get the friend request details first
      const allRequests = await fetch(`http://localhost:3001/friendRequests`)
      const requestsData = await allRequests.json()
      const request = requestsData.find(r => r.id === requestId)

      if (!request) {
        alert("Friend request not found")
        return
      }

      // Update request status to accepted
      await fetch(`http://localhost:3001/friendRequests/${requestId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "accepted", updatedAt: new Date().toISOString() }),
      })

      // Get both users
      const sender = await fetch(`http://localhost:3001/users/${request.senderId}`).then(r => r.json())
      const receiver = await fetch(`http://localhost:3001/users/${request.receiverId}`).then(r => r.json())

      // Add friends to each other
      const senderFriends = sender.friends || []
      const receiverFriends = receiver.friends || []

      if (!senderFriends.includes(request.receiverId)) {
        senderFriends.push(request.receiverId)
      }
      if (!receiverFriends.includes(request.senderId)) {
        receiverFriends.push(request.senderId)
      }

      // Update both users
      await fetch(`http://localhost:3001/users/${request.senderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ friends: senderFriends }),
      })

      await fetch(`http://localhost:3001/users/${request.receiverId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ friends: receiverFriends }),
      })

      // Refresh data
      fetchFriendRequests()
      fetchUsers()

      // Update current user
      const userResponse = await fetch(`http://localhost:3001/users?email=${currentUser.email}`)
      const userData = await userResponse.json()
      if (userData && userData[0]) {
        setCurrentUser(userData[0])
      }

      alert("Friend request accepted!")
    } catch (err) {
      console.error("Error accepting friend request:", err)
      alert("Failed to accept friend request")
    }
  }

  const handleRejectFriendRequest = async (requestId) => {
    try {
      const response = await fetch(`/api/friend-requests/${requestId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "rejected" }),
      })

      if (response.ok) {
        fetchFriendRequests()
      }
    } catch (err) {
      console.error("Error rejecting friend request:", err)
    }
  }

  const handleStartChat = async (userId) => {
    try {
      const response = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "direct",
          participants: [currentUser.id, userId],
        }),
      })

      const data = await response.json()
      if (response.ok) {
        setShowNewChat(false)
        await fetchConversations()
        setSelectedConversation(data.conversation)
        fetchMessages(data.conversation.id)
      } else {
        alert(data.error || "You must be friends to start a chat")
      }
    } catch (err) {
      console.error("Error starting chat:", err)
    }
  }

  const handleCreateGroup = async (name, memberIds) => {
    try {
      const response = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "group",
          name: name,
          participants: [currentUser.id, ...memberIds],
        }),
      })

      const data = await response.json()
      if (response.ok) {
        setShowNewGroup(false)
        await fetchConversations()
        setSelectedConversation(data.conversation)
        fetchMessages(data.conversation.id)
      }
    } catch (err) {
      console.error("Error creating group:", err)
    }
  }

  const handleLogout = () => {
    clearUserSession()
    router.push("/login")
  }

  if (!currentUser || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-16 h-16 relative mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
            <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
          </div>
          <h2 className="text-xl font-semibold text-foreground">QuickChat</h2>
          <p className="mt-2 text-muted-foreground">Loading your conversations...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex bg-background overflow-hidden">
      <div className="flex-1 flex flex-col">
        {/* Friend Requests Section */}
        {friendRequests.received.length > 0 && (
          <FriendRequestsList
            requests={friendRequests.received}
            onAccept={handleAcceptFriendRequest}
            onReject={handleRejectFriendRequest}
          />
        )}

        <div className="flex-1 flex">
          <Sidebar
            currentUser={currentUser}
            conversations={conversations}
            selectedConversation={selectedConversation}
            onSelectConversation={handleSelectConversation}
            onNewChat={() => setShowNewChat(true)}
            onNewGroup={() => setShowNewGroup(true)}
            onLogout={handleLogout}
            isOpen={sidebarOpen}
            onToggle={() => setSidebarOpen(!sidebarOpen)}
            users={users}
          />

          <div className="flex-1 flex flex-col">
            {selectedConversation ? (
              <ChatWindow
                conversation={selectedConversation}
                messages={messages}
                currentUser={currentUser}
                onSendMessage={handleSendMessage}
                users={users}
                onBack={() => setSidebarOpen(true)}
              />
            ) : (
              <EmptyState onNewChat={() => setShowNewChat(true)} />
            )}
          </div>
        </div>
      </div>

      {showNewChat && (
        <NewChatModal
          users={users}
          currentUser={currentUser}
          friendRequests={[...friendRequests.sent, ...friendRequests.received]}
          onClose={() => setShowNewChat(false)}
          onStartChat={handleStartChat}
          onSendFriendRequest={handleSendFriendRequest}
        />
      )}

      {showNewGroup && (
        <NewGroupModal users={users} onClose={() => setShowNewGroup(false)} onCreateGroup={handleCreateGroup} />
      )}
    </div>
  )
}
