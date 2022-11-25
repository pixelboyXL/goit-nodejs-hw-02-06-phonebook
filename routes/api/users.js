const express = require("express");
const router = express.Router();

const { tryCatchWrapper } = require("../../helpers");
const { auth } = require("../middleware/auth");
const users = require("../../controllers/userController");

router.post("/register", tryCatchWrapper(users.register));

router.post("/login", tryCatchWrapper(users.login));

router.post("/logout", tryCatchWrapper(auth), tryCatchWrapper(users.logout));

module.exports = router;