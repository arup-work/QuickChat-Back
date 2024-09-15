import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    // For email verification
    verificationToken: {
        type: String
    },
    verificationTokenExpire: {
        type: Date
    },
}, {timestamps: true})

// Create a model
const User = mongoose.model('User', UserSchema);

// Export the model
export default User;