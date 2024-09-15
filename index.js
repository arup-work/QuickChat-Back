import express from 'express';
import http from "http";
import mongoose from 'mongoose';
import 'dotenv/config';


import Route from './routes/index.js';
import errorHandler from './errorHandler.js';
import emailQueue from './utils/emailQueue.js';
import sendEmail from './services/email.service.js';

const app = express();
const server = http.createServer(app);

// Middleware to parse JSON bodies
app.use(express.json());

// All routes
app.use('/api/v1',Route)

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