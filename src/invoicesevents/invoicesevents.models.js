import { Schema, model } from "mongoose";

const eventInvoice = new Schema({
  event: {
    type: Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  total: {
    type: Number,
    required: true,
    min: [0, "El total no puede ser negativo"]
  },
  date: {
    type: Date,
    default: Date.now
  }
}, {
  versionKey: false,
  timestamps: true
});

export default model("EventInvoice", eventInvoice);