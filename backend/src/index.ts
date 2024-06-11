import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import prisma from "./prisma";
import { User } from "./models/User";

import { authenticate } from "./lib/middleware";

import AuthRouter from "./routes/authRoutes";
import ProductRouter from "./routes/productRoutes";
import OrderRouter from "./routes/orderRoutes";
import UserRouter from "./routes/userRoutes";
import CategoryRouter from "./routes/categoryRoutes";
import SubCategoryRouter from "./routes/subCategoryRoutes";

export const secretKey = process.env.JSONWEBTOKEN_SECRET_KEY!;

var corsOptions = {
  origin: "http://localhost:5173",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};
dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));

const port = 3000;

app.use(AuthRouter);
app.use(ProductRouter);
app.use(OrderRouter);
app.use(UserRouter);
app.use(CategoryRouter);
app.use(SubCategoryRouter);

app.get("/", async (req, res) => {
  const users: User[] = await prisma.user.findMany();
  res.send(users);
});

app.get("/protected", authenticate, (req: any, res) => {
  res.send(
    `Benvenuto ${req.user["Email"]}! Puoi vedere questa pagina protetta`
  );
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
