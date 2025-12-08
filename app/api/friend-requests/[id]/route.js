import { NextResponse } from 'next/server'
import { updateFriendRequest, deleteFriendRequest } from '../../../../lib/db'

export async function PATCH(request, { params }) {
    try {
        const { id } = params
        const { status } = await request.json()

        console.log('PATCH /api/friend-requests/[id] called with:', { id, status })

        if (!status || !['accepted', 'rejected'].includes(status)) {
            return NextResponse.json(
                { error: 'Valid status (accepted/rejected) is required' },
                { status: 400 }
            )
        }

        const updatedRequest = await updateFriendRequest(id, status)

        return NextResponse.json({ request: updatedRequest, success: true })
    } catch (error) {
        console.error('Update friend request error in API route:', error)
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        )
    }
}

export async function DELETE(request, { params }) {
    try {
        const { id } = params

        await deleteFriendRequest(id)

        return NextResponse.json({ message: 'Friend request deleted', success: true })
    } catch (error) {
        console.error('Delete friend request error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
