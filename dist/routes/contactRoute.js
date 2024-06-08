"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const contactController_1 = require("../controllers/contactController");
const routes_1 = __importDefault(require("../middlewares/routes"));
const router = express_1.default.Router();
// se importan los controladores y el middleware para crear las rutas de contacto
//es importante enviar el token que te da la ruta de login del usario para esto por que si no no te va a servir
//puedes usar la misma logica para crear los grupos y asi.
router.route("/create").post(routes_1.default, contactController_1.createContact);
router.route("/update/:id").put(routes_1.default, contactController_1.updateContact);
router.route("/delete/:id").delete(routes_1.default, contactController_1.deleteContact);
exports.default = router;
