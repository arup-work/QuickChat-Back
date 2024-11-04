import UserService from "../services/user.service.js";

export default class UserController{
    static async getAllUsers(req, res){
        try {
            const users = await UserService.getAllUsers();
            return res.status(200).json({
                users,
                status: 200
            })
        } catch (error) {
            return res.status(500).json({
                message: error.message,
                status: 500
            })
        }
    }

    static async getLastSeen(req, res){
        try {
            const { userId } = req.params;
            const response = await UserService.getLastSeen(userId);
            return res.status(200).json({
                response,
                status: 200
            })
        } catch (error) {
            return res.status(500).json({
                message: error.message,
                status: 500
            })
        }
    }
}