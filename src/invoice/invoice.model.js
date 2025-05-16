import { Schema, model } from "mongoose";

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