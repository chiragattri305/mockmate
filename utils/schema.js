import mongoose from "mongoose";

const { Schema } = mongoose;

/**
 * Helper to safely register a model only once (avoids OverwriteModelError
 * during Next.js hot-reloads in development).
 */
const model = (name, schema, collection) =>
  mongoose.models[name] || mongoose.model(name, schema, collection);

/* ----------------------------- Mock Interview ---------------------------- */
const MockInterviewSchema = new Schema(
  {
    mockId: { type: String, required: true, index: true },
    jsonMockResp: { type: String, required: true },
    jobPosition: { type: String, required: true },
    jobDesc: { type: String, required: true },
    jobExperience: { type: String, required: true },
    createdBy: { type: String, required: true, index: true },
    createdAt: { type: String },
    // AI analysis of an uploaded resume against the target role (optional)
    resumeAnalysis: { type: String, default: "" },
  },
  { timestamps: true }
);

/* -------------------------------- Question ------------------------------- */
const QuestionSchema = new Schema(
  {
    mockId: { type: String, required: true, index: true },
    MockQuestionJsonResp: { type: String, required: true },
    jobPosition: { type: String, required: true },
    jobDesc: { type: String, required: true },
    jobExperience: { type: String, required: true },
    typeQuestion: { type: String, required: true },
    company: { type: String, required: true },
    createdBy: { type: String, required: true, index: true },
    createdAt: { type: String },
  },
  { timestamps: true }
);

/* ------------------------------ User Answer ------------------------------ */
const UserAnswerSchema = new Schema(
  {
    mockIdRef: { type: String, required: true, index: true },
    question: { type: String, required: true },
    correctAns: { type: String },
    userAns: { type: String },
    feedback: { type: String },
    rating: { type: String },
    userEmail: { type: String, index: true },
    createdAt: { type: String },
  },
  { timestamps: true }
);

/* ------------------------------- Newsletter ------------------------------ */
const NewsletterSchema = new Schema(
  {
    newName: { type: String },
    newEmail: { type: String },
    newMessage: { type: String },
    createdAt: { type: String },
  },
  { timestamps: true }
);

/* ----------------------- Quiz Arena player progress ---------------------- */
const UserProgressSchema = new Schema(
  {
    userId: { type: String, required: true, unique: true, index: true },
    userName: { type: String, default: "Player" },
    userImageSrc: { type: String, default: "/logo.svg" },
    points: { type: Number, default: 0, index: true },
    gamesPlayed: { type: Number, default: 0 },
    bestScore: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const MockInterview = model("MockInterview", MockInterviewSchema, "mockInterviews");
export const Question = model("Question", QuestionSchema, "questions");
export const UserAnswer = model("UserAnswer", UserAnswerSchema, "userAnswers");
export const Newsletter = model("Newsletter", NewsletterSchema, "newsletters");
export const UserProgress = model("UserProgress", UserProgressSchema, "userProgress");
