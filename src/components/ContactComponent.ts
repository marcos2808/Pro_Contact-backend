import { Request, Response } from "express";
import { Contact } from "../models/main";
import bcrypt from "bcrypt";

import { generateToken1, generateJWT } from "../helpers/generateToken.js";
import { emailRegistro, emailReset } from "../helpers/corre.js";
import { check, validationResult } from "express-validator";
import verifyPassword from "../helpers/passtest.js";
import jwt from "jsonwebtoken";

interface CustomRequest extends Request {
    user?: any;
    user_id: any;
}

class ContactComponent {
    constructor() { }

    async createContact(req: CustomRequest, res: Response) { // Método para crear un contacto
        try {
            const { firsName, lastName, phoneNumberP, phoneNumberH, phoneNumberW, email, address } = req.body; // Asegúrate de que estos campos estén en el cuerpo de la solicitud
            await check("owner", "Owner is required").not().isEmpty().run(req);
            await check("firsName", "First name is required").not().isEmpty().run(req);
            await check("lastName", "Last name is required").not().isEmpty().run(req);
            await check("phoneNumberP", "Phone number is required").not().isEmpty().run(req);
            await check("phoneNumberH", "Phone number is required").not().isEmpty().run(req);
            await check("phoneNumberW", "Phone number is required").not().isEmpty().run(req);
            await check("email", "Email is required").isEmail().run(req);
            await check("address", "Address is required").not().isEmpty().run(req);
            const newContact = new Contact({ // Crea un nuevo contacto
                owner: req.user_id,
                firsName,
                lastName,
                phoneNumberP,
                phoneNumberH,
                phoneNumberW,
                email,
                address,
            });
            await newContact.save();
            res.status(201).json(newContact);
        } catch (error) {
            res.status(500).json({ message: "Internal server error", error: error });
        }
    }

    // Método para editar un contacto
    async updateContact(req: CustomRequest, res: Response) { // Método para editar un contacto
        try {
            const { firsName, lastName, phoneNumberP, phoneNumberH, phoneNumberW, email, address } = req.body; // Asegúrate de que estos campos estén en el cuerpo de la solicitud
            const contactId = req.params.id; // Asegúrate de que el ID del contacto se pasa como un parámetro en la URL

            // Encuentra el contacto por ID y actualízalo
            const updatedContact = await Contact.findByIdAndUpdate(contactId, {
                owner: req.user_id,
                firsName,
                lastName,
                phoneNumberP,
                phoneNumberH,
                phoneNumberW,
                email,
                address,
            }, { new: true }); // { new: true } asegura que Mongoose devuelva el documento actualizado

            if (!updatedContact) {
                return res.status(404).json({ message: "Contact not found" });
            }

            res.status(200).json(updatedContact);
        } catch (error) {
            res.status(500).json({ message: "Internal server error", error: error });
        }
    }

    // Método para eliminar un contacto
    async deleteContact(req: CustomRequest, res: Response) {
        try {
            const contactId = req.params.id as string; // Asegúrate de que el ID del contacto se pasa como un parámetro en la URL

            // Encuentra el contacto por ID y elimínalo
            const deletedContact = await Contact.deleteOne({ _id: contactId as string });

            if (!deletedContact) {
                return res.status(404).json({ message: "Contact not found" });
            }

            res.status(200).json({ message: "Contact deleted successfully" });
        } catch (error) {
            res.status(500).json({ message: "Internal server error", error: error });
        }
    }
}

export default ContactComponent;