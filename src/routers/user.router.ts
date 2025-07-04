import { Router } from "express";
import { auth } from "../middlewares/auth.middleware";
import { deleteUser, getUser, getUsers, updateUser } from "../controllers/user.controller";

const router = Router()

router.get('/',auth,getUsers)
router.get('/:id',auth,getUser)
router.put('/:id',auth,updateUser)
router.delete('/:id',auth,deleteUser)

export default router