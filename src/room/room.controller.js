import Hotel from '../hotel/hotel.model.js';
import Room from './room.model.js';
import Reservation from '../reservation/reservation.model.js';
import jwt from 'jsonwebtoken';

export const getRoom = async (req, res) =>{
    try{
        
        const rooms = await Room.find();

        if(!rooms){
            return res.status(404).json({
                message: "Rooms not found"
            })
        }

        return res.status(200).json({
            rooms
        })

    }catch(err){
        return res.status(500).json({
            succes: false,
            message: "Error al obtener al usuario",
            error: err.message
        });
    }
};

export const AllRoomsByHotel = async (req, res) => {
  try {
    const { idHotel, hotelName } = req.body;
    let hotel;

    if (idHotel) {
      hotel = await Hotel.findOne({ _id: idHotel, status: true });
    } else if (hotelName) {
      hotel = await Hotel.findOne({ name: { $regex: hotelName, $options: 'i' }, status: true });
    } else {
      return res.status(400).json({ message: 'Se requiere identificación del hotel o nombre del hotel' });
    }

    if (!hotel) {
      return res.status(404).json({ message: 'Hotel no encontrado' });
    }

    const rooms = await Room.find({ hotel: hotel._id });

    if (rooms.length === 0) {
      return res.status(404).json({ message: 'No se encontraron habitaciones en este hotel.' });
    }

    return res.status(200).json(rooms);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al buscar habitaciones del hotel', error: error.message });
  }
};

  export const registerRoom = async (req, res) => {
    try {
        const { hotelId } = req.body;
        const data = req.body;

        const hotelExists = await Hotel.findById(hotelId);
        if (!hotelExists) {
            return res.status(404).json({
                message: `No existe un hotel con el ID: ${hotelId}`
            });
        }
        const roomExists = await Room.findOne({ numeroCuarto: data.numeroCuarto, hotel: hotelId });
        if (roomExists) {
            return res.status(400).json({
                message: `Ya existe una habitación número ${data.numeroCuarto} en este hotel`
            });
        }
        data.hotel = hotelId;
        const room = await Room.create(data);

        return res.status(201).json({
            message: "Habitación registrada exitosamente",
            room
        });
    } catch (err) {
        return res.status(500).json({
            message: "Error al registrar la habitación",
            error: err.message
        });
    }
};

export const deleteRoom = async (req, res) => {
  try {
      const { roomId } = req.params;

      const room = await Room.findById(roomId);
      if (!room) {
          return res.status(404).json({
              message: `No se encontró ninguna habitación con el ID: ${roomId}`
          });
      }

      const reservations = await Reservation.find({ room: roomId, state: 'activa' });

      let affectedReservations = 0;

      for (const reservation of reservations) {
          const { dateEntry, departureDate } = reservation;

          const conflictingReservations = await Reservation.find({
              room: { $ne: roomId },
              state: 'activa',
              $or: [
                  {
                      dateEntry: { $lt: departureDate },
                      departureDate: { $gt: dateEntry }
                  }
              ]
          }).distinct('room');

          const replacementRoom = await Room.findOne({
              _id: { $nin: [...conflictingReservations, roomId] }, 
              tipo: room.tipo,
              hotel: room.hotel,
              status: 'DISPONIBLE'
          });

          if (replacementRoom) {
              reservation.room = replacementRoom._id;
              await reservation.save();
          } else {
              reservation.state = 'cancelada';
              await reservation.save();
          }

          affectedReservations++;
      }

      await Room.findByIdAndDelete(roomId);

      return res.status(200).json({
          message: `Habitación eliminada correctamente. Reservaciones afectadas: ${affectedReservations}`
      });

  } catch (err) {
      return res.status(500).json({
          message: "Error al eliminar la habitación",
          error: err.message
      });
  }
};

export const updateRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const updates = req.body;
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({
        message: `No se encontró ninguna habitación con el ID: ${roomId}`
      });
    }
    if (
      updates.numeroCuarto &&
      String(updates.numeroCuarto) !== String(room.numeroCuarto)
    ) {
      const roomExists = await Room.findOne({
        hotel: room.hotel,
        numeroCuarto: updates.numeroCuarto,
        _id: { $ne: roomId }
      });

      if (roomExists) {
        return res.status(400).json({
          message: `Ya existe una habitación con el número ${updates.numeroCuarto} en este hotel`
        });
      }
    }

    Object.keys(updates).forEach(key => {
      room[key] = updates[key];
    });

    await room.save();

    return res.status(200).json({
      message: "Habitación actualizada correctamente",
      updatedRoom: room
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error al actualizar la habitación",
      error: err.message
    });
  }
};



