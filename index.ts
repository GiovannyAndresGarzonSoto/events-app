import app from './app'
import {connectDatabase} from './database'

const main = () => {
    app.listen(app.get('port'))
    console.log(`Server running on port ${app.get('port')}`)
    console.log(`Documentation API in http://localhost:${app.get('port')}/api/docs`)
    connectDatabase()
}

main()