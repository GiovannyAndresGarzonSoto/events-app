import { type Request, type Response } from 'express'
import User, { type IUser } from '../models/User'
import nodemailer from 'nodemailer'
import jwt from 'jsonwebtoken'
import _ from 'lodash'
import { getSeed } from '../../utils'

const nmuser = 'otho.bahringer4@ethereal.email'
const nmpass = '22S6cSD4fzeV7YNCHq'

export const authController = {
    signup: async(req: Request, res: Response): Promise<void> => {
        try{
            const {name, email, password} = req.body
            const verifyUser = await User.findOne({email})
            if(verifyUser){
                res.status(200).json({
                    success: false,
                    message: 'El correo ya existe para otro usuario'
                })
            }
            const newUser: IUser = new User({
                name, 
                email,
                password
            })
            newUser.password = await newUser.encryptPassword(newUser.password)
            const data = await newUser.save()
            const payload = {
                _id: data._id,
                name: data.name,
                email: data.email,
                role: data.role
            }
            const token = jwt.sign(payload, getSeed(), {expiresIn: 1200})
            
            const transporter = nodemailer.createTransport({
                host: 'smtp.ethereal.email',
                port: 587,
                secure: false,
                auth: {
                    user: nmuser,
                    pass: nmpass
                },
                tls: {
                    rejectUnauthorized: false
                }
            })

            const info = await transporter.sendMail({
                from: 'noreply@mipet.com',
                to: email,
                subject: 'Pkapp Account Activation Link',
                html: `
                <h2>Please click on given link to activate your mipet account</h2>
                <p>localhost:8080/auth/activate/${token}</p>`
            })
            if(!info){
                res.json({
                    success: false,
                    message: 'Problemas al enviar correo de verificacion'
                })
            } 
            res.json({
                success: true,
                message: 'Le hemos enviado un correo para verificar su cuenta'
            })
        }catch(err){
            res.status(200).json({
                success: false,
                message: 'Problemas al registrar el Usuario',
                err
            })
        }
    },

    signin: async(req: Request, res: Response): Promise<void> => {
        try{
            const data = await User.findOne({email: req.body.email})
            if(!data){
                res.status(200).json({
                    success: false,
                    message: 'Correo o contraseña erronea'
                })
            }
            const correctPassword: boolean | undefined = await data?.validatePassword(req.body.password) 
            if(!correctPassword){
                res.status(200).json({
                    success: false,
                    message: 'Correo o contraseña erronea'
                })
            }
            if(!data?.active) {
                res.status(200).json({
                    success: false,
                    message: 'Es necesario confirmar su correo'
                })
            }
            const payload = {
                _id: data?._id,
                email: data?.email,
                role: data?.role
            }
            const token = jwt.sign(payload, getSeed(), {
                expiresIn: 60*60*2 
            })
            res.json({
                success: true,
                token
            })
        }catch(err){
            res.status(200).json({
                sucess: false,
                message: 'No se pudo autenticar el Usuario',
                err
            })
        }
    },

    activateAccount: async(req: Request, res: Response): Promise<void> => {
        try{
            const {token} = req.body 
            if(!token) {
                res.status(200).json({
                    success: false,
                    message: 'Es necesario un token'
                })
            }
            const decoded: any = jwt.verify(token, getSeed())
            if(!decoded){
                res.status(200).json({
                    success: false,
                    message: 'Token erroneo o expirado'
                })
            }
            const {email} = decoded
            const user = await User.findOne({email})
            if (!user) {
                res.status(200).json({
                    success: false,
                    message: 'Usuario no encontrado'
                });
            }
            await user?.updateOne({active: true})
            res.json({
                success: true,
                message: 'La cuenta ha sido activada'
            })
        }catch(err){
            res.status(200).json({
                success: false,
                message: 'Error al activar la cuenta',
                err
            })
        }
    },

    forgotPassword: async(req: Request, res: Response): Promise<void> => {
        try{
            const {email} = req.body
            const user = await User.findOne({email})
            if(!user){
                res.status(200).json({
                    success: false,
                    message: 'Problemas al realizar la operacion'
                })
            }
            const token = jwt.sign({_id: user?._id}, getSeed(), {expiresIn: 1200})
            const transporter = nodemailer.createTransport({
                host: 'smtp.ethereal.email',
                port: 587,
                secure: false,
                auth: {
                    user: nmuser,
                    pass: nmpass
                },
                tls: {
                    rejectUnauthorized: false
                }
            })
            const info = await transporter.sendMail({
                from: 'noreply@mipet.com', // sender address,
                to: email,
                subject: 'Pkapp Reset Password Link',
                html: `
                    <h2>Please click on given link to reset your password</h2>
                    <p>localhost:8080/auth/resetpass/${token}</p>`
            })
            console.log(info)
            if(!info){
                res.json({
                    success: false,
                    message: 'Problemas al cambiar su contraseña'
                })
            }
            const data = await user?.updateOne({resetLink: token})
            console.log(data)
            if(!data){
                res.status(200).json({
                    success: false,
                    message: 'Enlace de resetear contraseña incorrecto'
                })
            }
            res.json({
                success: true,
                message: 'Le hemos enviado un enlace para resetear la contraseña'
            })
        }catch(err){
            res.status(200).json({
                success: false,
                message: 'Error al enviar enlace para resetear contraseña',
                err
            })
        }
    },
    
    resetPassword: async(req: Request, res: Response): Promise<void> => {
        try{
            const {resetLink, newPass} = req.body
            if(!resetLink){
                res.status(200).json({
                    success: false,
                    message: 'Token incorrecto o expirado'
                })
            }
            const decoded = jwt.verify(resetLink, getSeed())
            if(!decoded){
                res.status(200).json({
                    success: false,
                    message: 'Error al verificar el token'
                })
            }
            let user = await User.findOne({resetLink})
            const obj = {
                password: newPass,
                resetLink: ''
            }
            user = _.extend(user, obj)
            user.password = await user.encryptPassword(user.password)
            const modifiedUser = await user.save()
            if(!modifiedUser){
                res.status(200).json({
                    success: false,
                    message: 'Error al modificar contraseña',
                })
            }
            res.json({
                success: true,
                message: 'Tu contraseña ha sido modificada'
            })
        }catch(err){
            res.status(200).json({
                success: false,
                message: 'Error al resetear contraseña',
                err
            })
        }
    } 
}