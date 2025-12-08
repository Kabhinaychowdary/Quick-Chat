import { NextResponse } from 'next/server'
import { getConversationsByUserId, createConversation, areFriends } from '../../../lib/db'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

  
    const conversations = await getConversationsByUserId(userId)

    
    conversations.sort((a, b) =>
      new Date(b.lastMessageTime) - new Date(a.lastMessageTime)
    )

    return NextResponse.json({ conversations })
  } catch (error) {
    console.error('Get conversations error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const { type, name, participants } = await request.json()

    if (!type || !participants || !Array.isArray(participants) || participants.length < 2) {
      return NextResponse.json(
        { error: 'Type and at least 2 participants are required' },
        { status: 400 }
      )
    }

    
    if (type === 'direct' && participants.length === 2) {
      const [user1, user2] = participants
      const friends = await areFriends(user1, user2)

      if (!friends) {
        return NextResponse.json(
          { error: 'Users must be friends to start a conversation. Please send a friend request first.' },
          { status: 403 }
        )
      }
    }

    
    const newConversation = {
      id: `conv_${Date.now()}`,
      type,
      name: type === 'group' ? name : null,
      participants,
      createdAt: new Date().toISOString(),
      lastMessage: null,
      lastMessageTime: new Date().toISOString(),
      unreadCount: 0
    }

    const createdConversation = await createConversation(newConversation)

    return NextResponse.json({ conversation: createdConversation })
  } catch (error) {
    console.error('Create conversation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
