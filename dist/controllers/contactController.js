"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteContact = exports.updateContact = exports.createContact = void 0;
const ContactComponent_1 = __importDefault(require("../components/ContactComponent"));
const contact = new ContactComponent_1.default();
const createContact = (req, res) => {
    contact.createContact(req, res);
};
exports.createContact = createContact;
const updateContact = (req, res) => {
    contact.updateContact(req, res);
};
exports.updateContact = updateContact;
const deleteContact = (req, res) => {
    contact.deleteContact(req, res);
};
exports.deleteContact = deleteContact;
