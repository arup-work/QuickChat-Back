import AuthService from "../services/auth.service.js";

export default class AuthController {
    static async register(req, res) {
        try {
            const { name, email, password } = req.body;
            const user = await AuthService.register(name, email, password);
            return res.status(200).json({
                message: "Congratulation your registration is successful. Please verify your email",
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email
                },
                status: 200
            })
        } catch (error) {
            return res.status(500).json({
                message: error.message,
                status: 500
            })
        }
    }

    static async login(req, res) {
        try {
            const { email, password } = req.body;
            const result = await AuthService.login(email, password);
            const { id, name, token, profileImage } = result;

            return res.status(200).json({
                message: "Login successful",
                user: { email, id, name, profileImage },
                token: token,
                status: 200
            })

        } catch (error) {
            return res.status(401).json({
                message: error.message,
                status: 401
            })
        }
    }

    static async verifyEmail(req, res) {
        try {
            const { token } = req.params;
            if (!token) {
                return res.status(404).json({
                    message: 'Token is required!',
                    status: 404
                });
            }

            const user = await AuthService.verifyEmail(token);
            return res.status(200).json({
                message: 'Email verified successfully',
                status: 200
            });
        } catch (error) {
            return res.status(401).json({
                message: error.message,
                status: 401
            })
        }
    }
}