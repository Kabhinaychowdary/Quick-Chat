import { NextResponse } from 'next/server'
import { getFriendRequests, createFriendRequest, updateFriendRequest, deleteFriendRequest } from '../../../lib/db'

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

        const requests = await getFriendRequests(userId)

        return NextResponse.json(requests)
    } catch (error) {
        console.error('Get friend requests error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

export async function POST(request) {
    try {
        const { senderId, receiverId } = await request.json()

        if (!senderId || !receiverId) {
            return NextResponse.json(
                { error: 'Sender ID and Receiver ID are required' },
                { status: 400 }
            )
        }

        if (senderId === receiverId) {
            return NextResponse.json(
                { error: 'Cannot send friend request to yourself' },
                { status: 400 }
            )
        }

        const friendRequest = await createFriendRequest(senderId, receiverId)

        return NextResponse.json({ request: friendRequest })
    } catch (error) {
        console.error('Create friend request error:', error)

        if (error.message === 'Friend request already exists') {
            return NextResponse.json(
                { error: error.message },
                { status: 409 }
            )
        }

        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
