import mongoose from 'mongoose';

const { Schema } = mongoose;

const blogSchema = new Schema({
  user_id: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  title: { 
    type: String, 
    required: true 
  },
  content: { 
    type: String, 
    required: true 
  },
  likesCount: {
    type: Number,
    default: 0,
  },
  
},{timestamps:true});



const Blog = mongoose.model('Blog', blogSchema);
export default Blog;
