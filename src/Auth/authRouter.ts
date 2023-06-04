import {Router} from "express";
import {email, forgetPassword, login, registration, confirm, me, logout} from "./auth";
import {authMiddleware} from "../Common/authmiddle";

const router = Router()

router.post('/auth/registration',registration)
router.post('/auth/login',login)
router.post('/auth/forget-password',forgetPassword)
router.post('/auth/email',email)
router.post('/auth/confirm',confirm)
router.get('/auth/me',authMiddleware,me)
router.put('/auth/logout',authMiddleware,logout)


export default router