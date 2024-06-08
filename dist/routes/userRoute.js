"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController"); // se importan los controladores 
const routes_1 = __importDefault(require("../middlewares/routes")); // se importa el middleware para la sesion, importante esto para las vistas que requieran tener el id del usuario
const router = express_1.default.Router();
router.route("/create").get(userController_1.createForm).post(userController_1.createUser); // se definen las rutas para el registro de usuario
router.route("/login").post(userController_1.login); // se define la ruta para el login
router.route("/confirm/:token").get(userController_1.confirmAccount); // se define la ruta para la confirmacion de la cuenta
router.route("/testingpug").get(userController_1.testingpug); // se define la ruta para la prueba de pug
router.route("/reset_password").get(userController_1.formReset).post(userController_1.resetPassword); // se define la ruta para el reseteo de contraseña
router.route("/reset_password/:token").get(userController_1.verifyPassword).post(userController_1.newPassword); // se define la ruta para la verificacion de la contraseña
router.route("/getUser").get(routes_1.default, userController_1.getUser); // se define la ruta para obtener la informacion del usuario
router.route("/getAUser/:id").get(routes_1.default, userController_1.getAUser); // se define la ruta para obtener la informacion de un usuario en especifico
router.route("/getAllUsers").get(routes_1.default, userController_1.getAllUsers); // se define la ruta para obtener la informacion de todos los usuarios
router.route("/editUser").put(routes_1.default, userController_1.editUser); // se define la ruta para editar la informacion del usuario
router.get("/pugtest1", userController_1.pugTest1);
router.get("/pugtest2", userController_1.pugTest2);
router.get("/pugtest3", userController_1.pugTest3);
exports.default = router; // se exportan las rutas
