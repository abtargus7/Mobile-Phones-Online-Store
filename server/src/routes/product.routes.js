import { Router } from "express";
import { createProduct } from "../controllers/product.controller.js";
import { isAdmin, verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/").post(verifyJWT, isAdmin ,createProduct)

export default router