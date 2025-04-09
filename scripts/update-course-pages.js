const fs = require('fs');
const path = require('path');

// List of course directories
const courseDirs = [
  'frontend',
  'fullstack',
  'ui-ux',
  'graphic-design',
  'digital-marketing',
  'cybersecurity',
  'ai-ml',
  'data-science',
  'software-devt'
];

// Course IDs and names mapping
const courseInfo = {
  'frontend': 'Frontend Development',
  'fullstack': 'Fullstack Development',
  'ui-ux': 'UI/UX Design',
  'graphic-design': 'Graphic Design',
  'digital-marketing': 'Digital Marketing',
  'cybersecurity': 'Cybersecurity',
  'ai-ml': 'AI & Machine Learning',
  'data-science': 'Data Science',
  'software-devt': 'Software Development'
};

// Template for the imports to add
const importsTemplate = `
"use client";

import { useAuth } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import JoinLiveClassButton from "@/components/course/JoinLiveClassButton";
import CoursePurchaseButton from "@/components/course/CoursePurchaseButton";
`;

// Template for the state variables to add
const stateTemplate = `
  const { isSignedIn, userId } = useAuth();
  const { user } = useUser();
  const [hasAccess, setHasAccess] = useState<boolean>(false);
  const [userRoleState, setUserRoleState] = useState<string | null>(null);
`;

// Template for the admin check function
const adminCheckTemplate = `
  // Function to determine if the current user is an admin based on their email
  const checkIfUserIsAdmin = async () => {
    if (!isSignedIn || !userId) return false;
    
    try {
      const userEmail = user?.primaryEmailAddress?.emailAddress;
      console.log("Current user email:", userEmail);
      
      if (!userEmail) return false;
      
      // Known admin emails - add any admin emails here
      const adminEmails = [
        "paxymekventures@gmail.com",
        "admin@techxos.com",
        "emeka@techxos.com"
      ];
      
      // Direct check for known admin emails
      if (adminEmails.includes(userEmail.toLowerCase())) {
        console.log("User is admin based on email match!");
        setUserRoleState("HEAD_ADMIN");
        setHasAccess(true);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Error in admin check:", error);
      return false;
    }
  };

  useEffect(() => {
    if (isSignedIn && userId) {
      checkIfUserIsAdmin();
    }
  }, [isSignedIn, userId, user]);
`;

// Template for the button component
const buttonTemplate = (courseId, courseName) => `
            <div className="p-2 md:p-4 mt-2 md:mt-3 mb-1 shadow-md hover:bg-white hover:text-green-700 transition-all duration-500 text-white border-2 border-[#38a169] rounded-md inline-block bg-green-700 font-bold border-solid">
              {!isSignedIn ? (
                <Link
                  href="/sign-in"
                  className="inline-bloc text-white md:p-4 mt-2 md:mt-3 mb-1 shadow-md hover:bg-green-700 hover:text-white transition-all duration-500 border-2 border-[#38a169] rounded-md bg-white font-bold border-solid"
                >
                  Enroll Now
                </Link>
              ) : (
                (() => {
                  console.log("Rendering button with role:", userRoleState, "hasAccess:", hasAccess);
                  
                  // Admin roles always get access
                  const isAdmin = 
                    userRoleState === "HEAD_ADMIN" ||
                    userRoleState === "ADMIN" ||
                    userRoleState === "LECTURER";
                  
                  // Final access decision
                  const shouldShowJoinButton = hasAccess || isAdmin;
                  
                  return shouldShowJoinButton ? (
                    <JoinLiveClassButton 
                      courseId="${courseId}" 
                      courseName="${courseName}" 
                    />
                  ) : (
                    <CoursePurchaseButton 
                      courseId="${courseId}" 
                      courseName="${courseName}" 
                    />
                  );
                })()
              )}
            </div>
`;

// Process each course directory
courseDirs.forEach(courseDir => {
  const courseId = courseDir;
  const courseName = courseInfo[courseDir];
  const pagePath = path.join(__dirname, '..', 'app', 'pages', courseDir, 'page.tsx');
  
  // Check if the file exists
  if (!fs.existsSync(pagePath)) {
    console.log(`File not found: ${pagePath}`);
    return;
  }
  
  // Read the file
  let content = fs.readFileSync(pagePath, 'utf8');
  
  // Add "use client" directive if not present
  if (!content.includes('"use client"')) {
    content = '"use client";\n\n' + content;
  }
  
  // Fix the import statement for JoinLiveClassButton if it exists
  if (content.includes('import { JoinLiveClassButton }')) {
    content = content.replace(
      'import { JoinLiveClassButton } from "@/components/course/JoinLiveClassButton";',
      'import JoinLiveClassButton from "@/components/course/JoinLiveClassButton";'
    );
    console.log(`Fixed import statement in ${pagePath}`);
  }
  
  // Add imports if not already present
  if (!content.includes('import { useAuth }')) {
    // Find the last import statement
    const lastImportIndex = content.lastIndexOf('import');
    const lastImportEndIndex = content.indexOf(';', lastImportIndex) + 1;
    
    // Insert the new imports after the last import
    content = content.slice(0, lastImportEndIndex) + importsTemplate + content.slice(lastImportEndIndex);
  }
  
  // Add state variables if not already present
  if (!content.includes('const { isSignedIn, userId }')) {
    // Find the state declarations
    const stateIndex = content.indexOf('const [isSubmitting');
    if (stateIndex !== -1) {
      // Insert the new state variables before the existing state declarations
      content = content.slice(0, stateIndex) + stateTemplate + content.slice(stateIndex);
    }
  }
  
  // Add admin check function if not already present
  if (!content.includes('checkIfUserIsAdmin')) {
    // Find the handleChange function
    const handleChangeIndex = content.indexOf('const handleChange');
    if (handleChangeIndex !== -1) {
      // Insert the admin check function before the handleChange function
      content = content.slice(0, handleChangeIndex) + adminCheckTemplate + content.slice(handleChangeIndex);
    }
  }
  
  // Add button component if not already present
  if (!content.includes('JoinLiveClassButton')) {
    // Find the end of the course details section
    const courseDetailsEndIndex = content.indexOf('</div>', content.indexOf('Options: Evening Class'));
    if (courseDetailsEndIndex !== -1) {
      // Insert the button component before the end of the course details section
      content = content.slice(0, courseDetailsEndIndex) + buttonTemplate(courseId, courseName) + content.slice(courseDetailsEndIndex);
    }
  }
  
  // Write the updated content back to the file
  fs.writeFileSync(pagePath, content);
  
  console.log(`Updated ${pagePath}`);
});

console.log('All course pages updated successfully!'); 