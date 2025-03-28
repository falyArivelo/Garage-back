const express = require("express");
const router = express.Router();
const sendEmailConttroller  = require("../controller/emailController");
const { verifyToken, verifyRole } = require('../middleware/auth');

// Envoyer l'email
router.post("/send-email", verifyToken, sendEmailConttroller.sendEmail); 

module.exports = router;
