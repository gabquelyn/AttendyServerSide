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
      .withMessage("Lastname cannot be blank nor contain number nor symbols"),
  ],
  studentControllers.postDetails
);

router.post(
  "/admin/create",
  [
    body("code")
      .trim()
      .not()
      .isEmpty()
      .isAlphanumeric()
      .withMessage("Course code must be Alphanumeric and not empty"),
    body("title")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Title cannot be empty"),
  ],
  studentControllers.createClass
);

router.post("/join/:classId", studentControllers.addToClass)

router.post("/pend/:classId", studentControllers.addToPending);

router.post("/ban/:classId", studentControllers.addToBan)

module.exports = router;
