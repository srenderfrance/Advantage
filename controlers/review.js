

module.exports.getStudent = (req, res) => {
    res.render("student.ejs", {
    title: "Student",
     });
 };

 

module.exports.getReview = (req, res) => {
    res.render("review.ejs", {
    title: "Review",
     });
 };