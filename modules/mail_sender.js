import configuration from "../configuration.js";
import nodemailer from "nodemailer";

const mail_sender = {
    send_mail: function (param) {
        let transporter = nodemailer.createTransport({
            host: "smtp.worksmobile.com",
            port: 587,
            auth: {
                user: configuration().email_user,
                pass: configuration().email_pass,
            },
        });

        let mail_options = {
            from: configuration().email_user,
            to: param.toEmail,
            subject: param.subject,
            text: param.text,
        };

        transporter.sendMail(mail_options);
        transporter.close();
        return;
    },
};

export default mail_sender;
