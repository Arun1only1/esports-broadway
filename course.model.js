import mongoose from "mongoose";

// set rule/schema
// rule means schema
const courseSchema = new mongoose.Schema({
  name: String,
  duration: Number,
  price: Number,
  tutorName: String,
});

// create table/model
const Course = mongoose.model("Course", courseSchema);

export default Course;
