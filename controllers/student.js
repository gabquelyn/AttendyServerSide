const user = require("../models/user");
const classModel = require("../models/class");
const { validationResult } = require("express-validator");
const { error } = require("../util/error");

exports.getDetails = (req, res, next) => {
  const userId = req.params.userId;
  user
    .findById(userId)
    .then((userDoc) => {
      if (!userDoc) {
        error(404, "User seem not to exist");
        throw error;
      }
      // const details = userDoc.mainDetails;
      res.status(200).json({ message: "User details found", data: userDoc });
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
        error(401, "User seem not to exist")
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

//only admin can reach this route
exports.createClass = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Invalid data inputs");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  const courseCode = req.body.code;
  const title = req.body.title;
  const userId = "63b8da88050fa7c386a3ac13"; //will be provided by the auth middleware.
  const newClass = new classModel({
    code: courseCode,
    title: title,
    open: true,
    creatorId: userId,
  });
  newClass
    .save()
    .then((result) => {
      const createdClass = result;
      return classModel.findByIdAndUpdate(createdClass._id, {
        $push: { attended: { studentId : userId.toString(), created: new Date().toString()} },
      });
    })
    .then((result) => {
      res.status(201).json({
        message: "Created and joined class Successfully",
        classId: result._id,
      });
    })
    .catch((error) => {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    });
};

//only admin can carry this action
exports.addToClass = (req, res, next) => {
  const classId = req.params.classId;
  const userId = "63b8b0f83c1aeada741f6fba"; // willbe provided by the auth middleware
  //the ability to join depends on the active status of a class.

  let fetchedClass;
  classModel
    .findById(classId)
    .then((classDoc) => {
      if (!classDoc) {
        error(404, "Class seems to be missing");
      }
      fetchedClass = classDoc;

       //if already in class
       const alreadyAttend = fetchedClass.attended.find(classObj => classObj.studentId.toString() === userId.toString())
       if(alreadyAttend){
         error(422, "Already a member of the class")
       }

      //if already in pending
      const alreadyPending = fetchedClass.pending.find(classObj => classObj.studentId.toString() === userId.toString())
      if(!alreadyPending){
        error(422, "Cannot bypass Admin's approval")
      }
      
      return fetchedClass.updateOne({
        $push: { attended : [{ studentId : userId.toString(), created: new Date().toString()}]},
        $pull: { pending : { studentId : userId.toString()}}
      })
    })
    .then((result) => {
      res.status(201).json({ message: "Joined class Successfully", result });
    })
    .catch((error) => {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    });
};

exports.addToPending = (req, res, next) => {
  const classId = req.params.classId;
  const userId = "63b8b0f83c1aeada741f6fba"; // willbe provided by the auth middleware

  let fetchedClass;
  classModel.findById(classId).then(classDoc => {

    //check class existence
    if(!classDoc){
      error(404, "Class doesn't exist")
    }
    fetchedClass = classDoc;

    //check if already in class
    const alreadyAttend = fetchedClass.attended.find(classObj => classObj.studentId.toString() === userId.toString())
    if(alreadyAttend){
      error(422, "Already a member of the class")
    }

    //check if already pending approval
    const alreadyPending = fetchedClass.pending.find(classObj => classObj.studentId.toString() === userId.toString())
    if(alreadyPending){
      error(422, "Awaiting Admin's permission")
    }

    return fetchedClass.updateOne({
      $push: { pending : [{ studentId : userId.toString(), created: new Date().toString()}] },
    })
  }).then(result => {
    res.status(201).json({message: "Awaiting Admin's approval to enter class", result})
  })
  .catch(error => {
    if (!error.statusCode) {
      error.statusCode = 500;
        }
        next(error);
  })
}

exports.addToBan = (req, res, next) => {
  const classId = req.params.classId;
  const userId = "63b8b0f83c1aeada741f6fba"; // willbe provided by the auth middleware
  //the ability to join depends on the active status of a class.
  let loadedClass;
  classModel
    .findById(classId).then(classDoc => {
      loadedClass = classDoc;
      const existing = loadedClass.banned.find(Obj => Obj.studentId.toString() === userId.toString())
      if(existing){
        error(422, "User already banned");
      }
      return loadedClass.updateOne({
      $push: {banned: [{studentId: userId.toString(), created: new Date().toString()}]},
      $pull: {pending: {studentId: userId.toString()}},
      $pull: {attended: {studentId: userId.toString()}}
      })
    })
    .then((result) => {
      console.log(result)
      res.status(201).json({ message: "User banned from this class"});
    })
    .catch((error) => {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    });
};
