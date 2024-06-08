import express from "express";
import dotenv from "dotenv";
import db from "./config/db";
import cors from "cors";
import userRouter from "./routes/userRoute";
import contactRouter from "./routes/contactRoute";
//dependencias generales y configuraciones
dotenv.config({ path: ".env" });

const app = express();
const port: number = Number(process.env.PORT) || 3000; //se define el puerte a usar

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(express.static("public"));

app.set("view engine", "pug");
app.set("views", "./views");
//configuracion inicial del express para las vistas y demas

app.use("/auth", userRouter); // aqui definimos el prefijo para las rutas de usuario
app.use("/contact", contactRouter); // aqui definimos el prefijo para las rutas de contacto
//basicamente tienes que traerte las rutas que creaste para x cosa y definir un prefijo para ellas siguiendo esa estructura
try {
    db.on("error", (err) => {
        console.error("Error:", err);
    });

    db.once("open", async () => {
        console.log("Se conecto a la base de datos");
    });
} catch (error) {
    console.log(error);
}
// cosa de la base de datos 
app.listen(port, () => console.log(`La conexion se activo en la url: ${port}!`)); // se activa el servidor en el puerto definido en el .env