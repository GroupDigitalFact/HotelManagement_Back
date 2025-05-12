import {config} from "dotenv"
import {initiServer} from "./configs/server.js"
import {createDefaultService, createDefaultUsers} from "./utils/defaulData.js"

config()
initiServer()      
createDefaultService();
createDefaultUsers();
