module.exports = {
    getLogin: (req, res) => {
        res.sendFile(path.join(__dirname, './public/login.html'))},

    getRegister: (req, res) => {
        res.sendFile(path.join(__dirname, './public/register.html'))},

}
//Doesn't work
