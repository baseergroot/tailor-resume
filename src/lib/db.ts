import getEnv from "@/helper/env";
import mongoose from "mongoose";


export default async function connectDB() {

  if (mongoose.connection.readyState === 1) return;

  try {
    console.log({uri: getEnv.MONGODB_URI})
    await mongoose.connect(getEnv.MONGODB_URI)
    console.log("Database connected successfully")
  } catch (error) {
    console.log({ dbCatchError: error })
  }
}