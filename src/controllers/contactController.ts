import { Request, Response } from "express";
import ContactComponent from "../components/ContactComponent";

const contact = new ContactComponent();

interface CustomRequest extends Request {
    user?: any;
    user_id: any;
}

const createContact = (req: any, res: Response): void => {
    contact.createContact(req, res);
};

const updateContact = (req: any, res: Response): void => {
    contact.updateContact(req, res);
};

const deleteContact = (req: any, res: Response): void => {
    contact.deleteContact(req, res);
};

export { createContact, updateContact, deleteContact };
