import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Function to hash passwords
export const hashPassword = async (password) => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};

// Function to generate JWT tokens
export const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { userId: user._id, username: user.username },
    process.env.access_token_secret, // Replace with your actual access token secret
    { expiresIn: '1m' }
  );

  const refreshToken = jwt.sign(
    { userId: user._id, username: user.username },
    process.env.refresh_token_secret, // Replace with your actual refresh token secret
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
};


export const decodeToken = async (token) => {
    try {
      const decoded = await jwt.verify(token, process.env.access_token_secret); // Replace with your actual access token secret
      return decoded.userId;
    } catch (error) {
      throw new Error('Invalid token');
    }
  };
