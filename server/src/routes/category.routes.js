import { Router } from "express";
import { addCategory } from "../controllers/category.controller.js";

const router=Router()

router.route("/add-category").post(addCategory);

export default router