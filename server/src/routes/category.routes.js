import { Router } from "express";
import { addCategory, deleteCategory, editCategory, getAllCategories, showCategory } from "../controllers/category.controller.js";

const router=Router()

router.route("/add-category").post(addCategory);
router.route("/edit-category/:categoryId").patch(editCategory);
router.route("/show-category/:categoryId").get(showCategory);
router.route("/delete-category/:categoryId").delete(deleteCategory);
router.route("/all-category").get(getAllCategories);
export default router