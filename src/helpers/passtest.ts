import Usuario from "../models/User.js";
import bcrypt from "bcrypt";
//middleware para verificar la contraseña
const verifyPassword = async (password: string, user_info: string) => {
  const usuario = await Usuario.findOne({
    $or: [{ email: user_info }, { username: user_info }],
  }).exec();
  console.log(usuario);
  if (!usuario) {
    return false;
  }
  const result = await bcrypt.compare(password, usuario.password);
  console.log(result);
  return result;
};

export default verifyPassword;
