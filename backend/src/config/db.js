// Database connection & Server Startup
import mongoose from "mongoose";

const startServer = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error("MONGODB_URI is not defined in .env file");
    }

    console.log("Connecting to MongoDB Atlas...");
    await mongoose.connect(mongoUri);
    console.log("MongoDB connected successfully.");
    
  } catch (error) {
    console.error("Database connection or Server startup error:", error);
    process.exit(1);
  }
};

export default startServer;