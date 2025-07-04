import { Router } from "express";
import { auth } from "../middlewares/auth.middleware";
import { createClients, deleteClient, getClient, getClients, updateClient } from "../controllers/client.controller";

const router = Router()

router.get('/',auth,getClients)
router.get('/:id',auth,getClient)
router.post('/',auth,createClients)
router.put('/:id',auth,updateClient)
router.delete('/:id',auth,deleteClient)

export default router