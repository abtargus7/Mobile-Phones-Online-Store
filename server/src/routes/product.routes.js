import { Router } from "express";
import { createProduct, deleteProduct, getAllProducts, getProducImages, getProduct, getProductsCreatedByUser, updateProduct } from "../controllers/product.controller.js";
import { isAdmin, verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/").post(verifyJWT, isAdmin ,createProduct)
router.route("/user").get(verifyJWT, isAdmin, getProductsCreatedByUser)
router.route("/").get(getAllProducts)
router.route("/:id").get(getProduct)
router.route("/:id").patch(verifyJWT, isAdmin, updateProduct)
router.route("/:id").delete(verifyJWT, isAdmin, deleteProduct)
router.route(":id/images").get(getProducImages)

export default router