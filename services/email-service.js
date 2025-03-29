const nodemailer = require("nodemailer");
const { SMTP_HOST, SMTP_PORT, MAIL_USER, MAIL_PASS } = require("../constants/envs");

async function sendMail({ from, to, subject, text, html }) {
    const transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: SMTP_PORT,
        auth: {
            user: MAIL_USER,
            pass: MAIL_PASS
        }
    });

    console.log("Sending email...", { SMTP_HOST, SMTP_PORT, MAIL_USER, MAIL_PASS });
    const info = await transporter.sendMail({
        from: `Trans-Fi <${from}>`,
        to,
        subject,
        text,
        html
    });
}

module.exports = sendMail;