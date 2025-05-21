import { Router } from "express"
import { createUser, getUser, logOutUser } from "../controllers/user.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router()

router.route("/").post(createUser)
router.route("/").get(getUser)
router.route("/logout").post(verifyJWT, logOutUser)


export default router