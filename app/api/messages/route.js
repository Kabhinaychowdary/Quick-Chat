import { NextResponse } from 'next/server'
import { getMessagesByConversationId, createMessage, updateConversation } from '../../../lib/db'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const conversationId = searchParams.get('conversationId')

    if (!conversationId) {
      return NextResponse.json(
        { error: 'Conversation ID is required' },
        { status: 400 }
      )
    }

    
    const messages = await getMessagesByConversationId(conversationId)

    
    messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))

    return NextResponse.json({ messages })
  } catch (error) {
    console.error('Get messages error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const { conversationId, senderId, content } = await request.json()

    if (!conversationId || !senderId || !content) {
      return NextResponse.json(
        { error: 'Conversation ID, sender ID, and content are required' },
        { status: 400 }
      )
    }

    
    const newMessage = {
      id: `msg_${Date.now()}`,
      conversationId,
      senderId,
      content,
      timestamp: new Date().toISOString(),
      status: 'sent'
    }

    const createdMessage = await createMessage(newMessage)

    
    await updateConversation(conversationId, {
      lastMessage: content,
      lastMessageTime: newMessage.timestamp
    })

    return NextResponse.json({ message: createdMessage })
  } catch (error) {
    console.error('Create message error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
