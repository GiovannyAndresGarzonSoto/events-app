import usersRoutes from './usersRoutes'
import eventsRoutes from './eventsRoutes'

import {Router} from 'express'

const router: Router = Router()

router.use('/auth', usersRoutes)
router.use('/events', eventsRoutes)

export default router