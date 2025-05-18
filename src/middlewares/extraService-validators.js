import { body, param } from 'express-validator'
import { hotelExists } from '../helpers/db-validators.js'
import { handleErrors } from "./handle-errors.js"
import { validarCampos } from './validar-campos.js'
import { validateJWT } from './validate-jwt.js'
import { hasRoles } from './validate-roles.js'

export const createExtraServiceValidator = [
    validateJWT,
    hasRoles('USER_ROLE', 'ADMIN_ROLE', 'HOTEL_ADMIN_ROLE'),
    body('name').notEmpty().withMessage('El nombre es obligatorio'),
    body('description').notEmpty().withMessage('La descripción es obligatoria'),
    body('cost').isNumeric().withMessage('El precio debe ser un número'),
    body('hotel').notEmpty().withMessage('El hotel es obligatorio'),
    body('hotel').isMongoId().custom(hotelExists).withMessage('El hotel debe ser un ID de Mongo válido'),
    validarCampos,
    handleErrors
]

export const updateExtraServiceValidator = [
    validateJWT,
    hasRoles('USER_ROLE', 'ADMIN_ROLE', 'HOTEL_ADMIN_ROLE'),
    param("uid").notEmpty().isMongoId().withMessage("El evento es requerido"),
    body('name').optional().notEmpty().withMessage('El nombre es obligatorio'),
    body('description').optional().notEmpty().withMessage('La descripción es obligatoria'),
    body('cost').optional().isNumeric().withMessage('El precio debe ser un número'),
    body('hotel').optional().notEmpty().withMessage('El hotel es obligatorio'),
    body('hotel').optional().isMongoId().custom(hotelExists).withMessage('El hotel debe ser un ID de Mongo válido'),
    validarCampos,
    handleErrors
]

export const deleteExtraServiceValidator = [
    validateJWT,
    hasRoles('USER_ROLE', 'ADMIN_ROLE', 'HOTEL_ADMIN_ROLE'),
    param("uid").notEmpty().isMongoId().withMessage("El ID del servicio extra es requerido"),
    validarCampos,
    handleErrors
];