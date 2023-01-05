const {Schema, model} = require("mongoose")

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    firstname: {
        type: String,
    },
    lastname: {
        type: String,
    },
    matricNum: {
        type: String,
    },
    recoveryToken : {
        type: Number
    },
},
{timestamps: true}
)

module.exports = model('User', userSchema);