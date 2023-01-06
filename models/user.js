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
    recoveryToken: {
      type: Number,
    },
  },
  { timestamps: true }
);

module.exports = model("User", userSchema);
