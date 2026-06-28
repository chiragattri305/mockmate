import "dotenv/config";
import mongoose from "mongoose";
import { Course } from "../utils/schema";

/**
 * Seeds a starter set of courses for the practice/learning section.
 * Run with: npm run db:seed
 */
async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not defined in environment variables");
  }

  await mongoose.connect(uri);
  console.log("Connected to MongoDB");

  const courses = [
    { title: "Frontend Engineering", imageSrc: "/logo.svg" },
    { title: "Backend Engineering", imageSrc: "/logo.svg" },
    { title: "Full Stack Development", imageSrc: "/logo.svg" },
    { title: "Data Structures & Algorithms", imageSrc: "/logo.svg" },
    { title: "System Design", imageSrc: "/logo.svg" },
  ];

  await Course.deleteMany({});
  await Course.insertMany(courses);
  console.log(`Seeded ${courses.length} courses`);

  await mongoose.disconnect();
  console.log("Done");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
