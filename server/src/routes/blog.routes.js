import { Router } from "express";
import { addBlog, deleteBlog, editBlog, getAllBlogs, getBlogByCategory, getBlogBySlug, searchBlogs, showBlog } from "../controllers/blog.contoller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { addComment, deleteComment, getAllComments, getBlogComments } from "../controllers/comment.controller.js";
import { addLike, removeLike } from "../controllers/like.controller.js";

const router=Router()

//  CORRECT ORDER - Specific routes first
router.route("/add-blog").post(upload.single("image"), addBlog);
router.route("/edit-blog/:blog_id").post(upload.single("image"), editBlog);
router.route("/delete-blog/:blog_id").delete(deleteBlog);
router.route("/all-blogs").get(getAllBlogs);
router.route("/show-blog/:blog_id").get(showBlog);

router.route("/comments").get(getAllComments)
router.route("/comments/delete-comment/:commentId").delete(deleteComment)
router.route("/search").get(searchBlogs);

router.route("/:categorySlug/:blogSlug").get(getBlogBySlug);
router.route("/:categorySlug/:blogSlug/comment").post(addComment);
router.route("/:categorySlug/:blogSlug/comments").get(getBlogComments);
router.route("/:categorySlug/:blogSlug/add-like").post(addLike);
router.route("/:categorySlug/:blogSlug/remove-like").delete(removeLike);


router.route("/:categorySlug").get(getBlogByCategory);

export default router