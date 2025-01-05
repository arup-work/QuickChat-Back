import mongoose from "mongoose";
import User from "../models/User.js";

export default class ProfileService {
    static async updateName(userId, name) {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            throw new Error('Invalid user ID format');
        }
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        user.name = name;
        await user.save();
        return user;
    }
}