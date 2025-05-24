import Reservation from "./reservation.model.js";
import Room from "../room/room.model.js";
import jwt from "jsonwebtoken";
import ExtraService from "../serviceExtra/extraServices.model.js";
import User from "../user/user.model.js";
import Hotel from "../hotel/hotel.model.js";

  export const editReservation = async (req, res) => {
    try {
      const { idreservation, username, hotelName, numeroCuarto, dateEntry, departureDate, cardNumber, CVV, expired, extraServices } = req.body;

      const reservation = await Reservation.findById(idreservation);
      if (!reservation) return res.status(404).json({ message: 'Reservación no encontrada' });

      const user = await User.findOne({ username });
      if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

      const hotel = await Hotel.findOne({ name: hotelName });
      if (!hotel) return res.status(404).json({ message: 'Hotel no encontrado' });

      const room = await Room.findOne({ hotel: hotel._id, numeroCuarto });
      if (!room) return res.status(404).json({ message: 'Habitación no encontrada' });

      const expiredDate = new Date(expired);
      if (isNaN(expiredDate)) return res.status(400).json({ message: 'Fecha de expiración inválida' });

      const overlappingReservations = await Reservation.find({
        _id: { $ne: idreservation },
        room: room._id,
        state: 'activa',
        $or: [
          { dateEntry: { $lt: departureDate }, departureDate: { $gt: dateEntry } },
          { dateEntry: { $gte: dateEntry }, departureDate: { $lte: departureDate } }
        ]
      });

      if (overlappingReservations.length > 0) {
        return res.status(400).json({ message: 'La habitación ya está reservada en las fechas seleccionadas' });
      }

      let validExtraServiceIds = [];
      if (extraServices && extraServices.length > 0) {
        const foundServices = await ExtraService.find({
          name: { $in: extraServices },
          hotel: hotel._id
        });

        if (foundServices.length !== extraServices.length) {
          return res.status(400).json({ message: 'Algunos servicios extra no pertenecen al hotel' });
        }

        validExtraServiceIds = foundServices.map(s => s._id);
      }

      reservation.user = user._id;
      reservation.room = room._id;
      reservation.dateEntry = dateEntry;
      reservation.departureDate = departureDate;
      reservation.cardNumber = cardNumber;
      reservation.CVV = CVV;
      reservation.expired = expiredDate;
      reservation.extraServices = validExtraServiceIds;

      await reservation.save();

      res.status(200).json({ message: 'Reservación actualizada correctamente', reservation });

    } catch (err) {
      console.error('Error al editar:', err);
      res.status(500).json({ message: 'Error al editar la reservación', error: err.message });
    }
  };


  export const createReservationRoom = async (req, res) => {
    try {
      const { username, hotelName, numeroCuarto, dateEntry, departureDate, cardNumber, CVV, expired, extraServices } = req.body;

      const user = await User.findOne({ username });
      if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

      const hotel = await Hotel.findOne({ name: hotelName });
      if (!hotel) return res.status(404).json({ message: 'Hotel no encontrado' });

      const room = await Room.findOne({ hotel: hotel._id, numeroCuarto });
      if (!room) return res.status(404).json({ message: 'Habitación no encontrada en el hotel' });

      const expiredDate = new Date(expired);
      if (isNaN(expiredDate)) return res.status(400).json({ message: 'Fecha de expiración inválida' });

      const overlappingReservations = await Reservation.find({
        room: room._id,
        state: 'activa',
        $or: [
          { dateEntry: { $lt: departureDate }, departureDate: { $gt: dateEntry } },
          { dateEntry: { $gte: dateEntry }, departureDate: { $lte: departureDate } }
        ]
      });

      if (overlappingReservations.length > 0) {
        return res.status(400).json({ message: 'La habitación ya está reservada en las fechas seleccionadas' });
      }

      let validExtraServiceIds = [];
      if (extraServices && extraServices.length > 0) {
        const foundServices = await ExtraService.find({
          name: { $in: extraServices },
          hotel: hotel._id
        });

        if (foundServices.length !== extraServices.length) {
          return res.status(400).json({ message: 'Algunos servicios extra no pertenecen al hotel' });
        }

        validExtraServiceIds = foundServices.map(s => s._id);
      }

      const newReservation = new Reservation({
        user: user._id,
        room: room._id,
        dateEntry,
        departureDate,
        cardNumber,
        CVV,
        expired: expiredDate,
        extraServices: validExtraServiceIds
      });

      await newReservation.save();
      room.status = 'OCUPADA';
      await room.save();

      res.status(201).json({ message: 'Reservación creada correctamente', reservation: newReservation });

    } catch (err) {
      console.error('Error en creación:', err);
      res.status(500).json({ message: 'Error al crear la reservación', error: err.message });
    }
  };


    export const listarReservation = async (req, res) => {
        try {
          const reservas = await Reservation.find({ state: 'activa' }) 
            .populate({
              path: 'user',
              select: 'username name surname phone'
            })
            .populate({
              path: 'room',
              select: 'tipo precio numeroCuarto hotel',
              populate: {
                path: 'hotel',
                select: 'name address'
              }
            })
            .populate({
              path: 'extraServices',
              select: 'name cost',
            });

          res.status(200).json(reservas);
        } catch (error) {
          console.error('Error al listar las reservas:', error);
          res.status(500).json({ message: 'Error al obtener las reservaciones' });
        }
    };

    export const listarReservaionManager = async (req, res) => {
      try {
        const token = req.header("Authorization");
        const { uid } = jwt.verify(token.replace("Bearer ", ""), process.env.SECRETORPRIVATEKEY);

        const hotel = await Hotel.findOne({ admin: uid });
        if (!hotel) {
          return res.status(404).json({ message: "No se encontró un hotel administrado por este usuario." });
        }

        const habitaciones = await Room.find({ hotel: hotel._id });
        const habitacionesIds = habitaciones.map(h => h._id);

        if (habitacionesIds.length === 0) {
          return res.status(404).json({ message: 'No hay habitaciones registradas para este hotel.' });
        }

        const reservas = await Reservation.find({
          room: { $in: habitacionesIds },
          state: 'activa'
        })
          .populate({
            path: 'user',
            select: 'username name surname phone'
          })
          .populate({
            path: 'room',
            select: 'tipo precio numeroCuarto hotel',
            populate: {
              path: 'hotel',
              select: 'name address'
            }
          })
          .populate({
            path: 'extraServices',
            select: 'name cost'
          });

        res.status(200).json(reservas);

      } catch (error) {
        console.error('Error al listar las reservas del hotel:', error);
        res.status(500).json({ message: 'Error al obtener las reservaciones del hotel', error: error.message });
      }
    };

    export const listarHotelesSugerence = async (req, res) => {
    try {
      const hoteles = await Hotel.find();

      if (!hoteles || hoteles.length === 0) {
        return res.status(404).json({ message: 'No se encontraron hoteles' });
      }
      const hotelesConDetalles = [];

      for (let hotel of hoteles) {
        const habitaciones = await Room.find({ hotel: hotel._id })
          .select('tipo capacidad precio numeroCuarto status')
          .lean();  
        const serviciosExtra = await ExtraService.find({ hotel: hotel._id })
          .select('name description cost status')
          .lean();  

        const hotelConDetalles = {
          ...hotel.toObject(),  
          rooms: habitaciones,
          extraServices: serviciosExtra
        };
        hotelesConDetalles.push(hotelConDetalles);
      }
      res.status(200).json(hotelesConDetalles);

    } catch (error) {
      console.error('Error al listar los hoteles:', error);
      res.status(500).json({ message: 'Error al obtener los hoteles', error: error.message });
    }
  };

  export const listarHotelManagger = async (req, res) => {
    try {
      const token = req.header("Authorization");
      if (!token) {
        return res.status(401).json({ message: "Token no proporcionado" });
      }

      const { uid } = jwt.verify(token.replace("Bearer ", ""), process.env.SECRETORPRIVATEKEY);

      const hotel = await Hotel.findOne({ admin: uid }).lean();
      if (!hotel) {
        return res.status(404).json({ message: 'No se encontró un hotel administrado por este usuario.' });
      }

      const habitaciones = await Room.find({ hotel: hotel._id })
        .select('tipo capacidad precio numeroCuarto status')
        .lean();

      const serviciosExtra = await ExtraService.find({ hotel: hotel._id })
        .select('name description cost status')
        .lean();

      const hotelConDetalles = {
        ...hotel,
        rooms: habitaciones,
        extraServices: serviciosExtra
      };

      return res.json([hotelConDetalles]);

    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error interno del servidor." });
    }
  };

  export const cancelReservationAdmin = async (req, res) => {
  try {
    const { id } = req.body; 

    const reservation = await Reservation.findById(id);
    if (!reservation) {
      return res.status(404).json({ message: 'Reservación no encontrada' });
    }

    if (reservation.state !== 'activa') {
      return res.status(400).json({ message: 'Solo se pueden cancelar reservaciones activas' });
    }

    reservation.state = 'cancelada';
    await reservation.save();

    const otrasReservasActivas = await Reservation.find({
      room: reservation.room,
      state: 'activa',
      _id: { $ne: reservation._id }
    });

    if (otrasReservasActivas.length === 0) {
      await Room.findByIdAndUpdate(reservation.room, { status: 'DISPONIBLE' });
    }

    res.status(200).json({
      message: 'Reservación cancelada correctamente',
      reservation
    });
  } catch (error) {
    console.error('Error al cancelar la reservación:', error);
    res.status(500).json({ message: 'Error al cancelar la reservación' });
  }
};

