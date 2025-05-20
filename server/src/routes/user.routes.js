import { Router } from "express"
import { createUser, getUser } from "../controllers/user.controller.js"

const router = Router()

router.route("/").post(createUser)
router.route("/").get(getUser)


export default router