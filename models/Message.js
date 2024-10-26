import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
    sender: {
        type: String,
        required: true, 
    },
    recipient: {
        type: String,
        required: true, 
    },
    message: {
        type: String,
        required: true
    }
}, { timestamps: true });

// Create a model
const Message = new mongoose.model('Message', MessageSchema);

export default Message;