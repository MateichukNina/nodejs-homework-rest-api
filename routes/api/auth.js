const express = require("express");
const router = express.Router();
const { loginSchema, registerSchema } = require("../../models/user");
const ctrl = require("../../controllers/auth");
const { authValidator } = require("../../helpers/bodyValidate");
const { authenticate } = require("../../helpers");

router.post("/register", authValidator(registerSchema), ctrl.register);
router.post("/login", authValidator(loginSchema), ctrl.login);
router.post("/logout", authenticate, ctrl.logOut);
router.get("/current", authenticate, ctrl.getCurrent);

module.exports = router;
