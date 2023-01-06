const express = require("express");
const studentControllers = require("../controllers/student");
const { body } = require("express-validator");
const router = express.Router();

router.get("/details/:userId", studentControllers.getDetails);
router.post(
  "/details/:userId",
  [
    body("firstname")
      .trim()
      .not()
      .isEmpty()
      .isAlpha()
      .withMessage("Firstname cannot be blank nor contain number nor symbols"),
    body("lastname")
      .trim()
      .not()
      .isEmpty()
      .isAlpha()
      .withMessage("Lastname cannot be blank nor contain number nor symbols")
  ],
  studentControllers.postDetails
);
router.post("/create", studentControllers.createClass)
module.exports = router;
