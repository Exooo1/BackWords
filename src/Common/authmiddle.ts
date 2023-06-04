import {NextFunction, Request, Response} from "express/ts4.0";
import {secretJWT, userIDType} from "../configIndex";
import {AccountType, status} from "./configAccount";
import jsonToken from "jsonwebtoken";

const jwt = jsonToken

const authMiddleware = (req: Request & userIDType, res: Response, next: NextFunction)=>{
    try {
        const token = req.headers.authorization.split(' ')[1]
        if (!token) res.status(404).json(status<number>(0, 0, 'notFound Token'))
        const decor = jwt.verify(token, secretJWT) as AccountType
        req.userId = decor._id
        return next()
    } catch (err) {
        res.json(status<null>(null, 0, ''))
    }
}

export {authMiddleware}