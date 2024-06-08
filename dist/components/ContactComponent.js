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
Object.defineProperty(exports, "__esModule", { value: true });
const main_1 = require("../models/main");
const express_validator_1 = require("express-validator");
class ContactComponent {
    constructor() { }
    createContact(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { firsName, lastName, phoneNumberP, phoneNumberH, phoneNumberW, email, address } = req.body; // Asegúrate de que estos campos estén en el cuerpo de la solicitud
                yield (0, express_validator_1.check)("owner", "Owner is required").not().isEmpty().run(req);
                yield (0, express_validator_1.check)("firsName", "First name is required").not().isEmpty().run(req);
                yield (0, express_validator_1.check)("lastName", "Last name is required").not().isEmpty().run(req);
                yield (0, express_validator_1.check)("phoneNumberP", "Phone number is required").not().isEmpty().run(req);
                yield (0, express_validator_1.check)("phoneNumberH", "Phone number is required").not().isEmpty().run(req);
                yield (0, express_validator_1.check)("phoneNumberW", "Phone number is required").not().isEmpty().run(req);
                yield (0, express_validator_1.check)("email", "Email is required").isEmail().run(req);
                yield (0, express_validator_1.check)("address", "Address is required").not().isEmpty().run(req);
                const newContact = new main_1.Contact({
                    owner: req.user_id,
                    firsName,
                    lastName,
                    phoneNumberP,
                    phoneNumberH,
                    phoneNumberW,
                    email,
                    address,
                });
                yield newContact.save();
                res.status(201).json(newContact);
            }
            catch (error) {
                res.status(500).json({ message: "Internal server error", error: error });
            }
        });
    }
    // Método para editar un contacto
    updateContact(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { firsName, lastName, phoneNumberP, phoneNumberH, phoneNumberW, email, address } = req.body; // Asegúrate de que estos campos estén en el cuerpo de la solicitud
                const contactId = req.params.id; // Asegúrate de que el ID del contacto se pasa como un parámetro en la URL
                // Encuentra el contacto por ID y actualízalo
                const updatedContact = yield main_1.Contact.findByIdAndUpdate(contactId, {
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
            }
            catch (error) {
                res.status(500).json({ message: "Internal server error", error: error });
            }
        });
    }
    // Método para eliminar un contacto
    deleteContact(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const contactId = req.params.id; // Asegúrate de que el ID del contacto se pasa como un parámetro en la URL
                // Encuentra el contacto por ID y elimínalo
                const deletedContact = yield main_1.Contact.deleteOne({ _id: contactId });
                if (!deletedContact) {
                    return res.status(404).json({ message: "Contact not found" });
                }
                res.status(200).json({ message: "Contact deleted successfully" });
            }
            catch (error) {
                res.status(500).json({ message: "Internal server error", error: error });
            }
        });
    }
}
exports.default = ContactComponent;
