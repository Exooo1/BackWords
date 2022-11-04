import express from 'express'
import { Response } from 'express/ts4.0'
import { userIType } from '../configIndex'
import { authModel } from '../Auth/authSchema'
import {
  AccountType,
  ProfileAccountType,
  ReqBodyType,
  ReqQueryType,
  status,
  StatusType,
  WordType,
} from '../Common/configAccount'

export const words = express()

words.get(
  '/words',
  async (
    req: ReqQueryType<{ count: number }> & userIType,
    res: Response<StatusType<ProfileAccountType>>,
  ) => {
    try {
      const { count } = req.query
      const profile = (await authModel.findOne({ _id: req.userId })) as AccountType
      if (!profile) return res.status(404).json(status<null>(null, 0, 'NotFound'))
      let array: Array<WordType> = []
      const values = Object.values(profile.profile.words) as Array<Array<WordType>>
      for (let i = 0; i < values.length; i++) {
        if (values[i].length > 0) {
          array = [...array, ...values[i]]
        }
      }
      const resultWords = []
      for (let i = (count - 1) * 15; i < count * 15; i++) {
        if (array[i]) resultWords.push(array[i])
        else break
      }
      res
        .status(200)
        .json(status<ProfileAccountType>({ ...profile.profile, words: resultWords }, 1, '', 'Done'))
    } catch (err) {
      res.status(500).json(status<null>(null, 0, err))
    }
  },
)

words.post(
  '/add-word',
  async (req: ReqBodyType<{ word: string }> & userIType, res: Response<StatusType<string>>) => {
    try {
      const { word } = req.body
      const words = (await authModel.findOne({ _id: req.userId })) as AccountType
      const repeat = words.profile.words[word[0].toLowerCase()].filter((item) => item.word === word)
      if (repeat.length)
        return res.status(400).json(status<null>(null, 0, 'The word is already in the dictionary.'))
      words.profile.words[word[0].toLowerCase()].unshift({
        ...req.body,
      })
      words.profile.totalWords += 1
      await words.save()
      res
        .status(200)
        .json(
          status<string>(
            words.profile.words[word[0].toLowerCase()][0],
            1,
            '',
            `You added word '${word}' ${new Date().toTimeString().split(' ')[0]}`,
          ),
        )
    } catch (err) {
      res.status(500).json(status<null>(null, 0, err))
    }
  },
)
words.delete(
  '/delete-word',
  async (
    req: ReqQueryType<{ id: string; letter: string }> & userIType,
    res: Response<StatusType<null>>,
  ) => {
    try {
      const { id, letter } = req.query
      const person = (await authModel.findOne({ _id: req.userId })) as AccountType
      person.profile.words[letter].pull({ _id: id })
      person.profile.totalWords -= 1
      await person.save()
      res.json(status<null>(null, 1, '', 'Deleted'))
    } catch (err) {
      res.status(500).json(status<null>(null, 0, err))
    }
  },
)
words.post(
  '/word-change',
  async (
    req: ReqBodyType<{ word: string; translate: string; description: string; id: String }> &
      userIType,
    res: Response<StatusType<null>>,
  ) => {
    try {
      const { word, translate, description, id } = req.body
      let person = (await authModel.findOne({ _id: req.userId })) as AccountType
      const result = person.profile.words[word[0].toLowerCase()].findIndex((item) => item._id == id)
      person.profile.words[word[0].toLowerCase()][result].word = word
      person.profile.words[word[0].toLowerCase()][result].translate = translate
      person.profile.words[word[0].toLowerCase()][result].description = description
      await person.save()
      res.status(200).json(status<null>(null, 1, '', `You changed this word ${word}`))
    } catch (err) {
      res.status(500).json(status<null>(null, 0, err))
    }
  },
)

words.post('/word-find', async (req: ReqQueryType<{ word: string }> & userIType, res) => {
  try {
    const profile = (await authModel.findOne({ _id: req.userId })) as AccountType
    if (!profile) return res.status(404).json(status<null>(null, 0, 'NotFound'))
    let array: Array<WordType> = []
    const values = Object.values(profile.profile.words) as Array<Array<WordType>>
    for (let i = 0; i < values.length; i++) {
      if (values[i].length > 0) {
        array = [...array, ...values[i]]
      }
    }
    const filterWords = array.filter((item) =>
      item.word.includes(req.query.word[0].toUpperCase() + req.query.word.slice(1)),
    )
    res.json(status<Array<WordType>>(filterWords, 1, ''))
  } catch (err) {
    res.status(500).json(status<null>(null, 0, err))
  }
})