export const reserveRoom = async (req, res) => {
    try {
      const token = req.header('Authorization');
      if (!token) return res.status(401).json({ message: 'Token no proporcionado' });
  
      const { uid } = jwt.verify(token.replace("Bearer ", ""), process.env.SECRETORPRIVATEKEY);
  
      const { roomId, dateEntry, departureDate, cardNumber, CVV, expired, extraServices } = req.body;
  
      const expiredDate = new Date(expired); 
      if (isNaN(expiredDate)) {
        return res.status(400).json({ message: 'Fecha de expiración inválida' });
      }
  
      const room = await Room.findById(roomId);
      if (!room) return res.status(404).json({ message: 'Habitación no encontrada' });
  
      if (room.status === 'OCUPADA') {
        const existingReservations = await Reservation.find({
          room: roomId,
          state: 'activa',
          $or: [
            { dateEntry: { $lt: departureDate }, departureDate: { $gt: dateEntry } },
            { dateEntry: { $gte: dateEntry }, departureDate: { $lte: departureDate } }
          ]
        });
  
        if (existingReservations.length > 0) {
          return res.status(400).json({ message: 'La habitación ya está reservada para las fechas seleccionadas' });
        }
      }
  
      if (extraServices && extraServices.length > 0) {
        const validExtraServices = await ExtraService.find({
          _id: { $in: extraServices },
          hotel: room.hotel
        });
  
        if (validExtraServices.length !== extraServices.length) {
          return res.status(400).json({ message: 'Algunos servicios extra no pertenecen al hotel de la habitación.' });
        }
      }
  
      const newReservation = new Reservation({
        user: uid,   
        room: roomId,
        dateEntry,
        departureDate,
        cardNumber,
        CVV,
        expired: expiredDate, 
        extraServices  
      });
  
      await newReservation.save();
  
      room.status = 'OCUPADA';  
      await room.save();
  
      return res.status(201).json({
        message: 'Reservación realizada correctamente',
        reservation: newReservation
      });
  
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error al realizar la reservación', error: err.message });
    }
  };

  export const cancelReservation = async (req, res) => {
    try {
      const token = req.header("Authorization");
      if (!token) {
        return res.status(401).json({ message: "Token no proporcionado" });
      }
  
      const { uid } = jwt.verify(token.replace("Bearer ", ""), process.env.SECRETORPRIVATEKEY);
      const { reservationId } = req.params;
  
      const reservation = await Reservation.findById(reservationId);
      if (!reservation) {
        return res.status(404).json({ message: "Reservación no encontrada" });
      }
  
      if (reservation.user.toString() !== uid) {
        return res.status(403).json({ message: "No estás autorizado para cancelar esta reservación" });
      }
  
      if (reservation.state !== "activa") {
        return res.status(400).json({ message: "Solo se pueden cancelar reservaciones activas" });
      }
  
      reservation.state = "cancelada";
      await reservation.save();
  
      const hoy = new Date();

      const reservacionesQueSolapan = await Reservation.find({
        room: reservation.room,
        _id: { $ne: reservationId },
        state: "activa",
        dateEntry: { $lt: reservation.departureDate },
        departureDate: { $gt: hoy } 
      });
      
      if (reservacionesQueSolapan.length === 0) {
        await Room.findByIdAndUpdate(reservation.room, { status: "DISPONIBLE" });
      }
      
  
      return res.status(200).json({ message: "Reservación cancelada exitosamente" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        message: "Error al cancelar la reservación",
        error: err.message
      });
    }
  };

  export const MyReservations = async (req, res) => {
    try {
      const token = req.header("Authorization");
      if (!token) return res.status(401).json({ message: "Token no proporcionado" });

      const { uid } = jwt.verify(token.replace("Bearer ", ""), process.env.SECRETORPRIVATEKEY);

      const reservations = await Reservation.find({ user: uid })
        .populate("extraServices", "name _id")
        .populate({
          path: "room",
          select: "numeroCuarto hotel",
          populate: {
            path: "hotel",
            select: "name _id"
          }
        });

      res.json({ reservations });
    } catch (err) {
      res.status(500).json({ message: "Error al obtener las reservaciones", error: err.message });
    }
  };

