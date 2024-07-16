// controllers/connectionController.js
import ConnectionAndChat from '../Models/connectionAndChatmodels.js';
import User from '../Models/usermodels.js';
import { decodeToken } from '../Utils/authutils.js';




export const getFriendRequests = async (req, res) => {
  try {
    const userId = await decodeToken(req.cookies.accessToken);
    console.log(userId);

    // Find all pending friend requests where the logged-in user is one of the participants
    const friendRequests = await ConnectionAndChat.find({
      participants: userId,
      status: 'pending',
    });

    // Prepare an array to store detailed requests
    const detailedRequests = [];

    // Iterate through each request to find the sender details
    for (const request of friendRequests) {
      // Find the sender (the other participant in the request)
      const senderId = request.participants.find(participant => participant.toString() !== userId.toString());

      // Find the sender's details from the User model
      const sender = await User.findById(senderId, 'username email'); // Select only the necessary fields

      if (sender) {
        detailedRequests.push({
          _id: request._id,
          status: request.status,
          sender: {
            _id: sender._id,
            username: sender.username,
            email: sender.email,
          },
          createdAt: request.createdAt,
          updatedAt: request.updatedAt,
        });
      }
    }

    console.log("Friend Requests: ", detailedRequests);
    res.status(200).json({ requests: detailedRequests });
  } catch (error) {
    console.error('Error fetching friend requests:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};



export const sendConnectionRequest = async (req, res) => {
  const  receiverId  = req.params.receiverId;
  const senderId = await decodeToken(req.cookies.accessToken);

  console.log(receiverId)  
  try {
    // Check if a connection already exists
    const existingConnection = await ConnectionAndChat.findOne({
      participants: { $all: [senderId, receiverId] }
    });



    if (existingConnection) {
      return res.status(400).json({ message: 'Connection request already sent or accepted' });
    }
    console.log(1);
    // Create a new connection request
    const newConnection = await new ConnectionAndChat({
      participants: [senderId, receiverId],
      status: 'pending',
    });

    console.log(newConnection)
    await newConnection.save();
    console.log(newConnection)
    res.status(201).json({ message: 'Connection request sent successfully', connection: newConnection });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


export const acceptConnectionRequest = async (req, res) => {
    const connectionId = req.params.connectionId;
    const userId = await decodeToken(req.cookies.accessToken);
  
    try {
      // Find the connection request
      const connection = await ConnectionAndChat.findById(connectionId);
      if (!connection) {
        return res.status(404).json({ message: 'Connection request not found' });
      }
  
      // Check if the user is one of the participants
      if (!connection.participants.includes(userId)) {
        return res.status(403).json({ message: 'You are not authorized to accept this request' });
      }
  
      // Update the request status
      connection.status = 'accepted';
      await connection.save();
  
      res.status(200).json({ message: 'Connection request accepted', connection });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };

  export const rejectConnectionRequest = async (req, res) => {
    const connectionId = req.params.connectionId;
    const userId = await decodeToken(req.cookies.accessToken);
  
    try {
      // Find the connection request
      const connection = await ConnectionAndChat.findById(connectionId);
      if (!connection) {
        return res.status(404).json({ message: 'Connection request not found' });
      }
  
      // Check if the user is one of the participants
      if (!connection.participants.includes(userId)) {
        return res.status(403).json({ message: 'You are not authorized to reject this request' });
      }
  
      // Update the request status
      connection.status = 'rejected';
      await connection.save();
  
      res.status(200).json({ message: 'Connection request rejected', connection });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };

  
  // controllers/chatController.js
// import ConnectionAndChat from '../models/connectionAndChat.js';

export const sendMessage = async (req, res) => {
    const connectionId = req.params.connectionId
  const {  content } = req.body;
  const senderId = await decodeToken(req.cookies.accessToken);
  

  try {
    // Find the connection
    const connection = await ConnectionAndChat.findById(connectionId);
    if (!connection) {
      return res.status(404).json({ message: 'Connection not found' });
    }

    // Check if the sender is a participant in the connection
    if (!connection.participants.includes(senderId)) {
      return res.status(403).json({ message: 'You are not a participant in this chat' });
    }

    // Add the new message
    const newMessage = { senderId, content };
    connection.messages.push(newMessage);
    await connection.save();

    res.status(201).json({ message: 'Message sent successfully', connection });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


export const getUserFriends = async (req, res) => {
  try {
    const userId = await decodeToken(req.cookies.accessToken);

    // Find all connections where the user is a participant and the status is 'accepted'
    const acceptedConnections = await ConnectionAndChat.find({
      participants: userId,
      status: 'accepted'
    });

    // Extract friend IDs from the accepted connections
    const friendIds = acceptedConnections.flatMap(connection =>
      connection.participants.filter(participant => participant.toString() !== userId.toString())
    );

    // Find user details for all friends
    const friends = await User.find({ _id: { $in: friendIds } }, 'username email');

    res.status(200).json({ friends });
  } catch (error) {
    console.error('Error fetching friends:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
