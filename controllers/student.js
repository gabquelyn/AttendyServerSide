const user = require("../models/user");
const classModel = require("../models/class");
const { validationResult } = require("express-validator");

exports.getDetails = (req, res, next) => {
  const userId = req.params.userId;
  user
    .findById(userId)
    .then((userDoc) => {
      if (!userDoc) {
        const error = new Error("No user found, Some error occoured");
        error.statusCode = 404;
        throw error;
      }
      // const details = userDoc.mainDetails;
      res.status(200).json({ message: "User details found", data: userDoc});
    })
    .catch((error) => {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    });
};

exports.postDetails = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Wrong input field");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  const userId = req.params.userId;
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const matricNumber = req.body.matricNumber;
  let fetcheduser;
  user
    .findById(userId)
    .then((userDoc) => {
      if (!userDoc) {
        const error = new Error("User seems not to exist");
        error.statusCode = 401;
        throw error;
      }
      fetcheduser = userDoc;
      fetcheduser.mainDetails = {
        firstname,
        lastname,
        matricNumber,
      };
      return fetcheduser.save();
    })
    .then((result) => {
      res
        .status(201)
        .json({ message: "Updated Successfully", data: result.mainDetails });
    })
    .catch((error) => {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    });
};



exports.createClass = (req, res, next) => {
  const courseCode = req.body.code;
  const title = req.body.title;
  let classData
  const userId = '63b74b0cf1f114075e1ab10b' //will be provided by the auth middleware.
  const newClass = new classModel({
    code: courseCode,
    title: title,
    open: true,
    creatorId: userId,
  })
  newClass.save().then(result => {
    classData = result
   return user.findById(userId)
  }).then(userDoc => {
    if(!userDoc){
      const error = newError("User seems to not exist")
      error.status = 404;
      throw error
    }
    userDoc.addClass(classData._id)
  }).then(result => {
    
  })
  .then(result => {
    res.status(201).json({message: "Created and joined class Successfully", data: classData, result})
  })
  .catch(error => {
    if(!error.statusCode){
      error.statusCode = 500;
    }
    next(error);
  })
}