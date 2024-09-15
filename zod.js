import { z } from "zod";

// Schema for registration
export const registerSchema = z.object({
    name: z.string({
        required_error: "Name is required",
        invalid_type_error: "Name must be a string",
    }).max(255).min(5),
    email: z.string({
        required_error: "Email is required",
        invalid_type_error: "Email is invalid",
    }).email(),
    password: z.string({
        password: z.string({
            required_error: "Password is required"
        }),
    })
})

// Schema for Login
export const loginSchema = z.object({
    email: z.string({
        required_error: "Email is required",
        invalid_type_error: "Email is invalid",
    }).email(),
    password: z.string({
        password: z.string({
            required_error: "Password is required"
        }),
    })
})