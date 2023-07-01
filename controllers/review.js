

module.exports.getStudent = (req, res) => {
    res.render("student.ejs",  { user: req.user }, {
    title: "Student",
     });
 };

 

module.exports.getStudy = (req, res) => {
    res.render("study.ejs", { user: req.user }, {
    title: "Study",
     });
 };