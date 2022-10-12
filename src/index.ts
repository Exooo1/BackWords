import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import {Request, Response} from 'express/ts4.0'
import dotenv from 'dotenv'
import {auth} from './Auth/auth'
import {words} from "./Words/words";

dotenv.config()
const app = express()
app.use(express.json())
app.use(cors())
app.use(auth)
app.use(words)

const start = async () => {
    try {
        await mongoose.connect(process.env.DB_URL)
        app.listen(process.env.PORT || 3000, () => console.log('ServerStarted!'))
        app.use((req: Request, res: Response) => res.status(500))
    } catch (err) {
        throw new Error("Server don't work..." + err)
    }
}
start()
