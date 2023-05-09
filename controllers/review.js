

module.exports.getStudent = (req, res) => {
    res.render("student.ejs", {
    title: "Student",
     });
 };

 

module.exports.getStudy = (req, res) => {
    res.render("study.ejs", {
    title: "Study",
     });
 };