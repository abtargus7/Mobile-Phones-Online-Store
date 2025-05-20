import express from 'express'
import cors from 'cors'

//initialze express app
const app = express()

//middlewares
app.use(cors())
app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true}))
app.use(express.static("public"))



export {app};