import { Router } from "express";
import { createProduct, getProduct, updateProduct } from "../controllers/product.controller.js";
import { isAdmin, verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/").post(verifyJWT, isAdmin ,createProduct)
router.route("/:id").get(getProduct)
router.route("/:id").patch(verifyJWT, isAdmin, updateProduct)

export default router