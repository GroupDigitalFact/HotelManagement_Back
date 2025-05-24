import jwt from 'jsonwebtoken';
import Hotel from '../hotel/hotel.model.js';
import Room from '../room/room.model.js';
import Reservation from '../reservation/reservation.model.js';
import Invoice from '../invoice/invoice.model.js';
import Event from '../event/event.model.js';

export const getHotels = async (req, res) => {
    try {
      const hotels = await Hotel.find({ status: true }).populate('admin', 'name surname');
      res.status(200).json({ hotels });
    } catch (error) {
      res.status(500).json({ error: "Error to find it" });
    }
  };


export const searchHotel = async (req, res) => {
    try {
      const { name, address, qualification, category } = req.body;
  
      let searchCriteria = {};
  
      if (name) {
        searchCriteria.name = { $regex: name, $options: 'i' }; 
      }
      if (address) {
        searchCriteria.address = { $regex: address, $options: 'i' };
      }
      if (qualification) {
        searchCriteria.qualification = qualification; 
      }
      if (category) {
        searchCriteria.category = category; 
      }
  
      const hotels = await Hotel.find(searchCriteria);
  
      if (hotels.length === 0) {
        return res.status(404).json({ message: 'No se encontraron hoteles con los criterios indicados' });
      }
  
      res.json(hotels);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al buscar hoteles' });
    }
  };


export const registerHotel = async (req, res) => {
  try {
    const data = req.body;
    const file = req.file?.filename;
    
    data.hotelPicture = file;
    const hotel = await Hotel.create(data);

    res.status(201).json({ message: 'Hotel registrado correctamente', hotel });
  } catch (error) {
    console.error('Error al registrar el hotel:', error);
    res.status(500).json({ message: 'Error al registrar el hotel', error: error.message });
  }
};

  export const updateHotel = async (req, res) => {
    try {
      const { id } = req.params;
      const updateFields = req.body;
  
      const hotel = await Hotel.findById(id);
      if (!hotel) return res.status(404).json({ message: 'Hotel no encontrado' });
  
      Object.assign(hotel, updateFields);
  
      await hotel.save();
  
      res.json({ message: 'Hotel actualizado correctamente', hotel });
    } catch (error) {
      console.error('Error al actualizar el hotel:', error);
      res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    }
  };

  export const searchHotelsAdmin = async (req, res) => {
    try {
      const token = req.header('Authorization');
      if (!token) return res.status(401).json({ message: 'Token no proporcionado' });
  
      const { uid } = jwt.verify(token.replace('Bearer ', ''), process.env.SECRETORPRIVATEKEY);
  
      const hoteles = await Hotel.find({ admin: uid, status: true });
  
      if (!hoteles.length) {
        return res.status(404).json({ message: 'No se encontraron hoteles administrados por este usuario' });
      }
  
      res.json({ hoteles });
  
    } catch (error) {
      console.error('Error al buscar hoteles del admin:', error);
      res.status(500).json({ message: 'Error al obtener los hoteles', error: error.message });
    }
  };

  export const deleteHotel = async (req, res) => {
    try {
      const { id } = req.params;
  
      const hotel = await Hotel.findById(id);
      if (!hotel) {
        return res.status(404).json({ message: 'Hotel no encontrado' });
      }
  
      const habitaciones = await Room.find({ hotel: id });
  
      for (const habitacion of habitaciones) {
        await Reservation.updateMany(
          { room: habitacion._id },
          { state: 'cancelada' }
        );
  
        await Room.findByIdAndDelete(habitacion._id);
      }
  
      await Hotel.findByIdAndDelete(id);
  
      res.json({ message: 'Hotel eliminado junto con sus habitaciones y reservas canceladas' });
  
    } catch (error) {
      console.error('Error al eliminar hotel:', error);
      res.status(500).json({ message: 'Error al eliminar el hotel', error: error.message });
    }
  };

  export const obtenerEstadisticasHotel = async (req, res) => {
    try {
      const token = req.header('Authorization');
      if (!token) return res.status(401).json({ message: 'Token no proporcionado' });
  
      const { uid: adminId } = jwt.verify(token.replace("Bearer ", ""), process.env.SECRETORPRIVATEKEY);
  
      const hoteles = await Hotel.find({ admin: adminId });
      const estadisticas = [];
  
      for (const hotel of hoteles) {
        const habitaciones = await Room.find({ hotel: hotel._id });
        const habitacionesIds = habitaciones.map(h => h._id);
  
        const reservas = await Reservation.find({ room: { $in: habitacionesIds } }).populate('extraServices');
  
        const ingresos = await Invoice.aggregate([
          { $match: { reservation: { $in: reservas.map(r => r._id) } } },
          {
            $group: {
              _id: { $month: "$createdAt" },
              total: { $sum: "$total" }
            }
          },
          { $sort: { "_id": 1 } }
        ]);
  
        const ingresosMensuales = Array(12).fill(0);
        ingresos.forEach(i => {
          ingresosMensuales[i._id - 1] = i.total;
        });
  
        const servicioContador = {};
        reservas.forEach(reserva => {
          reserva.extraServices.forEach(servicio => {
            const nombre = servicio.name;
            servicioContador[nombre] = (servicioContador[nombre] || 0) + 1;
          });
        });
  
        const serviciosMasUsados = Object.entries(servicioContador)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);
  
        estadisticas.push({
          hotelId: hotel._id,
          hotelNombre: hotel.name,
          totalHabitaciones: habitaciones.length,
          habitacionesOcupadas: reservas.filter(r => r.status === "confirmada").length,
          totalReservas: reservas.length,
          ingresosMensuales,
          serviciosMasUsados
        });
      }
  
      res.json({ estadisticas });
  
    } catch (error) {
      console.error("Error al obtener estadísticas:", error);
      res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    }
  };

