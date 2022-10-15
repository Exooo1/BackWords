import Route from 'express'
import {NextFunction, Request, Response} from 'express/ts4.0'
import bcrypt from 'bcrypt'
import jsonToken from 'jsonwebtoken'
import {authModel} from './authSchema'
import {secretJWT, userIType} from '../configIndex'
import {AccountType, AuthTokenType, status} from '../Common/configAccount'
import nodemailer from 'nodemailer'
import {createHandlebars} from "../HTML/configSendEmail";

export const auth = Route()
const jwt = jsonToken

auth.post('/auth/registration', async (req: Request, res: Response) => {
    try {
        const {email, password, firstName, lastName} = req.body
        const log = await authModel.findOne({email})
        if (log) return res.status(400).json(status<null>(null, 0, 'you are authorized'))
        const hashPassword = bcrypt.hashSync(password, 7)
        const person = new authModel({
            email,
            password: hashPassword,
            profile: {firstName, lastName},
            created: new Date().toLocaleString()
        })
        await person.save()
        res.json(status<string>(`${person._id}`, 1, '',))
    } catch (err) {
        res.status(500).json(status<null>(null, 0, err))
    }
})

auth.post('/auth/login', async (req: Request, res: Response) => {
    try {
        const {email, password} = req.body
        const person = await authModel.findOne({email}) as AccountType
        if (!person) return res.status(404).json(status<null>(null, 0, "You aren't authorized!"))
        const validPass = bcrypt.compareSync(password, person.password)
        if (!validPass) res.status(404).json(status<null>(null, 0, 'Incorrect password or email'))
        const token = jwt.sign({_id: person._id}, secretJWT, {expiresIn: '15d'})
        if (!person.verify) return res.status(400).json(status<null>(null, 0, 'Confirm your Email'))
        await authModel.updateOne({email}, {auth: 1})
        res.json(status<AuthTokenType>({token: token, auth: 1}, 1, ''))
    } catch (err) {
        res.status(500).json(status<null>(null, 0, err))
    }
})

auth.post('/auth/email', (req, res, next) => {
    const {email, name, verify} = req.body
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
        html: createHandlebars({username: name, verify}),
    }
    try {
        transporter.sendMail(mailOptions)
    } catch (err) {
        res.status(500).json(status<null>(null, 1, err))
    }
    res.json(status<null>(null, 1, '', 'Message was sent.'))
})

auth.post('/auth/confirm', async (req: Request, res: Response) => {
    const {id} = req.body
    try {
        const account = await authModel.findOne({_id: id})
        if (!account) return res.status(404).json(status<null>(null, 0, 'NotFound'))
        await authModel.updateOne({_id: id}, {verify: 1})
        res.status(200).json(status<null>(null, 1, '', 'Congrats! You confirmed your Email'))
    } catch (err) {
        res.status(500).json(status<null>(null, 0, err))
    }
})

auth.use((req: Request & userIType, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization.split(' ')[1]
        if (!token) res.status(404).json(status<null>(null, 0, 'notFound Token'))
        const decor = jwt.verify(token, secretJWT) as AccountType
        req.userId = decor._id
        next()
    } catch (err) {
        res.status(500).json(status<null>(null, 0, "You aren't authorized"))
    }
})
auth.post('/auth/me', async (req: Request & userIType, res: Response) => {
    const id = req.userId
    try {
        const account = await authModel.findOne({_id: id})
        if (!account) return res.status(404).json(status<null>(null, 0, 'NotFound'))
        res.json(status<number>(account.auth, 1, ''))
    } catch (err) {
        res.status(500).json(status<null>(null, 0, err))
    }
})
auth.put('/auth/logout', async (req: Request & userIType, res: Response) => {
    const id = req.userId
    try {
        await authModel.updateOne({_id: id}, {auth: 0})
        res.status(200).json(status<number>(0, 0, '', 'LogOut'))
    } catch (err) {
        res.status(500).json(status<null>(null, 0, err))
    }
})

