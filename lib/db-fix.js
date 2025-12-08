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
            }
        }

        return updatedRequest
    } catch (error) {
        console.error('Update friend request error:', error)
        throw error
    }
}
