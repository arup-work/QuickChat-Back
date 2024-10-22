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

const app = express();
const server = http.createServer(app);

app.use(cors());  // Enable CORS for all routes
app.use(express.json()); // Middleware to parse JSON bodies

// io
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
})

// Listen for connection from clients
io.on('connection', (socket) => {
    console.log('New Client connected: ', socket.id);
    
    // Send a message from the server to the client
    socket.emit('message', 'Welcome to the socket.io server');

    // Listen for events from the client
    socket.on('messageFromClient', (message) => {
        console.log('Message from client:', message);

        // You can broadcast this to other clients if needed
        io.emit('message', `Client says: ${message}`);
        
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