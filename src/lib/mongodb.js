import mongoose from "mongoose"

const connectToDatabase = async () => {
  mongoose.set("strictPopulate", false);
  try {
    if (!process.env.MONGO_URL) {
      throw new Error("MONGO_URL is not defined in environment variables");
    }
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Error while connecting to database:", err);
    throw err; // Re-throw to handle it in the caller
  }
}

export default connectToDatabase;