const { Role, Permission } = require("../models");

module.exports = (requiredPermission) => {
  return async (req, res, next) => {
    try {
      const role = await Role.findByPk(req.user.role_id, {
        include: [
          {
            model: Permission,
            as: "permissions",
            through: { attributes: [] },
          },
        ],
      });

      const hasPermission = role.permissions.some(
        (perm) => perm.name === requiredPermission
      );

      if (!hasPermission) {
        return res.status(403).json({
          message: "Access denied (permission)",
        });
      }

      next();
    } catch (err) {
      next(err);
    }
  };
};