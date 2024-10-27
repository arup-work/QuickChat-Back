import Message from "../models/Message.js";

export default class MessageService {
    static async getMessageBetweenUsers(senderId, receiverId){
        const messages = await Message.find({
            $or: [
                {senderId: senderId, recipientId: receiverId},
                {senderId: receiverId, recipientId: senderId}
            ]
        }).sort({ timestamp: 1});
        return messages;
    }
}