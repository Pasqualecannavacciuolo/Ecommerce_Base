import express from "express";
import {
  add_product,
  get_all_products,
  get_all_products_archiviati,
  get_all_products_attivi,
  get_all_products_bozze,
  get_product_by_id,
  modify_product_by_id,
} from "../controllers/productController";
import { authenticate } from "../lib/middleware";
const ProductRouter = express.Router();

ProductRouter.get("/product/get", /*authenticate, */ get_all_products);
ProductRouter.get(
  "/product/get/attivi",
  /*authenticate, */ get_all_products_attivi
);
ProductRouter.get(
  "/product/get/bozze",
  /*authenticate, */ get_all_products_bozze
);
ProductRouter.get(
  "/product/get/archiviati",
  /*authenticate, */
  get_all_products_archiviati
);
ProductRouter.get("/product/get/:id", /*authenticate, */ get_product_by_id);
ProductRouter.post("/product/add", /*authenticate, */ add_product);
ProductRouter.put(
  "/product/modify/:id",
  /*authenticate, */
  modify_product_by_id
);

export default ProductRouter;
