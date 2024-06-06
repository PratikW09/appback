import express from 'express';
// Correct import path for blogController.js
import { createBlog, updateBlog, deleteBlog, likeBlog, getUserPosts, getAllPosts } from '../Controllers/blogContorller.js';
import { registerUser, loginUser, logoutUser, getUserDetails } from '../Controllers/userContorller.js';
import { verifyJWT } from '../Middleware/authmiddleware.js';
import { sendConnectionRequest, acceptConnectionRequest,sendMessage } from '../Controllers/connectionContorller.js';



const router = express.Router();

router.post('/create', verifyJWT,createBlog);
router.post('/like/:blogid', verifyJWT, likeBlog);
router.get('/getUserPost', verifyJWT, getUserPosts);
router.get('/getAllPost', verifyJWT, getAllPosts);

router.post('/connect/:receiverId',verifyJWT,sendConnectionRequest)
router.post('/accept/:connectionId',verifyJWT,acceptConnectionRequest)
router.post('/chat/:connectionId',verifyJWT,sendMessage)

// Route to register a new user
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile',verifyJWT, getUserDetails);
export default router;
