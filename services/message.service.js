import mongoose from "mongoose";
import Message from "../models/Message.js";

export default class MessageService {
    static async getMessageBetweenUsers(senderId, receiverId) {
        const messages = await Message.find({
            $or: [
                { senderId: senderId, recipientId: receiverId },
                { senderId: receiverId, recipientId: senderId }
            ]
        }).sort({ timestamp: 1 });
        return messages;
    }

    static async getAllUsersLastMessages(senderId) {
        if (!mongoose.Types.ObjectId.isValid(senderId)) {
            console.error("Invalid senderId:", senderId);
            throw new Error("Invalid senderId");
        }
    
        const senderObjectId = mongoose.Types.ObjectId.createFromHexString(senderId);
    
        try {
            const messages = await Message.aggregate([
                // Match messages involving the senderId
                {
                    $match: {
                        $or: [
                            { senderId: senderObjectId },
                            { recipientId: senderObjectId }
                        ]
                    }
                },
                // Add a conversationId for grouping conversations
                {
                    $addFields: {
                        conversationId: {
                            $cond: [
                                { $lt: ["$senderId", "$recipientId"] },
                                { $concat: [
                                    { $toString: "$senderId" }, "_", { $toString: "$recipientId" }
                                  ] },
                                { $concat: [
                                    { $toString: "$recipientId" }, "_", { $toString: "$senderId" }
                                  ] }
                            ]
                        }
                    }
                },
                // Sort by creation date (latest messages first)
                {
                    $sort: { createdAt: -1 }
                },
                // Group by conversationId and take the latest message
                {
                    $group: {
                        _id: "$conversationId",
                        lastMessage: { $first: "$content" }, // Latest message content
                        createdAt: { $first: "$createdAt" }, // Latest message timestamp
                        senderId: { $first: "$senderId" }, // Sender in the conversation
                        recipientId: { $first: "$recipientId" } // Recipient in the conversation
                    }
                },
                // Project the desired fields for output
                {
                    $project: {
                        _id: 0,
                        conversationId: "$_id", // Rename _id to conversationId
                        lastMessage: 1,
                        createdAt: 1,
                        users: ["$senderId", "$recipientId"] // Format users array
                    }
                },
                // Optional: Sort the final output by creation date
                {
                    $sort: { createdAt: -1 }
                }
            ]);
            return messages;
    
        } catch (error) {
            console.error("Error fetching last messages:", error);
            throw new Error("Could not fetch last messages");
        }
    }
    
    
    
    
    
}