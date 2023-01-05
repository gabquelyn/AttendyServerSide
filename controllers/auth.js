const bcrypt = require("bcryptjs");
const User = require("../models/user");
const { validationResult } = require("express-validator");
const user = require("../models/user");
const jwt = require("jsonwebtoken");

exports.signup = (req, res, next) => {
  const errors = validationResult(req);

  //if there are any form of errors
  if (!errors.isEmpty()) {
    const error = new Error("Account Creation Failed");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  const email = req.body.email;
  const password = req.body.password;
  user
    .find({ email: email })
    .then((userDoc) => {
      if (userDoc.length !== 0) {
        const error = new Error("User Already Exists");
        error.statusCode = 422;
        throw error;
      }
      return bcrypt.hash(password, 12);
    })
    .then((hashedPassword) => {
      const user = new User({
        email,
        password: hashedPassword,
      });
      return user.save();
    })
    .then((result) => {
      res
        .status(201)
        .json({
          userId: result._id,
          message: "User created succefully",
          createdAt: result.createdAt,
        });
    })
    .catch((error) => {
      console.log(error);
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    });
};

exports.login = (req, res, next) => {
const errors = validationResult(req);
if(!errors.isEmpty()){
    const error = new Error('Validation unresolved');
    error.data = errors.array();
    error.statusCode = 402;
    throw error;
}
  let loadedUser;
  const email = req.body.email;
  const password = req.body.password;
  const rememberMe = req.body.remember
  user
    .findOne({ email: email })
    .then((userDoc) => {
      if (!userDoc) {
        const error = new Error("User Does not Exist, Check Email and Retry");
        error.statusCode = 401;
        throw error;
      }
      loadedUser = userDoc;
      return bcrypt.compare(password, userDoc.password);
    })
    .then((isMatch) => {
      if (!isMatch) {
        const error = new Error("Incorrect password!");
        error.statusCode = 401;
        throw error;
      }
      const expire = '10hr'
      const token = jwt.sign(
        {
          userId: loadedUser._id,
          email: loadedUser.email,
        },
        `${process.env.JWT_SECRET_PHRASE}`,
        { expiresIn: expire }
      );
        console.log(token)
      res.status(200).json({token:token, userId: loadedUser._id.toString(), expires: expire})
    })
    .catch((error) => {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    });
};
