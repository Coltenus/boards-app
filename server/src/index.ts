import cors from 'cors'
import express from 'express'
import dotenv from 'dotenv'
dotenv.config()

import { getDb } from './db.js'
import userDataRouter from './user_data.js'
import boardDataRouter from './board_data.js'
import answerDataRouter from './answer_data.js'

const app = express()

// Initialize the DB early so startup fails fast if the path is invalid.
getDb()

app.use(express.json())
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow same-device tools (no Origin), localhost, and private LAN clients.
      if (!origin) {
        callback(null, true)
        return
      }

      const isLocalhost = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(origin)
      const isPrivateLan = /^https?:\/\/(10\.\d+\.\d+\.\d+|192\.168\.\d+\.\d+|172\.(1[6-9]|2\d|3[0-1])\.\d+\.\d+)(:\d+)?$/i.test(origin)

      if (isLocalhost || isPrivateLan) {
        callback(null, true)
        return
      }

      callback(new Error(`CORS blocked origin: ${origin}`))
    },
  }),
)

app.use(userDataRouter)
app.use(boardDataRouter)
app.use(answerDataRouter)

const host = process.env.HOST || 'localhost'
const port = Number(process.env.PORT ?? 5174)
app.listen(port, host, () => {
  console.log(`API listening on http://${host}:${port}`)
})
