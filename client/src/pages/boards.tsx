import { useState } from 'react';
import InputField from './components/input_field';
import BoardField from './components/board';

interface BoardsPageProps {
    apiUrl?: string
    text_color_class?: string
    muted_text_color_class?: string
    border_color_class?: string
    bg_class?: string
    input_bg_class?: string
    shadow_class?: string
    buttonBaseClass?: string
    buttonPrimaryClass?: string
    buttonSecondaryClass?: string
    iconButtonClass?: string
    menuPanelClass?: string
    menuItemClass?: string
}

export default function BoardsPage(props: BoardsPageProps) {
    const { apiUrl, text_color_class, muted_text_color_class, border_color_class,
        bg_class, input_bg_class, shadow_class, buttonBaseClass, buttonPrimaryClass,
        buttonSecondaryClass, iconButtonClass, menuPanelClass, menuItemClass } = props
    const token = localStorage.getItem('token') || ''
    const email = localStorage.getItem('email') || ''

    const [boards, setBoards] = useState<any[]>([])

    const setBoard = (boardId: number, updatedBoard: any) => {
        setBoards(prev => prev.map(board => board.id === boardId ? { ...board, ...updatedBoard } : board))
    }

    const send_icon = <span className="material-symbols-outlined text-[18px] leading-none">send</span>
    const clear_icon = <span className="material-symbols-outlined text-[18px] leading-none">backspace</span>

    const fetchBoards = () => {
        fetch(`${apiUrl}/board/list`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ token, email: email })
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setBoards(data.boards)
                }
            })
            .catch(err => {
                console.error('Error fetching boards:', err)
            })
    }

    const handleSubmit = async (content: string): Promise<boolean> => {
        if (!token) {
            alert('You must be logged in to submit a board.')
            return false
        }

        const normalized = content.trim()
        if (!normalized) {
            alert('Board content cannot be empty.')
            return false
        }

        try {
            const res = await fetch(`${apiUrl}/board/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content: normalized, token, email: email,
                    timestamp: new Date().toISOString()
                })
            })
            const data = await res.json()
            if (res.ok && data.success) {
                fetchBoards()
                return true
            }
            alert('Error submitting board: ' + (data?.message ?? 'Unknown error'))
            return false
        } catch (err) {
            console.error('Error submitting board:', err)
            alert('Error submitting board. Please try again.')
            return false
        }
    }

    useState(() => {
        fetchBoards()
    }, [])

    return (
        <div className={`flex flex-col items-center`}>
            {token && <InputField handleSubmit={handleSubmit}
            border_color_class={border_color_class} text_color_class={text_color_class}
            buttonBaseClass={buttonBaseClass} buttonPrimaryClass={buttonPrimaryClass}
            buttonSecondaryClass={buttonSecondaryClass} iconButtonClass={iconButtonClass}
            bg_color_class={input_bg_class} shadow_class={shadow_class}
            send_icon={send_icon} clear_icon={clear_icon} box_class='box-1 flex items-start mt-4' />}
            {boards.map((board) => (
                <BoardField key={board.id} board={board} apiUrl={apiUrl}
                fetchBoards={fetchBoards} token={token} email={email}
                border_color_class={border_color_class} text_color_class={text_color_class}
                muted_text_color_class={muted_text_color_class} bg_class={bg_class}
                input_bg_class={input_bg_class} shadow_class={shadow_class}
                buttonBaseClass={buttonBaseClass} buttonPrimaryClass={buttonPrimaryClass}
                buttonSecondaryClass={buttonSecondaryClass} iconButtonClass={iconButtonClass}
                send_icon={send_icon} clear_icon={clear_icon} menuPanelClass={menuPanelClass}
                menuItemClass={menuItemClass} setBoard={setBoard} />
            ))}
        </div>
    );
}