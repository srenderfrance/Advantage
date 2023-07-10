

module.exports.getStudent = (req, res) => {
    res.render("student",  { user: req.user });
 };

 

module.exports.getStudy = (req, res) => {
    res.render("study", { user: req.user });
 };