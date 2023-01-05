const Course = require("../models/course");

exports.getCourses = (req, res, next) => {
    Course.find().then(foundCourses => {
        return res.status(200).json({courses: foundCourses})
    })
}

exports.postCourse = (req, res, next) => {

}