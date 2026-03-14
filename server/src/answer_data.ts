import { Router } from "express";
import type { Request, Response } from 'express'
import { getDb } from "./db.js";

const answerDataRouter = Router()
const db = getDb()

answerDataRouter.post('/api/comment/create', (req: Request, res: Response) => {
    const { token, email, board_id, content, timestamp } = req.body  
    if (typeof token !== 'string' || typeof email !== 'string' || typeof board_id !== 'number' || typeof content !== 'string' || typeof timestamp !== 'string') {
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
    const board = boardStmt.get(board_id)
    if (!board) {
        res.status(404).json({ success: false, message: 'Board not found' })
        return
    }
    
    const stmt = db.prepare('INSERT INTO answer_data (board_id, email, content, create_time, name) VALUES (?, ?, ?, ?, ?)')
    stmt.run(board_id, email, content, timestamp, user.name)
    res.json({ success: true })
})

answerDataRouter.post('/api/comment/:id', (req: Request, res: Response) => {
    const { id } = req.params
    const { token, email } = req.body
    if (typeof token !== 'string' || typeof email !== 'string') {
        res.status(400).json({ success: false, message: 'Invalid input' })
        return
    }
    const stmt = db.prepare('SELECT answer_data.*, user_data.email AS email FROM answer_data JOIN user_data ON answer_data.email = user_data.email WHERE board_id = ? ORDER BY create_time DESC')
    const comments = stmt.all(id)
    const parsedComments = comments.map(comment => ({
        id: comment.id,
        board_id: comment.board_id,
        name: comment.name,
        email: comment.email,
        content: comment.content,
        create_time: comment.create_time,
        upvote_count: JSON.parse(comment.upvote_emails).length,
        downvote_count: JSON.parse(comment.downvote_emails).length,
        is_user_upvoted: email ? JSON.parse(comment.upvote_emails).includes(email) : false,
        is_user_downvoted: email ? JSON.parse(comment.downvote_emails).includes(email) : false,
    }))
    res.json({ success: true, comments: parsedComments })
})

answerDataRouter.post('/api/comment/vote/:board_id/:comment_id', (req: Request, res: Response) => {
    const { board_id, comment_id } = req.params
    const { token, email, vote_type } = req.body
    if (typeof token !== 'string' || typeof email !== 'string' || typeof vote_type !== 'string') {
        res.status(400).json({ success: false, message: 'Invalid input' })
        return
    }

    const userStmt = db.prepare('SELECT * FROM user_data WHERE token = ?')
    const user = userStmt.get(token)
    if (!user) {
        res.status(401).json({ success: false, message: 'Invalid token' })
        return
    }

    const commentStmt = db.prepare('SELECT * FROM answer_data WHERE id = ? AND board_id = ?')
    const comment = commentStmt.get(comment_id, board_id)
    if (!comment) {
        res.status(404).json({ success: false, message: 'Comment not found' })
        return
    }

    let upvote_emails = JSON.parse(comment.upvote_emails)
    let downvote_emails = JSON.parse(comment.downvote_emails)

    if (vote_type === 'upvote') {
        if (upvote_emails.includes(email)) {
            upvote_emails = upvote_emails.filter((e: string) => e !== email)
        } else {
            upvote_emails.push(email)
            downvote_emails = downvote_emails.filter((e: string) => e !== email)
        }
    } else if (vote_type === 'downvote') {
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

    const stmt = db.prepare('UPDATE answer_data SET upvote_emails = ?, downvote_emails = ? WHERE id = ?')
    stmt.run(JSON.stringify(upvote_emails), JSON.stringify(downvote_emails), comment_id)
    res.json({ success: true })
})

export default answerDataRouter