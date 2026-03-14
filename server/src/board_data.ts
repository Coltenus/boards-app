import { Router } from "express";
import type { Request, Response } from 'express'
import { getDb } from "./db.js";

const boardDataRouter = Router()
const db = getDb()

boardDataRouter.post('/api/board/list', (req: Request, res: Response) => {
    const { token, email } = req.body
    const stmt = db.prepare('SELECT board_data.*, user_data.email AS email FROM board_data JOIN user_data ON board_data.email = user_data.email ORDER BY create_time DESC')
    const boards = stmt.all()
    const parsedBoards = boards.map(board => ({
        id: board.id,
        name: board.name,
        email: board.email,
        content: board.content,
        create_time: board.create_time,
        upvote_count: JSON.parse(board.upvote_emails).length,
        downvote_count: JSON.parse(board.downvote_emails).length,
        is_user_upvoted: email ? JSON.parse(board.upvote_emails).includes(email) : false,
        is_user_downvoted: email ? JSON.parse(board.downvote_emails).includes(email) : false,
    }))
    res.json({ success: true, boards: parsedBoards })
})

boardDataRouter.post('/api/board/create', (req: Request, res: Response) => {
    const { content, token, email, timestamp } = req.body
    if (typeof content !== 'string' || typeof token !== 'string' || typeof email !== 'string' || typeof timestamp !== 'string') {
        res.status(400).json({ success: false, message: 'Invalid input' })
        return
    }

    const userStmt = db.prepare('SELECT * FROM user_data WHERE token = ?')
    const user = userStmt.get(token)
    if (!user) {
        res.status(401).json({ success: false, message: 'Invalid token' })
        return
    }

    const stmt = db.prepare('INSERT INTO board_data (email, content, create_time, name) VALUES (?, ?, ?, ?)')
    const info = stmt.run(user.email, content, timestamp, user.name)
    res.json({ success: true })
})

boardDataRouter.delete('/api/board/delete/:id', (req: Request, res: Response) => {
    const { id } = req.params
    const { token } = req.body
    if (typeof token !== 'string') {
        res.status(400).json({ success: false, message: 'Invalid input' })
        return
    }

    const userStmt = db.prepare('SELECT * FROM user_data WHERE token = ?')
    const user = userStmt.get(token)
    if (!user) {
        res.status(401).json({ success: false, message: 'Invalid token' })
        return
    }

    const boardStmt = db.prepare('SELECT * FROM board_data WHERE id = ?')
    const board = boardStmt.get(id)
    if (!board) {
        res.status(404).json({ success: false, message: 'Board not found' })
        return
    }

    if (board.email !== user.email) {
        res.status(403).json({ success: false, message: 'You can only delete your own boards' })
        return
    }

    const deleteStmt = db.prepare('DELETE FROM board_data WHERE id = ?')
    deleteStmt.run(id)
    res.json({ success: true })
})

boardDataRouter.post('/api/board/vote/:id', (req: Request, res: Response) => {
    const { id } = req.params
    const { token, email, voteType } = req.body  
    if (typeof token !== 'string' || typeof email !== 'string' || typeof voteType !== 'string') {
        res.status(400).json({ success: false, message: 'Invalid input' })
        return
    }

    const userStmt = db.prepare('SELECT * FROM user_data WHERE token = ?')
    const user = userStmt.get(token)
    if (!user) {
        res.status(401).json({ success: false, message: 'Invalid token' })
        return
    }

    const boardStmt = db.prepare('SELECT * FROM board_data WHERE id = ?')
    const board = boardStmt.get(id)
    if (!board) {
        res.status(404).json({ success: false, message: 'Board not found' })
        return
    }

    let upvote_emails = JSON.parse(board.upvote_emails)
    let downvote_emails = JSON.parse(board.downvote_emails)

    if (voteType === 'upvote') {
        if (upvote_emails.includes(email)) {
            upvote_emails = upvote_emails.filter((e: string) => e !== email)
        } else {
            upvote_emails.push(email)
            downvote_emails = downvote_emails.filter((e: string) => e !== email)
        }
    } else if (voteType === 'downvote') {
        if (downvote_emails.includes(email)) {
            downvote_emails = downvote_emails.filter((e: string) => e !== email)
        } else {
            downvote_emails.push(email)
            upvote_emails = upvote_emails.filter((e: string) => e !== email)
        }
    } else {
        res.status(400).json({ success: false, message: 'Invalid vote type' })
        return
    }

    const updateStmt = db.prepare('UPDATE board_data SET upvote_emails = ?, downvote_emails = ? WHERE id = ?')
    updateStmt.run(JSON.stringify(upvote_emails), JSON.stringify(downvote_emails), id)
    res.json({ success: true })
})

export default boardDataRouter