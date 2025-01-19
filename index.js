import express from 'express';
import http from "http";
import mongoose from 'mongoose';
import 'dotenv/config';
import cors from 'cors';


import Route from './routes/index.js';
import errorHandler from './errorHandler.js';
import emailQueue from './utils/emailQueue.js';
import sendEmail from './services/email.service.js';
import { Server } from 'socket.io';
import Message from './models/Message.js';
import User from './models/User.js';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const app = express();
const server = http.createServer(app);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(cors());  // Enable CORS for all routes
app.use(express.json()); // Middleware to parse JSON bodies

// Serve static files from the 'public' directory
app.use('/uploads',express.static(path.join(__dirname, 'public')));


// io
const io = new Server(server, {
    cors: {
        origin: [process.env.FRONTEND_URL, "http://localhost:3000"],
        methods: ["GET", "POST"]
    }
})

// Middleware to check for userId
io.use((socket, next) => {
    const userId = socket.handshake.query.userId;
    if (userId) {
        socket.userId = userId;
        next();
    } else {
        next(new Error('User ID required'));
    }
});

const onlineUsers = new Set(); //Track online users

// Listen for connection from clients
io.on('connection', (socket) => {
    const userId = socket.userId;
    // console.log('New Client connected: ', userId);

    // Add user to online users set
    onlineUsers.add(userId);

    // Emit updated online users and their statuses
    const emitUserStatuses = async () => {
        const allUsers = await User.find({}, "_id lastSeen"); // Fetch all users with their last seen
        const userStatuses = allUsers.map((user) => ({
            userId: user._id,
            status: onlineUsers.has(user._id.toString()) ? 'online' : 'offline',
            lastSeen: onlineUsers.has(user._id.toString()) ?  null : user.lastSeen
        }));
        io.emit('userStatusesUpdate', userStatuses); 
    }

    emitUserStatuses();

    // Join a specific chat room 
    socket.on('joinRoom', ({ sender, recipient }) => {
        const room = [sender, recipient].sort().join('-');
        socket.join(room);
        console.log(`User ${sender} joined room ${room}`);
    })

    //Listen for new messages
    socket.on('message', ({ sender, recipient, message }) => {
        const room = [sender, recipient].sort().join('-');
        const newMessage = new Message({ senderId: sender, recipientId: recipient, content: message });

        // Save the message to the database
        newMessage.save().then(() => {
            io.to(room).emit('message', newMessage);
        })
    })

    // Listen for typing event
    socket.on('typing', ({ sender, recipient }) => {
        const room = [sender, recipient].sort().join('-');
        console.log(`${sender} is typing in room ${room}`);
        socket.to(room).emit("userTyping", { sender });  // Notify all users in the room
    })

    // Listen for stopTyping event
    socket.on('stopTyping', ({ sender, recipient }) => {
        const room = [sender, recipient].sort().join('-');
        console.log(`${sender} stopTyping in room ${room}`);
        socket.to(room).emit("userStoppedTyping", { sender });  // Notify all users in the room
    })

    // On disconnect, update the last seen timestamp in the database
    socket.on('disconnect', async () => {
        onlineUsers.delete(userId); //Remove user from online users
        const lastSeen = new Date();
        await User.findByIdAndUpdate(userId, { lastSeen });
        
        console.log(`${userId} disconnected`);
        emitUserStatuses(); // Update all clients after disconnect
    })
})


// All routes
app.use('/api/v1', Route)

// Setup email queue processing
emailQueue.process(async (job) => {
    const { email, subject, template, context } = job.data;
    await sendEmail({ email, subject, template, context })
})

// Handle all errors
app.use(errorHandler);

const PORT = process.env.PORT || 8000;
server.listen(PORT, (err) => {
    if (!err) {
        mongoose.connect('mongodb://127.0.0.1:27017/quick_chat').then(() => console.log("Successfully connected!"));
        console.log(`Server is running on port ${PORT}`);
    }
});