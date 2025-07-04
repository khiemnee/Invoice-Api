import { Router } from "express";
import { auth } from "../middlewares/auth.middleware";
import { invoicePayment, invoicePaymentStatus } from "../controllers/payment.controller";

const router = Router()

router.post('/:id',auth,invoicePayment)
router.get('/status',invoicePaymentStatus)

export default router