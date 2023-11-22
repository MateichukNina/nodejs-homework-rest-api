const express = require("express");
const router = express.Router();
const ctrl = require("../../controllers/user");
const { authenticate } = require("../../helpers");

router.patch("/avatar", authenticate, ctrl.uploadAvatar )


module.exports = router;