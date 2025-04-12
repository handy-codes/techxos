import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createClerkClient } from "@clerk/backend";
import { requireAdmin } from "@/lib/auth-utils";

export async function GET() {
  try {
    const authCheck = await requireAdmin();
    if (!authCheck.success) {
      return authCheck.response;
    }

    // Get all users
    const users = await db.liveClassUser.findMany({
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("[USERS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const authCheck = await requireAdmin();
    if (!authCheck.success) {
      return authCheck.response;
    }

    // Only HEAD_ADMIN can create ADMIN users
    if (authCheck.success && (authCheck.user as { role: string }).role !== "HEAD_ADMIN") {
      return new NextResponse("Only HEAD_ADMIN can create users", { status: 403 });
    }

    const { email, name, role } = await req.json();
    
    // Validate allowed roles
    if (!["ADMIN", "LECTURER"].includes(role)) {
      return new NextResponse("Invalid role", { status: 400 });
    }

    const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY! });
    
    let clerkUserId;
    
    try {
      // Try to create the user first
      const clerkUser = await clerk.users.createUser({
        emailAddress: [email],
        firstName: name?.split(' ')[0] || "",
        lastName: name?.split(' ').slice(1).join(' ') || "",
        skipPasswordRequirement: true,
        publicMetadata: { systemRole: role }
      });
      
      clerkUserId = clerkUser.id;
    } catch (error: any) {
      // If error is form_identifier_exists, find the existing user
      if (error?.errors?.[0]?.code === 'form_identifier_exists') {
        console.log("Email exists, finding user...");
        
        try {
          // The correct way to search for users by email in Clerk
          const response = await clerk.users.getUserList({
            query: email,
            limit: 10
          });
          
          console.log("Clerk API response structure:", 
            JSON.stringify({
              responseType: typeof response,
              hasData: !!response.data,
              dataType: response.data ? typeof response.data : null,
              isArray: response.data ? Array.isArray(response.data) : null,
              userCount: response.data ? (Array.isArray(response.data) ? response.data.length : null) : null,
              firstUserKeys: response.data && Array.isArray(response.data) && response.data.length > 0 
                ? Object.keys(response.data[0]) 
                : null
            })
          );
          
          // Clerk returns a data property containing the array of users
          const users = response.data || [];
          
          // Find the user with exact email match
          const matchingUser = users.find(user => {
            // Clerk's API might return emailAddresses in different formats
            // Make sure to handle all possible cases
            if (!user.emailAddresses) return false;
            
            // Handle both array and object cases
            const emailAddresses = Array.isArray(user.emailAddresses) 
              ? user.emailAddresses 
              : [user.emailAddresses];
              
            return emailAddresses.some(emailObj => {
              // Handle both direct string and object with emailAddress property
              const userEmail = typeof emailObj === 'string' 
                ? emailObj 
                : emailObj?.emailAddress;
                
              return userEmail && userEmail.toLowerCase() === email.toLowerCase();
            });
          });
          
          if (matchingUser) {
            clerkUserId = matchingUser.id;
            
            // Update their metadata to reflect the new role
            await clerk.users.updateUser(clerkUserId, {
              publicMetadata: { systemRole: role }
            });
          } else {
            console.log("No matching user found with standard search, trying direct email lookup...");
            
            // Alternative approach: Try to list all users and filter manually
            try {
              // Get all users (limited to reasonable number)
              const allUsersResponse = await clerk.users.getUserList({ limit: 100 });
              const allUsers = allUsersResponse.data || [];
              
              // Log how many users we're searching through
              console.log(`Searching through ${allUsers.length} users for email: ${email}`);
              
              // Manual search through all users
              for (const user of allUsers) {
                const userEmails = user.emailAddresses || [];
                for (const emailObj of userEmails) {
                  const userEmail = emailObj.emailAddress || '';
                  if (userEmail.toLowerCase() === email.toLowerCase()) {
                    console.log(`Found user by direct search: ${user.id}`);
                    clerkUserId = user.id;
                    
                    // Update metadata
                    await clerk.users.updateUser(clerkUserId, {
                      publicMetadata: { systemRole: role }
                    });
                    break;
                  }
                }
                if (clerkUserId) break;
              }
              
              if (!clerkUserId) {
                console.error("Could not find existing user with email after exhaustive search:", email);
                return new NextResponse("Email exists but user not found after thorough search", { status: 400 });
              }
            } catch (fallbackError) {
              console.error("Error in fallback search:", fallbackError);
              return new NextResponse("Error in fallback user search", { status: 500 });
            }
          }
        } catch (searchError) {
          console.error("Error searching for user:", searchError);
          return new NextResponse("Error finding existing user", { status: 500 });
        }
      } else {
        // If it's not a duplicate email error, rethrow
        console.error("Clerk error:", error);
        throw error;
      }
    }
    
    if (!clerkUserId) {
      return new NextResponse("Failed to create or find user in Clerk", { status: 500 });
    }

    // Check if the user already exists in our database
    const existingDbUser = await db.liveClassUser.findUnique({
      where: {
        email: email,
      },
    });

    if (existingDbUser) {
      // Update the existing user
      await db.liveClassUser.update({
        where: { email: email },
        data: {
          clerkUserId,
          role,
          name: name || existingDbUser.name,
          isActive: true
        }
      });
    } else {
      // Create database record
      await db.liveClassUser.create({
        data: {
          clerkUserId,
          email,
          name: name || email.split('@')[0],
          role,
          isActive: true
        }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[ADMIN_USER_CREATE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}



// import { NextResponse } from "next/server";
// import { auth } from "@clerk/nextjs/server";
// import { db } from "@/lib/db";

// async function checkAdminAccess(userId: string) {
//   // Get user from Clerk to check email
//   const clerkUser = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
//     headers: {
//       Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
//     },
//   }).then(res => res.json());

//   // Check if user is HEAD_ADMIN by email
//   if (clerkUser && clerkUser.email_addresses[0].email_address === "paxymekventures@gmail.com") {
//     return true;
//   }

//   // If not HEAD_ADMIN, check database role
//   const currentUser = await db.liveClassUser.findUnique({
//     where: { id: userId }
//   });

//   return currentUser && ["HEAD_ADMIN", "ADMIN"].includes(currentUser.role);
// }

// export async function GET() {
//   try {
//     const { userId } = auth();
//     if (!userId) {
//       return new NextResponse("Unauthorized", { status: 401 });
//     }

//     const hasAccess = await checkAdminAccess(userId);
//     if (!hasAccess) {
//       return new NextResponse("Unauthorized", { status: 401 });
//     }

//     // Get all users
//     const users = await db.liveClassUser.findMany({
//       orderBy: { createdAt: "desc" }
//     });

//     return NextResponse.json(users);
//   } catch (error) {
//     console.error("[USERS_GET]", error);
//     return new NextResponse("Internal Error", { status: 500 });
//   }
// }

// export async function POST(req: Request) {
//   try {
//     const { userId } = auth();
//     if (!userId) {
//       return new NextResponse("Unauthorized", { status: 401 });
//     }

//     const hasAccess = await checkAdminAccess(userId);
//     if (!hasAccess) {
//       return new NextResponse("Unauthorized", { status: 401 });
//     }

//     const body = await req.json();
//     const { email, name, role } = body;

//     // Create new user
//     const newUser = await db.liveClassUser.create({
//       data: {
//         id: email,
//         email,
//         name,
//         role,
//         isActive: true,
//       },
//     });

//     return NextResponse.json(newUser);
//   } catch (error) {
//     console.error("[USERS_POST]", error);
//     return new NextResponse("Internal Error", { status: 500 });
//   }
// } 