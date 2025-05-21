import { Router } from "express";
import { createProduct, deleteProduct, getProduct, getProductsCreatedByUser, updateProduct } from "../controllers/product.controller.js";
import { isAdmin, verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/").post(verifyJWT, isAdmin ,createProduct)
router.route("/").get(verifyJWT, isAdmin, getProductsCreatedByUser)
router.route("/:id").get(getProduct)
router.route("/:id").patch(verifyJWT, isAdmin, updateProduct)
router.route("/:id").delete(verifyJWT, isAdmin, deleteProduct)

export default router