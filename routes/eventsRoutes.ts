import { Router } from 'express'
import { eventController } from '../controllers/eventController'

const router: Router = Router()

/**
 * @swagger
 * /api/events:
 *   get:
 *     summary: Get all events
 *     tags: [Events]
 *     responses:
 *       200:
 *         description: Events retrieved successfully
 *       500:
 *         description: Error retrieving events
 */
router.get('/', eventController.getAll)

/**
 * @swagger
 * /api/events/{id}:
 *   get:
 *     summary: Get event by ID
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Event retrieved successfully
 *       404:
 *         description: Event not found
 *       500:
 *         description: Error retrieving event
 */
router.get('/:id', eventController.getById)

/**
 * @swagger
 * /api/events:
 *   post:
 *     summary: Create a new event
 *     tags: [Events]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date-time
 *               endDate:
 *                 type: string
 *                 format: date-time
 *               maxParticipants:
 *                 type: integer
 *               prize:
 *                 type: string
 *               category:
 *                 type: string
 *               creatorId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Event created successfully
 *       500:
 *         description: Error creating event
 */
router.post('/', eventController.create)

/**
 * @swagger
 * /api/events/{id}:
 *   put:
 *     summary: Update event by ID
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Event updated successfully
 *       404:
 *         description: Event not found
 *       500:
 *         description: Error updating event
 */
router.put('/:id', eventController.update)

/**
 * @swagger
 * /api/events/{id}:
 *   delete:
 *     summary: Delete event by ID
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Event deleted successfully
 *       404:
 *         description: Event not found
 *       500:
 *         description: Error deleting event
 */
router.delete('/:id', eventController.delete)

/**
 * @swagger
 * /api/events/join:
 *   post:
 *     summary: Join an event
 *     tags: [Events]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               eventId:
 *                 type: string
 *               userId:
 *                 type: string
 *     responses:
 *       200:
 *         description: User added to event successfully
 *       404:
 *         description: Event not found
 *       400:
 *         description: User already participating or event full
 *       500:
 *         description: Error joining event
 */
router.post('/join', eventController.join)

/**
 * @swagger
 * /api/events/selectWinner:
 *   post:
 *     summary: Select a winner for an event
 *     tags: [Events]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               eventId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Winner selected successfully
 *       404:
 *         description: Event not found
 *       400:
 *         description: Event not completed or no participants
 *       500:
 *         description: Error selecting winner
 */
router.post('/selectWinner', eventController.selectWinner)

export default router
