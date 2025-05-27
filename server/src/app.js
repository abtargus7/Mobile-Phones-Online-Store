import express from 'express'
import cors from 'cors'
import userRouter from './routes/user.routes.js'
import productRouter from './routes/product.routes.js'
import errorHandler from './middlewares/errorHandler.middleware.js'
import cookieParser from 'cookie-parser'

import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import { fileURLToPath } from 'url';

//initialze express app
const app = express()


//ES Module workaround for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load YAML file file swagger
const swaggerDocument = YAML.load(path.join(__dirname, '..', 'swagger.yaml'));


//middlewares
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))
app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true}))
app.use(express.static("public"))
app.use(cookieParser())

//routes
app.use('/api/v1/user', userRouter)
app.use('/api/v1/product', productRouter)

//route for swagger api documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//error handling middleware
app.use(errorHandler)

export {app};