import express from "express";
import dotenv from "dotenv";
dotenv.config(); // <- top pe add kiya
import mongoose from "mongoose";
import userRoute from "./routes/userRoute.js";
import authRoute from "./routes/authRoute.js";
import adminRoute from './routes/adminRoute.js';
import vendorRoute from './routes/venderRoute.js';
import cors from 'cors';
import cookieParser from "cookie-parser";
import { cloudinaryConfig } from "./utils/cloudinaryConfig.js";

const App = express();

App.use(express.json());
App.use(cookieParser());

const port = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((error) => console.error(error));

const allowedOrigins = ['https://rent-a-ride-two.vercel.app', 'http://localhost:5173'];

App.use(
  cors({
    origin: allowedOrigins,
    methods:['GET', 'PUT', 'POST' ,'PATCH','DELETE'],
    credentials: true,
  })
);

App.use('*', cloudinaryConfig);

App.use("/api/user", userRoute);
App.use("/api/auth", authRoute);
App.use("/api/admin", adminRoute);
App.use("/api/vendor", vendorRoute);

App.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "internal server error";
  return res.status(statusCode).json({
    succes: false,
    message,
    statusCode,
  });
});

App.listen(port, () => {
  console.log(`Server listening on port ${port}!`);
});
