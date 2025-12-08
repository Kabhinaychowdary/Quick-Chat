export default function FriendRequestsList({ requests, onAccept, onReject }) {
    if (!requests || requests.length === 0) {
        return null
    }

    return (
        <div className="p-4 border-b border-border">
            <h3 className="text-sm font-semibold text-foreground mb-3">Friend Requests</h3>
            <div className="space-y-2">
                {requests.map((request) => (
                    <div
                        key={request.id}
                        className="flex items-center justify-between p-3 bg-accent/50 rounded-lg"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                                <span className="text-sm font-semibold text-primary">
                                    {request.senderName?.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-foreground">{request.senderName}</p>
                                <p className="text-xs text-muted-foreground">wants to connect</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => onAccept(request.id)}
                                className="px-3 py-1 text-xs bg-primary text-primary-foreground rounded-md hover:opacity-90"
                            >
                                Accept
                            </button>
                            <button
                                onClick={() => onReject(request.id)}
                                className="px-3 py-1 text-xs bg-destructive/10 text-destructive rounded-md hover:bg-destructive/20"
                            >
                                Reject
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
