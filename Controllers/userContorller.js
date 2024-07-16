import User from '../Models/usermodels.js';
import { hashPassword, generateTokens, decodeToken } from '../Utils/authutils.js';
import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';

export const registerUser = async (req, res) => {
  const { username, email, password, fullName, contact } = req.body;
  // console.log(username, email, password, fullName, contact)

  // Validate the input
  if (!username || !email || !password || !fullName || !contact) {
    return res.status(400).json({ message: 'Please fill in all fields' });
  }

  try {
    // Check if the email or username already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Email or username already exists' });
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Create a new user
    const newUser = new User({ username, email, password: hashedPassword, fullName, contact });

    // Generate tokens
    const { accessToken, refreshToken } = await generateTokens(newUser);

    newUser.refreshToken = refreshToken;
    // Save the user to the database
    await newUser.save();

    const option ={
        httpOnly:true,
        secure:true
    }

    // console.log(newUser)

    res.status(201).cookie("accessToken",accessToken,option)
    .cookie("refreshToken",refreshToken,option).json({ message: 'User registered successfully', accessToken, refreshToken });
  } catch (error) {
    console.log(error,error.message)
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


export const getUserDetails = async(req, res) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) {
      return res.status(401).json({ message: 'No token provided user is not login' });
    }

    const userId = await decodeToken(token);
    // console.log(userId)
    
    // Assuming you have a User model
    const user = await User.findById({_id:userId}).select('-password'); // Exclude password from response

    if (!user) {
      return res.status(404).json({ message: 'User not found something went wrong ' });
    }
    // console.log(user)
    res.status(200).json({ message:"details feteched succuessfully" ,user });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};



export const loginUser = async (req, res) => {
  const { emailOrUsername, password } = req.body;
  // console.log( emailOrUsername, password)

  // Validate the input
  if (!emailOrUsername || !password) {
    return res.status(400).json({ message: 'Please fill in all fields' });
  }

  try {
    // Check if the user exists by email or username
    const user = await User.findOne({ $or: [{ email: emailOrUsername }, { username: emailOrUsername }] });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email/username or password' });
    }

    // Validate the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email/username or password' });
    }

    // Generate new access and refresh tokens
    const { accessToken, refreshToken } = generateTokens(user);
    user.refreshToken = refreshToken;
    await user.save();
    const option ={
        httpOnly:true,
        secure:true
    }
    // console.log(user);

    res.status(200).cookie("accessToken",accessToken,option)
    .cookie("refreshToken",refreshToken,option).json({ message: 'Login successful',user, accessToken, refreshToken });
  } catch (error) {
    // console.log(error.message)
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};






export const logoutUser = async(req,res)=>{
    // console.log(req.user);
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1 // this removes the field from document
            }
        },
        {
            new : true
        }
    )

    const option ={
        httpOnly:true,
        secure:true
    }

    return res
    .status(200)
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .json(
        200,{},"User Logout Successfully"
    )
}
