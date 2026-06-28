"use server";
import { revalidatePath } from "next/cache";
import { connectDB } from "@/utils/db";
import { getCourseById, getUserProgress } from "@/utils/queries";
import { UserProgress } from "@/utils/schema";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export const upsertUserProgress = async (courseId: string) => {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) {
    throw new Error("Unauthorized");
  }

  const course = await getCourseById(courseId);

  if (!course) {
    throw new Error("Course not found");
  }

  await connectDB();
  const existingUserProgress = await getUserProgress();

  if (existingUserProgress) {
    await UserProgress.updateOne(
      { userId },
      {
        activeCourseId: courseId,
        userName: user.firstName || "User",
        userImageSrc: user.imageUrl || "/logo.svg",
      }
    );
  } else {
    await UserProgress.create({
      userId,
      activeCourseId: courseId,
      userName: user.firstName || "User",
      userImageSrc: user.imageUrl || "/logo.svg",
    });
  }

  revalidatePath("/dashboard/courses");
  revalidatePath("/dashboard/learn");
  redirect("/dashboard/learn");
};
