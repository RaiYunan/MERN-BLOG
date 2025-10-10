import { Router } from "express";
import { getAllUsers, getUser,updateUser } from "../controllers/user.controller.js";

import {upload} from "../middlewares/multer.middleware.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router=Router()

router.route("/get-user/:userId").get(getUser)
router.route("/update-user/:userId").patch(verifyJWT,upload.single("avatar"),updateUser)
router.route("/get-all-users").get(getAllUsers)

export default router