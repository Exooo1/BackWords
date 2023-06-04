import {Router} from "express";
import {addWord, deleteWord, getWords, sortWords, wordChange, wordFind, wordsDownload} from "./words";
import {authMiddleware} from "../Common/authmiddle";

const router = Router()

router.get('/words',authMiddleware,getWords)
router.post('/add-word',authMiddleware,addWord)
router.delete('/delete-word',authMiddleware,deleteWord)
router.post('/wordChange',authMiddleware,wordChange)
router.get('/word-find',authMiddleware,wordFind)
router.post('/sort-words',authMiddleware,sortWords)
router.get('/words-download',authMiddleware,wordsDownload)



export default router