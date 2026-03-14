interface CommentFieldProps {
    apiUrl?: string
    fetchComments: () => void
    token: string
    email: string
    buttonBaseClass?: string
    buttonPrimaryClass?: string
    buttonSecondaryClass?: string
    menuPanelClass?: string
    menuItemClass?: string
    border_color_class?: string
    text_color_class?: string
    arrow_drop_up?: React.ReactNode
    arrow_drop_down?: React.ReactNode
    boardId: number
    comment: any
}

export default function CommentField(props: CommentFieldProps) {
    const { apiUrl, fetchComments, token, email, buttonBaseClass, buttonPrimaryClass,
        buttonSecondaryClass, border_color_class, text_color_class, arrow_drop_up, arrow_drop_down } = props
    const {comment} = props
    const boardId = props.boardId


    const handleUpvoteComment = (commentId: number, voteType: string) => {
        fetch(`${apiUrl}/comment/vote/${boardId}/${commentId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ token, email: email, vote_type: voteType })
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    fetchComments()
                } else {
                    alert('Error voting on comment: ' + data.message)
                }
            })
            .catch(err => {
                console.error('Error voting on comment:', err)
                alert('Error voting on comment. Please try again.')
            })
    }

    return (
        <div key={comment.id} className={`border rounded ${border_color_class} flex flex-row justify-between items-start p-4 mb-2`}>
            <div>
                <p className={`text-sm font-medium ${text_color_class} whitespace-pre-wrap`}>{comment.content}</p>
                <p className={`text-xs ${text_color_class}`}>By: {comment.name} at {new Date(comment.create_time).toLocaleString()}</p>
            </div>
            <div className={`flex flex-row mt-2 gap-2 justify-end items-end`}>
                <button
                    className={`h-8 w-15 ${buttonBaseClass} ${comment.is_user_upvoted ? buttonPrimaryClass : buttonSecondaryClass} ${!token && 'pointer-events-none'}`}
                    onClick={() => handleUpvoteComment(comment.id, 'upvote')}
                    disabled={!token}
                >
                    {arrow_drop_up}
                    <span>{comment.upvote_count}</span>
                </button>
                <button
                    className={`h-8 w-15 ${buttonBaseClass} ${comment.is_user_downvoted ? buttonPrimaryClass : buttonSecondaryClass} ${!token && 'pointer-events-none'}`}
                    onClick={() => handleUpvoteComment(comment.id, 'downvote')}
                    disabled={!token}
                >
                    {arrow_drop_down}
                    <span>{comment.downvote_count}</span>
                </button>
            </div>
        </div>
    );
}
