import express from "express";
import { add_order, get_all_orders } from "../controllers/orderController";
const OrderRouter = express.Router();

OrderRouter.get("/order/get", get_all_orders);
OrderRouter.post("/order/add", add_order);

export default OrderRouter;
