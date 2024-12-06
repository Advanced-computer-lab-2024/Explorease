const mailgun = require('mailgun-js');

const DOMAIN = process.env.MAILGUN_DOMAIN; // Add your Mailgun domain in .env
const API_KEY = process.env.MAILGUN_API_KEY; // Add your Mailgun API key in .env

const mg = mailgun({ apiKey: API_KEY, domain: DOMAIN });

const sendEmail = async (to, subject, html) => {
    try {
        const data = {
            from: 'Explorease <no-reply@explorease.com>',
            to,
            subject,
            html,
        };

        await mg.messages().send(data);
        console.log(`Email sent to ${to}`);
    } catch (error) {
        console.error(`Failed to send email to ${to}:`, error.message);
    }
};

module.exports = { sendEmail };
