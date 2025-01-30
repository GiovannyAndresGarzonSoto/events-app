import {Router} from 'express'
import {eventController} from '../controllers/eventController'

const router: Router = Router()

router.post('/create', eventController.create)

router.get('/getAll', eventController.getAll)

router.get('/getById', eventController.getById)

router.put('/update', eventController.update)

router.put('/delete', eventController.delete)

router.post('/join', eventController.join)

router.post('/selectWinner', eventController.selectWinner)

export default router