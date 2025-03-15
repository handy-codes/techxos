export default function Frontend() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 text-center mb-12">
          Frontend Development Bootcamp
          <span className="block mt-2 text-2xl text-indigo-600">
            (12-Week Curriculum)
          </span>
        </h1>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Week 1-3 */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-bold mb-4 text-indigo-600">Week 1-3: Introduction to Frontend Development & Tools Setup</h2>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-indigo-600 font-extrabold">✓</span>
                  <span className="ml-2">Overview of Frontend Development in 2025</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 font-extrabold">✓</span>
                  <span className="ml-2">Installing VS Code, Node.js, Git Bash and necessary extensions</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 font-extrabold">✓</span>
                  <span className="ml-2">HTML, CSS, and Tailwind CSS Basics</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 font-extrabold">✓</span>
                  <span className="ml-2">JavaScript ES6+ Fundamentals</span>
                </li>
              </ul>
            </div>

          {/* Week 4 */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-indigo-600">
              Week 4: Tailwind CSS
            </h2>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="text-indigo-600 font-extrabold">✓</span>
                <span className="ml-2">Utility-First Fundamentals</span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-600 font-extrabold">✓</span>
                <span className="ml-2">Responsive Design Patterns</span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-600 font-extrabold">✓</span>
                <span className="ml-2">Dark Mode Implementation</span>
              </li>
              <li className="flex items-start mt-4 p-3 bg-indigo-50 rounded">
                <span className="ml-2">
                <strong className="text-white p-2 rounded-sm bg-green-500 shadow-md">Project:</strong> Responsive Portfolio Layout
                </span>
              </li>
            </ul>
          </div>

          {/* Weeks 5-6 */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-indigo-600">
              Weeks 5-6: Introduction to React.js & Next.js
            </h2>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="text-indigo-600 font-extrabold">✓</span>
                <span className="ml-2">File-based Routing</span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-600 font-extrabold">✓</span>
                <span className="ml-2">API Routes & Middleware</span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-600 font-extrabold">✓</span>
                <span className="ml-2">Static Site Generation (SSG)</span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-600 font-extrabold">✓</span>
                <span className="ml-2">Server-Side Rendering (SSR)</span>
              </li>
              <li className="flex items-start mt-4 p-3 bg-indigo-50 rounded">
                <span className="ml-2">
                  <strong className="text-white p-2 rounded-sm bg-green-500 shadow-md">Project:</strong> E-commerce Product Page
                </span>
              </li>
            </ul>
          </div>

          {/* Weeks 7-8 */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-indigo-600">
              Weeks 7-8: Git & GitHub
            </h2>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="text-indigo-600 font-extrabold">✓</span>
                <span className="ml-2">Version Control Fundamentals</span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-600 font-extrabold">✓</span>
                <span className="ml-2">Branching Strategies</span>
              </li>
              <li className="flex items-start">
              <span className="text-indigo-600 font-extrabold">✓</span>
                <span className="ml-2">Open Source Contribution</span>
              </li>
              <li className="flex items-start mt-4 p-3 bg-indigo-50 rounded">
                 <strong className="text-white p-1 rounded-sm bg-green-500 shadow-md">Lab:</strong> Team Code Collaboration
              </li>
            </ul>
          </div>

          {/* Weeks 9-10 */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-indigo-600">
              Weeks 9-10: Deployment
            </h2>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="text-indigo-600 font-extrabold">✓</span>
                <span className="ml-2">Vercel Platform Deep Dive</span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-600 font-extrabold">✓</span>
                <span className="ml-2">Netlify Features & CI/CD</span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-600 font-extrabold">✓</span>
                <span className="ml-2">Performance Optimization</span>
              </li>
              <li className="flex items-start mt-4 p-3 bg-indigo-50 rounded">
                <span className="ml-2">
                 <strong className="text-white p-1 rounded-sm bg-green-500 shadow-md">Assignment:</strong> Multi-environment Deployment
                </span>
              </li>
            </ul>
          </div>

          {/* Week 11 */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-indigo-600">
              Week 11: Production Ready
            </h2>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="text-indigo-600 font-extrabold">✓</span>
                <span className="ml-2">Domain Registration (Hostinger)</span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-600 font-extrabold">✓</span>
                <span className="ml-2">DNS Configuration</span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-600 font-extrabold">✓</span>
                <span className="ml-2">SSL Certificates</span>
              </li>
              <li className="flex items-start mt-4 p-3 bg-indigo-50 rounded">
                <span className="ml-2">
                  <strong className="text-white p-2 rounded-sm bg-green-500 shadow-md">Project:</strong> Full Deployment Pipeline
                </span>
              </li>
            </ul>
          </div>

          {/* Week 12 */}
          <div className="bg-white p-6 rounded-lg shadow-lg md:col-span-2 lg:col-span-3">
            <h2 className="text-xl font-bold mb-4 text-indigo-600">
              Week 12: Capstone
            </h2>
            <div className="space-y-3">
              <p>✅ Final Project: E-commerce, Real Estate, and more</p>
              <p>✅ Code Review & Optimization</p>
              <p>✅ Deployment to Production</p>
              <div className="mt-4 p-4 bg-indigo-100 rounded-lg">
                <h3 className="font-bold mb-2">Outcomes:</h3>
                <ul className="list-disc pl-5">
                  <li>Professional Portfolio Development</li>
                  <li>CI/CD Pipeline Implementation</li>
                  <li>Custom Domain Deployment</li>
                  <li>Certificate of Completion</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        {/* Footer remains the same */}
        <footer className="mt-12 text-center text-gray-600">
            <p>Includes weekly assignments, code reviews, and 1:1 mentorship sessions</p>
            <div className="mt-4 flex justify-center space-x-4">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                Next.js 14
              </span>
              <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                Tailwind CSS
              </span>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                Git & GitHub
              </span>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                Web Hosting
              </span>

            </div>
          </footer>
      </div>
    </div>
  );
}

// export default function Frontend() {
//     return (
//       <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
//         <div className="max-w-7xl mx-auto">
//           <h1 className="text-4xl font-bold text-gray-900 text-center mb-12">
//             Frontend Development Bootcamp
//             <span className="block mt-2 text-2xl text-indigo-600">
//               (12-Week Curriculum)
//             </span>
//           </h1>

//           <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
//             {/* Week 1-3 */}
//             <div className="bg-white p-6 rounded-lg shadow-lg">
//               <h2 className="text-xl font-bold mb-4 text-indigo-600">Week 1-3: Introduction to Frontend Development & Tools Setup</h2>
//               <ul className="space-y-3">
//                 <li className="flex items-start">
//                   <span className="text-indigo-600 font-extrabold">✓</span>
//                   <span className="ml-2">Overview of Frontend Development in 2025</span>
//                 </li>
//                 <li className="flex items-start">
//                   <span className="text-indigo-600 font-extrabold">✓</span>
//                   <span className="ml-2">Installing VS Code, Node.js, Git Bash and necessary extensions</span>
//                 </li>
//                 <li className="flex items-start">
//                   <span className="text-indigo-600 font-extrabold">✓</span>
//                   <span className="ml-2">Introduction to Version Control (Git & GitHub) </span>
//                 </li>
//                 <li className="flex items-start">
//                   <span className="text-indigo-600 font-extrabold">✓</span>
//                   <span className="ml-2">HTML, CSS, and Tailwind CSS Basics</span>
//                 </li>
//                 <li className="flex items-start">
//                   <span className="text-indigo-600 font-extrabold">✓</span>
//                   <span className="ml-2">JavaScript ES6+ Fundamentals</span>
//                 </li>
//               </ul>
//             </div>

//             {/* Week 3 */}
//             <div className="bg-white p-6 rounded-lg shadow-lg">
//               <h2 className="text-xl font-bold mb-4 text-indigo-600">Weeks 4: Tailwind CSS</h2>
//               <ul className="space-y-3">
//                 <li>Utility-First Fundamentals</li>
//                 <li>Responsive Design Patterns</li>
//                 <li>Dark Mode Implementation</li>
//                 <li className="mt-4 p-3 bg-indigo-50 rounded">
//                   <strong>Project:</strong> Responsive Portfolio Layout
//                 </li>
//               </ul>
//             </div>

//             {/* Weeks 5-6 */}
//             <div className="bg-white p-6 rounded-lg shadow-lg">
//               <h2 className="text-xl font-bold mb-4 text-indigo-600">Weeks 5-6: Introduction to React.js & Next.js</h2>
//               <ul className="space-y-3">
//                 <li>File-based Routing</li>
//                 <li>API Routes & Middleware</li>
//                 <li>Static Site Generation (SSG)</li>
//                 <li>Server-Side Rendering (SSR)</li>
//                 <li className="mt-4 p-3 bg-indigo-50 rounded">
//                   <strong>Project:</strong> E-commerce Product Page
//                 </li>
//               </ul>
//             </div>

//             {/* Weeks 7-8 */}
//             <div className="bg-white p-6 rounded-lg shadow-lg">
//               <h2 className="text-xl font-bold mb-4 text-indigo-600">Weeks 7-8: Git & GitHub</h2>
//               <ul className="space-y-3">
//                 <li>Version Control Fundamentals</li>
//                 <li>Branching Strategies</li>
//                 <li>Collaborative Workflows</li>
//                 <li className="mt-4 p-3 bg-indigo-50 rounded">
//                   <strong>Lab:</strong> Team Code Collaboration
//                 </li>
//               </ul>
//             </div>

//             {/* Weeks 9-10 */}
//             <div className="bg-white p-6 rounded-lg shadow-lg">
//               <h2 className="text-xl font-bold mb-4 text-indigo-600">Weeks 9-10: Deployment</h2>
//               <ul className="space-y-3">
//                 <li>Vercel Platform Deep Dive</li>
//                 <li>Netlify Features & CI/CD</li>
//                 <li>Performance Optimization</li>
//                 <li className="mt-4 p-3 bg-indigo-50 rounded">
//                   <strong>Assignment:</strong> Multi-environment Deployment
//                 </li>
//               </ul>
//             </div>

//             {/* Week 11 */}
//             <div className="bg-white p-6 rounded-lg shadow-lg">
//               <h2 className="text-xl font-bold mb-4 text-indigo-600">Week 11: Production Ready</h2>
//               <ul className="space-y-3">
//                 <li>Domain Registration (Hostinger)</li>
//                 <li>DNS Configuration</li>
//                 <li>SSL Certificates</li>
//                 <li className="mt-4 p-3 bg-indigo-50 rounded">
//                   <strong>Project:</strong> Full Deployment Pipeline
//                 </li>
//               </ul>
//             </div>

//             {/* Week 12 */}
//             <div className="bg-white p-6 rounded-lg shadow-lg md:col-span-2 lg:col-span-3">
//               <h2 className="text-xl font-bold mb-4 text-indigo-600">Week 12: Capstone</h2>
//               <div className="space-y-3">
//                 <p>✅ Final Project: E-commerce, Real Estate, and more</p>
//                 <p>✅ Code Review & Optimization</p>
//                 <p>✅ Deployment to Production</p>
//                 <div className="mt-4 p-4 bg-indigo-100 rounded-lg">
//                   <h3 className="font-bold mb-2">Outcomes:</h3>
//                   <ul className="list-disc pl-5">
//                     <li>Professional Portfolio Development</li>
//                     <li>CI/CD Pipeline Implementation</li>
//                     <li>Custom Domain Deployment</li>
//                     <li>Certificate of Completion</li>
//                   </ul>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <footer className="mt-12 text-center text-gray-600">
//             <p>Includes weekly assignments, code reviews, and 1:1 mentorship sessions</p>
//             <div className="mt-4 flex justify-center space-x-4">
//               <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
//                 Git & GitHub
//               </span>
//               <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
//                 Next.js 14
//               </span>
//               <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
//                 Tailwind CSS
//               </span>
//             </div>
//           </footer>
//         </div>
//       </div>
//     );
//   }
