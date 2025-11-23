import mongoose from "mongoose";

export const connectDb = async () => {
  try {
    if (mongoose.connections[0].readyState) {
      console.log("Already connected to MongoDB");
      return;
    }

    const uri = `${process.env.MONGO_DB_URI}/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`;

    const connectionInstance = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log(
      `MongoDB connected! DB Host: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    throw error;
  }
};
