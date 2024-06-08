import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });
// configuracion de la base de datos, no te tienes que meter con esto
mongoose.connect(process.env.MONGO_URL as string);

const db = mongoose.connection;

export default db;
