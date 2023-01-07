const { Schema, model } = require("mongoose");

const classSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    open: { type: Schema.Types.Boolean, required: true },
    attended: [
      {
        studentId: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        created: {
          type: Schema.Types.Date
        }
      },
    ],
    pending: [
      {
        studentId: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        created: {
          type: Schema.Types.Date
        }
      },
    ],
    banned: [
      {
        studentId: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        created: {
          type: Schema.Types.Date
        }
      },
    ],
    creatorId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = model("Class", classSchema);
