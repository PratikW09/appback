import mongoose,{ Schema } from 'mongoose';



const userSchema = new Schema
({
  username :
  {
      type : String,
      required : true,
      unique : true,
      lowercase : true,
      trim : true,
      index : true,
  },
  email :
  {
      type : String,
      required : true,
      unique : true,
      lowercase : true,
      trim : true,
  },
  fullName :
  {
      type : String,
      required : true,
      trim : true,
      index : true,
  },
  contact:{
    type : String,
      required : true,
      unique : true,
      lowercase : true,
      trim : true,
  },
  password :
  {
      type : String,
      required : [true, "Password is required"]
  },
  refreshToken :
  {
      type : String
  }
},
{
  timestamps: true
})

const User = mongoose.model('User', userSchema);
export default User;
