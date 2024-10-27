import express from "express";
import MessageController from "../controllers/message.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const messageRoute = express.Router();

// Get all messages between the current user and another user by user ID
messageRoute.get(
    '/:receiverId',
    [authMiddleware],
    MessageController.getMessagesBetweenUsers
)

export default messageRoute;