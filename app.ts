import express, {type Application} from 'express' 
import morgan from 'morgan'
import routes from './routes'
import path from 'path'
import env from 'dotenv'
import cors from 'cors'
import swaggerJsDoc from 'swagger-jsdoc'
import swaggerUI from 'swagger-ui-express'

const app: Application = express()
env.config()

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Events API',
            description: 'Events API Docs for developers',
            contact: {
                name: 'giovannygarzonsoto@gmail.com'
            },
            servers: [`http://localhost:${process.env.PORT}`],
            version: '1.0.0'
        }
    },
    apis: [path.join(__dirname, './routes/*.ts')]
}    

app.use(cors())
app.use(morgan('dev'))
app.set('port', process.env.PORT)
app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use('/api', routes)
app.use(express.static(path.join(__dirname, '../public')))

const swaggerDocs = swaggerJsDoc(swaggerOptions)
app.use('/api/docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs))

export default app