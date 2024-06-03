const { default: mongoose } = require("mongoose");

const PreRegSchema = new mongoose.Schema({
    email: {
        type: String, 
        required: true
    },
    salt: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});
const PreReg = mongoose.model('PreReg', PreRegSchema);
module.exports = PreReg;