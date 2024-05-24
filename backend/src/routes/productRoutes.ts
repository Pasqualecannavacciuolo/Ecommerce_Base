import express from "express";
import {
  add_product,
  get_all_products,
} from "../controllers/productController";
import { authenticate } from "../lib/middleware";
const ProductRouter = express.Router();

ProductRouter.get("/product/get", authenticate, get_all_products);
ProductRouter.post("/product/add", add_product);

export default ProductRouter;
