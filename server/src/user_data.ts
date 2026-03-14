import { Router } from "express";
import type { Request, Response } from 'express'
import { getDb } from "./db.js";
import bcrypt from 'bcrypt'

const userDataRouter = Router()
const db = getDb()
const secretKey = process.env.SECRET_KEY

userDataRouter.post('/api/user/register', (req: Request, res: Response) => {
  const { email, password, name, gender, birthdate } = req.body

  if (typeof email !== 'string' || typeof password !== 'string'
    || typeof name !== 'string' || typeof gender !== 'string' || typeof birthdate !== 'string') {
    res.status(400).json({ success: false, message: 'Invalid input' })
    return
  }

  if(db.prepare('SELECT * FROM user_data WHERE email = ?').get(email)) {
    res.status(400).json({ success: false, message: 'User already exists' })
    return
  }

    const stmt = db.prepare('INSERT INTO user_data (email, password_hash, token, name, gender, birthdate) VALUES (?, ?, ?, ?, ?, ?)')
    const password_hash = bcrypt.hashSync(password + secretKey, 10)
    const token = bcrypt.hashSync(email + secretKey, 10)
    const info = stmt.run(email, password_hash, token, name, gender, birthdate)
    res.json({ success: true })
})

userDataRouter.post('/api/user/login', (req: Request, res: Response) => {
  const { email, password } = req.body
  if (typeof email !== 'string' || typeof password !== 'string') {
    res.status(400).json({ success: false, message: 'Invalid input' })
    return
  }

  const stmt = db.prepare('SELECT * FROM user_data WHERE email = ?')
  const user = stmt.get(email)
  if (user && bcrypt.compareSync(password + secretKey, user.password_hash)) {
    res.json({ success: true, user: { id: user.id, email: user.email, token: user.token, name: user.name } })
    } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' })
  }
})

userDataRouter.post('/api/user/profile/:email', (req: Request, res: Response) => {
  const { email } = req.params
  const { token } = req.body
  if (typeof token !== 'string' || typeof email !== 'string') {
    res.status(400).json({ success: false, message: 'Invalid input' })
    return
  }

  const stmt = db.prepare('SELECT * FROM user_data WHERE email = ?')
  const user = stmt.get(email)
  if (user && token === user.token) {
    res.json({ success: true, profile: {
      id: user.id,
      email: user.email,
      name: user.name,
      gender: user.gender,
      birthdate: user.birthdate,
      joined: user.joined
    } })
  } else {
    res.status(401).json({ success: false, message: 'Invalid token' })
  }
})

userDataRouter.post('/api/user/verify', (req: Request, res: Response) => {
    const { email, token } = req.body
    if (typeof token !== 'string' || typeof email !== 'string') {
      res.status(400).json({ success: false, message: 'Invalid input' })
      return
    }
  
    const stmt = db.prepare('SELECT * FROM user_data WHERE email = ?')
    const user = stmt.get(email)
    if (user && token === user.token) {
      res.json({ success: true, user: { id: user.id, email: user.email, token: user.token } })
    } else {
      res.status(401).json({ success: false, message: 'Invalid token' })
    }
})

export default userDataRouter