import mongoose from "mongoose";
import User from "../models/User.js";
import upload from "../config/multer.js";
import path from "path";
import deleteFile from "../utils/helpers/deleteFile.js";

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

    static async updateProfileImage(req, res) {

        try {
            const { userId } = req.params;

            if (!mongoose.Types.ObjectId.isValid(userId)) {
                throw new Error('Invalid user ID format');
            }
            const user = await User.findById(userId);

            if (!user) {
                throw new Error('User not found');
            }

            // Delete the old profile image if it exists
            if (user.profileImage) {
                const oldImagePath = path.join('public', user.profileImage);
                deleteFile(oldImagePath);
            }

            // Use multer to handle file upload
            return new Promise((resolve, reject) => {
                upload.single('image')(req, res, async (err) => {
                    if (err) {
                        reject(new Error(err.message));
                        return;
                    }

                    const imagePath = req.file.path.replace(/\\/g, '/').replace('public/', '');
                    user.profileImage = imagePath;
                    await user.save();

                    const imageUrl = `${process.env.BASE_URL}/uploads/${imagePath}`;
                    resolve({ message: 'Profile image uploaded successfully', imageUrl });
                });
            });
        } catch (error) {
            return res.json({ status: 500, message: error.message });
        }
    }

    static async removeProfileImage(userId){
        try {
            if (!mongoose.Types.ObjectId.isValid(userId)) {
                throw new Error('Invalid user ID format');
            }
            const user = await User.findById(userId);

            if (!user) {
                throw new Error('User not found');
            }

            // Delete the old profile image if it exists
            if (user.profileImage) {
                const oldImagePath = path.join('public', user.profileImage);
                deleteFile(oldImagePath);
            }

            // Update profile image
            user.profileImage = null;
            user.save();

            return user;
            
        } catch (error) {
            return error;
        }
    }
}