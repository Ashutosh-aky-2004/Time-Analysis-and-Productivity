import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn_str = process.env.MONGO_URI.endsWith("/")
      ? process.env.MONGO_URI + "timeAnalysisAndProductivity"
      : process.env.MONGO_URI + "/timeAnalysisAndProductivity";
    await mongoose.connect(conn_str);
    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.error("MongoDB Connection Failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;
