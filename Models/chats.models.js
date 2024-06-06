import mongoose,{ Schema } from 'mongoose';



const chatSchema = new Schema({
  connection_id: {
    type: Schema.Types.ObjectId, 
    ref: 'Connection', 
    required: true 
  },
  sender_id: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  receiver_id: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  message: { 
    type: String, 
    required: true 
  },
  sent_at: { 
    type: Date, 
    default: Date.now 
  }
});

const Chat = mongoose.model('Chat', chatSchema);
export default Chat;
