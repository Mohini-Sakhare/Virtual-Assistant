import express from 'express';
import { askToAssistant, deletehistory, getCurrentUser, updateAssistant } from '../controller/UserController.js';
import isAuth from '../middleware/AuthMiddleware.js';
import upload from '../middleware/Multer.js';


const UserRouter = express.Router();


UserRouter.get('/current',isAuth, getCurrentUser);
UserRouter.post("/update",isAuth, upload.single("assistantImage"), updateAssistant);
UserRouter.post('/asktoassistant',isAuth,askToAssistant);
UserRouter.post('/delete-history',isAuth, deletehistory);
export default UserRouter;