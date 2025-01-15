const Router = require("express").Router;
const userController = require("../controllers/user-controller");
const router = new Router();
const { body } = require("express-validator");

const adminRouter = require("./admin");
router.use("/admin", adminRouter);

router.post("/registration", body("email").isEmail(), body("password").isLength({ min: 3, max: 32 }), userController.registration);
router.post("/login", userController.login);
router.post("/logout", userController.logout);

module.exports = router;
