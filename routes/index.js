import express from "express";
import authRoute from "./auth.routes.js";
import userRoute from "./user.routes.js";
import messageRoute from "./message.routes.js";

const Route = express.Router();

Route.use(
    '/auth',
    authRoute,
)

Route.use(
    '/user',
    userRoute
)

Route.use(
    '/message',
    messageRoute
)


export default Route;