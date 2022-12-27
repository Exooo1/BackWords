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
export type LetterType = {
  a: Array<WordType>
  b: Array<WordType>
  c: Array<WordType>
  d: Array<WordType>
  e: Array<WordType>
  f: Array<WordType>
  g: Array<WordType>
  h: Array<WordType>
  i: Array<WordType>
  j: Array<WordType>
  k: Array<WordType>
  l: Array<WordType>
  m: Array<WordType>
  n: Array<WordType>
  o: Array<WordType>
  p: Array<WordType>
  q: Array<WordType>
  r: Array<WordType>
  s: Array<WordType>
  t: Array<WordType>
  u: Array<WordType>
  v: Array<WordType>
  w: Array<WordType>
  x: Array<WordType>
  y: Array<WordType>
  z: Array<WordType>
}
export type ProfileAccountType = {
  firstName: string
  lastName: string
  words: LetterType | Array<WordType>
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
