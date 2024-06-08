"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserComponent = void 0;
const main_1 = require("../models/main");
const generateToken_js_1 = require("../helpers/generateToken.js");
const corre_js_1 = require("../helpers/corre.js");
const express_validator_1 = require("express-validator");
const passtest_js_1 = __importDefault(require("../helpers/passtest.js"));
// componente en donde esta la logica de los controladores
class UserComponent {
    constructor() { }
    createUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { username, email, password, } = req.body;
            yield (0, express_validator_1.check)("username") // todo esto de await y check es lo de express validator, son otro tipo de validaciones para el req.body
                .notEmpty()
                .withMessage("Username is required")
                .run(req);
            yield (0, express_validator_1.check)("email")
                .notEmpty()
                .withMessage("Email is required")
                .isEmail()
                .withMessage("Email is not valid")
                .run(req);
            yield (0, express_validator_1.check)("password")
                .notEmpty()
                .withMessage("Password is required")
                .isLength({ min: 6 })
                .withMessage("Password must be at least 6 characters long")
                .run(req);
            let result = (0, express_validator_1.validationResult)(req);
            if (!result.isEmpty()) {
                return res.status(400).json({
                    message: "you have these errors",
                    errors: result.array(),
                });
            }
            console.log(req.body);
            try {
                console.log(req.body);
                const ExisteUsuario = yield main_1.Usuario.findOne({ email: email }).exec(); // se verifica si el email ya esta registrado
                const existeUsername = yield main_1.Usuario.findOne({
                    username: username,
                }).exec();
                if (existeUsername) { // si el username ya esta registrado se manda un mensaje de error
                    return res.status(400).json({
                        message: "there was these errors",
                        errors: [
                            {
                                type: "field",
                                value: username,
                                msg: "the username is already registered",
                                path: "username",
                                location: "body",
                            },
                        ],
                    });
                }
                if (ExisteUsuario) { // si el email ya esta registrado se manda un mensaje de error
                    return res.status(400).json({
                        message: "there was these errors",
                        errors: [
                            {
                                type: "field",
                                value: email,
                                msg: "the email is already registered",
                                path: "email",
                                location: "body",
                            },
                        ],
                    });
                }
                const usuario = new main_1.Usuario({
                    email,
                    username,
                    password,
                    token: (0, generateToken_js_1.generateToken1)(),
                    confirm: false,
                });
                yield usuario.save(); // se guarda el usuario
                (0, corre_js_1.emailRegistro)({
                    email: usuario.email,
                    nombre: usuario.username,
                    token: usuario.token,
                });
                return res.status(200).json({
                    message: "User created",
                    response: [
                        {
                            type: "server",
                            value: "",
                            msg: "User created, check your email to confirm your account",
                            path: "",
                            location: "",
                        },
                    ],
                });
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({
                    message: "User not created",
                    errors: [
                        {
                            type: "server",
                            value: "500",
                            msg: "there was an error when creating the user",
                            path: "SessionManager.createUser",
                            location: "SessionManager",
                        },
                    ],
                });
            }
        });
    }
    verifyUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { token } = req.params; // se obtiene el token de la url
            const usuario = yield main_1.Usuario.findOne({ token: token }).exec(); // se busca el usuario con el token
            console.log(token);
            if (!usuario) { // si no se encuentra el usuario se manda un mensaje de error
                return res.render("auth/confirm_account", {
                    pagina: "Authentication error",
                    mensaje: "There has been an error when trying to confirm your account, try again",
                    error: true,
                });
            }
            usuario.token = null; // se elimina el token
            usuario.confirm = true; // se confirma el usuario
            yield usuario.save(); // se guarda el usuario
            return res.render("auth/confirm_account", {
                pagina: "Account confirmed",
                mensaje: "Your account has been successfully confirmed, you can now log in !",
                error: false,
            });
        });
    }
    resetPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email } = req.body; // se obtiene el email del req.body
            yield (0, express_validator_1.check)("email") // se verifica que el email sea valido
                .notEmpty()
                .withMessage("Email is required")
                .isEmail()
                .withMessage("Email is not valid")
                .run(req);
            let result = (0, express_validator_1.validationResult)(req); // se verifica si hay errores
            if (!result.isEmpty()) { // si hay errores se manda un mensaje de error
                return res.status(400).json({
                    message: "we have these errors when resetting the password",
                    errors: result.array(),
                });
            }
            const usuario = yield main_1.Usuario.findOne({ email: email }).exec(); // se busca el usuario con el email
            if (!usuario) { // si no se encuentra el usuario se manda un mensaje de error
                return res.status(400).json({
                    message: "there was these errors",
                    error: [
                        {
                            type: "field",
                            value: email,
                            msg: "the email is not registered",
                            path: "email",
                            location: "body",
                        },
                    ],
                });
            }
            usuario.token = (0, generateToken_js_1.generateToken1)(); // se genera un token
            yield usuario.save(); // se guarda el usuario
            (0, corre_js_1.emailReset)({
                email: usuario.email,
                nombre: usuario.username,
                token: usuario.token,
            });
            return res.status(200).json({
                message: "we have send an mail to your email",
            });
        });
    }
    checkResetPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { token } = req.params; // se obtiene el token de la url
            const usuario = yield main_1.Usuario.findOne({ token: token }).exec(); // se busca el usuario con el token
            if (!usuario) { // si no se encuentra el usuario se manda un mensaje de error
                return res.render("auth/reset_password", {
                    pagina: "Reset Password",
                    errores: [
                        {
                            msg: "The email is not registered",
                        },
                    ],
                });
            }
            res.render("auth/set_new_password", {
                pagina: "Set new password",
            });
        });
    }
    verifyNewPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { token } = req.params; // se obtiene el token de la url
            const { password } = req.body; // se obtiene la contraseña del req.body
            yield (0, express_validator_1.check)("password")
                .isLength({ min: 6 })
                .withMessage("Password must be at least 6 characters long")
                .notEmpty()
                .withMessage("Password is required")
                .run(req);
            yield (0, express_validator_1.check)("repeat_password")
                .equals(password)
                .withMessage("the passwords doesn't match")
                .run(req);
            let result = (0, express_validator_1.validationResult)(req);
            if (!result.isEmpty()) {
                return res.status(400).json({
                    message: "there was these errors",
                    error: result.array(),
                });
            }
            const usuario = yield main_1.Usuario.findOne({ token: token }).exec(); // se busca el usuario con el token
            if (!usuario) { // si no se encuentra el usuario se manda un mensaje de error
                return res.status(404).json({
                    message: "User not found",
                });
            }
            usuario.password = password; // se cambia la contraseña
            usuario.token = null; // se elimina el token
            yield usuario.save(); // se guarda el usuario
            res.render("auth/reset_password", {
                pagina: "Reset Password",
                mensaje: "Your password has been successfully changed",
            });
            // return res.status(200).json({ // se manda un mensaje de que la contraseña fue cambiada
            //     message: "Contraseña cambiada",
            // });
        });
    }
    loginVerify(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, express_validator_1.check)("email")
                .notEmpty()
                .withMessage("Email is required")
                .isEmail()
                .withMessage("Email is not valid")
                .run(req);
            yield (0, express_validator_1.check)("password")
                .notEmpty()
                .withMessage("Password is required")
                .run(req);
            let result = (0, express_validator_1.validationResult)(req);
            if (!result.isEmpty()) {
                return res.status(400).json({
                    message: "there was these errors",
                    errors: result.array(),
                });
            }
            return res.status(200).json({
                message: "Loggin succesfull",
            });
        });
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user_info, password } = req.body; // se obtiene el email o username y la contraseña del req.body
            console.log("🚀 ~ UserComponent ~ login ~ req.body:", req.body);
            yield (0, express_validator_1.check)("user_info") // se verifica que el email o username no esten vacios
                .notEmpty()
                .withMessage("Email or username is required")
                .run(req);
            yield (0, express_validator_1.check)("password")
                .notEmpty()
                .withMessage("Password is required")
                .run(req);
            let result = (0, express_validator_1.validationResult)(req); // se verifica si hay errores
            console.log("🚀 ~ UserComponent ~ login ~ result:", result);
            if (!result.isEmpty()) {
                return res.status(400).json({
                    message: "there was these errors",
                    error: result.array(),
                });
            }
            const usuario = yield main_1.Usuario.findOne({
                $or: [{ email: user_info }, { username: user_info }],
            }).exec();
            console.log("🚀 ~ UserComponent ~ login ~ usuario:", usuario);
            if (!usuario) { // si no se encuentra el usuario se manda un mensaje de error
                return res.status(400).json({
                    message: "there was these errors",
                    errors: [
                        {
                            type: "field",
                            value: "",
                            msg: "the user doesn't exist",
                            path: "user_info",
                            location: "body",
                        },
                    ],
                });
            }
            if (!usuario.confirm) { // si el usuario no esta confirmado se manda un mensaje de error
                return res.status(400).json({
                    message: "there was these errors",
                    errors: [
                        {
                            type: "field",
                            value: user_info,
                            msg: "the user isn't confirmed",
                            path: "user_info",
                            location: "body",
                        },
                    ],
                });
            }
            const passwordMatch = yield (0, passtest_js_1.default)(password, user_info); // se verifica si la contraseña es correcta
            console.log(passwordMatch);
            if (!passwordMatch) { // si la contraseña no es correcta se manda un mensaje de error
                return res.status(400).json({
                    message: "there was these errors",
                    errors: [
                        {
                            type: "field",
                            value: password,
                            msg: "the password is incorrect",
                            path: "password",
                            location: "body",
                        },
                    ],
                });
            }
            const token = (0, generateToken_js_1.generateJWT)(usuario.id); // se genera un token
            console.log(usuario.id);
            // storeToken(token);
            return res.status(200).json({
                message: "Usuario logeado",
                token: token,
                id: usuario.id,
            });
        });
    }
    closeSession(req, res) {
        return res.status(200).json({
            message: "Sesion cerrada",
        });
    }
    getUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield main_1.Usuario.findById(req.user._id).exec();
                console.log(user);
                return res.status(200).json({
                    message: "User found",
                    user: user,
                });
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({
                    message: "there was these errors",
                    errors: [
                        {
                            type: "server",
                            value: "",
                            msg: "there was an error when getting the user",
                            path: "",
                            location: "",
                        },
                    ],
                });
            }
        });
    }
    getAUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const user = yield main_1.Usuario.findById(id).exec();
                console.log(user);
                return res.status(200).json({
                    message: "User found",
                    user: user,
                });
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({
                    message: "there was these errors",
                    errors: [
                        {
                            type: "server",
                            value: "",
                            msg: "there was an error when getting the user",
                            path: "",
                            location: "",
                        },
                    ],
                });
            }
        });
    }
    editUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, express_validator_1.check)("name").notEmpty().withMessage("Name is required").run(req);
            yield (0, express_validator_1.check)("lastname")
                .notEmpty()
                .withMessage("Lastname is required")
                .run(req);
            yield (0, express_validator_1.check)("username")
                .notEmpty()
                .withMessage("Username is required")
                .run(req);
            yield (0, express_validator_1.check)("profilePicture").optional().run(req);
            yield (0, express_validator_1.check)("email")
                .optional()
                .isEmail()
                .withMessage("enter a valid email")
                .run(req);
            const result = (0, express_validator_1.validationResult)(req);
            if (!result.isEmpty()) {
                return res.status(400).json({
                    message: "there was these errors",
                    error: result.array(),
                });
            }
            const { username, email } = req.body; // se obtiene el username y el email del req.body
            try {
                const Username = yield main_1.Usuario.findOne({
                    username: username,
                }).exec(); // se busca el usuario con el username
                const existingEmail = yield main_1.Usuario.findOne({
                    email: email,
                }).exec(); // se busca el usuario con el email
                const myusername = yield main_1.Usuario.findById(req.user.id).exec(); // se busca el usuario logeado
                if (myusername === null) { // si el usuario logeado no existe se manda un mensaje de error
                    return res.status(400).json({
                        message: "there was these errors",
                        errors: [
                            {
                                type: "field",
                                value: username,
                                msg: "the username is null",
                                path: "username",
                                location: "body",
                            },
                        ],
                    });
                }
                if (Username && Username.username !== myusername.username) { // si el username ya esta registrado se manda un mensaje de error
                    return res.status(400).json({
                        message: "there was these errors",
                        errors: [
                            {
                                type: "field",
                                value: username,
                                msg: "the username is already registered",
                                path: "username",
                                location: "body",
                            },
                        ],
                    });
                }
                if (existingEmail && existingEmail.email !== myusername.email) { // si el email ya esta registrado se manda un mensaje de error
                    return res.status(400).json({
                        message: "there was these errors",
                        errors: [
                            {
                                type: "field",
                                value: email,
                                msg: "the email is already registered",
                                path: "email",
                                location: "body",
                            },
                        ],
                    });
                }
                const user = yield main_1.Usuario.findById(req.user.id).exec(); // se busca el usuario logeado
                if (user === null) { // si el usuario logeado no existe se manda un mensaje de error
                    return res.status(400).json({
                        message: "there was these errors",
                        errors: [
                            {
                                type: "field",
                                value: username,
                                msg: "the user is null",
                                path: "user",
                                location: "body",
                            },
                        ],
                    });
                }
                user.username = username; // se cambia el username
                user.email = email; // se cambia el email
                yield user.save(); // se guarda el usuario
                return res.status(200).json({
                    message: "User edited",
                    user: user,
                });
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({
                    message: "there was these errors",
                    errors: [
                        {
                            type: "server",
                            value: "",
                            msg: "there was an error when editing the user",
                            path: "",
                            location: "",
                        },
                    ],
                });
            }
        });
    }
    getAllUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield main_1.Usuario.find().exec();
                return res.status(200).json({
                    message: "Users found",
                    users: users,
                });
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({
                    message: "there was these errors",
                    errors: [
                        {
                            type: "server",
                            value: "",
                            msg: "there was an error when getting the users",
                            path: "",
                            location: "",
                        },
                    ],
                });
            }
        });
    }
}
exports.UserComponent = UserComponent;
