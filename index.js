import express from "express";
import connectDB from "./connect.db.js";
import Course from "./course.model.js";
import mongoose from "mongoose";

const app = express();

// to make app understand json
app.use(express.json());

// ================================database connection=============================================
connectDB();

// =================================routes===============================================
// ? add course
app.post("/course/add", async (req, res) => {
  const newCourse = req.body;

  await Course.create(newCourse);

  return res.status(201).send({ message: "Course is added successfully." });
});

// ? get course list
app.get("/course/list", async (req, res) => {
  const courseList = await Course.find();

  return res.status(200).send({ message: "success", courses: courseList });
});

//? get course details by _id
app.get("/course/details/:id", async (req, res) => {
  // extract course id from req.params
  const courseId = req.params.id;

  // validate for mongo id
  const isValidMongoId = mongoose.isValidObjectId(courseId);

  // if not valid mongo id
  if (!isValidMongoId) {
    return res.status(400).send({ message: "Invalid mongo id." });
  }

  // find course by id
  const requiredCourse = await Course.findOne({ _id: courseId });

  // if not course,throw error
  if (!requiredCourse) {
    return res.status(404).send({ message: "Course does not exist." });
  }

  // send res
  return res
    .status(200)
    .send({ message: "success", courseDetails: requiredCourse });
});

// ?delete a course by id

app.delete("/course/delete/:id", async (req, res) => {
  // extract course id from req.params
  const courseId = req.params.id;

  // check for mongo id validity
  const isValidMongoId = mongoose.isValidObjectId(courseId);

  // if not valid mongo id, throw error
  if (!isValidMongoId) {
    return res.status(400).send({ message: "Invalid mongo id." });
  }

  // find course by id
  const requiredCourse = await Course.findOne({ _id: courseId });

  // if not course, throw error
  if (!requiredCourse) {
    return res.status(404).send({ message: "Course does not exist." });
  }

  // delete course
  await Course.deleteOne({ _id: courseId });

  // send response
  return res.status(200).send({ message: "Course is deleted successfully." });
});

// ?edit
app.put("/course/edit/:id", async (req, res) => {
  // extract courseId from req.params
  const courseId = req.params.id;

  // check for mongo id validity
  const isValidMongoId = mongoose.isValidObjectId(courseId);

  // if not valid, throw error
  if (!isValidMongoId) {
    return res.status(400).send({ message: "Invalid mongo id." });
  }

  // find course by id
  const requiredCourse = await Course.findOne({ _id: courseId });

  // if not course, throw error

  if (!requiredCourse) {
    return res.status(404).send({ message: "Course does not exist." });
  }

  // get new values from req.body
  const newValues = req.body;

  // edit product

  await Course.updateOne(
    { _id: courseId },
    {
      $set: {
        name: newValues.name,
        price: newValues.price,
        tutorName: newValues.tutorName,
        duration: newValues.duration,
      },
    }
  );

  // send response
  return res.status(200).send({ message: "Course is updated successfully." });
});

// ================================port and server==============================================
const PORT = 8000;

app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`);
});
