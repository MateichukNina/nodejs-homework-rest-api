const express = require('express');
const router = express.Router();
 const {schemas} = require("../../models/user");
const ctrl = require("../../controllers/auth");
const { authValidator } = require('../../helpers/bodyValidate');


router.post("/register",   ctrl.register);
router.post("/login", authValidator(schemas.loginSchema) ,ctrl.login)

module.exports = router;