import mongoose from "mongoose";
import express from "express";
import {Request, Response} from "express/ts4.0";
import {userIType} from "../configIndex";
import {authModel} from "../Auth/authSchema";
import {AccountType, ProfileAccountType, status} from "../Common/configAccount";


export const words = express()

words.get('/words', async (req: Request & userIType, res: Response) => {
    const id = req.userId
    try {
        const profile = await authModel.findOne({_id: id}) as AccountType
        if (!profile) return res.status(404).json(status<null>(null, 0, 'NotFound'))
        res.status(200).json(status<ProfileAccountType>(profile.profile, 1, '', 'Done'))
    } catch (err) {
        res.status(500).json(status<null>(null, 0, err))
    }
})

words.post('/add-word', async (req: Request & userIType, res: Response) => {
    const id = req.userId
    const {word} = req.body
    try {
        const words = await authModel.findOne({_id: id}) as AccountType
        words.profile.words[word[0].toLowerCase()].unshift({...req.body, _id: new mongoose.Types.ObjectId()})
        words.profile.totalWords += 1
        await words.save()
        res.status(200).json(status<string>(words.profile.words[word[0].toLowerCase()][0], 1, '','Added'))
    } catch (err) {
        res.status(500).json(status<null>(null, 0, err))
    }
})
words.delete('/delete-word', async (req: Request & userIType, res: Response) => {
    const ids = req.userId
    const {id, letter} = req.query as { id: string, letter: string }
    try {
        const person = await authModel.findOne({_id: ids}) as AccountType
        person.profile.words[letter].pull({_id: id})
        person.profile.totalWords -= 1
        await person.save()
        res.json(status<null>(null,1,'','Deleted'))
    }catch (err){
        res.status(500).json(status<null>(null, 0, err))
    }
})