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

/* ------------------------- Gamified learning system ---------------------- */
const CourseSchema = new Schema(
  {
    title: { type: String, required: true },
    imageSrc: { type: String, required: true },
  },
  { timestamps: true }
);

const UnitSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    order: { type: Number, required: true },
  },
  { timestamps: true }
);

const LessonSchema = new Schema(
  {
    title: { type: String, required: true },
    unitId: { type: Schema.Types.ObjectId, ref: "Unit", required: true },
    order: { type: Number, required: true },
  },
  { timestamps: true }
);

const ChallengeSchema = new Schema(
  {
    lessonId: { type: Schema.Types.ObjectId, ref: "Lesson", required: true },
    type: { type: String, enum: ["SELECT", "ASSIST"], required: true },
    duoQuestion: { type: String, required: true },
    order: { type: Number, required: true },
  },
  { timestamps: true }
);

const ChallengeOptionSchema = new Schema(
  {
    challengeId: { type: Schema.Types.ObjectId, ref: "Challenge", required: true },
    text: { type: String, required: true },
    correct: { type: Boolean, required: true },
    imageSrc: { type: String },
    audioSrc: { type: String },
  },
  { timestamps: true }
);

const ChallengeProgressSchema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    challengeId: { type: Schema.Types.ObjectId, ref: "Challenge", required: true },
    completed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const UserProgressSchema = new Schema(
  {
    userId: { type: String, required: true, unique: true, index: true },
    userName: { type: String, default: "User" },
    userImageSrc: { type: String, default: "/logo.svg" },
    activeCourseId: { type: Schema.Types.ObjectId, ref: "Course", default: null },
    hearts: { type: Number, default: 5 },
    points: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const MockInterview = model("MockInterview", MockInterviewSchema, "mockInterviews");
export const Question = model("Question", QuestionSchema, "questions");
export const UserAnswer = model("UserAnswer", UserAnswerSchema, "userAnswers");
export const Newsletter = model("Newsletter", NewsletterSchema, "newsletters");
export const Course = model("Course", CourseSchema, "courses");
export const Unit = model("Unit", UnitSchema, "units");
export const Lesson = model("Lesson", LessonSchema, "lessons");
export const Challenge = model("Challenge", ChallengeSchema, "challenges");
export const ChallengeOption = model("ChallengeOption", ChallengeOptionSchema, "challengeOptions");
export const ChallengeProgress = model("ChallengeProgress", ChallengeProgressSchema, "challengeProgress");
export const UserProgress = model("UserProgress", UserProgressSchema, "userProgress");
