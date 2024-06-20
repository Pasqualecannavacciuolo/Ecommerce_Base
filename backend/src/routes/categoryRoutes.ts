import express from "express";
import {} from "../controllers/productController";
import { authenticate } from "../lib/middleware";
import {
  add_category,
  get_all_categories,
  get_category_by_id,
  modify_status_by_id,
} from "../controllers/categoryController";
const CategoryRouter = express.Router();

CategoryRouter.get("/category/get", /*authenticate, */ get_all_categories);
CategoryRouter.get("/category/get/:id", /*authenticate, */ get_category_by_id);
CategoryRouter.post("/category/add", /*authenticate, */ add_category);
CategoryRouter.put(
  "/category/modifyStatus/:id",
  /*authenticate, */
  modify_status_by_id
);

export default CategoryRouter;
