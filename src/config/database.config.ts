import mongoose from "mongoose";
import { config } from "./app.config";

const connectDatabase = async () => {
  try {
    await mongoose.connect(config.MONGO_URI);
    console.log("Connected to Mongo Database");
  } catch (error) {
    console.log("Error connecting to Mongo Database: ", error);
    process.exit(1);
  }
};

export default connectDatabase;
