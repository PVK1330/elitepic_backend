module.exports = (...allowedRoles) => {
    return (req, res, next) => {
        const userRole = req.user.role?.name;

        if (!allowedRoles.includes(userRole)) {
            return res.status(403).json({
                message: "Access denied (role)",
            });
        }

        next();
    };
};