import { getDatabasePath, getDb } from './db.js'

getDb()
console.log(`SQLite ready: ${getDatabasePath()}`)
