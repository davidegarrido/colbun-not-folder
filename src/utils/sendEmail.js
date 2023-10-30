import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

function createTransporter() {
    return nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
        connectionTimeout: 10000,
    });
}

async function sendEmail(subject = "empty message", dataChangeDetails = "testing email sending") {
    console.log("Sending email with data");
    const transporter = createTransporter();

    const recipientEmails = process.env.RECIPIENT_EMAIL.split(',').map(email => email.trim());

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: recipientEmails.join(', '),
        subject: subject,
        html: dataChangeDetails
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
}

export { sendEmail };
