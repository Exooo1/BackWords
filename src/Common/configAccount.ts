import { Request } from 'express/ts4.0'

export type StatusType<T> = {
  item: T
  resultCode: number
  error: string
  message: string
}
export type WordType = {
  _id: string
  word: string
  translate: string
  description: string
  added: string
}
export type AuthTokenType = {
  token: string
  auth: number
}
export type ProfileAccountType = {
  firstName: string
  lastName: string
  words: any
  totalWords: number
}
export type AccountType = {
  _id: string
  created: string
  verify: number
  auth: number
  email: string
  password: string
  profile: ProfileAccountType
  save: () => void
}
export const status = <T>(
  something: T,
  resultCode: number,
  error: string,
  message?: string,
): StatusType<T> => {
  return {
    item: something,
    resultCode,
    error,
    message,
  }
}
export type ReqQueryType<T> = Request<{}, {}, {}, T>
export type ReqBodyType<T> = Request<{}, {}, T>
export type ReqParamType<T> = Request<T>
