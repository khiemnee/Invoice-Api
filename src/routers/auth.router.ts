import { Router } from "express";
import { getMe, loginUser, logOut, refeshToken, registerUser } from "../controllers/auth.controller";
import { auth } from "../middlewares/auth.middleware";

const router = Router()

router.post('/register',registerUser)
router.post('/login',loginUser)
router.get('/me',auth,getMe)
router.post('/refeshToken',refeshToken)
router.delete('/logOut',auth,logOut)

export default router