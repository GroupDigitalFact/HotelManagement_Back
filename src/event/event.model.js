import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

const eventoSchema = new Schema({
    nombre: {
        type: String,
        required: [true, "Event name is required"]
    },
    descripcion: {
        type: String,
        required: [true, "Description is required"]
    },
    fecha: {
        type: Date,
        required: [true, "Event date is required"],
    },
    servicios: [{
        type: Schema.Types.ObjectId,
        ref: 'Service',
    }],
    hotel: {
        type: Schema.Types.ObjectId,
        ref: 'Hotel',
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    totalPrice: {
        type: Number,
        default: 0
    },
    status: {
        type: Boolean,
        required: true,
        default: true
    }
}, {
    versionKey: false,
    timestamps: true
});

export default models.Event || model("Event", eventoSchema);
