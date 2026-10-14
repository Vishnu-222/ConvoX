import "dotenv/config";
import http from "http";
import app from "./src/app.js";
import connectToDatabase from "./src/config/database.js";
import { initializeSocket } from "./src/config/socket.js";

const PORT = process.env.PORT || 3000;

// Create the HTTP server using our existing Express app.
const server = http.createServer(app);
initializeSocket(server);

const startServer = async () => {
    await connectToDatabase();

    server.listen(PORT, () => {
        console.log(`ConvoX server running on port ${PORT}`);
    });
};

startServer();
