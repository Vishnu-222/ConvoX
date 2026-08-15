/**
 * @name createWelcomeEmailTemplate
 * @description Create the HTML template for the ConvoX welcome email.
 * @param {string} fullName - Name of the newly registered user.
 * @returns {string} HTML content for the welcome email.
 */
const createWelcomeEmailTemplate = (fullName) => {
  return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Welcome to ConvoX</title>
        </head>

        <body style="
            margin: 0;
            padding: 0;
            background-color: #f4f4f5;
            font-family: Arial, Helvetica, sans-serif;
        ">

            <table
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
                style="background-color: #f4f4f5; padding: 40px 20px;"
            >
                <tr>
                    <td align="center">

                        <table
                            width="100%"
                            cellpadding="0"
                            cellspacing="0"
                            border="0"
                            style="
                                max-width: 600px;
                                background-color: #ffffff;
                                border-radius: 12px;
                                overflow: hidden;
                            "
                        >

                            <!-- Header -->
                            <tr>
                                <td style="
                                    padding: 32px;
                                    text-align: center;
                                    background-color: #18181b;
                                ">
                                    <h1 style="
                                        margin: 0;
                                        color: #ffffff;
                                        font-size: 30px;
                                    ">
                                        ConvoX
                                    </h1>

                                    <p style="
                                        margin: 8px 0 0;
                                        color: #d4d4d8;
                                        font-size: 14px;
                                    ">
                                        Connect. Chat. Converse.
                                    </p>
                                </td>
                            </tr>

                            <!-- Content -->
                            <tr>
                                <td style="padding: 40px 32px;">

                                    <h2 style="
                                        margin: 0 0 20px;
                                        color: #18181b;
                                        font-size: 24px;
                                    ">
                                        Welcome, ${fullName}! 👋
                                    </h2>

                                    <p style="
                                        margin: 0 0 16px;
                                        color: #52525b;
                                        font-size: 16px;
                                        line-height: 1.6;
                                    ">
                                        We're excited to have you join ConvoX.
                                    </p>

                                    <p style="
                                        margin: 0 0 24px;
                                        color: #52525b;
                                        font-size: 16px;
                                        line-height: 1.6;
                                    ">
                                        Your account has been created successfully.
                                        You can now start connecting and chatting
                                        with people on ConvoX.
                                    </p>

                                    <!-- CTA -->
                                    <table
                                        cellpadding="0"
                                        cellspacing="0"
                                        border="0"
                                        style="margin: 0 auto;"
                                    >
                                        <tr>
                                            <td
                                                align="center"
                                                style="
                                                    border-radius: 8px;
                                                    background-color: #18181b;
                                                "
                                            >
                                                <a
                                                    href="${process.env.CLIENT_URL || "#"}"
                                                    target="_blank"
                                                    style="
                                                        display: inline-block;
                                                        padding: 14px 28px;
                                                        color: #ffffff;
                                                        text-decoration: none;
                                                        font-size: 15px;
                                                        font-weight: bold;
                                                    "
                                                >
                                                    Start Chatting
                                                </a>
                                            </td>
                                        </tr>
                                    </table>

                                    <p style="
                                        margin: 32px 0 0;
                                        color: #71717a;
                                        font-size: 14px;
                                        line-height: 1.6;
                                    ">
                                        If you didn't create this account,
                                        you can safely ignore this email.
                                    </p>

                                </td>
                            </tr>

                            <!-- Footer -->
                            <tr>
                                <td style="
                                    padding: 24px 32px;
                                    background-color: #fafafa;
                                    text-align: center;
                                ">
                                    <p style="
                                        margin: 0;
                                        color: #71717a;
                                        font-size: 13px;
                                    ">
                                        © ${new Date().getFullYear()} ConvoX.
                                        All rights reserved.
                                    </p>

                                    <p style="
                                        margin: 8px 0 0;
                                        color: #a1a1aa;
                                        font-size: 12px;
                                    ">
                                        This is an automated email.
                                        Please do not reply.
                                    </p>
                                </td>
                            </tr>

                        </table>

                    </td>
                </tr>
            </table>

        </body>
        </html>
    `;
};

export { createWelcomeEmailTemplate };
