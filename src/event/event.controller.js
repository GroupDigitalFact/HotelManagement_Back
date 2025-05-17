import Hotel from '../hotel/hotel.model.js';
import Event from './event.model.js';

export const listEvent = async (req, res) =>{
    try{
        
        const events = await Event.find({status: true});

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
    const  uid  = req.usuario._id
    const data = req.body;
    data.user = uid;
    const date = data.fecha;
    
    const eventDate = await Event.findOne({date});
    if (eventDate) {
      return res.status(400).json({
        message: "Error al crear el evento",
        error: "Ya existe un evento para esta fecha"
      })
    }

    const event = await Event.create(data);
    
    if (!event) {
      return res.status(400).json({
        message: "Error al crear tu evento",
        error: "El evento no ha sido encontrado"
      })
    }
    return res.status(200).json({
      message: "Evento creado con exito",
      event
    
    })
  }catch (e){
    return res.status(500).json({
      message: "Error al crear evento",
      error: e.message
    })
  }
};

export const updateEvent = async (req, res) => {
  try {
    const { uid } = req.params;
    const data = req.body;
    const date = data.fecha;
    const eventDate = await Event.findOne({date});
    if (eventDate) {
       return res.status(400).json({
        message: "Error al actualizar el evento",
        error: "Ya existe un evento para esta fecha"
      })
    }
    
    const event = await Event.findByIdAndUpdate(uid, data, { new: true });
    
    if (!event) {
      return res.status(400).json({
        message: "Error al actualizar el evento",
        error: "Evento no encontrado"
      })
    }
    
    return res.status(200).json({
      message: "Evento actualizado con exito",
      event 
    })
  }catch (e){
    return res.status(500).json({
      message: "Error al actualizar evento",
      error: e.message
    })
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const { uid } = req.params;
    const event = await Event.findByIdAndUpdate(uid, { status: false }, { new: true });

        if (!event) {
            return res.status(400).json({
                message: "Error al eliminar el evento",
                error: "Evento no encontrado"
            })
        }
        return res.status(200).json({
            message: "Evento ah sido cancelado con exito ",
            event
        })
    }catch (e){
        return res.status(500).json({
            message: "Error al eliminar el evento",
            error: e.message
        })
    }
};
