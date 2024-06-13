import express from "express";
import {} from "../controllers/productController";
import { authenticate } from "../lib/middleware";
import {
  add_sub_category,
  get_all_sub_categories,
  get_sub_category_by_id,
  modify_status_by_id,
} from "../controllers/subCategoryController";
const SubCategoryRouter = express.Router();

SubCategoryRouter.get(
  "/sub_category/get",
  authenticate,
  get_all_sub_categories
);
SubCategoryRouter.get(
  "/sub_category/get/:id",
  authenticate,
  get_sub_category_by_id
);
SubCategoryRouter.post("/sub_category/add", authenticate, add_sub_category);
SubCategoryRouter.put(
  "/sub_category/modifyStatus/:id",
  authenticate,
  modify_status_by_id
);

export default SubCategoryRouter;
