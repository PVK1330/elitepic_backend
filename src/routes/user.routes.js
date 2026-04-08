const router = require("express").Router();
const c = require("../controllers/user.controller");
const { checkAuth, checkRole } = require("../middlewares/auth.middleware");

router.post("/", checkAuth, checkRole("Admin"), c.createUser);
router.get("/", checkAuth, c.getUsers);
router.patch("/:userId", checkAuth, c.updateUser);
router.patch("/:userId/role", checkAuth, checkRole("Admin"), c.assignRole);

module.exports = router;
