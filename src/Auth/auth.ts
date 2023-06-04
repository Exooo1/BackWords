import Route from 'express'
import { Request, Response} from 'express/ts4.0'
import bcrypt from 'bcrypt'
import jsonToken from 'jsonwebtoken'
import {authModel} from './authSchema'
import {secretJWT, userIDType} from '../configIndex'
import {
    AuthTokenType,
    ReqBodyType,
    status,
    StatusType,
} from '../Common/configAccount'
import nodemailer from 'nodemailer'
import {createHandlebars} from '../HTML/configSendEmail'
import {returnEmailAccount} from '../Common/returnAccount'

export const auth = Route()
const jwt = jsonToken

const registration = async(req: ReqBodyType<{ email: string; password: string; firstName: string; lastName: string }>,
                      res: Response<StatusType<string>>) =>{
        try {
            const {email, password, firstName, lastName} = req.body
            const account = await returnEmailAccount({value: email})
            if (account) return res.status(400).json(status<null>(null, 0, 'Email already exists'))
            const hashPassword = bcrypt.hashSync(password, 7)
            const person = new authModel({
                email,
                password: hashPassword,
                profile: {firstName, lastName},
                created: new Date().toLocaleString(),
            })
            await person.save()
            res.status(200).json(status<string>(`${person._id}`, 1, ''))
        } catch (err) {
            res.status(500).json(status<null>(null, 0, err))
        }
}

const login = async (  req: ReqBodyType<{ email: string; password: string }>,
                       res: Response<StatusType<AuthTokenType>>) =>{
    try {
        const {email, password} = req.body
        const account = await returnEmailAccount({value: email})
        if (!account) return res.status(404).json(status<null>(null, 0, "You aren't authorized!"))
        const validPass = bcrypt.compareSync(password, account.password)
        if (!validPass) return res.status(404).json(status<null>(null, 0, 'Email or password is incorrect'))
        if (!account.verify) return res.status(400).json(status<null>(null, 0, 'Please confirm your email'))
        const token = jwt.sign({_id: account._id}, secretJWT, {expiresIn: '15d'})
        await authModel.updateOne({email}, {auth: 1})
        res.json(status<AuthTokenType>({token: token, auth: 1}, 1, ''))
    } catch (err) {
        res.status(500).json(status<null>(null, 0, err))
    }

}

const forgetPassword = async (req:Request, res:Response)=>{
    try {
        const {email,password,id} = req.body
        const profile = await returnEmailAccount({value:email})

    } catch (err) {

    }
    return res.send('Hello')
}

const email = async (req: ReqBodyType<{ email: string; name: string; verify: string }>,
                     res: Response<StatusType<null>>) =>{
    try {
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
        await transporter.sendMail(mailOptions)
        res.json(status<null>(null, 1, '', 'Message was sent.'))
    } catch (err) {
        res.status(500).json(status<null>(null, 0, 'Error sending email'))
    }
}

const confirm = async(req: ReqBodyType<{ id: string }>, res: Response<StatusType<string>>) =>{
    try {
        const {id} = req.body
        const account = await authModel.findOne({_id: id})
        if (!account) return res.status(404).json(status<null>(null, 0, 'NotFound'))
        if (account.verify === 1)
            return res.status(400).json(status<null>(null, 0, 'Account already verified'))
        await authModel.updateOne({_id: id}, {verify: 1})
        res.status(200).json(status<string>('Email confirmed successfully', 1, ''))
    } catch (err) {
        res.status(500).json(status<null>(null, 0, err))
    }

}

const me = async (req: Request & userIDType, res: Response<StatusType<number>>) =>{
    try {
        const account = await authModel.findOne({_id: req.userId})
        if (!account) return res.status(404).json(status<null>(null, 0, 'NotFound'))
        res.json(status<number>(account.auth, 1, ''))
    } catch (err) {
        res.status(500).json(status<null>(null, 0, err))
    }
}

const logout = async (req: Request & userIDType, res: Response<StatusType<number>>) =>{
    try {
        await authModel.updateOne({_id: req.userId}, {auth: 0})
        res.status(200).json(status<number>(0, 0, '', 'LogOut'))
    } catch (err) {
        res.status(500).json(status<null>(null, 0, err))
    }
}


export {registration,login,forgetPassword,confirm,email,me,logout}