"use strict"
import swaggerUi from "swagger-ui-express"
import swaggerJsDoc from "swagger-jsdoc";
import express from "express"
import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"
import { dbConnection } from "./mongo.js"
import apiLimiter from "../src/middlewares/validar-cant-peticiones.js"
import authRoutes from "../src/auth/auth.routes.js"
import hotelRoutes from "../src/hotel/hotel.routes.js"
import roomRoutes from "../src/room/room.routes.js"
import userRoutes from "../src/user/user.routes.js"
import reservationRoutes from "../src/reservation/reservation.routes.js"
import invoiceRoutes from "../src/invoice/invoice.routes.js"
import extraServiceRoutes from "../src/serviceExtra/extraService.routes.js"
import serviceRoutes from "../src/service/service.routes.js"
import eventRoutes from "../src/event/event.routes.js"


const swaggerDefinition = {
    openapi: "3.0.0",
    info: {
        title: "Hotel management API Documentation",
        version: "1.0.0",
        description: "Documentación de la API para Hotel Management",
    },
    servers: [
        {
            url: `http://localhost:${process.env.PORT || 3001}`,
            description: "Servidor local",
        },
    ],
};

const swaggerOptions = {
    swaggerDefinition,
    apis: ["./src/**/*.routes.js", "./src/**/*.model.js"], 
};

const swaggerSpec = swaggerJsDoc(swaggerOptions);

const middlewares = (app) => {
    app.use(express.urlencoded({extended: false}))
    app.use(express.json())
    app.use(cors())
    app.use(helmet())
    app.use(morgan("dev"))
    app.use(apiLimiter)

    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

}


const routes = (app) =>{
    app.use("/hotelManagement/v1/auth", authRoutes);
    app.use("/hotelManagement/v1/user", userRoutes);
    app.use("/hotelManagement/v1/hotel", hotelRoutes);
    app.use("/hotelManagement/v1/room", roomRoutes);
    app.use("/hotelManagement/v1/reservation", reservationRoutes);
    app.use("/hotelManagement/v1/invoice", invoiceRoutes);
    app.use("/hotelManagement/v1/extraServices", extraServiceRoutes);
    app.use("/hotelManagement/v1/services", serviceRoutes);
    app.use("/hotelManagement/v1/event", eventRoutes);
}


const conectarDB = async () =>{
    try{
        await dbConnection()
    }catch(err){
        console.log(`Database connection failed: ${err}`)
        process.exit(1)
    }
}

export const initiServer = () => {
    const app = express()
    try{
        middlewares(app)
        conectarDB()
        routes(app)
        app.listen(process.env.PORT)
        console.log(`Server running on port ${process.env.PORT}`)
        console.log(`Swagger docs available at http://localhost:${process.env.PORT}/api-docs`);
    }catch(err){
        console.log(`Server init failed: `, err)
    }
}