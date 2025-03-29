const dotenv = require("dotenv");
dotenv.config();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;
const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = process.env.SMTP_PORT;
const MAIL_USER = process.env.MAIL_USER;
const MAIL_PASS = process.env.MAIL_PASS;

module.exports = {
    PORT,
    MONGODB_URI,
    SMTP_HOST,
    SMTP_PORT,
    MAIL_USER,
    MAIL_PASS,
}