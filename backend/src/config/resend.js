import { Resend } from "resend";

const resendClient = new Resend(process.env.RESEND_API_KEY);

const emailSender = {
    email: process.env.EMAIL_FROM,
    name: process.env.EMAIL_FROM_NAME,
};

export {
    resendClient,
    emailSender,
};