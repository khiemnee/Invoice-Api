import { NextFunction, Request,Response } from "express";
import * as jwt from 'jsonwebtoken'
import { AppDataSource } from "../database/data-source";
import { User } from "../entity/User";

const userRepository = AppDataSource.getRepository(User)

export const auth = async (req:Request,res:Response,next:NextFunction) =>{
    try {
        const token = req.headers.authorization.replace('Bearer ','')

        const decode = jwt.verify(token,'accessTokenKeyInvoice') as {id : number}

        const user = await userRepository.findOne({
            where : {
                id : decode.id
            }
        })

        if(!user){
             res.status(403).send({
                error : 'not authorized'
            })
            return
        }

        req.user = user

        next()


    } catch (error) {
        if(error instanceof Error){
            res.status(500).send(error.message)
        }
    }
}