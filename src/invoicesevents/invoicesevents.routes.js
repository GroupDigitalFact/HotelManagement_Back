import { Router } from "express";
import { generateInvoice } from "./invoicesevents.controllers.js";

const router = Router();

router.get("/invoice/:id", generateInvoice);

export default router;