import * as jwt from 'jsonwebtoken'
import { accessTokenKey, refeshTokenKey } from '../secret'

export const accessToken = async(id : number) =>{
    const token = jwt.sign({id},accessTokenKey,{expiresIn : '15m'})
    return token
}

export const refeshAccessToken = async (id:number) =>{
 const token = jwt.sign({id},refeshTokenKey,{expiresIn : '7d'})
    return token
}