import express from "express";
import dotenv from 'dotenv';
dotenv.config()
import cors from 'cors';
import cookieParser from "cookie-parser";
import connectDb from "./config/db.js";
import AuthRouter from "./routes/AuthRoutes.js";
import UserRouter from "./routes/UserRoutes.js";

const app=express();

app.use(
    cors({
        origin:['https://virtual-assistant-frontend-cop0.onrender.com'],
        //  methods: ['GET','POST'],
        credentials: true,
    })
);
app.use(express.json());
app.use(cookieParser());
app.use("/auth",AuthRouter);
app.use("/user",UserRouter);

app.set('port', (process.env.PORT || 5050));

const start = async () => {
  try {
    await connectDb();
    app.listen(5050, () => {
      console.log("server started");
    });
  } catch (err) {
    console.error("Failed to start server:", err);
  }
};

start();
