import * as dotenv from 'dotenv'

dotenv.config()

export const accessTokenKey = process.env.accessTokenKey
export const refeshTokenKey = process.env.refeshTokenKey
export const vnpaySecureSecret = process.env.vnpaySecureSecret
export const vnpayTmnCode = process.env.vnpayTmnCode
export const vnpayHost = process.env.vnpayHost
export const vnpayAddress = process.env.vnpayAddress
export const emailApiKey = process.env.emailApiKey