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
        try {
            // Query to get the latest message for each other
            // Convert senderId to ObjectId if it's a valid string
            const senderObjectId = mongoose.Types.ObjectId.isValid(senderId)
                ? mongoose.Types.ObjectId(senderId)
                : null;

            if (!senderObjectId) {
                throw new Error("Invalid senderId");
            }
            const message = await Message.aggregate([
                {
                    $match: {
                        $or: [
                            { senderId: senderId },
                            { recipientId: senderId }
                        ]
                    }
                },
                {
                    $sort: { createdAt: -1 }  //sort by creation date (latest first)
                },
                {
                    $group: {
                        _id: {
                            conversationUser: {
                                $cond: [
                                    { $eq: ["$senderId", senderId] },
                                    "$recipientId",
                                    "$senderId"
                                ]
                            }
                        },
                        lastMessage: { $first: "$content" },
                        createdAt: { $first: "$createdAt" },
                    }
                }, {
                    $project: {
                        _id: 0,
                        userId: "$_id.conversationUser",
                        lastMessage: 1,
                        createdAt: 1,
                    }
                },
                {
                    $sort: { createdAt: -1 } // Optional: Sort the final output by message date
                }
            ]);
            return message;

        } catch (error) {
            console.error("Error fetching last messages:", error);
            throw new Error("Could not fetch last messages");
        }
    }
}