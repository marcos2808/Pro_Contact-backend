import express from "express";
import {
    createUser,
    createForm,
    confirmAccount,
    testingpug,
    formReset,
    resetPassword,
    newPassword,
    verifyPassword,
    login,
    pugTest1,
    pugTest2,
    pugTest3,
    getUser,
    editUser,
    getAllUsers,
    getAUser,
} from "../controllers/userController"; // se importan los controladores 
import getUserInfo from "../middlewares/routes"; // se importa el middleware para la sesion, importante esto para las vistas que requieran tener el id del usuario

const router = express.Router();

router.route("/create").get(createForm).post(createUser); // se definen las rutas para el registro de usuario
router.route("/login").post(login); // se define la ruta para el login
router.route("/confirm/:token").get(confirmAccount); // se define la ruta para la confirmacion de la cuenta
router.route("/testingpug").get(testingpug); // se define la ruta para la prueba de pug
router.route("/reset_password").get(formReset).post(resetPassword); // se define la ruta para el reseteo de contraseña
router.route("/reset_password/:token").get(verifyPassword).post(newPassword); // se define la ruta para la verificacion de la contraseña
router.route("/getUser").get(getUserInfo, getUser); // se define la ruta para obtener la informacion del usuario
router.route("/getAUser/:id").get(getUserInfo, getAUser); // se define la ruta para obtener la informacion de un usuario en especifico
router.route("/getAllUsers").get(getUserInfo, getAllUsers); // se define la ruta para obtener la informacion de todos los usuarios
router.route("/editUser").put(getUserInfo, editUser); // se define la ruta para editar la informacion del usuario
router.get("/pugtest1", pugTest1);
router.get("/pugtest2", pugTest2);
router.get("/pugtest3", pugTest3);

export default router; // se exportan las rutas
