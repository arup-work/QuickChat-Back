import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true, 
    },
    recipientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true, 
    },
    content: {
        type: String,
        required: true
    }
}, { timestamps: true });

// Create a model
const Message = new mongoose.model('Message', MessageSchema);

export default Message;