import mongoose from "mongoose";
import express from "express";
import {Request, Response} from "express/ts4.0";
import {userIType} from "../configIndex";
import {authModel} from "../Auth/authSchema";
import {PersonType, status} from "../Auth/tools";


export const words = express()

words.get('/words', async (req: Request & userIType, res: Response) => {
    const id = req.userId
    const profile = await authModel.findOne({_id: id}) as PersonType
    if (!profile) return res.status(404).json(status(0, 'bro its BAD!!!!!'))
    res.status(200).json(status(profile.profile, '', 'okay all'))
})

words.post('/add-word', async (req: Request & userIType, res: Response) => {
    const id = req.userId
    const {word} = req.body
    const words = await authModel.findOne({_id: id}) as PersonType
    words.profile.words[word[0].toLowerCase()].unshift({...req.body, _id: new mongoose.Types.ObjectId()})
    words.profile.totalWords += 1
    // @ts-ignore
    await words.save()
    res.status(200).json({resultCode: words.profile.words[word[0].toLowerCase()][0]})
})
words.delete('/delete-word', async (req: Request & userIType, res: Response) => {
    const ids = req.userId
    const {id, letter} = req.query as { id: string, letter: string }
    const person = await authModel.findOne({_id: ids}) as PersonType
    person.profile.words[letter].pull({_id: id})
    person.profile.totalWords -= 1
    //@ts-ignore
    await person.save()

    res.json('Okay')
})