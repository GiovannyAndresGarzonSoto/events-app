import express, {type Application} from 'express' 
import morgan from 'morgan'
import routes from './src/routes'
import path from 'path'
import env from 'dotenv'
import cors from 'cors'
import swaggerUI from 'swagger-ui-express'
import { swaggerDefinition } from './docs/swaggerDefinition'
import YAML from 'yamljs'

env.config()

const app: Application = express()
const swaggerDocument = YAML.load('./docs/swagger.yaml')   

app.use(cors())
app.use(morgan('dev'))
app.set('port', process.env.PORT)
app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use('/api', routes)
app.use(express.static(path.join(__dirname, '../public')))

app.use('/api/docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument))

export default app