import * as dotenv from 'dotenv'

dotenv.config()

export const accessTokenKey = process.env.accessTokenKey
export const refeshTokenKey = process.env.refeshTokenKey
export const vnpaySecureSecret = process.env.vnpaySecureSecret
export const vnpayTmnCode = process.env.vnpayTmnCode
export const vnpayHost = process.env.vnpayHost
export const vnpayAddress = process.env.vnpayAddress
export const emailApiKey = process.env.emailApiKey
export const port = process.env.port
export const DB_HOST=process.env.DB_HOST
export const DB_PORT=process.env.DB_PORT
export const DB_USERNAME=process.env.DB_USERNAME
export const DB_PASSWORD=process.env.DB_PASSWORD
export const DB_DATABASE=process.env.DB_DATABASE