"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// modelo de la tabla de contactos
const contactSchema = new mongoose_1.default.Schema({
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
}, {
    timestamps: true,
});
const Contact = mongoose_1.default.model("Contact", contactSchema);
exports.default = Contact;
