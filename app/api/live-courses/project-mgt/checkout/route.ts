import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // For now, return hardcoded values
    return NextResponse.json({
      price: 250000, // Amount in NGN (250,000)
      studentEmail: "user@example.com", // This will be replaced with actual user email
      studentName: "Student Name", // This will be replaced with actual user name
    });

  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
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