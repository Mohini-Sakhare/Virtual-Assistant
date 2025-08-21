import express from "express";
import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config()
import connectDb from "./config/db.js";
import AuthRouter from "./routes/AuthRoutes.js";
import cookieParser from "cookie-parser";
import cors from 'cors'
import UserRouter from "./routes/UserRoutes.js";
import geminiResponse from "./gemini.js";

const app=express();

app.use(
    cors({
        origin:['http://localhost:5173'],
        //  methods: ['GET','POST'],
        credentials: true,
    })
);
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth",AuthRouter);
app.use("/api/user",UserRouter);

app.set('port', (process.env.PORT || 5050));

const start = async()=>{
   app.listen(5050, ()=>{
    connectDb()
    console.log("server started");
})
}
start();