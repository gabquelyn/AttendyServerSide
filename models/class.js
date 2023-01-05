const {Schema, model} = require("mongoose")

const classSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    attended: [{type: Schema.Types.ObjectId, ref: "User", required: true}],
    timestamp
})

module.exports = model("Class", classSchema);
 