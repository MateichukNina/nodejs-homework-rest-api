const express = require("express");
const router = express.Router();
const { loginSchema, registerSchema, verifySchema } = require("../../models/user");
const ctrl = require("../../controllers/auth");
const { authValidator } = require("../../helpers/bodyValidate");
const { authenticate } = require("../../helpers");
const upload = require("../../helpers/upload")



router.post("/register", authValidator(registerSchema), ctrl.register);
router.post("/login", authValidator(loginSchema), ctrl.login);
router.post("/logout", authenticate, ctrl.logOut);
router.get("/current", authenticate, ctrl.getCurrent);
router.patch("/avatar", upload.single("avatar"), authenticate, ctrl.uploadAvatar );
router.get("/verify/:verificationToken", ctrl.verify);
router.post("/verify", authValidator(verifySchema), ctrl.emailResend)

module.exports = router;
