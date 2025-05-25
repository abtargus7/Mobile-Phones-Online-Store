import { Router } from "express";
import { createProduct, deleteProduct, getAllProducts, getProduct, getProductsCreatedByUser, updateImages, updateProduct, updateVariants } from "../controllers/product.controller.js";
import { isAdmin, verifyJWT } from "../middlewares/auth.middleware.js";

//create router for product routes
const router = Router()

//product routes
router.route("/").post(verifyJWT, isAdmin ,createProduct)
router.route("/user").get(verifyJWT, isAdmin, getProductsCreatedByUser)
router.route("/").get(getAllProducts)
router.route("/:id").get(getProduct)
router.route("/:id").put(verifyJWT, isAdmin, updateProduct)
router.route("/:id").delete(verifyJWT, isAdmin, deleteProduct)
router.route("/:id/variants").put(verifyJWT, isAdmin, updateVariants)
router.route("/:id/images").put(verifyJWT, isAdmin, updateImages)

export default router