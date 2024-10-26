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

const app = express();
const server = http.createServer(app);

app.use(cors());  // Enable CORS for all routes
app.use(express.json()); // Middleware to parse JSON bodies

// io
const io = new Server(server, {
    cors: {
        origin: [process.env.FRONTEND_URL, "http://localhost:3000"],
        methods: ["GET", "POST"]
    }
})

// Listen for connection from clients
io.on('connection', (socket) => {
    console.log('New Client connected: ', socket.id);

    // Join a specific chat room 
    socket.on('joinRoom', ({ sender, recipient }) => {
        const room = [sender, recipient].sort().join('-');
        socket.join(room);
        console.log(`User ${sender} joined room ${room}`);
    })

    //Listen for new messages
    socket.on('message',({ sender, recipient, message}) => {
        const room = [sender, recipient].sort().join('-');
        const newMessage = new Message({ sender, recipient, message});

        // Save the message to the database
        newMessage.save().then(() => {
            io.to(room).emit('message', newMessage);
        })
    })      

    // Handle client disconnect
    socket.on('disconnect', () => {
        console.log('Client disconnected', socket.id);
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