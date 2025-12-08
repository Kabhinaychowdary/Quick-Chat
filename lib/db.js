const JSON_SERVER_URL = process.env.JSON_SERVER_URL || 'http://localhost:3001'

// Helper function to make API calls to JSON Server
async function apiCall(endpoint, options = {}) {
  try {
    const response = await fetch(`${JSON_SERVER_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    })

    if (!response.ok) {
      throw new Error(`API call failed: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error('API call error:', error)
    throw error
  }
}

// Read all data from JSON Server
export async function readData() {
  try {
    const [users, conversations, messages, friendRequests] = await Promise.all([
      apiCall('/users'),
      apiCall('/conversations'),
      apiCall('/messages'),
      apiCall('/friendRequests'),
    ])

    return {
      users,
      conversations,
      messages,
      friendRequests,
    }
  } catch (error) {
    console.error('Error reading data:', error)
    throw error
  }
}

// Write data to JSON Server (not typically used, prefer specific CRUD operations)
export async function writeData(newData) {
  // This function is kept for backward compatibility but not recommended
  // Use specific CRUD operations instead
  console.warn('writeData is deprecated. Use specific CRUD operations instead.')
  return true
}

// User operations
export async function getUsers() {
  return await apiCall('/users')
}

export async function getUserById(id) {
  return await apiCall(`/users/${id}`)
}

export async function getUserByEmail(email) {
  const users = await apiCall(`/users?email=${encodeURIComponent(email)}`)
  return users[0] || null
}

export async function createUser(userData) {
  return await apiCall('/users', {
    method: 'POST',
    body: JSON.stringify(userData),
  })
}

export async function updateUser(id, userData) {
  return await apiCall(`/users/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(userData),
  })
}

export async function deleteUser(id) {
  return await apiCall(`/users/${id}`, {
    method: 'DELETE',
  })
}

// Conversation operations
export async function getConversations() {
  return await apiCall('/conversations')
}

export async function getConversationById(id) {
  return await apiCall(`/conversations/${id}`)
}

export async function getConversationsByUserId(userId) {
  const conversations = await apiCall('/conversations')
  return conversations.filter(conv =>
    conv.participants.includes(userId)
  )
}

export async function createConversation(conversationData) {
  return await apiCall('/conversations', {
    method: 'POST',
    body: JSON.stringify(conversationData),
  })
}

export async function updateConversation(id, conversationData) {
  return await apiCall(`/conversations/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(conversationData),
  })
}

export async function deleteConversation(id) {
  return await apiCall(`/conversations/${id}`, {
    method: 'DELETE',
  })
}

// Message operations
export async function getMessages() {
  return await apiCall('/messages')
}

export async function getMessageById(id) {
  return await apiCall(`/messages/${id}`)
}

export async function getMessagesByConversationId(conversationId) {
  return await apiCall(`/messages?conversationId=${conversationId}`)
}

export async function createMessage(messageData) {
  return await apiCall('/messages', {
    method: 'POST',
    body: JSON.stringify(messageData),
  })
}

export async function updateMessage(id, messageData) {
  return await apiCall(`/messages/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(messageData),
  })
}

export async function deleteMessage(id) {
  return await apiCall(`/messages/${id}`, {
    method: 'DELETE',
  })
}

// Friend Request operations
export async function getFriendRequests(userId) {
  const allRequests = await apiCall('/friendRequests')

  return {
    sent: allRequests.filter(req => req.senderId === userId),
    received: allRequests.filter(req => req.receiverId === userId && req.status === 'pending')
  }
}

export async function createFriendRequest(senderId, receiverId) {
  // Check if request already exists
  const allRequests = await apiCall('/friendRequests')
  const existing = allRequests.find(req =>
    (req.senderId === senderId && req.receiverId === receiverId) ||
    (req.senderId === receiverId && req.receiverId === senderId)
  )

  if (existing) {
    throw new Error('Friend request already exists')
  }

  const newRequest = {
    id: `freq_${Date.now()}`,
    senderId,
    receiverId,
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }

  return await apiCall('/friendRequests', {
    method: 'POST',
    body: JSON.stringify(newRequest),
  })
}

export async function updateFriendRequest(id, status) {
  try {
    const request = await apiCall(`/friendRequests/${id}`)

    if (!request) {
      throw new Error('Friend request not found')
    }

    // Update request status
    const updatedRequest = await apiCall(`/friendRequests/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        status,
        updatedAt: new Date().toISOString()
      }),
    })

    // If accepted, add to friends list
    if (status === 'accepted') {
      try {
        await addFriend(request.senderId, request.receiverId)
        await addFriend(request.receiverId, request.senderId)
      } catch (err) {
        console.error('Error adding friends:', err)
        // Continue even if adding friends fails
      }
    }

    return updatedRequest
  } catch (error) {
    console.error('Update friend request error in db.js:', error)
    throw error
  }
}

export async function deleteFriendRequest(id) {
  return await apiCall(`/friendRequests/${id}`, {
    method: 'DELETE',
  })
}

// Friend operations
export async function addFriend(userId, friendId) {
  const user = await getUserById(userId)

  if (!user.friends) {
    user.friends = []
  }

  if (!user.friends.includes(friendId)) {
    user.friends.push(friendId)
    await updateUser(userId, { friends: user.friends })
  }
}

export async function removeFriend(userId, friendId) {
  const user = await getUserById(userId)

  if (user.friends) {
    user.friends = user.friends.filter(id => id !== friendId)
    await updateUser(userId, { friends: user.friends })
  }
}

export async function areFriends(userId, friendId) {
  const user = await getUserById(userId)
  return user.friends && user.friends.includes(friendId)
}

export async function getFriends(userId) {
  const user = await getUserById(userId)

  if (!user.friends || user.friends.length === 0) {
    return []
  }

  const allUsers = await getUsers()
  return allUsers.filter(u => user.friends.includes(u.id))
}
