import express from "express";
import {
  login,
  logout,
  register,
  verifyJWT,
} from "../controllers/authController";
const AuthRouter = express.Router();

AuthRouter.post("/login", login);

AuthRouter.post("/register", register);

AuthRouter.post("/verifyJWT", verifyJWT);

AuthRouter.post("/logout", logout);

export default AuthRouter;
