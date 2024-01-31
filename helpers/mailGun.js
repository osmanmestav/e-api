import Mailgun from "mailgun.js";
import formData from 'form-data';

const mailgun = new Mailgun(formData)
const mg = mailgun.client({
    username: 'api',
    key: '9bcc94a8905c8313d88386680c7a9fdf-102c75d8-971e96dc',
});

const sendMail = async (sender_email, receiver_email, email_subject, email_body) => {
    mg.messages.create("sandbox1f7450910b2b4bd2bc2a12feec6c2a19.mailgun.org", {
        from: "Mailgun Sandbox <postmaster@sandbox1f7450910b2b4bd2bc2a12feec6c2a19.mailgun.org>",
        to: ["mestav@mestav.com"],
        subject: "Hello",
        text: "Testing some Mailgun awesomness!",
    })
        .then(msg => console.log(msg))
        .catch(err => console.log(err))
}

sendMail()