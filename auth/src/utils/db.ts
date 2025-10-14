import mongoose from "mongoose";

// Connect to the database
const connectDB = async (db: string) => {
  await mongoose.connect(db);
};

export { connectDB };
