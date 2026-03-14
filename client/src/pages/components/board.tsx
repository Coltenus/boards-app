import { useEffect, useState } from "react";
import CommentField from "./comment";
import InputField from "./input_field";

interface BoardFieldProps {
    apiUrl?: string
    fetchBoards: () => void
    token: string
    email: string
    buttonBaseClass?: string
    buttonPrimaryClass?: string
    buttonSecondaryClass?: string
    iconButtonClass?: string
    menuPanelClass?: string
    menuItemClass?: string
    border_color_class?: string
    text_color_class?: string
    muted_text_color_class?: string
    bg_class?: string
    input_bg_class?: string
    shadow_class?: string
    send_icon?: React.ReactNode
    clear_icon?: React.ReactNode
    board: any
    setBoard: (boardId: number, updatedBoard: any) => void
}

export default function BoardField(props: BoardFieldProps) {
    const { apiUrl, fetchBoards, token, email, buttonBaseClass, buttonPrimaryClass,
        buttonSecondaryClass, iconButtonClass, border_color_class, text_color_class,
        send_icon, clear_icon, menuPanelClass, menuItemClass, shadow_class, input_bg_class, bg_class } = props
    const {board, setBoard} = props
    const boardId = board.id
    const [openMenuBoardId, setOpenMenuBoardId] = useState<number | null>(null)
    const [commentsHidden, setCommentsHidden] = useState<boolean>(true)
    const [comments, setComments] = useState<any[]>([])

    const fetchComments = () => {
        fetch(`${apiUrl}/comment/${boardId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ token, email: email })
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setComments(data.comments)
                } else {
                    alert('Error fetching comments: ' + data.message)
                }
            })
            .catch(err => {
                console.error('Error fetching comments:', err)
                alert('Error fetching comments. Please try again.')
            })
    }

    const toggleBoardMenu = () => {
        setOpenMenuBoardId(prev => prev === boardId ? null : boardId)
    }

    const handleSubmitComment = async (content: string): Promise<boolean> => {
        if (!token) {
            alert('You must be logged in to comment.')
            return false
        }

        const normalized = content.trim()
        if (!normalized) {
            alert('Comment cannot be empty.')
            return false
        }

        try {
            const res = await fetch(`${apiUrl}/comment/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    token, email: email, board_id: boardId, content: normalized,
                    timestamp: new Date().toISOString()
                })
            })
            const data = await res.json()
            if (res.ok && data.success) {
                fetchBoards()
                fetchComments()
                return true
            }
            alert('Error submitting comment: ' + (data?.message ?? 'Unknown error'))
            return false
        } catch (err) {
            console.error('Error submitting comment:', err)
            alert('Error submitting comment. Please try again.')
            return false
        }
    }

    const handleDelete = () => {
        if (!token) {
            alert('You must be logged in to delete a board.')
            return
        }

        if (!window.confirm('Are you sure you want to delete this board? This action cannot be undone.')) {
            return
        }

        fetch(`${apiUrl}/board/delete/${boardId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ token, email: email })
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    fetchBoards()
                } else {
                    alert('Error deleting board: ' + data.message)
                }
            })
            .catch(err => {
                console.error('Error deleting board:', err)
                alert('Error deleting board. Please try again.')
            })
    }

    const handleUpvote = (voteType: string) => {
        if (!token) {
            alert('You must be logged in to upvote a board.')
            return
        }

        fetch(`${apiUrl}/board/vote/${boardId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ token, email: email, voteType })
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    fetchBoards()
                } else {
                    alert('Error voting on board: ' + data.message)
                }
            })
            .catch(err => {
                console.error('Error voting on board:', err)
                alert('Error voting on board. Please try again.')
            })
    }

    const handleComment = () => {
        if (commentsHidden) {
            fetchComments()
        }
        setCommentsHidden(!commentsHidden)
    }

    const arrow_drop_up = <span className="material-symbols-outlined text-[20px] leading-none">arrow_drop_up</span>
    const arrow_drop_down = <span className="material-symbols-outlined text-[20px] leading-none">arrow_drop_down</span>
    const comment_icon = <span className="material-symbols-outlined text-[18px] leading-none">comment</span>
    const menu_icon = <span className="material-symbols-outlined text-[18px] leading-none">more_vert</span>
    const delete_icon = <span className="material-symbols-outlined text-[18px] leading-none">delete</span>

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            const target = event.target as HTMLElement | null
            if (!target?.closest('[data-board-menu]')) {
                setOpenMenuBoardId(null)
            }
        }

        document.addEventListener('mousedown', handleOutsideClick)
        return () => document.removeEventListener('mousedown', handleOutsideClick)
    }, [])

    return (
        <div key={boardId} className={`box-1 border-2 mb-2 ${border_color_class} rounded-lg ${text_color_class} flex flex-col mt-4 w-full p-4 ${shadow_class} ${bg_class}`}>
                    <div className={`flex flex-row w-full`}>
                        <div className={`flex-1 whitespace-pre-wrap`}>
                            <p className={`text-lg font-semibold ${text_color_class}`}>{board.content}</p>
                        </div>
                        <div className={`flex flex-col ml-4`}>
                            <p className={`text-sm ${text_color_class}`}>By: {board.name}</p>
                            <p className={`text-sm ${text_color_class}`}>At: {new Date(board.create_time).toLocaleString()}</p>
                            <div className={`flex flex-row mt-2 gap-2 justify-end`}>
                                <button
                                    className={`${buttonBaseClass} ${board.is_user_upvoted ? buttonPrimaryClass : buttonSecondaryClass} ${!token && 'pointer-events-none'}`}
                                    onClick={() => handleUpvote('upvote')}
                                    disabled={!token}
                                >
                                    {arrow_drop_up}
                                    <span>{board.upvote_count}</span>
                                </button>
                                <button
                                    className={`${buttonBaseClass} ${board.is_user_downvoted ? buttonPrimaryClass : buttonSecondaryClass} ${!token && 'pointer-events-none'}`}
                                    onClick={() => handleUpvote('downvote')}
                                    disabled={!token}
                                >
                                    {arrow_drop_down}
                                    <span>{board.downvote_count}</span>
                                </button>
                            </div>

                            <div className={`flex flex-row mt-2 gap-2 justify-end relative`}>
                                <button
                                    className={`${buttonBaseClass} ${buttonSecondaryClass}`}
                                    onClick={() => handleComment()}
                                    aria-label="Comments"
                                    title="Comments"
                                >
                                    {comment_icon}
                                </button>
                                <button
                                    data-board-menu
                                    className={`${buttonBaseClass} ${buttonSecondaryClass} ${openMenuBoardId === board.id ? 'ring-2 ring-white/30' : ''}`}
                                    onClick={() => toggleBoardMenu()}
                                    aria-label="Menu"
                                    title="Menu"
                                >
                                    {menu_icon}
                                </button>

                                {openMenuBoardId === board.id && (
                                    <div
                                        data-board-menu
                                        className={`absolute right-0 top-full mt-2 min-w-[180px] border rounded-xl z-20 p-1 ${menuPanelClass}`}
                                    >
                                        {board.email === localStorage.getItem('email') ? (
                                            <button
                                                className={`${menuItemClass} text-red-400 hover:bg-red-500/15`}
                                                onClick={() => {
                                                    setOpenMenuBoardId(null)
                                                    handleDelete()
                                                }}
                                            >
                                                {delete_icon}
                                                <span>Delete board</span>
                                            </button>
                                        ) : (
                                            <p className={`px-3 py-2 text-xs opacity-70`}>No actions available</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className={`flex flex-col w-full mt-4 ${commentsHidden ? 'hidden' : ''}`}>
                        {token && (
                            <InputField handleSubmit={handleSubmitComment}
                                border_color_class={border_color_class} text_color_class={text_color_class}
                                buttonBaseClass={buttonBaseClass} buttonPrimaryClass={buttonPrimaryClass}
                                buttonSecondaryClass={buttonSecondaryClass} iconButtonClass={iconButtonClass}
                                bg_color_class={input_bg_class}
                                send_icon={send_icon} clear_icon={clear_icon} box_class='flex flex-row w-full items-center' />
                        )}
                        <div className={`mt-4`}>
                            {comments.map((comment: any, index: number) => (
                                <CommentField key={index} comment={comment} apiUrl={apiUrl}
                                fetchComments={fetchComments} token={token} email={email}
                                buttonBaseClass={buttonBaseClass} buttonPrimaryClass={buttonPrimaryClass}
                                buttonSecondaryClass={buttonSecondaryClass}
                                border_color_class={border_color_class} text_color_class={text_color_class}
                                arrow_drop_up={arrow_drop_up} arrow_drop_down={arrow_drop_down} boardId={boardId} />
                            ))}
                        </div>
                    </div>
                </div>
    );
}
