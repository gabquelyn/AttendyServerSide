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
    open: {type: Schema.Types.Boolean, required: true},
    attended: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
    pending: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
    banned: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
    creatorId: {
      type: Schema.Types.ObjectId,
      required: true,
    }
  },
  { timestamps: true }
);

classSchema.methods.addUser = function(userId){
  const existing = this.attended.find(id => id = userId);
  if(existing){
    return
  }
  const updatedAttended = [...this.attended, userId]
  this.attended = updatedAttended
  return this.save();
}

module.exports = model("Class", classSchema);
