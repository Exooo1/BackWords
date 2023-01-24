import { authModel } from '../Auth/authSchema'
import { AccountType } from './configAccount'

type ReturnAccountType<T> = {
  value: T
}

export const returnEmailAccount = async ({ value }: ReturnAccountType<string>) => {
  return (await authModel.findOne({ email: value })) as AccountType
}
