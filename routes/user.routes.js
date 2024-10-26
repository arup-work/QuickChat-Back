import express from "express";
import UserController from "../controllers/user.controller.js";

const userRoute = express.Router();

// Fetch all users
userRoute.get(
    '/all-users', 
    UserController.getAllUsers
);


export default userRoute;