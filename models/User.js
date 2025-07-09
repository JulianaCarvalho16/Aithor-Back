const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { sendMessage } = require("../controllers/chatController");

router.post("/message", auth, sendMessage);

module.exports = router;
