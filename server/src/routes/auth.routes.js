import {Router} from "express"
import { googleLogin, loginUser, logoutUser, registerUser, updatePassword } from "../controllers/auth.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router=Router()

router.route("/register").post(registerUser);
router.route("/login").post(loginUser)
router.route("/google-login").post(googleLogin);
router.route("/logout").post(verifyJWT,logoutUser)
router.route("/update-password").patch(verifyJWT,updatePassword);

export default router