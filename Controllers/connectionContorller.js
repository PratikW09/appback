// controllers/connectionController.js
import ConnectionAndChat from '../Models/connectionAndChatmodels.js';
import { decodeToken } from '../Utils/authutils.js';

export const sendConnectionRequest = async (req, res) => {
  const  receiverId  = req.params.receiverId;
  const senderId = await decodeToken(req.cookies.accessToken);

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

    res.status(201).json({ message: 'Connection request sent successfully', connection: newConnection });
  } catch (error) {
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
