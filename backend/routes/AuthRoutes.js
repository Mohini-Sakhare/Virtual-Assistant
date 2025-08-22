import express from 'express';
import { Login, SignUp, logOut } from '../controller/AuthController.js';

const AuthRouter = express.Router();

AuthRouter.post("/signup", SignUp);
AuthRouter.post('/login', Login);
AuthRouter.get('/logout', logOut);

export default AuthRouter;