import {Request, Response} from 'express/ts4.0'
import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import cron from 'node-cron'
import {authModel} from './Auth/authSchema'
import {server} from "./chat/chat";
import  auth from "./Auth/authRouter";
import word from './Words/routerWords'
import profile from './Profile/profileRouter'

dotenv.config()
const app = express()
app.use(express.json())
app.use(cors())
app.use(auth)
app.use(profile)
app.use(word)

cron.schedule('*/20 * * * *', async () => {
    await authModel.deleteMany({verify: 0})
})

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

server.listen(8999, () => {
    console.log('Go!')
})
