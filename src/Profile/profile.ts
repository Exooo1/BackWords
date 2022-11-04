import express, { Request, Response } from 'express'
import { authModel } from '../Auth/authSchema'
import { userIType } from '../configIndex'
import { AccountType, status } from '../Common/configAccount'

export const profile = express()

profile.get('/profile/fullname', async (req: Request & userIType, res: Response) => {
  try {
    const person = (await authModel.findOne({ _id: req.userId })) as AccountType
    res.json(status<{ firstName: string; lastName: string }>(person.profile, 1, ''))
  } catch (err) {
    res.status(500).json(status<null>(null, 0, err))
  }
})
