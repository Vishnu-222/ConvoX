import "dotenv/config";
import app from "./src/app.js";
import connectToDatabase from "./src/config/database.js";

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    await connectToDatabase();

    app.listen(PORT, () => {
        console.log(`ConvoX server running on port ${PORT}`);
    });
};

startServer();