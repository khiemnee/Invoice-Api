import { Router } from "express";
import { auth } from "../middlewares/auth.middleware";
import { createInvoices, deleteInvoice, getInvoice, getInvoicePdf, getInvoices, updateInvoice } from "../controllers/invoice.controller";

const router = Router()

router.post('/',auth,createInvoices)
router.get('/',auth,getInvoices)
router.get('/:id',auth,getInvoice)
router.put('/:id',auth,updateInvoice)
router.delete('/:id',auth,deleteInvoice)
router.get('/:id/download',auth,getInvoicePdf)

export default router