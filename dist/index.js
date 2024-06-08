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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./config/db"));
const cors_1 = __importDefault(require("cors"));
const userRoute_1 = __importDefault(require("./routes/userRoute"));
const contactRoute_1 = __importDefault(require("./routes/contactRoute"));
//dependencias generales y configuraciones
dotenv_1.default.config({ path: ".env" });
const app = (0, express_1.default)();
const port = Number(process.env.PORT) || 3000; //se define el puerte a usar
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use(express_1.default.static("public"));
app.set("view engine", "pug");
app.set("views", "./views");
//configuracion inicial del express para las vistas y demas
app.use("/auth", userRoute_1.default); // aqui definimos el prefijo para las rutas de usuario
app.use("/contact", contactRoute_1.default); // aqui definimos el prefijo para las rutas de contacto
//basicamente tienes que traerte las rutas que creaste para x cosa y definir un prefijo para ellas siguiendo esa estructura
try {
    db_1.default.on("error", (err) => {
        console.error("Error:", err);
    });
    db_1.default.once("open", () => __awaiter(void 0, void 0, void 0, function* () {
        console.log("Se conecto a la base de datos");
    }));
}
catch (error) {
    console.log(error);
}
// cosa de la base de datos 
app.listen(port, () => console.log(`La conexion se activo en la url: ${port}!`)); // se activa el servidor en el puerto definido en el .env
