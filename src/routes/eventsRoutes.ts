import { Router } from 'express'
import { eventController } from '../controllers/eventController'

const router: Router = Router()

router.get('/', eventController.getAll)

router.get('/:id', eventController.getById)

router.post('/', eventController.create)

router.put('/:id', eventController.update)

router.delete('/:id', eventController.delete)

router.post('/join', eventController.join)

router.post('/selectWinner', eventController.selectWinner)

export default router
