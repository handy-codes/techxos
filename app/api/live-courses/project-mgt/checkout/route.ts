import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { LiveClass, LiveClassPurchase, LiveClassUser } from "@prisma/client";

interface CheckoutResponse {
  price: number;
  studentId: string;
  studentEmail: string;
  studentName: string;
  endDate: Date;
}

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const liveClass = await db.liveClass.findFirst({
      where: { 
        title: "Project Management",
        isActive: true,
        endTime: {
          gt: new Date()
        }
      }
    }) as LiveClass | null;

    if (!liveClass) {
      return new NextResponse("No active class found", { status: 404 });
    }

    // Check if user already has an active purchase
    const existingPurchase = await db.liveClassPurchase.findFirst({
      where: {
        studentId: userId,
        liveClassId: liveClass.id,
        isActive: true,
        endDate: {
          gt: new Date()
        }
      }
    }) as LiveClassPurchase | null;

    if (existingPurchase) {
      return new NextResponse("Already purchased", { status: 400 });
    }

    // Get user details from Clerk
    const user = await db.liveClassUser.findUnique({
      where: { id: userId }
    }) as LiveClassUser | null;

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Calculate end date based on course duration
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + (liveClass.duration * 7));

    const response: CheckoutResponse = {
      price: liveClass.price,
      studentId: userId,
      studentEmail: user.email,
      studentName: user.name,
      endDate
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("[CHECKOUT_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 






// import { NextResponse } from "next/server";
// import { auth } from "@clerk/nextjs/server";
// import { db } from "@/lib/db";

// export async function POST(req: Request) {
//   try {
//     const { userId } = auth();
    
//     if (!userId) {
//       return new NextResponse("Unauthorized", { status: 401 });
//     }

//     const liveClass = await db.liveClass.findFirst({
//       where: { 
//         title: "Project Management",
//         isActive: true,
//         endTime: {
//           gt: new Date()
//         }
//       }
//     });

//     if (!liveClass) {
//       return new NextResponse("No active class found", { status: 404 });
//     }

//     // Check if user already has an active purchase
//     const existingPurchase = await db.liveClassPurchase.findFirst({
//       where: {
//         studentId: userId,
//         liveClassId: liveClass.id,
//         isActive: true,
//         endDate: {
//           gt: new Date()
//         }
//       }
//     });

//     if (existingPurchase) {
//       return new NextResponse("Already purchased", { status: 400 });
//     }

//     // Calculate end date based on course duration
//     const endDate = new Date();
//     endDate.setDate(endDate.getDate() + (liveClass.duration * 7));

//     return NextResponse.json({
//       price: liveClass.price,
//       studentId: userId,
//       endDate
//     });
//   } catch (error) {
//     console.error("[CHECKOUT_POST]", error);
//     return new NextResponse("Internal Error", { status: 500 });
//   }
// } 