export const ReservationAdmin = async (req, res) => {
  try {
    const { identifier } = req.params; 

    let user = null;
    if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
      user = await User.findById(identifier);
    } else {
      user = await User.findOne({ username: identifier });
    }

    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    const reservations = await Reservation.find({ user: user._id })
      .populate("extraServices", "name _id")
      .populate("room", "numeroCuarto hotel");

    res.json({ reservations });
  } catch (err) {
    res.status(500).json({ message: "Error al obtener reservaciones", error: err.message });
  }
};


export const UserReservationsAdminHotel = async (req, res) => {
  try {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ message: "Token no proporcionado" });

    const { uid } = jwt.verify(token.replace("Bearer ", ""), process.env.SECRETORPRIVATEKEY);
    const { identifier } = req.params;

    let user = null;
    if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
      user = await User.findById(identifier);
    } else {
      user = await User.findOne({ username: identifier });
    }
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    const hotelesAdmin = await Hotel.find({ admin: uid }).select("_id");

    const hotelIds = hotelesAdmin.map(h => h._id.toString());

    const reservations = await Reservation.find({ user: user._id })
      .populate({
        path: "room",
        match: { hotel: { $in: hotelIds } },
        select: "numeroCuarto hotel"
      })
      .populate("extraServices", "name _id");

    const filteredReservations = reservations.filter(r => r.room !== null);

    res.json({ reservations: filteredReservations });
  } catch (err) {
    res.status(500).json({ message: "Error al obtener reservaciones", error: err.message });
  }
};

export const TodayReservationsByHotelAdmin = async (req, res) => {
  try {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ message: "Token no proporcionado" });

    const { uid } = jwt.verify(token.replace("Bearer ", ""), process.env.SECRETORPRIVATEKEY);

    const hotel = await Hotel.findOne({ admin: uid }).select("_id");
    if (!hotel) return res.status(404).json({ message: "Hotel no encontrado para este administrador" });
    const now = new Date();
    const startOfDay = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0));
    const endOfDay = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 23, 59, 59, 999));

    const reservations = await Reservation.find({
      dateEntry: { $gte: startOfDay, $lte: endOfDay }
    })
      .populate({
        path: "room",
        match: { hotel: hotel._id },
        select: "numeroCuarto hotel"
      })
      .populate("user", "username email") 
      .populate("extraServices", "name _id");

    const filteredReservations = reservations.filter(r => r.room !== null);

    res.json({ reservations: filteredReservations });
  } catch (err) {
    res.status(500).json({ message: "Error al obtener reservaciones del día", error: err.message });
  }
};

