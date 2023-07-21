import express from "express";
import cors from "cors";
import connectDB from "./connection/db.js";
import todoRoutes from "./routes/todoroutes.js";

const app = express();
const port = 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Connect to MongoDB
connectDB();

// Use the todo routes
app.use("/api/todos", todoRoutes);

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
