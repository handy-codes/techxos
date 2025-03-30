import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

async function CourseSectionPage({
  params
}: {
  params: { courseId: string; sectionId: string }
}) {
  const { userId } = auth();

  // Check if user is authenticated
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const purchase = await db.purchase.findUnique({
    where: {
      userId_courseId: {
        userId: userId,
        courseId: params.courseId
      }
    }
  });

  // ... rest of your code

  return (
    <div>
      {/* Your JSX here */}
    </div>
  );
}

export default CourseSectionPage; 