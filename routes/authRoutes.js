const express = require("express");
const authControllers = require("../controllers/auth");
const router = express.Router();
const { body } = require("express-validator");

router.post(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email")
      .normalizeEmail(),
    body("password").trim().isLength({ min: 8 }).withMessage("Password should be at least 8 characters long"),
  ],
  authControllers.signup
);

module.exports = router;

router.post("/login",
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email"),
    body("password").trim().isLength({ min: 8 }).withMessage("Password should be at least 8 characters long"),
   authControllers.login);