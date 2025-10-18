import { Router } from "express";
import { addBlog, deleteBlog, editBlog, getAllBlogs, getBlogBySlug, showBlog } from "../controllers/blog.contoller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { addComment, getBlogComments } from "../controllers/comment.controller.js";
import { addLike } from "../controllers/like.controller.js";

const router=Router()

router.route("/add-blog").post(upload.single("image"),addBlog);
router.route("/edit-blog/:blog_id").post(upload.single("image"),editBlog)
router.route("/delete-blog/:blog_id").delete(deleteBlog)
router.route("/all-blogs").get(getAllBlogs)
router.route("/show-blog/:blog_id").get(showBlog)
router.route("/:categorySlug/:blogSlug").get(getBlogBySlug);
router.route("/:categorySlug/:blogSlug/comment").post(addComment);
router.route("/:categorySlug/:blogSlug/comments").get(getBlogComments);

router.route("/:categoruSlug/:blogSlug/like").post(addLike);

export default router