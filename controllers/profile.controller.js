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