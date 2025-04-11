import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import axios from "axios";

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_BASE_URL = "https://api.paystack.co";

export async function POST(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { courseId } = params;

    if (!courseId) {
      return new NextResponse("Course ID is required", { status: 400 });
    }

    // Get user details from Clerk
    const user = await clerkClient.users.getUser(userId);
    const userEmail = user.emailAddresses[0]?.emailAddress;
    const userName = `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Student";

    if (!userEmail) {
      return new NextResponse("User email is required for payment", { status: 400 });
    }

    // Find the course
    const course = await db.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return new NextResponse("Course not found", { status: 404 });
    }

    // Check if user already purchased this course
    const existingPurchase = await db.purchase.findFirst({
      where: {
        customerId: userId,
        courseId: courseId,
      },
    });

    if (existingPurchase) {
      return new NextResponse("You have already purchased this course", { status: 400 });
    }

    // Initialize Paystack payment
    try {
      const response = await axios.post(
        `${PAYSTACK_BASE_URL}/transaction/initialize`,
        {
          email: userEmail,
          amount: Math.round(course.price * 100), // Convert to kobo
          callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${courseId}/success`,
          metadata: {
            courseId,
            userId,
            userName,
            courseTitle: course.title
          }
        },
        {
          headers: {
            Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Return payment initialization data
      return NextResponse.json({
        authorizationUrl: response.data.data.authorization_url,
        reference: response.data.data.reference,
        accessCode: response.data.data.access_code
      });
    } catch (paystackError) {
      console.error("[PAYSTACK_INIT] Error:", paystackError.response?.data || paystackError);
      return new NextResponse("Payment initialization failed", { status: 500 });
    }
  } catch (error) {
    console.error("[COURSE_CHECKOUT] Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
