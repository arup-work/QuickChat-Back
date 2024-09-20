import JWT from 'jsonwebtoken';
import User from "../models/User.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import emailQueue from "../utils/emailQueue.js";

// A function to check if an exist your database
const validateUserDetails = async (email) => {
    const user = await User.findOne({ email });
    return user;
}

export default class AuthService {
    static async register(name, email, password) {
        try {
            // Check if the email is already in use 
            const userDetails = await validateUserDetails(email);
            if (!!userDetails) {
                throw new Error("Email already used");
            }

            // Hash the password
            const saltRound = 10;
            const hashedPassword = await bcrypt.hash(password, saltRound);

            // Process with user registration since email is unique and validation passed
            const user = await User.create({ name, email, password: hashedPassword });

            // For email verification
            const verificationToken = crypto.randomBytes(32).toString('hex');
            user.verificationToken = crypto.createHash('sha256').update(verificationToken).digest('hex');
            user.verificationTokenExpire = Date.now() + 3600000; // 1 hour
            await user.save();
            
            // Send verification mail
            const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;

            const context = { verificationUrl, name: user.name };
            await emailQueue.add({
                email: user.email,
                subject: 'Verify Email',
                template: 'verifyEmailTemplate.ejs',
                context: context
            })

            return user;

        } catch (error) {
            throw new Error(error.message);
        }
    }

    static async login(email, password) {
        // Check if the email exist or not
        const userDetails = await validateUserDetails(email);
        try {

            if (!userDetails) {
                throw new Error("Unauthorized access!");
            }

            // Compare the provided password with the hashed password
            const isPasswordValid = await bcrypt.compare(password, userDetails.password);
            if (!isPasswordValid) {
                throw new Error("Invalid credential!");
            }

            // Check user verified email or not
            // if (!userDetails.isVerifiedEmail) {
            //     throw new Error("Email is not verified. Please check your email!");
            // }

            // Exclude the password field from the response
            const { id, name, email } = userDetails;

            // Sign a JWT token
            const token = JWT.sign({
                email,
                id
            }, process.env.ACCESS_TOKEN_SECRET_KEY);

            return { id, name, email, token };
        } catch (error) {
            throw new Error(error.message);
        }
    }

    static async verifyEmail(token) {
        try {
            const hashedToken = crypto.createHash('sha256').update(token).digest("hex");

            const user = await User.findOne({
                verificationToken: hashedToken,
                verificationTokenExpire: { $gt: Date.now() }
            });
            console.log(token);
            

            if (!user) {
                throw new Error("Token is invalid or expired!");
            }

            user.isVerifiedEmail = true;
            user.verificationToken = undefined;
            user.verificationTokenExpire = undefined;
            await user.save();

            return user;
        } catch (error) {
            throw new Error(error.message);
        }
    }
}