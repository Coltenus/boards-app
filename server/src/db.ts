import fs from 'fs'
import path from 'path'

import Database from 'better-sqlite3'

let dbSingleton: Database.Database | null = null

function ensureDirectoryExists(filePath: string) {
  const dir = path.dirname(filePath)
  fs.mkdirSync(dir, { recursive: true })
}

export function getDatabasePath() {
  return process.env.DATABASE_PATH ?? 'data/dev.db'
}

export function getDb() {
  if (dbSingleton) return dbSingleton

  const dbPath = getDatabasePath()
  ensureDirectoryExists(dbPath)

  const db = new Database(dbPath)
  db.pragma('journal_mode = WAL')
  db.pragma('foreign_keys = ON')

  db.exec(`CREATE TABLE IF NOT EXISTS user_data (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    token TEXT UNIQUE NOT NULL,
    joined TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    name TEXT NOT NULL,
    gender TEXT NOT NULL,
    birthdate TEXT NOT NULL
  )`)

  db.exec(`CREATE TABLE IF NOT EXISTS board_data (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    content TEXT NOT NULL,
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    upvote_emails TEXT DEFAULT '[]',
    downvote_emails TEXT DEFAULT '[]',
    answer_ids TEXT DEFAULT '[]',
    FOREIGN KEY (email) REFERENCES user_data(email) ON DELETE CASCADE
  )`)

  db.exec(`CREATE TABLE IF NOT EXISTS answer_data (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    board_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    content TEXT NOT NULL,
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    upvote_emails TEXT DEFAULT '[]',
    downvote_emails TEXT DEFAULT '[]',
    FOREIGN KEY (board_id) REFERENCES board_data(id) ON DELETE CASCADE,
    FOREIGN KEY (email) REFERENCES user_data(email) ON DELETE CASCADE
  )`)

  dbSingleton = db
  return db
}