export const obtenerEstadisticasPorHotelId = async (req, res) => {
  try {
    const { id } = req.params;

    const hotel = await Hotel.findById(id).populate('admin', 'name surname email');
    if (!hotel) return res.status(404).json({ message: 'Hotel no encontrado' });

    const habitaciones = await Room.find({ hotel: hotel._id });
    const habitacionesIds = habitaciones.map(h => h._id);

    const reservas = await Reservation.find({ room: { $in: habitacionesIds } }).populate('extraServices');

    const ingresosReservas = await Invoice.aggregate([
      { $match: { reservation: { $in: reservas.map(r => r._id) } } },
      {
        $group: {
          _id: { $month: "$createdAt" },
          total: { $sum: "$total" }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    const eventos = await Event.find({ hotel: hotel._id });

    const ingresosPorReservas = Array(12).fill(0);
    ingresosReservas.forEach(i => {
      ingresosPorReservas[i._id - 1] += i.total;
    });

    const ingresosPorEventos = Array(12).fill(0);
    const eventosCountPorMes = Array(12).fill(0);
    const eventosNombresPorMes = Array.from({ length: 12 }, () => []);

    eventos.forEach(evento => {
      const mes = new Date(evento.fecha).getMonth();
      ingresosPorEventos[mes] += evento.totalPrice;
      eventosCountPorMes[mes]++;
      eventosNombresPorMes[mes].push(evento.nombre);
    });

    const ingresosTotalesPorMes = ingresosPorReservas.map((ingreso, i) => ingreso + ingresosPorEventos[i]);

    const nombresMeses = [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    const resumenIngresosMensuales = nombresMeses.map((mes, i) => ({
      mes,
      total: ingresosTotalesPorMes[i],
      ingresosPorReservas: ingresosPorReservas[i],
      ingresosPorEventos: ingresosPorEventos[i]
    }));

    const eventosMensuales = nombresMeses.map((mes, i) => ({
      mes,
      totalEventos: eventosCountPorMes[i],
      nombresEventos: eventosNombresPorMes[i]
    }));

    const servicioContador = {};
    reservas.forEach(reserva => {
      reserva.extraServices.forEach(servicio => {
        const nombre = servicio.name;
        servicioContador[nombre] = (servicioContador[nombre] || 0) + 1;
      });
    });

    const serviciosMasUsados = Object.entries(servicioContador)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const estadisticas = {
      hotelId: hotel._id,
      hotelNombre: hotel.name,
      encargadoNombre: `${hotel.admin.name} ${hotel.admin.surname}`,
      encargadoEmail: hotel.admin.email,
      totalHabitaciones: habitaciones.length,
      habitacionesOcupadas: reservas.filter(r => r.state === "activa").length,
      totalReservas: reservas.length,
      resumenIngresosMensuales,
      totalEventos: eventos.length,
      eventosMensuales,  
      serviciosMasUsados
    };

    res.json({ estadisticas });

  } catch (error) {
    console.error("Error al obtener estadísticas por hotel ID:", error);
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
};