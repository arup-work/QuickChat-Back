import express from "express";
import UserController from "../controllers/user.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import ProfileController from "../controllers/profile.controller.js";

const userRoute = express.Router();

// Fetch all users (requires authentication)
userRoute.get(
    '/all-users', 
    [authMiddleware],
    UserController.getAllUsers
);

// Fetch last seen
userRoute.get(
    '/last-seen/:userId',
    [authMiddleware],
    UserController.getLastSeen
)

// Update user name
userRoute.post(
    '/update-name/:userId',
    [authMiddleware],
    ProfileController.updateName
)



export default userRoute;