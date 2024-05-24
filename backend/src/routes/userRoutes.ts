import express from "express";
import { get_user } from "../controllers/userController";
const UserRouter = express.Router();

UserRouter.post("/user/detail", get_user);

export default UserRouter;
