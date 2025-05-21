import { body, param} from "express-validator";
import { validarCampos } from "./validate-fields.js";
import { deleteFileOnError } from "./delete-file-on-error.js";
import { handleErrors } from "./handle-errors.js";
import { validateJWT } from "./validate-jwt.js";
import { hasRoles } from "../middlewares/validate-roles.js";

export const createEventValidator = [
    validateJWT,
    hasRoles("USER_ROLE", "ADMIN_ROLE", "HOTEL_ADMIN_ROLE"),
    body("nombre").notEmpty().withMessage("El nombre del evento es requerido"),
    body("descripcion").notEmpty().withMessage("La descripcion del evento es requerida"),
    body("fecha").notEmpty().withMessage("La fecha del evento es requerida"),
    body("servicios").optional().notEmpty().withMessage("Los servicios son requeridos"),
    body("hotel").notEmpty().isMongoId().withMessage("El hotel es requerido"),
    validarCampos,
    deleteFileOnError,
    handleErrors
];

export const editDeleteEventValidator = [
    validateJWT,
    hasRoles("USER_ROLE", "ADMIN_ROLE", "HOTEL_ADMIN_ROLE"),
    param("uid").notEmpty().withMessage("El evento es requerido"),
    body("nombre").optional().notEmpty().withMessage("El nombre del evento es requerido"), 
    body("descripcion").optional().notEmpty().withMessage("La descripcion del evento es requerida"), 
    body("fecha").optional(),
    validarCampos,
    deleteFileOnError,
    handleErrors
];


export const DeleteEventValidator = [
    validateJWT,
    hasRoles("USER_ROLE","ADMIN_ROLE", "HOTEL_ADMIN_ROLE"),
    param("uid").notEmpty().withMessage("El evento es requerido"),
    validarCampos,
    deleteFileOnError,
    handleErrors
]


export const getEventByUserValidator = [
    validateJWT,
]