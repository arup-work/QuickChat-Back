import MessageService from "../services/message.service.js";

export default class MessageController{
    static async getMessagesBetweenUsers(req, res){
        try {
            const senderId = req.user.id;
            const receiverId= req.params.receiverId;

            const messages = await MessageService.getMessageBetweenUsers(senderId, receiverId);
            res.status(200).json({
                message: "Message retrieved successfully",
                messages,
                status: 200
            })
        } catch (error) {
            res.status(500).json({
                message: error.message,
                status: 500
            })
        }
    }
}