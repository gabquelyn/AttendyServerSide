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

classSchema.methods.addToClassAttended = function(userId){
  const existing = this.attended.find(id => id = userId);
  if(existing){
    return
  }
  const updatedAttended = [...this.attended, userId]
  this.attended = updatedAttended
  return this.save();
}

classSchema.methods.addToPending = function(userId){
  const ifExists = this.pending.find(id => id = userId);
  if(ifExists){
    return
  }
  const updatedPending = [...this.pending, userId]
  this.pending = updatedPending;
}

module.exports = model("Class", classSchema);
