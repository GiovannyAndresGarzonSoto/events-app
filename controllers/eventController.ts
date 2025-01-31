import { type Request, type Response } from 'express'
import Event, { type IEvent }  from '../models/Event'

export const eventController = {
    create: async (req: Request, res: Response): Promise<void> => {
        try {
            const { name, description, startDate, endDate, maxParticipants, prize, category, creatorId } = req.body
            const newEvent = new Event({
                name,
                description,
                startDate,
                endDate,
                maxParticipants,
                prize,
                category,
                creatorId,
            })

            const savedEvent: IEvent = await newEvent.save()

            res.status(201).json({
                success: true,
                message: 'Evento creado exitosamente',
                event: savedEvent,
            })
        } catch (err) {
            res.status(500).json({
                success: false,
                message: 'Error al crear el evento',
                error: err,
            })
        }
    },

    getAll: async (req: Request, res: Response): Promise<void> => {
        try {
            const events = await Event.find().populate('creatorId', 'name email').populate('participants', 'name email')

            res.status(200).json({
                success: true,
                message: 'Eventos obtenidos exitosamente',
                events,
            })
        } catch (err) {
            res.status(500).json({
                success: false,
                message: 'Error al obtener los eventos',
                error: err,
            })
        }
    },

    getById: async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params

            const event = await Event.findById(id)
                .populate('creatorId', 'name email')
                .populate('participants', 'name email')

            if (!event) {
                res.status(404).json({
                    success: false,
                    message: 'Evento no encontrado',
                })
                return
            }

            res.status(200).json({
                success: true,
                message: 'Evento obtenido exitosamente',
                event,
            })
        } catch (err) {
            res.status(500).json({
                success: false,
                message: 'Error al obtener el evento',
                error: err,
            })
        }
    },

    update: async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params
            const updateData = req.body

            const updatedEvent = await Event.findByIdAndUpdate(id, updateData, { new: true })

            if (!updatedEvent) {
                res.status(404).json({
                    success: false,
                    message: 'Evento no encontrado',
                })
                return
            }

            res.status(200).json({
                success: true,
                message: 'Evento actualizado exitosamente',
                event: updatedEvent,
            })
        } catch (err) {
            res.status(500).json({
                success: false,
                message: 'Error al actualizar el evento',
                error: err,
            })
        }
    },

    delete: async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params

            const deletedEvent = await Event.findByIdAndDelete(id)

            if (!deletedEvent) {
                res.status(404).json({
                    success: false,
                    message: 'Evento no encontrado',
                })
                return
            }

            res.status(200).json({
                success: true,
                message: 'Evento eliminado exitosamente',
                event: deletedEvent,
            })
        } catch (err) {
            res.status(500).json({
                success: false,
                message: 'Error al eliminar el evento',
                error: err,
            })
        }
    },

    join: async (req: Request, res: Response): Promise<void> => {
        try {
            const { eventId, userId } = req.body

            const event = await Event.findById(eventId)

            if (!event) {
                res.status(404).json({
                    success: false,
                    message: 'Evento no encontrado',
                })
                return
            }

            if (event.participants?.includes(userId)) {
                res.status(400).json({
                    success: false,
                    message: 'El usuario ya está participando en este evento',
                })
                return
            }

            // if (event.participants.length >= event.maxParticipants) {
            //     res.status(400).json({
            //         success: false,
            //         message: 'El evento ha alcanzado el límite de participantes',
            //     })
            //     return
            // }

            event.participants?.push(userId)
            await event.save()

            res.status(200).json({
                success: true,
                message: 'Usuario añadido al evento exitosamente',
                event,
            })
        } catch (err) {
            res.status(500).json({
                success: false,
                message: 'Error al unirse al evento',
                error: err,
            })
        }
    },

    selectWinner: async (req: Request, res: Response): Promise<void> => {
        try {
            const { eventId } = req.body

            const event = await Event.findById(eventId).populate('participants', 'name email')

            if (!event) {
                res.status(404).json({
                    success: false,
                    message: 'Evento no encontrado',
                })
                return
            }

            if (event.status !== 'completed') {
                res.status(400).json({
                    success: false,
                    message: 'El evento no ha finalizado',
                })
                return
            }

            const participants = event.participants
            if (participants?.length === 0) {
                res.status(400).json({
                    success: false,
                    message: 'No hay participantes en el evento',
                })
                return
            }

            const winner = participants?[Math.floor(Math.random() * participants.length)]
            //event.winnerId = winner._id
            :await event.save()

            res.status(200).json({
                success: true,
                message: 'Ganador seleccionado exitosamente',
                winner,
            })
        } catch (err) {
            res.status(500).json({
                success: false,
                message: 'Error al seleccionar el ganador',
                error: err,
            })
        }
    },
}