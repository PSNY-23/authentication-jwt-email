import mongoose from "mongoose";

const connectDB = async (DB_URI) => {
  try {
    const DB_OPTIONS = {
      dbName: "geekshop",
    };
    await mongoose.connect(DB_URI, DB_OPTIONS);
    console.log("MongoDB connected");
  } catch (error) {
    console.log(error);
  }
};
export default connectDB;