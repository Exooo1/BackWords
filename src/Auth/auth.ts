import Route from 'express'
import { NextFunction, Request, Response } from 'express/ts4.0'
import bcrypt from 'bcrypt'
import jsonToken from 'jsonwebtoken'
import { authModel } from './authSchema'
import { secretJWT, userIType } from '../configIndex'
import {
  AccountType,
  AuthTokenType,
  ReqBodyType,
  status,
  StatusType,
} from '../Common/configAccount'
import nodemailer from 'nodemailer'
import { createHandlebars } from '../HTML/configSendEmail'

export const auth = Route()
const jwt = jsonToken

auth.post(
  '/auth/registration',
  async (
    req: ReqBodyType<{ email: string; password: string; firstName: string; lastName: string }>,
    res: Response<StatusType<string>>,
  ) => {
    try {
      const { email, password, firstName, lastName } = req.body
      const log = await authModel.findOne({ email })
      if (log) return res.status(400).json(status<null>(null, 0, 'you are authorized'))
      const hashPassword = bcrypt.hashSync(password, 7)
      const person = new authModel({
        email,
        password: hashPassword,
        profile: { firstName, lastName },
        created: new Date().toLocaleString(),
      })
      await person.save()
      res.status(200).json(status<string>(`${person._id}`, 1, ''))
    } catch (err) {
      res.status(500).json(status<null>(null, 0, err))
    }
  },
)

auth.post(
  '/auth/login',
  async (
    req: ReqBodyType<{ email: string; password: string }>,
    res: Response<StatusType<AuthTokenType>>,
  ) => {
    try {
      const { email, password } = req.body
      const person = (await authModel.findOne({ email })) as AccountType
      if (!person) return res.status(404).json(status<null>(null, 0, "You aren't authorized!"))
      const validPass = bcrypt.compareSync(password, person.password)
      if (!validPass) res.status(404).json(status<null>(null, 0, 'Incorrect password or email'))
      const token = jwt.sign({ _id: person._id }, secretJWT, { expiresIn: '15d' })
      if (!person.verify) return res.status(400).json(status<null>(null, 0, 'Confirm your Email'))
      await authModel.updateOne({ email }, { auth: 1 })
      res.json(status<AuthTokenType>({ token: token, auth: 1 }, 1, ''))
    } catch (err) {
      res.status(500).json(status<null>(null, 0, err))
    }
  },
)

auth.post(
  '/auth/email',
  (
    req: ReqBodyType<{ email: string; name: string; verify: string }>,
    res: Response<StatusType<null>>,
  ) => {
    const { email, name, verify } = req.body
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      },
    })

    const mailOptions = {
      from: `YourVocabularyApp`,
      to: `${email}`,
      subject: 'Authorization in YourVocabulary',
      html: createHandlebars({ username: name, verify }),
    }
    try {
      transporter.sendMail(mailOptions)
    } catch (err) {
      res.status(500).json(status<null>(null, 1, err))
    }
    res.json(status<null>(null, 1, '', 'Message was sent.'))
  },
)
auth.use((req: Request & userIType, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization.split(' ')[1]
    if (!token) res.status(404).json(status<number>(0, 0, 'notFound Token'))
    const decor = jwt.verify(token, secretJWT) as AccountType
    req.userId = decor._id
    next()
  } catch (err) {
    res.json(status<null>(null, 0, ''))
  }
})

auth.post(
  '/auth/confirm',
  async (req: ReqBodyType<{ id: string }>, res: Response<StatusType<null>>) => {
    try {
      const { id } = req.body
      const account = await authModel.findOne({ _id: id })
      if (!account) return res.status(404).json(status<null>(null, 0, 'NotFound'))
      await authModel.updateOne({ _id: id }, { verify: 1 })
      res.status(200).json(status<null>(null, 1, '', 'Congrats! You confirmed your Email'))
    } catch (err) {
      res.status(500).json(status<null>(null, 0, err))
    }
  },
)

auth.get('/auth/me', async (req: Request & userIType, res: Response<StatusType<number>>) => {
  try {
    const account = await authModel.findOne({ _id: req.userId })
    if (!account) return res.status(404).json(status<null>(null, 0, 'NotFound'))
    res.json(status<number>(account.auth, 1, ''))
  } catch (err) {
    res.status(500).json(status<null>(null, 0, err))
  }
})
auth.put('/auth/logout', async (req: Request & userIType, res: Response<StatusType<number>>) => {
  try {
    await authModel.updateOne({ _id: req.userId }, { auth: 0 })
    res.status(200).json(status<number>(0, 0, '', 'LogOut'))
  } catch (err) {
    res.status(500).json(status<null>(null, 0, err))
  }
})
