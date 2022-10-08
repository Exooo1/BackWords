import Route from 'express'
import {NextFunction, Request, Response} from 'express/ts4.0'
import bcrypt from 'bcrypt'
import jsonToken from 'jsonwebtoken'
import {authModel} from './authSchema'
import {secretJWT, userIType} from '../config'
import {AccountType, PersonType, status} from './tools'
import nodemailer from 'nodemailer'
import {createHandlebars} from "../HTML/config";

export const auth = Route()
export const authToken = Route()
const jwt = jsonToken

auth.post('/auth/registration', async (req: Request, res: Response) => {
    try {
        const {email, password, firstName, lastName} = req.body
        const log = await authModel.findOne({email})
        if (log) return res.status(400).json(status(0, 'You are auth!'))
        const hashPassword = bcrypt.hashSync(password, 7)
        const person = new authModel({
            email,
            password: hashPassword,
            profile: {firstName, lastName},
            created: new Date().toLocaleString()
        })
        await person.save()
        res.json(status(1, '', `${person._id}`))
    } catch (err) {
        res.status(500).json(status(0, err))
    }
})

auth.post('/auth/login', async (req: Request, res: Response) => {
    try {
        const {email, password} = req.body
        const person = await authModel.findOne({email}) as AccountType
        if (!person) return res.status(404).json(status(0, "You aren't auth!"))
        const validPass = bcrypt.compareSync(password, person.password)
        if (!validPass) res.status(404).json(status(0, 'Incorrect password or email'))
        const token = jwt.sign({_id: person._id}, secretJWT, {expiresIn: '15d'})
        if (!person.verify) return res.status(400).json(status(0, 'Confirm your Email'))
        await authModel.updateOne({email}, {auth: 1})
        res.json({token: token, auth: 1})
    } catch (err) {
        res.status(500).json(status(0, 'Server does not work!'))
    }
})

auth.post('/auth/email', (req, res, next) => {
    const {email, name, verify} = req.body
    console.log(verify)
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
    transporter.sendMail(mailOptions, (error, info) => console.log('Ok'))
    res.json(status(1, '', 'message sent'))
})

auth.post('/auth/confirm', async (req: Request, res: Response) => {
    const {id} = req.body
    const account = await authModel.findOne({_id: id})
    if (!account) return res.status(404).json(status(0, 'NotFound'))
    await authModel.updateOne({_id: id}, {verify: 1})
    res.status(200).json(status(0, '', 'Congrats! You confirmed your Email'))
})

auth.use((req: Request & userIType, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization.split(' ')[1]
        console.log(token, "TOKEN")
        if (!token) res.status(404).json({resultCode: 0})
        const decor = jwt.verify(token, secretJWT) as PersonType
        req.userId = decor._id
        next()
    } catch (err) {
        res.status(500).json(status(0, "You aren't auth"))
    }
})
auth.post('/auth/me', async (req: Request & userIType, res: Response) => {
    const id = req.userId
    console.log(id, "IDDDDD")
    const account = await authModel.findOne({_id: id})
    if (!account) return res.status(404).json(status(0, 'NotFound'))
    console.log(account)
    // @ts-ignore
    res.json(status(account.auth, ''))
})
auth.put('/auth/logout', async (req: Request & userIType, res: Response) => {
    const id = req.userId
    try {
        await authModel.updateOne({_id: id}, {auth: 0})
    } catch (err) {
    }
    res.status(200).json(status(0, '', 'change auth!'))
})
