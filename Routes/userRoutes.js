import express from 'express';
// Correct import path for blogController.js
import { createBlog, updateBlog, deleteBlog, likeBlog, getUserPosts, getAllPosts, getAllLikes, getPostById } from '../Controllers/blogContorller.js';
import { registerUser, loginUser, logoutUser, getUserDetails } from '../Controllers/userContorller.js';
import { verifyJWT } from '../Middleware/authmiddleware.js';
import { sendConnectionRequest, acceptConnectionRequest,sendMessage, getFriendRequests, rejectConnectionRequest, getUserFriends } from '../Controllers/connectionContorller.js';



const router = express.Router();

router.post('/create', verifyJWT,createBlog);
router.delete('/delete/:blogid', verifyJWT,deleteBlog);
router.post('/like/:blogid', verifyJWT, likeBlog);
router.get('/getUserPost', verifyJWT, getUserPosts);
router.get('/getAllLikes', verifyJWT, getAllLikes);
router.get('/getAllPost', getAllPosts);
router.get('/getsinglePost/:blogid',verifyJWT, getPostById);
router.put('/update/:blogid',verifyJWT, updateBlog);

router.post('/connect/:receiverId',verifyJWT,sendConnectionRequest)
router.post('/accept/:connectionId',verifyJWT,acceptConnectionRequest)
router.post('/reject/:connectionId',verifyJWT,rejectConnectionRequest)
router.post('/chat/:connectionId',verifyJWT,sendMessage)
router.get('/friend-req',verifyJWT,getFriendRequests)
router.get('/friends',verifyJWT,getUserFriends)

// Route to register a new user
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile',verifyJWT, getUserDetails);
router.post('/logout',verifyJWT, logoutUser);
export default router;
