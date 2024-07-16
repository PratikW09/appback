import Blog from '../Models/blogmodels.js';

// controllers/likeController.js
import Like from '../Models/likemodels.js';
import { decodeToken } from '../Utils/authutils.js';




const likeBlog = async (req, res) => {
    const blogid = req.params.blogid; // Assuming the blog ID is passed in the URL parameters
    // console.log(blogid);
  
    try {
      // Retrieve the user ID from the cookies
      const userId = await decodeToken(req.cookies.accessToken);
  console.log(userId)
      // Check if the blog post exists
      const blog = await Blog.findById(blogid);
      if (!blog) {
        return res.status(404).json({ message: 'Blog post not found' });
      }
  
      // Check if the user has already liked the blog post
      const existingLike = await Like.findOne({blogId: blogid, userId: userId });
      if (existingLike) {
        console.log("You have already liked this blog post")
        return res.status(400).json({ message: 'You have already liked this blog post' });
      }
  
      // Create a new like
      const newLike = new Like({blogId: blogid,  userId:userId });
    //   console.log(newLike);
  
      // Save the like to the database
      await newLike.save();
    //   console.log(1);
  
      // Increment the likes count in the blog post
      blog.likesCount = (blog.likesCount || 0) + 1;
    //   console.log(2);
      await blog.save();
    //   console.log("hii", blog);
      // console.log("likes",)
      res.status(201).json({ message: 'Blog post liked successfully', like: newLike, blog });
    } catch (error) {
      console.error("Error liking the blog post:", error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };

  const getAllLikes = async (req, res) => {
    try {
      // Fetch all likes from the database
      const likes = await Like.find();
  
      // Return the likes array
      res.status(201).json({ message: 'All likes array', likes: likes });
    } catch (error) {
      console.error("Error fetching likes:", error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };

// Controller function to create a new blog post
 const createBlog = async (req, res) => {
    const { title, content,author,tags } = req.body;
    // console.log(req.body);
    // console.log(title, content)
  
    // Validate the input
    if (!title || !content) {
      return res.status(400).json({ message: 'Please fill in all fields' });
    }
  
    try {
      // Retrieve the user ID from the cookies
    //   console.log(req.cookies)
      const userId = await decodeToken(req.cookies.accessToken);

      // console.log("userId from createBlog contorller ->",userId)
  
      // Create a new blog post
      const newBlog = new Blog({
        user_id: userId,
        title,
        content,
        author,
        tags
      });
  
      // Save the blog post to the database
      await newBlog.save();
  
      res.status(201).json({ message: 'Blog post created successfully', blog: newBlog });
    } catch (error) {
      // console.log(error)
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };



  const updateBlog = async (req, res) => {
    const { title, content, tags, author } = req.body;
    const blogId = req.params.blogid;
  
    // console.log(req.body);
    // console.log(blogId);
  
    // Validate the input
    if (!title || !content) {
      return res.status(400).json({ message: 'Please fill in all fields' });
    }
  
    try {
      // Find the blog post by ID
      const blog = await Blog.findById(blogId);
      if (!blog) {
        return res.status(404).json({ message: 'Blog post not found' });
      }
  
      // console.log(blog);
  
      // Check if the requesting user is the owner of the blog post
      const token = req.cookies.accessToken;
      if (!token) {
        return res.status(401).json({ message: 'No token provided, user is not logged in' });
      }
  
      const userId = await decodeToken(token);
      if (blog.user_id.toString() !== userId.toString()) {  // Ensure user IDs are compared correctly
        return res.status(403).json({ message: 'You are not authorized to update this blog post' });
      }
  
      // Update the blog post fields
      blog.title = title;
      blog.content = content;
      if (tags) {
        blog.tags = tags;
      }
      if (author) {
        blog.author = author;
      }
  
      // Save the updated blog post
      await blog.save();
      // console.log(blog);
  
      res.status(200).json({ message: 'Blog post updated successfully', blog });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };
  
  

  const getPostById = async (req, res) => {
    const blogId = req.params.blogid; // Assuming the blog ID is passed in the URL parameters
  
    try {
      // Find the blog post by ID
      const blog = await Blog.findById(blogId);
      if (!blog) {
        return res.status(404).json({ message: 'Blog post not found' });
      }
  
      // Respond with the blog post
      res.status(200).json({ blog });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };
  
  const deleteBlog = async (req, res) => {
    const blogId = req.params.blogid; // Assuming the blog ID is passed in the URL parameters
    // console.log("Delete post", blogId);
  
    try {
      // Find the blog post by ID
      const blog = await Blog.findById(blogId);
      if (!blog) {
        return res.status(404).json({ message: 'Blog post not found' });
      }
      // console.log("Blog found:", blog);
  
      const token = req.cookies.accessToken;
      if (!token) {
        return res.status(401).json({ message: 'No token provided, user is not logged in' });
      }
  
      const userId = await decodeToken(token);
      if (String(blog.user_id) !== String(userId)) {
        // console.log("Unauthorized user");
        return res.status(403).json({ message: 'You are not authorized to delete this blog post' });
      }
  
      // Delete the blog post
      // console.log("Deleting blog post");
      await blog.deleteOne();
      // console.log("Blog post deleted");
  
      res.status(200).json({ message: 'Blog post deleted successfully', blog });
    } catch (error) {
      console.error("Server error:", error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };


  const getUserPosts = async (req, res) => {
    try {
      // console.log("Fetching user posts...");
  
      // Decode the token to get user ID
      const userId = await decodeToken(req.cookies.accessToken);
      // console.log("User ID from token:", userId);
  
      if (!userId) {
        return res.status(401).json({ message: 'Invalid token or user not authenticated' });
      }
  
      // Find posts by the user ID
      const posts = await Blog.find({ user_id: userId }).sort({ createdAt: -1 });
      // console.log("Posts found:", posts);
  
      if (!posts || posts.length === 0) {
        return res.status(404).json({ message: 'No posts found for this user' });
      }
  
      res.status(200).json({ posts });
    } catch (error) {
      console.error("Error fetching user posts:", error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };


  const getAllPosts = async (req, res) => {
    try {
      const posts = await Blog.find().sort({ createdAt: -1 }); // Sort by creation date, descending
      res.status(200).json({ posts });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };
  
  export {getAllLikes,likeBlog,deleteBlog,updateBlog,createBlog,getUserPosts,getAllPosts,getPostById
    
};