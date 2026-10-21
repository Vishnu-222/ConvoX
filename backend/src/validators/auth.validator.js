/**
 * @description Validate user signup request.
 */
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateSignup = (req, res, next) => {
    const { fullName, email, password } = req.body;

    if (!fullName?.trim()) {
        return res.status(400).json({
            success: false,
            message: "Full name is required.",
        });
    }

    if (!email?.trim()) {
        return res.status(400).json({
            success: false,
            message: "Email is required.",
        });
    }

    if (!emailRegex.test(email.trim())) {
        return res.status(400).json({
            success: false,
            message: "Please enter a valid email address.",
        });
    }

    if (!password?.trim()) {
        return res.status(400).json({
            success: false,
            message: "Password is required.",
        });
    }

    if (password.trim().length < 6) {
        return res.status(400).json({
            success: false,
            message: "Password must be at least 6 characters long.",
        });
    }

    next();
};

/**
 * @description Validate user login request.
 */
export const validateLogin = (req, res, next) => {
    const { email, password } = req.body;

    if (!email?.trim()) {
        return res.status(400).json({
            success: false,
            message: "Email is required.",
        });
    }

    if (!emailRegex.test(email.trim())) {
        return res.status(400).json({
            success: false,
            message: "Please enter a valid email address.",
        });
    }

    if (!password?.trim()) {
        return res.status(400).json({
            success: false,
            message: "Password is required.",
        });
    }

    next();
};