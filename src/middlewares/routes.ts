import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import Usuario from "../models/User.js";
interface CustomRequest extends Request {
    user?: any;
    user_id?: any;
}
//middleware para obtener la informacion del usuario y para verificar el token, es importante para las rutas que requieran el id del usuario
//no te tienes que meter con esto en cuestion
const getUserInfo = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers.authorization as string;
    const token = authHeader && authHeader.split(" ")[1];
    console.log(token);
    console.log(authHeader);

    if (!token) {
        return res.status(401).json({
            message: "Token is required",
            status: 401,
        });
    }
    try {
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined");
        }
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded);
        if (!decoded || !decoded.id) {
            throw new Error("Invalid token payload");
        }
        const user = await Usuario.findById(decoded.id);
        console.log(user);
        if (user) {
            req.user = user;
            req.user_id = decoded.id;
        } else {
            return res.status(400).json({
                message: "User not found",
                status: 400,
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "you have to login again",
            status: 500,
        });
    }
    next();
};

export default getUserInfo;
