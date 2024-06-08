import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { contactInterface } from "../interfaces/main";
 // modelo de la tabla de contactos
const contactSchema = new mongoose.Schema<contactInterface>(
    {
        owner: {
            type: String,
            ref: "User",
            required: true,
        },
        firsName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        phoneNumberP: {
            type: String,
            required: true,
        },
        phoneNumberH: {
            type: String,
            required: true,
        },
        phoneNumberW: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Contact = mongoose.model("Contact", contactSchema);

export default Contact;
