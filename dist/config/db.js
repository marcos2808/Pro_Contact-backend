"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: ".env" });
// configuracion de la base de datos, no te tienes que meter con esto
mongoose_1.default.connect(process.env.MONGO_URL);
const db = mongoose_1.default.connection;
exports.default = db;
