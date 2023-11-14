const express = require('express');
const router = express.Router();
// const {shemas} = require("../../models/user");
const ctrl = require("../../controllers/auth")

router.post("/register", ctrl.register);
router.post("/login", ctrl.login)

module.exports = router;