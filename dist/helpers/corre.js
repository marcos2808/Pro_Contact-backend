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
exports.emailReset = exports.emailRegistro = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: ".env" });
//para los correos, no te tienes que meter con esto
const emailRegistro = (datos) => __awaiter(void 0, void 0, void 0, function* () {
    const transport = nodemailer_1.default.createTransport({
        service: "gmail",
        auth: {
            user: process.env.APP_USER,
            pass: process.env.APP_PASSWORD,
        },
    });
    console.log("daticos" + datos);
    const { email, nombre, token } = datos;
    try {
        yield transport.sendMail({
            from: process.env.APP_USER,
            to: email,
            subject: "Confirm your account",
            html: `<!DOCTYPE html>
<html
  lang="en"
  xmlns="http://www.w3.org/1999/xhtml"
  xmlns:o="urn:schemas-microsoft-com:office"
>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <meta name="x-apple-disable-message-reformatting" />
    <title></title>
    <style>
      table,
      td,
      div,
      h1,
      p {
        font-family: Arial, sans-serif;
      }
      body {
        margin: 0;
        padding: 0;
        background-color: #f5f5f5;
      }
      .container {
        width: 100%;
        border-collapse: collapse;
        border: 0;
        border-spacing: 0;
        background: #ffffff;
      }
      .header {
        padding: 40px 0 30px 0;
        background: #0073e6;
        text-align: center;
      }
      .header img {
        width: 200px;
        height: auto;
        display: block;
        margin: 0 auto;
        filter: drop-shadow(0 0 0.75rem #1e1e1e);
      }
      .content {
        padding: 36px 30px 20px 30px;
        background-color: #ffffff;
      }
      .content h1 {
        font-size: 24px;
        margin: 0 0 20px 0;
        color: #333333;
        text-align: center;
        text-shadow: 1px 1px 3px #999999;
      }
      .content p {
        margin: 0 0 12px 0;
        font-size: 16px;
        line-height: 24px;
        color: #666666;
      }
      .verify-link {
        display: inline-block;
        margin: 20px 0;
        padding: 10px 20px;
        font-size: 16px;
        color: #ffffff;
        background-color: #0073e6;
        text-decoration: none;
        border-radius: 5px;
      }
      .footer {
        padding: 20px;
        text-align: center;
        font-size: 12px;
        color: #999999;
      }
    </style>
  </head>
  <body>
    <table role="presentation" class="container">
      <tr>
        <td align="center">
          <table
            role="presentation"
            style="
              width: 602px;
              border-collapse: collapse;
              border: 1px solid #cccccc;
              border-spacing: 0;
              text-align: left;
            "
          >
            <tr>
              <td class="header">
                <img
                  src="https://firebasestorage.googleapis.com/v0/b/funatics-1699583872359.appspot.com/o/imagen_2024-05-22_210857105.png?alt=media&token=081adb15-2a02-4314-973c-9bf67d267b44"
                  alt="Logo"
                />
              </td>
            </tr>
            <tr>
              <td class="content">
                <h1>Verify Your Account</h1>
                <p>Use the following link to verify your account:</p>
                <p style="text-align: center">
                  <a
                    href="${process.env.BACKEND_URL}/auth/confirm/${token}"
                    class="verify-link"
                    >Verify Your Account</a
                  >
                </p>
                <p>
                  If you didn't create this account, please disregard this
                  message.
                </p>
              </td>
            </tr>
            <tr>
              <td class="footer">
                &copy; 2024 ProContact. All rights reserved.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`,
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.emailRegistro = emailRegistro;
const emailReset = (datos) => __awaiter(void 0, void 0, void 0, function* () {
    const transport = nodemailer_1.default.createTransport({
        service: "gmail",
        auth: {
            user: process.env.APP_USER,
            pass: process.env.APP_PASSWORD,
        },
    });
    const { email, nombre, token } = datos;
    try {
        yield transport.sendMail({
            from: "LuckyNotes@gmail.com",
            to: email,
            subject: "Reset your password",
            html: `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <meta name="x-apple-disable-message-reformatting" />
  <title></title>
  <style>
    table, td, div, h1, p {
      font-family: Arial, sans-serif;
    }
    body {
      margin: 0;
      padding: 0;
      background-color: #f5f5f5;
    }
    .container {
      width: 100%;
      border-collapse: collapse;
      border: 0;
      border-spacing: 0;
      background: #ffffff;
    }
    .header {
      padding: 40px 0 30px 0;
      background: #0073e6;
      text-align: center;
    }
    .header img {
      width: 200px;
      height: auto;
      display: block;
      margin: 0 auto;
      filter: drop-shadow(0 0 0.75rem #1e1e1e);
    }
    .content {
      padding: 36px 30px 20px 30px;
      background-color: #ffffff;
    }
    .content h1 {
      font-size: 24px;
      margin: 0 0 20px 0;
      color: #333333;
      text-align: center;
      text-shadow: 1px 1px 3px #999999;
    }
    .content p {
      margin: 0 0 12px 0;
      font-size: 16px;
      line-height: 24px;
      color: #666666;
    }
    .verify-link {
      display: inline-block;
      margin: 20px 0;
      padding: 10px 20px;
      font-size: 16px;
      color: #ffffff;
      background-color: #0073e6;
      text-decoration: none;
      border-radius: 5px;
    }
    .footer {
      padding: 20px;
      text-align: center;
      font-size: 12px;
      color: #999999;
    }
  </style>
</head>
<body>
  <table role="presentation" class="container">
    <tr>
      <td align="center">
        <table role="presentation" style="width: 602px; border-collapse: collapse; border: 1px solid #cccccc; border-spacing: 0; text-align: left;">
          <tr>
            <td class="header">
              <img src="https://firebasestorage.googleapis.com/v0/b/funatics-1699583872359.appspot.com/o/imagen_2024-05-22_210857105.png?alt=media&token=081adb15-2a02-4314-973c-9bf67d267b44" alt="Logo" />
            </td>
          </tr>
          <tr>
            <td class="content">
              <h1>Reset your password</h1>
              <p>Use the following link to reset your password:</p>
              <p style="text-align: center">
                <a href="${process.env.BACKEND_URL}/auth/reset_password/${token}" class="verify-link">Reset your password</a>
              </p>
              <p>If you didn't request a password reset, please ignore this message.</p>
            </td>
          </tr>
          <tr>
            <td class="footer">
              &copy; 2024 ProContact. All rights reserved.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>

      `,
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.emailReset = emailReset;
