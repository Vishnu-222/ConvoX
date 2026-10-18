import mongoose from "mongoose";
import dns from "dns";

// Keep the DNS workaround for local development only.
// Production hosting should use its own DNS configuration.
if (process.env.NODE_ENV !== "production") {
    dns.setDefaultResultOrder("ipv4first");
    dns.setServers(["8.8.8.8", "8.8.4.4"]);
}

const connectToDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);

        // Stop startup if the database connection fails.
        throw error;
    }
};

export default connectToDatabase;