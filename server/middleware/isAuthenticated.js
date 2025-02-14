import jwt from "jsonwebtoken"


export const isAuth = (req, res, next) => {
    try {
        const { token } = req.cookies;

        if (!token) {
            return res.status(401).json({ 
                success: false, 
                message: "Unauthorized, token missing" 
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        req.user = { id: decoded.userId }; 
        next();

    } catch (error) {
        return res.status(401).json({ 
            success: false, 
            message: "Invalid token" 
        });
    }
};
