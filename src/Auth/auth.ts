import Route from 'express'
import {NextFunction, Request, Response} from 'express/ts4.0'
import bcrypt from 'bcrypt'
import jsonToken from 'jsonwebtoken'
import {authModel} from "./authSchema";
import {secretJWT, userIType} from "../config";
import {PersonType, status} from "./tools";

export const auth = Route()
export const authToken = Route()
const jwt = jsonToken

auth.post('/auth/registration', async (req: Request, res: Response) => {
    try {
        const {email, password, firstName, lastName} = req.body
        const log = await authModel.findOne({email})
        if (log) return res.status(400).json(status(0, 'You are auth!'))
        const hashPassword = bcrypt.hashSync(password, 7)
        const person = new authModel({email, password: hashPassword, profile: {firstName, lastName}})
        await person.save()
        res.json(status(1, 'You have been registered'))
    } catch (err) {
        res.status(500).json(status(0, err))
    }
})

auth.post('/auth/login', async (req: Request, res: Response) => {
    try {
        const {email, password} = req.body
        const person = await authModel.findOne({email})
        if (!person) return res.status(404).json(status(0, 'You aren\'t auth!'))
        const validPass = bcrypt.compareSync(password, person.password)
        if (!validPass) res.status(404).json(status(0, 'Incorrect password or email'))
        const token = jwt.sign({_id: person._id}, secretJWT, {expiresIn: '15d'})
        res.json({token: token})
    } catch (err) {
        res.status(500).json(status(0, 'Server does not work!'))
    }
})

authToken.use((req: Request & userIType, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization.split(' ')[1]
        if (!token) res.status(404).json({resultCode: 0})
        const decor = jwt.verify(token, secretJWT) as PersonType
        req.userId = decor._id
        next()
    } catch (err) {
        res.status(500).json(status(0, 'You aren\'t auth'))
    }
})
