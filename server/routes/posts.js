import express  from "express";
import {getFeedPosts,getUserPosts,likePost} from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";
const router = express.Router();

// Read routes
router.get("/", verifyToken, getFeedPosts);
router.get("/:userId/posts", verifyToken, getUserPosts);

//Patch routes
router.patch("/:id/like", verifyToken, likePost);

export default router;