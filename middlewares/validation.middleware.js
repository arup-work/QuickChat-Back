export const validationMiddleware = (zodValidationSchema) => {
    return (req, res, next) => {
        const response = zodValidationSchema.safeParse(req.body);
        if (!response.success) {
            return res.status(400).json({
                message: "Invalid data format",
                response: response.error.errors,
                statusCode: 400
            })
        }

        next();
    }
}