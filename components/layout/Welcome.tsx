import React from 'react'
// import { clerkClient } from "@clerk/nextjs/server";


const Welcome = () => {
  return (
    <div>Welcome</div>
  )
}

export default Welcome





// async function getUserName(userId: string) {
//   try {
//     const user = await clerkClient.users.getUser(userId);
//     if (user) {
//       console.log(user); // Assuming the user's name is stored in the 'name' property
//     } else {
//       console.log("User not found");
//     }
//   } catch (error) {
//     console.error("Error fetching user:", error);
//   }
// }

// // Usage
// getUserName("user_id_here");