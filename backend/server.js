import dotenv from "dotenv";
import app from "./src/app.js";
import connectToDatabase from "./src/config/database.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    await connectToDatabase();

    app.listen(PORT, () => {
        console.log(`ConvoX server running on port ${PORT}`);
    });
};

startServer();