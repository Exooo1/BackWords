import express, {Request, Response} from 'express'
import {authModel} from '../Auth/authSchema'
import {userIDType} from '../configIndex'
import {AccountType, MessageChatType, ProfileChatType, status, StatusType} from '../Common/configAccount'
import {chatModel} from "../chat/chatScheme";

export const profile = express()

profile.get('/profile/fullname', async (req: Request & userIDType, res: Response<StatusType<ProfileChatType>>) => {
    try {
        const person = (await authModel.findOne({_id: req.userId})) as AccountType
        const chat = (await chatModel.find()) as Array<MessageChatType>
        res.json(status<ProfileChatType>({
            email: person.email,
            firstName: person.profile.firstName,
            lastName: person.profile.lastName,
            chat
        }, 1, ''))
    } catch (err) {
        res.status(500).json(status<null>(null, 0, err))
    }
})
