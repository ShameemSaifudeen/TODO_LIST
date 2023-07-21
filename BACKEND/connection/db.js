import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://0.0.0.0/todo-app", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB successfully!");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

export default connectDB;
