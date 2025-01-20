import ProfileService from "../services/profile.service.js";

export default class ProfileController {
    static async updateName(req, res) {
        try {
            const { name } = req.body;
            const { userId } = req.params;

            if (!userId || !name) {
                return res.status(400).json({ message: 'Missing userId or name' });
            }
            const response = await ProfileService.updateName(userId, name);
            const {  email } = response;
            return res.status(200).json({
                user: { email, name},
                status: 200
            })
        } catch (error) {
            return res.status(500).json({
                message: error.message,
                status: 500
            })
        }
    }

    static async updateProfileImage(req, res) {
        try {
            const { userId } = req.params;
            
            if (!userId) {
                return res.status(400).json({ message: 'Missing userId' });
            }
            const response = await ProfileService.updateProfileImage(req, res);
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

    static async removeProfileImage(req, res) {
        try {
            const { userId } = req.params;
            
            if (!userId) {
                return res.status(400).json({ message: 'Missing userId' });
            }
            const response = await ProfileService.removeProfileImage(userId);
            console.log(response);
            
            const {  email, profileImage } = response;
            return res.status(200).json({
                user: {email, profileImage},
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