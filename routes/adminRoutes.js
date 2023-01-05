const express = require("express");
const adminControllers = require('../controllers/admin')
const router = express.Router()

router.get('/courses', adminControllers.getCourses);
router.post("/courses", adminControllers.postCourse);
module.exports = router;