import { cache } from "react";
import { connectDB } from "./db";
import { auth } from "@clerk/nextjs/server";
import { Course, UserProgress } from "./schema";

export type CourseDoc = {
  id: string;
  title: string;
  imageSrc: string;
};

export type UserProgressDoc = {
  userId: string;
  userName: string;
  userImageSrc: string;
  activeCourseId: string | null;
  activeCourse: CourseDoc | null;
  hearts: number;
  points: number;
};

const toCourse = (c: any): CourseDoc => ({
  id: String(c._id),
  title: c.title,
  imageSrc: c.imageSrc,
});

// Fetches user progress (with the populated active course) for the authenticated user
export const getUserProgress = cache(async (): Promise<UserProgressDoc | null> => {
  try {
    const { userId } = await auth();
    if (!userId) return null;

    await connectDB();
    const data: any = await UserProgress.findOne({ userId }).lean();
    if (!data) return null;

    let activeCourse: CourseDoc | null = null;
    if (data.activeCourseId) {
      const course: any = await Course.findById(data.activeCourseId).lean();
      if (course) activeCourse = toCourse(course);
    }

    return {
      userId: data.userId,
      userName: data.userName,
      userImageSrc: data.userImageSrc,
      activeCourseId: data.activeCourseId ? String(data.activeCourseId) : null,
      activeCourse,
      hearts: data.hearts,
      points: data.points,
    };
  } catch (error) {
    console.error("Error fetching user progress:", error);
    throw error;
  }
});

// Fetches all courses
export const getCourses = cache(async (): Promise<CourseDoc[]> => {
  try {
    await connectDB();
    const data: any[] = await Course.find().lean();
    return data.map(toCourse);
  } catch (error) {
    console.error("Error fetching courses:", error);
    throw error;
  }
});

export const getCourseById = cache(async (courseId: string): Promise<CourseDoc | null> => {
  try {
    await connectDB();
    const data: any = await Course.findById(courseId).lean();
    return data ? toCourse(data) : null;
  } catch (error) {
    console.error("Error fetching Courses By Id:", error);
    throw error;
  }
});
