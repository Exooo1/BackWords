import {Router} from "express";
import {authMiddleware} from "../Common/authmiddle";
import {getFullName} from "./profile";


const router = Router()

router.get('/profile/fullname',authMiddleware,getFullName)

export default router