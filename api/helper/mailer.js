let nodemailer = require('nodemailer'),
    config = require('../../config');

const PASSWORD_REQUEST =
    "<h2>Forum Entreprise Polytech</h2>\n\n" +
    "<p>Bonjour,</br>Voici votre mot de passe pour le forum entreprise Polytech : %password%</br></p>";

let transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: config.gmail.user,
        pass: config.gmail.password
    }
});

class Mailer {

    static sendPassword(user, password) {
        const mailOptions = {
            from: config.gmail.user,
            to: user,
            subject: 'Votre mot de passe',
            html: PASSWORD_REQUEST.replace('%password%', password)
        };

        transport.sendMail(mailOptions).then(res => console.log('email sent')).catch(err => console.log(err));
    }
}

module.exports = {Mailer};
