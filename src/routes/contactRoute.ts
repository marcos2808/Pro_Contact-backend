import express from "express";
import {
    createContact,
    updateContact,
    deleteContact
} from "../controllers/contactController";
import getUserInfo from "../middlewares/routes";

const router = express.Router();
// se importan los controladores y el middleware para crear las rutas de contacto
//es importante enviar el token que te da la ruta de login del usario para esto por que si no no te va a servir
//puedes usar la misma logica para crear los grupos y asi.
router.route("/create").post(getUserInfo, createContact);
router.route("/update/:id").put(getUserInfo, updateContact);
router.route("/delete/:id").delete(getUserInfo, deleteContact);

export default router;