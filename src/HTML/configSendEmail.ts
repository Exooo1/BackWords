import path from 'path'
import handlebars from 'handlebars'
import fs from 'fs'
import { SendEmailType } from './typesEmail'

export const createHandlebars = (value: SendEmailType) => {
  const filePath = path.join(__dirname, './sendEmail.html')
  const source = fs.readFileSync(filePath, 'utf-8').toString()
  const template = handlebars.compile(source)
  return template(value)
}
