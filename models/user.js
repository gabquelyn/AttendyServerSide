const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
        type: Schema.Types.Boolean,
        required: true
    },
    mainDetails: {
      firstname: String,
      lastname: String,
      matricNumber: String
    },
    classes: [
      {
        type: Schema.Types.ObjectId,
        ref: "Class",
        required: true,
      }
    ],
    recoveryToken: {
      type: Number,
    },
  },
  { timestamps: true }
);

userSchema.methods.addClass = function(classId){
  const existing = this.classes.find(id => id === classId);
  if(existing){
    return
  }
  const updatedClasses = [...this.classes, classId.toString()]
  this.classes = updatedClasses;
  return this.save();
}

module.exports = model("User", userSchema);
