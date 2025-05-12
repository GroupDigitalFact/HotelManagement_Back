import User from "../src/user/user.model.js";
import Hotel from "../src/hotel/hotel.model.js";
import Room from "../src/room/room.model.js";
import argon2 from "argon2";
import Service from "../src/service/service.model.js";
import Event from "../src/Event/event.model.js";
import Reservation from "../src/reservation/reservation.model.js";
import Invoice from "../src/invoice/invoice.model.js";


export const createDefaultService = async () => {
  const services = [
    {
      name: "Alquiler de Sillas",
      description: "Servicio de alquiler de sillas para eventos corporativos y sociales."
    },
    {
      name: "Alquiler de Mesas",
      description: "Servicio de alquiler de mesas para recepciones y banquetes."
    },
    {
      name: "Sistema de Sonido Profesional",
      description: "Servicio de alquiler de sistema de sonido de alta calidad para eventos."
    }
  ];

  for (const service of services) {
    await Service.updateOne(
      { name: service.name },
      { $setOnInsert: service },
      { upsert: true }
    );
  }
};

export const createDefaultUsers = async () => {
  const users = [
    {
      name: "Carlos",
      surname: "PARA PRUEBASz",
      username: "adminhotel1",
      email: "admin1@hotel.com",
      password: "Admin123**",
      phone: "11112222",
      role: "ADMIN_ROLE",
      profilePicture: null
    },
    {
      name: "Laura",
      surname: "PARA PRUEBAS",
      username: "adminhotel2",
      email: "admin2@hotel.com",
      password: "Admin123**",
      phone: "22223333",
      role: "HOTEL_ADMIN_ROLE",
      profilePicture: null
    },
    {
      name: "Pedro",
      surname: "PARA PRUEBAS",
      username: "usuario1",
      email: "user1@hotel.com",
      password: "Admin123**",
      phone: "33334444",
      role: "USER_ROLE",
      profilePicture: null
    }
  ];

  for (const user of users) {
    const hashedPassword = await argon2.hash(user.password); 
    await User.updateOne(
      { email: user.email },
      { $setOnInsert: { ...user, password: hashedPassword } }, 
      { upsert: true }
    );
  }
};
