import { resendClient, emailSender } from "../config/resend.js";
import { createWelcomeEmailTemplate } from "../templates/email.template.js";

/**
 * @name sendWelcomeEmail
 * @description Send a welcome email to a newly registered user.
 * @param {string} email - Recipient email address.
 * @param {string} fullName - Name of the newly registered user.
 * @returns {object} Resend email response.
 */
const sendWelcomeEmail = async (email, fullName) => {
    try {
        const { data, error } = await resendClient.emails.send({
            from: `${emailSender.name} <${emailSender.email}>`,
            to: email,
            subject: "Welcome to ConvoX!",
            html: createWelcomeEmailTemplate(fullName),
        });

        if (error) {
            throw error;
        }

        return data;
    } catch (error) {
        console.error("Welcome email error:", error);
        throw error;
    }
};

export default sendWelcomeEmail;