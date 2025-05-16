import Hotel from '../hotel/hotel.model.js';
import Event from './event.model.js';

export const listEvent = async (req, res) =>{
    try{
        
        const events = await Event.find();

        if(!events){
            return res.status(404).json({
                message: "Events not found"
            })
        }

        return res.status(200).json({
            events
        })

    }catch(err){
        return res.status(500).json({
            succes: false,
            message: "Error al obtener los eventos",
            error: err.message
        });
    }
};

export const createEvent = async (req, res) => {
  try {
    const { hotelId, nombre, descripcion, fecha, servicios } = req.body;

    const hotel = await Hotel.findById(hotelId);
    if (!hotel) return res.status(404).json({ message: 'Hotel no encontrado' });

    const nuevoEvento = new Event({ nombre, descripcion, fecha, servicios, hotel: hotelId });
    await nuevoEvento.save();

    res.status(201).json({ message: 'Evento creado con éxito', evento: nuevoEvento });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear evento', error: error.message });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const { hotelId, eventId } = req.params;
    const updates = req.body;

    const evento = await Event.findOne({ _id: eventId, hotel: hotelId });
    if (!evento) return res.status(404).json({ message: 'Evento no encontrado en este hotel' });

    const eventoActualizado = await Event.findByIdAndUpdate(eventId, updates, { new: true });
    res.status(200).json({ message: 'Evento actualizado', evento: eventoActualizado });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar evento', error: error.message });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const { hotelId, eventId } = req.params;

    const evento = await Event.findOne({ _id: eventId, hotel: hotelId });
    if (!evento) return res.status(404).json({ message: 'Evento no encontrado en este hotel' });

    await Event.findByIdAndDelete(eventId);
    res.status(200).json({ message: 'Evento eliminado' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar evento', error: error.message });
  }
};

export const getEventsByHotel = async (req, res) => {
  try {
    const { hotelId } = req.params;

    const eventos = await Event.find({ hotel: hotelId }).populate('servicios');
    res.status(200).json(eventos);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener eventos', error: error.message });
  }
};
