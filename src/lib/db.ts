import mongoose from "mongoose";


export default async function connectDB() {

  if (!process.env.MONGODB_URI) {
    throw new Error("Please provide MongoDB URI");
  }

  if (mongoose.connection.readyState === 1) return;

  try {
    await mongoose.connect(process.env.MONGODB_URI!)
    console.log("Database connected successfully")
  } catch (error) {
    console.log({ dbCatchError: error })
  }
}