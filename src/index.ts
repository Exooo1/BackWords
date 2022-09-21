import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import morgan from 'morgan'
import { Request, Response } from 'express/ts4.0'
import dotenv from 'dotenv'
import { morganConfig, userIType } from './config'
import { auth, authToken } from './Auth/auth'
import { authModel } from './Auth/authSchema'

dotenv.config()
const app = express()
app.use(express.json())
app.use(cors())
app.use(auth)
// app.use(authToken)
app.use(morgan(morganConfig(morgan)))

app.get('/', async (req: Request & userIType, res: Response) => {
  const result = await authModel.findOne({ _id: req.userId })
  res.json({ message: '', person: result })
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
