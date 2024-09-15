import express from "express";
import { validationMiddleware } from "../middlewares/validation.middleware.js";
import { loginSchema, registerSchema } from "../zod.js";
import AuthController from "../controllers/auth.controller.js";

const authRoute = express.Router();

// Registration route
authRoute.post(
    '/register',
    [validationMiddleware(registerSchema)],
    AuthController.register
)

// Login route
authRoute.post(
    '/login',
    [validationMiddleware(loginSchema)],
    AuthController.login

)


export default authRoute;