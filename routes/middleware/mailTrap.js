const nodemailer = require("nodemailer");

const mailTrap = async ({email, token}) => {
    const transport = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: "b2e6441759cca6",
            pass: "ac3c9148236c55",
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