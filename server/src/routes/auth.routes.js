import {Router} from "express"
import { googleLogin, loginUser, registerUser } from "../controllers/auth.controler.js"

const router=Router()

router.route("/register").post(registerUser);
router.route("/login").post(loginUser)
router.route("/google-login").post(googleLogin);

export default router