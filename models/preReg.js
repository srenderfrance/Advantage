const { default: mongoose } = require("mongoose");

const PreRegSchema = new mongoose.Schema({
    email: {
        type: String, 
        required: true
    },
    password: {
        type: String,
        reuired: true
    }
});
const PreReg = mongoose.model('PreReg', PreRegSchema);
module.exports = PreReg