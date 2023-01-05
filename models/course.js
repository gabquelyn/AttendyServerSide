const {Schema, model } = require("mongoose");

const courseSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    creatorId: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    classes: [
        {type: Schema.Types.ObjectId, required: true, ref: "Class"}
    ]
})

module.exports = model('Course', courseSchema);