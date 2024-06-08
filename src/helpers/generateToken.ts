import crypto from "crypto";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config({ path: ".env" });
//funciones para crear tokens y asi
const generateToken1 = (): string => {
    const token = crypto.randomBytes(10).toString("hex");
    console.log(token);
    return token;
};

const generateJWT = (id: string): string => {
    return jwt.sign({ id }, process.env.JWT_SECRET as string, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

export { generateToken1, generateJWT };
