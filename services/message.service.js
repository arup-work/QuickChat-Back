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
         // Convert senderId to ObjectId
         if (!mongoose.Types.ObjectId.isValid(senderId)) {
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
                // Sort messages by creation date (latest messages first)
                {
                    $sort: { createdAt: -1 }
                },
                // Group by conversation partner
                {
                    $group: {
                        _id: {
                            conversationUser: {
                                $cond: [
                                    { $eq: ["$senderId", senderId] },
                                    "$recipientId", // If senderId matches, group by recipientId
                                    "$senderId"     // Otherwise, group by senderId
                                ]
                            }
                        },
                        lastMessage: { $first: "$content" }, // Take the latest message content
                        createdAt: { $first: "$createdAt" } // Take the timestamp of the latest message
                    }
                },
                // Project the desired output fields
                {
                    $project: {
                        _id: 0,
                        userId: "$_id.conversationUser", // Rename _id.conversationUser to userId
                        lastMessage: 1,
                        createdAt: 1
                    }
                },
                // Optional: Sort the final output by message date
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