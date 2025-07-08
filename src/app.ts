import * as express from 'express'
import * as cookieParse from 'cookie-parser'
import * as cors from 'cors'
import authRouter from './routers/auth.router'
import clientsRouter from './routers/client.router'
import userRouter from './routers/user.router'
import invoiceRouter from './routers/invoice.router'
import paymentRouter from './routers/payment.router'

const app  = express()

app.use(cors())
app.use(express.json())
app.use(cookieParse())
app.use('/api/auth',authRouter)
app.use('/api/clients',clientsRouter)
app.use('/api/users',userRouter)
app.use('/api/invoices',invoiceRouter)
app.use('/api/payment',paymentRouter)

export default app

