import express from 'express'
import cors from 'cors'
import userRouter from './routes/user.routes.js'
import productRouter from './routes/product.routes.js'
import errorHandler from './middlewares/errorHandler.middleware.js'
import cookieParser from 'cookie-parser'

//initialze express app
const app = express()

//middlewares
app.use(cors())
app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true}))
app.use(express.static("public"))
app.use(cookieParser())

//routes
app.use('/api/v1/user', userRouter)
app.use('/api/v1/product', productRouter)

app.use(errorHandler)

export {app};