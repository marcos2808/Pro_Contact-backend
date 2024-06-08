import { Request, Response } from "express";
import { Usuario } from "../models/main";
import bcrypt from "bcrypt";

import { generateToken1, generateJWT } from "../helpers/generateToken.js";
import { emailRegistro, emailReset } from "../helpers/corre.js";
import { check, validationResult } from "express-validator";
import verifyPassword from "../helpers/passtest.js";
import jwt from "jsonwebtoken";

interface CustomRequest extends Request {
    user?: any;
}
// componente en donde esta la logica de los controladores
class UserComponent {
    constructor() { }

    async createUser(req: Request, res: Response): Promise<Response> { //metodo para crear un usuario
        const {
            username,
            email,
            password,
        } = req.body;
        await check("username") // todo esto de await y check es lo de express validator, son otro tipo de validaciones para el req.body
            .notEmpty()
            .withMessage("Username is required")
            .run(req);
        await check("email")
            .notEmpty()
            .withMessage("Email is required")
            .isEmail()
            .withMessage("Email is not valid")
            .run(req);
        await check("password")
            .notEmpty()
            .withMessage("Password is required")
            .isLength({ min: 6 })
            .withMessage("Password must be at least 6 characters long")
            .run(req);
        let result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({
                message: "you have these errors",
                errors: result.array(),
            });
        }
        console.log(req.body);
        try {
            console.log(req.body);

            const ExisteUsuario = await Usuario.findOne({ email: email }).exec(); // se verifica si el email ya esta registrado
            const existeUsername = await Usuario.findOne({ // se verifica si el username ya esta registrado
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

            const usuario = new Usuario({ // se crea el usuario
                email,
                username,
                password,
                token: generateToken1(),
                confirm: false,
            });

            await usuario.save(); // se guarda el usuario

            emailRegistro({ // se manda un correo de confirmacion
                email: usuario.email,
                nombre: usuario.username,
                token: usuario.token,
            });

            return res.status(200).json({ // se manda un mensaje de que el usuario fue creado
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
        } catch (error) {
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
    }

    async verifyUser(req: Request, res: Response): Promise<void> { // metodo para verificar el usuario
        const { token } = req.params;  // se obtiene el token de la url
        const usuario = await Usuario.findOne({ token: token }).exec(); // se busca el usuario con el token
        console.log(token);
        if (!usuario) { // si no se encuentra el usuario se manda un mensaje de error
            return res.render("auth/confirm_account", { // se renderiza la pagina de confirmacion de cuenta
                pagina: "Authentication error",
                mensaje:
                    "There has been an error when trying to confirm your account, try again",
                error: true,
            });
        }


        usuario.token = null; // se elimina el token
        usuario.confirm = true; // se confirma el usuario
        await usuario.save(); // se guarda el usuario

        return res.render("auth/confirm_account", { // se renderiza la pagina de confirmacion de cuenta
            pagina: "Account confirmed",
            mensaje:
                "Your account has been successfully confirmed, you can now log in !",
            error: false,
        });
    }

    async resetPassword(req: Request, res: Response): Promise<Response> { // metodo para resetear la contraseña
        const { email } = req.body; // se obtiene el email del req.body
        await check("email") // se verifica que el email sea valido
            .notEmpty()
            .withMessage("Email is required")
            .isEmail()
            .withMessage("Email is not valid")
            .run(req);

        let result = validationResult(req); // se verifica si hay errores
        if (!result.isEmpty()) { // si hay errores se manda un mensaje de error
            return res.status(400).json({ // se manda un mensaje de error
                message: "we have these errors when resetting the password",
                errors: result.array(),
            });
        }

        const usuario = await Usuario.findOne({ email: email }).exec(); // se busca el usuario con el email

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

        usuario.token = generateToken1(); // se genera un token
        await usuario.save(); // se guarda el usuario
        emailReset({ // se manda un correo para resetear la contraseña
            email: usuario.email,
            nombre: usuario.username,
            token: usuario.token,
        });

        return res.status(200).json({
            message: "we have send an mail to your email",
        });
    }

    async checkResetPassword(req: Request, res: Response): Promise<void> { // metodo para verificar el reseteo de la contraseña
        const { token } = req.params; // se obtiene el token de la url
        const usuario = await Usuario.findOne({ token: token }).exec();// se busca el usuario con el token

        if (!usuario) { // si no se encuentra el usuario se manda un mensaje de error
            return res.render("auth/reset_password", { // se renderiza la pagina de reseteo de contraseña
                pagina: "Reset Password",
                errores: [
                    {
                        msg: "The email is not registered",
                    },
                ],
            });
        }

        res.render("auth/set_new_password", { // se renderiza la pagina de setear nueva contraseña
            pagina: "Set new password",
        });
    }

    async verifyNewPassword(req: Request, res: Response): Promise<Response> { // metodo para verificar la nueva contraseña
        const { token } = req.params;  // se obtiene el token de la url
        const { password } = req.body; // se obtiene la contraseña del req.body
        await check("password")
            .isLength({ min: 6 })
            .withMessage("Password must be at least 6 characters long")
            .notEmpty()
            .withMessage("Password is required")
            .run(req);
        await check("repeat_password")
            .equals(password)
            .withMessage("the passwords doesn't match")
            .run(req);

        let result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({
                message: "there was these errors",
                error: result.array(),
            });
        }

        const usuario = await Usuario.findOne({ token: token }).exec(); // se busca el usuario con el token
        if (!usuario) { // si no se encuentra el usuario se manda un mensaje de error
            return res.status(404).json({
                message: "User not found",
            });
        }
        usuario.password = password; // se cambia la contraseña
        usuario.token = null; // se elimina el token
        await usuario.save(); // se guarda el usuario


        res.render("auth/reset_password", { // se renderiza la pagina de reseteo de contraseña
            pagina: "Reset Password",
            mensaje: "Your password has been successfully changed",
        });

        // return res.status(200).json({ // se manda un mensaje de que la contraseña fue cambiada
        //     message: "Contraseña cambiada",
        // });
    }

    async loginVerify(req: Request, res: Response): Promise<Response> { // metodo para verificar el login
        await check("email")
            .notEmpty()
            .withMessage("Email is required")
            .isEmail()
            .withMessage("Email is not valid")
            .run(req);
        await check("password")
            .notEmpty()
            .withMessage("Password is required")
            .run(req);
        let result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({
                message: "there was these errors",
                errors: result.array(),
            });
        }

        return res.status(200).json({
            message: "Loggin succesfull",
        });
    }

    async login(req: Request, res: Response): Promise<Response> { // metodo para logearse
        const { user_info, password } = req.body; // se obtiene el email o username y la contraseña del req.body
        console.log("🚀 ~ UserComponent ~ login ~ req.body:", req.body)
        
        await check("user_info") // se verifica que el email o username no esten vacios
            .notEmpty()
            .withMessage("Email or username is required")
            .run(req);
        await check("password")
            .notEmpty()
            .withMessage("Password is required")
            .run(req);

        let result = validationResult(req); // se verifica si hay errores
        console.log("🚀 ~ UserComponent ~ login ~ result:", result)
        if (!result.isEmpty()) {
            return res.status(400).json({
                message: "there was these errors",
                error: result.array(),
            });
        }
        const usuario = await Usuario.findOne({ // se busca el usuario con el email o username
            $or: [{ email: user_info }, { username: user_info }],
        }).exec();
        console.log("🚀 ~ UserComponent ~ login ~ usuario:", usuario)

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

        const passwordMatch = await verifyPassword(password, user_info); // se verifica si la contraseña es correcta
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

        const token = generateJWT(usuario.id); // se genera un token
        console.log(usuario.id);
        // storeToken(token);
        return res.status(200).json({ // se manda un mensaje de que el usuario fue logeado
            message: "Usuario logeado",
            token: token,
            id: usuario.id,
        });
    }

    closeSession(req: Request, res: Response): Response { // metodo para cerrar la sesion
        return res.status(200).json({
            message: "Sesion cerrada",
        });
    }

    async getUser(req: CustomRequest, res: Response): Promise<Response> { // metodo para obtener el usuario logeado
        try {
            const user = await Usuario.findById(req.user._id).exec();
            console.log(user);
            return res.status(200).json({
                message: "User found",
                user: user,
            });
        } catch (error) {
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
    }

    async getAUser(req: Request, res: Response): Promise<Response> { // metodo para obtener un usuario cualquiera por su id de mongo
        const { id } = req.params;
        try {
            const user = await Usuario.findById(id).exec();
            console.log(user);
            return res.status(200).json({
                message: "User found",
                user: user,
            });
        } catch (error) {
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
    }

    async editUser(req: CustomRequest, res: Response): Promise<Response> { // metodo para editar un usuario
        await check("name").notEmpty().withMessage("Name is required").run(req);
        await check("lastname")
            .notEmpty()
            .withMessage("Lastname is required")
            .run(req);
        await check("username")
            .notEmpty()
            .withMessage("Username is required")
            .run(req);
        await check("profilePicture").optional().run(req);
        await check("email")
            .optional()
            .isEmail()
            .withMessage("enter a valid email")
            .run(req);
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({
                message: "there was these errors",
                error: result.array(),
            });
        }
        const { username, email } = req.body; // se obtiene el username y el email del req.body
        try {
            const Username = await Usuario.findOne({
                username: username,
            }).exec(); // se busca el usuario con el username
            const existingEmail = await Usuario.findOne({
                email: email,
            }).exec(); // se busca el usuario con el email
            const myusername = await Usuario.findById(req.user.id).exec(); // se busca el usuario logeado
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

            const user = await Usuario.findById(req.user.id).exec(); // se busca el usuario logeado
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
            await user.save(); // se guarda el usuario
            return res.status(200).json({ // se manda un mensaje de que el usuario fue editado
                message: "User edited",
                user: user,
            });
        } catch (error) {
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
    }

    async getAllUsers(req: CustomRequest, res: Response): Promise<Response> {
        try {
            const users = await Usuario.find().exec();
            return res.status(200).json({
                message: "Users found",
                users: users,
            });
        } catch (error) {
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
    }
}

export { UserComponent };
