const nodemailer = require("nodemailer");

const { USER_MAILTRAP, PASSWORD_MAILTRAP } = process.env;

const mailTrap = async ({email, token}) => {
    const transport = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: USER_MAILTRAP,
            pass: PASSWORD_MAILTRAP,
        },
    });

    const url = `localhost:3000/api/users/verify/${token}`;

    const emailBody = {
        from: "dmitrij.kravchenko.1997@gmail.com",
        to: email,
        subject: "Hello",
        html: `<h1> Please open this link: ${url} to verify your email <h1>`,
        text: `Please open this link: ${url} to verify your email`,
    };

    await transport.sendMail(emailBody);
};

module.exports = {
    mailTrap,
};