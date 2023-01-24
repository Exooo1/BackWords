import dotenv from 'dotenv'

dotenv.config()
export const secretJWT = process.env.SECRET_JWT
export type userIDType = {
  userId: String
}
