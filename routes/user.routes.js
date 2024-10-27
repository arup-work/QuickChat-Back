import express from "express";
import UserController from "../controllers/user.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const userRoute = express.Router();

// Fetch all users (requires authentication)
userRoute.get(
    '/all-users', 
    [authMiddleware],
    UserController.getAllUsers
);


export default userRoute;