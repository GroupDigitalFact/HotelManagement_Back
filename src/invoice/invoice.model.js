import { Schema, model } from "mongoose";
/**
 * @swagger
 * components:
 *   schemas:
 *     Invoice:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Identificador único de la factura.
 *           example: 609bda8f1c4ae34d5c8f9b2a
 *         reservation:
 *           type: string
 *           description: Identificador único de la reservación asociada.
 *           example: 609bda8f1c4ae34d5c8f9b2b
 *         total:
 *           type: number
 *           description: Total a pagar por la factura.
 *           example: 150.75
 *         Date:
 *           type: string
 *           format: date
 *           description: Fecha de emisión de la factura.
 *           example: 2025-05-15
 */
const invoiceSchema = new Schema({
    reservation: {
        type: Schema.Types.ObjectId,
        ref: 'Reservation',
        required: true
    },
    total: {
        type: Number,
        required: true,
        min: [0, "El total no puede ser negativo"]
    },
    Date: {
        type: Date,
        default: Date.now
    }
}, {
    versionKey: false,
    timestamps: true
});

export default model("Invoice", invoiceSchema);