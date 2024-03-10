import { db } from "../utils/db.js";
import { Router } from "express";
import { ObjectId } from "mongodb";

const questionRouter = Router();

questionRouter.get("/", async (req, res) => {
  const collection = db.collection("question");

  const query = {};

  const title = req.query.title;
  const category = req.query.category;

  if (title) {
    query.title = new RegExp(title, "i");
  }

  if (category) {
    query.category = new RegExp(category, "i");
  }

  const questionData = await collection.find(query).limit(10).toArray();

  try {
    return res.status(200).json({
      data: questionData,
    });
  } catch {
    return res.status(500).json({
      message: `Server error, cannot display question`,
    });
  }
});

questionRouter.get("/:id", async (req, res) => {
  const collection = db.collection("question");
  const questionId = new ObjectId(req.params.id);

  const questionData = await collection.findOne({ _id: questionId });

  if (!questionData) {
    return res.status(404).json({
      message: `No question id: ${questionId} available`,
    });
  }

  try {
    return res.status(200).json({
      data: questionData,
    });
  } catch {
    return res.status(500).json({
      message: `Server Error, cannot display question id:${questionId} `,
    });
  }
});

questionRouter.post("/", async (req, res) => {
  const collection = db.collection("question");
  const questionBody = { ...req.body };

  try {
    const postQuestion = await collection.insertOne(questionBody);
  } catch {
    return res.status(500).json({
      message: "Server error, cannot create question",
    });
  }

  return res.status(200).json({
    message: "question has been created successfully",
  });
});

questionRouter.put("/:id", async (req, res) => {
  const collection = db.collection("question");
  const questionId = new ObjectId(req.params.id);
  const questionBody = { ...req.body };

  try {
    const updateQuestion = await collection.updateOne(
      {
        _id: questionId,
      },
      {
        $set: questionBody,
      }
    );
  } catch {
    return res.status(500).json({
      message: "Server error, cannot update question",
    });
  }

  if (!questionBody) {
    return res.status(404).json({
      message: "No data available to update",
    });
  }

  return res.json({
    message: "question has been updated successfully",
  });
});

questionRouter.delete("/:id", async (req, res) => {
  const collection = db.collection("question");
  const questionId = new ObjectId(req.params.id);

  const questionData = await collection.findOne({ _id: questionId });

  try {
    const deleteQuestion = await collection.deleteOne({ _id: questionId });
  } catch {
    return res.status(500).json({
      message: "Server error, cannot delete question",
    });
  }

  if (!questionData) {
    return res.status(404).json({
      message: `No question available to delete`,
    });
  }

  return res.json({
    message: "question has been deleted successfully",
  });
});

export default questionRouter;
