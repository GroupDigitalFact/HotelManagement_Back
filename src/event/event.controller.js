import Hotel from '../hotel/hotel.model.js';
import Event from './event.model.js';
import Service from '../service/service.model.js';
import { startOfDay, endOfDay } from 'date-fns';

export const listEvent = async (req, res) =>{
    try{        
        const events = await Event.find({status: true}).populate('hotel','name').populate('user','email')
          .populate('servicios','name')
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
    const data = req.body;

    if (!data.user) {
      return res.status(400).json({
        message: "Error al crear el evento",
        error: "El usuario es requerido para crear un evento"
      });
    }

    if (!data.hotel) {
      return res.status(400).json({
        message: "Error al crear el evento",
        error: "El hotel es requerido para crear un evento"
      });
    }

    const hotel = await Hotel.findById(data.hotel);
    if (!hotel) {
      return res.status(404).json({
        message: "Error al crear el evento",
        error: "Hotel no encontrado"
      });
    }

    const eventosEnFecha = await Event.countDocuments({
      fecha: data.fecha,
      status: true,
      hotel: data.hotel
    });

    if (eventosEnFecha >= hotel.quantitySalons) {
      return res.status(400).json({
        message: "Error al crear el evento",
        error: "No hay salones disponibles para esta fecha en este hotel"
      });
    }

    let totalServicios = 0;

    if (Array.isArray(data.servicios) && data.servicios.length > 0) {
      const serviciosDB = await Service.find({ _id: { $in: data.servicios }, status: true });
      totalServicios = serviciosDB.reduce((acc, servicio) => acc + servicio.priceService, 0);
    }

    const totalPrice = hotel.priceBaseEvent + totalServicios;

    data.totalPrice = totalPrice;

    const event = await Event.create(data);

    if (!event) {
      return res.status(400).json({
        message: "Error al crear tu evento",
        error: "El evento no ha sido creado"
      });
    }

    return res.status(200).json({
      message: "Evento creado con éxito",
      event
    });

  } catch (e) {
    return res.status(500).json({
      message: "Error al crear evento",
      error: e.message
    });
  }
};

export const updateEvent = async (req, res) => {
  const { uid } = req.params;
  const data = req.body;

  try {
    const event = await Event.findById(uid);

    if (!event) {
      return res.status(404).json({
        message: "Evento no encontrado"
      });
    }

    const date = data.fecha;

    const eventDate = await Event.findOne({ fecha: date, _id: { $ne: uid } });

    if (eventDate) {
      return res.status(400).json({
        message: "Error al actualizar el evento",
        error: "Ya existe un evento para esta fecha"
      });
    }

    await Event.findByIdAndUpdate(uid, data, { new: true });

    const eventUpdated = await Event.findById(uid);

    res.status(200).json({
      message: "Evento actualizado con éxito",
      event: eventUpdated
    });

  } catch (error) {
    res.status(500).json({
      message: "Error en el servidor al actualizar evento",
      error: error.message
    });
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

export const listUserEvents = async (req, res) => {
  try {
    const usuarioId = req.usuario._id;

    const events = await Event.find({ user: usuarioId, status: true })
      .populate('hotel', 'name')
      .populate('servicios', 'name');

    if (!events || events.length === 0) {
      return res.status(404).json({
        message: 'No tienes eventos registrados.'
      });
    }

    return res.status(200).json({
      message: 'Eventos encontrados',
      events
    });

  } catch (error) {
    return res.status(500).json({
      message: 'Error al obtener eventos del usuario',
      error: error.message
    });
  }
};

export const createEventUser = async (req, res) => {
  try {
    const data = req.body;
    const userId = req.usuario._id;
    data.user = userId;

    if (!data.hotel) {
      return res.status(400).json({
        message: "Error al crear el evento",
        error: "El hotel es requerido para crear un evento"
      });
    }

    const hotel = await Hotel.findById(data.hotel);
    if (!hotel) {
      return res.status(404).json({
        message: "Error al crear el evento",
        error: "Hotel no encontrado"
      });
    }

    const eventosEnFecha = await Event.countDocuments({
      fecha: data.fecha,
      status: true,
      hotel: data.hotel
    });

    if (eventosEnFecha >= hotel.quantitySalons) {
      return res.status(400).json({
        message: "Error al crear el evento",
        error: "No hay salones disponibles para esta fecha en este hotel"
      });
    }

    let totalPrice = 0;

    if (data.servicios && data.servicios.length > 0) {
      const servicios = await Service.find({ _id: { $in: data.servicios } });
      totalPrice = servicios.reduce((total, serv) => total + serv.priceService, 0);
    }

    totalPrice += hotel.priceBaseEvent;

    data.totalPrice = totalPrice;

    const event = await Event.create(data);

    if (!event) {
      return res.status(400).json({
        message: "Error al crear tu evento",
        error: "El evento no ha sido creado"
      });
    }

    return res.status(200).json({
      message: "Evento creado con éxito",
      event
    });

  } catch (e) {
    return res.status(500).json({
      message: "Error al crear evento",
      error: e.message
    });
  }
};

export const listTodayEvents = async (req, res) => {
    try {

        const todayStart = startOfDay(new Date());
        const todayEnd = endOfDay(new Date());

  
        const filter = {
            status: true,
            fecha: {
                $gte: todayStart,
                $lte: todayEnd
            }
        };

        const events = await Event.find(filter)
            .populate('hotel', 'name')
            .populate('user', 'email')
            .populate('servicios', 'name');

        return res.status(200).json({ events });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error al obtener los eventos de hoy",
            error: err.message
        });
    }
};
