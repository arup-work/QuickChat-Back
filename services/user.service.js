import User from "../models/User.js";

export default class UserService{
    static async getAllUsers(){
        const users = await User.find().select('-password -createdAt -updatedAt -verificationToken -__v -verificationTokenExpire -isVerifiedEmail');
        return users;
    }
}