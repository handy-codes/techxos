export default function Frontend() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8&quot;>
      <div className=&quot;max-w-7xl mx-auto&quot;>
        <h1 className=&quot;text-4xl font-bold text-gray-900 text-center mb-12&quot;>
          Frontend Development Bootcamp
          <span className=&quot;block mt-2 text-2xl text-indigo-600&quot;>
            (12-Week Curriculum)
          </span>
        </h1>

        <div className=&quot;grid gap-8 md:grid-cols-2 lg:grid-cols-3&quot;>
            {/* Week 1-3 */}
            <div className=&quot;bg-white p-6 rounded-lg shadow-lg&quot;>
              <h2 className=&quot;text-xl font-bold mb-4 text-indigo-600&quot;>Week 1-3: Introduction to Frontend Development & Tools Setup</h2>
              <ul className=&quot;space-y-3&quot;>
                <li className=&quot;flex items-start&quot;>
                  <span className=&quot;text-indigo-600 font-extrabold&quot;>✓</span>
                  <span className=&quot;ml-2&quot;>Overview of Frontend Development in 2025</span>
                </li>
                <li className=&quot;flex items-start&quot;>
                  <span className=&quot;text-indigo-600 font-extrabold&quot;>✓</span>
                  <span className=&quot;ml-2&quot;>Installing VS Code, Node.js, Git Bash and necessary extensions</span>
                </li>
                <li className=&quot;flex items-start&quot;>
                  <span className=&quot;text-indigo-600 font-extrabold&quot;>✓</span>
                  <span className=&quot;ml-2&quot;>HTML, CSS, and Tailwind CSS Basics</span>
                </li>
                <li className=&quot;flex items-start&quot;>
                  <span className=&quot;text-indigo-600 font-extrabold&quot;>✓</span>
                  <span className=&quot;ml-2&quot;>JavaScript ES6+ Fundamentals</span>
                </li>
              </ul>
            </div>

          {/* Week 4 */}
          <div className=&quot;bg-white p-6 rounded-lg shadow-lg&quot;>
            <h2 className=&quot;text-xl font-bold mb-4 text-indigo-600&quot;>
              Week 4: Tailwind CSS
            </h2>
            <ul className=&quot;space-y-3&quot;>
              <li className=&quot;flex items-start&quot;>
                <span className=&quot;text-indigo-600 font-extrabold&quot;>✓</span>
                <span className=&quot;ml-2&quot;>Utility-First Fundamentals</span>
              </li>
              <li className=&quot;flex items-start&quot;>
                <span className=&quot;text-indigo-600 font-extrabold&quot;>✓</span>
                <span className=&quot;ml-2&quot;>Responsive Design Patterns</span>
              </li>
              <li className=&quot;flex items-start&quot;>
                <span className=&quot;text-indigo-600 font-extrabold&quot;>✓</span>
                <span className=&quot;ml-2&quot;>Dark Mode Implementation</span>
              </li>
              <li className=&quot;flex items-start mt-4 p-3 bg-indigo-50 rounded&quot;>
                <span className=&quot;ml-2&quot;>
                <strong className=&quot;text-white p-2 rounded-sm bg-green-500 shadow-md&quot;>Project:</strong> Responsive Portfolio Layout
                </span>
              </li>
            </ul>
          </div>

          {/* Weeks 5-6 */}
          <div className=&quot;bg-white p-6 rounded-lg shadow-lg&quot;>
            <h2 className=&quot;text-xl font-bold mb-4 text-indigo-600&quot;>
              Weeks 5-6: Introduction to React.js & Next.js
            </h2>
            <ul className=&quot;space-y-3&quot;>
              <li className=&quot;flex items-start&quot;>
                <span className=&quot;text-indigo-600 font-extrabold&quot;>✓</span>
                <span className=&quot;ml-2&quot;>File-based Routing</span>
              </li>
              <li className=&quot;flex items-start&quot;>
                <span className=&quot;text-indigo-600 font-extrabold&quot;>✓</span>
                <span className=&quot;ml-2&quot;>API Routes & Middleware</span>
              </li>
              <li className=&quot;flex items-start&quot;>
                <span className=&quot;text-indigo-600 font-extrabold&quot;>✓</span>
                <span className=&quot;ml-2&quot;>Static Site Generation (SSG)</span>
              </li>
              <li className=&quot;flex items-start&quot;>
                <span className=&quot;text-indigo-600 font-extrabold&quot;>✓</span>
                <span className=&quot;ml-2&quot;>Server-Side Rendering (SSR)</span>
              </li>
              <li className=&quot;flex items-start mt-4 p-3 bg-indigo-50 rounded&quot;>
                <span className=&quot;ml-2&quot;>
                  <strong className=&quot;text-white p-2 rounded-sm bg-green-500 shadow-md&quot;>Project:</strong> E-commerce Product Page
                </span>
              </li>
            </ul>
          </div>

          {/* Weeks 7-8 */}
          <div className=&quot;bg-white p-6 rounded-lg shadow-lg&quot;>
            <h2 className=&quot;text-xl font-bold mb-4 text-indigo-600&quot;>
              Weeks 7-8: Git & GitHub
            </h2>
            <ul className=&quot;space-y-3&quot;>
              <li className=&quot;flex items-start&quot;>
                <span className=&quot;text-indigo-600 font-extrabold&quot;>✓</span>
                <span className=&quot;ml-2&quot;>Version Control Fundamentals</span>
              </li>
              <li className=&quot;flex items-start&quot;>
                <span className=&quot;text-indigo-600 font-extrabold&quot;>✓</span>
                <span className=&quot;ml-2&quot;>Branching Strategies</span>
              </li>
              <li className=&quot;flex items-start&quot;>
              <span className=&quot;text-indigo-600 font-extrabold&quot;>✓</span>
                <span className=&quot;ml-2&quot;>Open Source Contribution</span>
              </li>
              <li className=&quot;flex items-start mt-4 p-3 bg-indigo-50 rounded&quot;>
                 <strong className=&quot;text-white p-1 rounded-sm bg-green-500 shadow-md&quot;>Lab:</strong> Team Code Collaboration
              </li>
            </ul>
          </div>

          {/* Weeks 9-10 */}
          <div className=&quot;bg-white p-6 rounded-lg shadow-lg&quot;>
            <h2 className=&quot;text-xl font-bold mb-4 text-indigo-600&quot;>
              Weeks 9-10: Deployment
            </h2>
            <ul className=&quot;space-y-3&quot;>
              <li className=&quot;flex items-start&quot;>
                <span className=&quot;text-indigo-600 font-extrabold&quot;>✓</span>
                <span className=&quot;ml-2&quot;>Vercel Platform Deep Dive</span>
              </li>
              <li className=&quot;flex items-start&quot;>
                <span className=&quot;text-indigo-600 font-extrabold&quot;>✓</span>
                <span className=&quot;ml-2&quot;>Netlify Features & CI/CD</span>
              </li>
              <li className=&quot;flex items-start&quot;>
                <span className=&quot;text-indigo-600 font-extrabold&quot;>✓</span>
                <span className=&quot;ml-2&quot;>Performance Optimization</span>
              </li>
              <li className=&quot;flex items-start mt-4 p-3 bg-indigo-50 rounded&quot;>
                <span className=&quot;ml-2&quot;>
                 <strong className=&quot;text-white p-1 rounded-sm bg-green-500 shadow-md&quot;>Assignment:</strong> Multi-environment Deployment
                </span>
              </li>
            </ul>
          </div>

          {/* Week 11 */}
          <div className=&quot;bg-white p-6 rounded-lg shadow-lg&quot;>
            <h2 className=&quot;text-xl font-bold mb-4 text-indigo-600&quot;>
              Week 11: Production Ready
            </h2>
            <ul className=&quot;space-y-3&quot;>
              <li className=&quot;flex items-start&quot;>
                <span className=&quot;text-indigo-600 font-extrabold&quot;>✓</span>
                <span className=&quot;ml-2&quot;>Domain Registration (Hostinger)</span>
              </li>
              <li className=&quot;flex items-start&quot;>
                <span className=&quot;text-indigo-600 font-extrabold&quot;>✓</span>
                <span className=&quot;ml-2&quot;>DNS Configuration</span>
              </li>
              <li className=&quot;flex items-start&quot;>
                <span className=&quot;text-indigo-600 font-extrabold&quot;>✓</span>
                <span className=&quot;ml-2&quot;>SSL Certificates</span>
              </li>
              <li className=&quot;flex items-start mt-4 p-3 bg-indigo-50 rounded&quot;>
                <span className=&quot;ml-2&quot;>
                  <strong className=&quot;text-white p-2 rounded-sm bg-green-500 shadow-md&quot;>Project:</strong> Full Deployment Pipeline
                </span>
              </li>
            </ul>
          </div>

          {/* Week 12 */}
          <div className=&quot;bg-white p-6 rounded-lg shadow-lg md:col-span-2 lg:col-span-3&quot;>
            <h2 className=&quot;text-xl font-bold mb-4 text-indigo-600&quot;>
              Week 12: Capstone
            </h2>
            <div className=&quot;space-y-3&quot;>
              <p>✅ Final Project: E-commerce, Real Estate, and more</p>
              <p>✅ Code Review & Optimization</p>
              <p>✅ Deployment to Production</p>
              <div className=&quot;mt-4 p-4 bg-indigo-100 rounded-lg&quot;>
                <h3 className=&quot;font-bold mb-2&quot;>Outcomes:</h3>
                <ul className=&quot;list-disc pl-5&quot;>
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
        <footer className=&quot;mt-12 text-center text-gray-600&quot;>
            <p>Includes weekly assignments, code reviews, and 1:1 mentorship sessions</p>
            <div className=&quot;mt-4 flex justify-center space-x-4&quot;>
              <span className=&quot;bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm&quot;>
                Next.js 14
              </span>
              <span className=&quot;bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm&quot;>
                Tailwind CSS
              </span>
              <span className=&quot;bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm&quot;>
                Git & GitHub
              </span>
              <span className=&quot;bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm&quot;>
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
//       <div className=&quot;min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8&quot;>
//         <div className=&quot;max-w-7xl mx-auto&quot;>
//           <h1 className=&quot;text-4xl font-bold text-gray-900 text-center mb-12&quot;>
//             Frontend Development Bootcamp
//             <span className=&quot;block mt-2 text-2xl text-indigo-600&quot;>
//               (12-Week Curriculum)
//             </span>
//           </h1>

//           <div className=&quot;grid gap-8 md:grid-cols-2 lg:grid-cols-3&quot;>
//             {/* Week 1-3 */}
//             <div className=&quot;bg-white p-6 rounded-lg shadow-lg&quot;>
//               <h2 className=&quot;text-xl font-bold mb-4 text-indigo-600&quot;>Week 1-3: Introduction to Frontend Development & Tools Setup</h2>
//               <ul className=&quot;space-y-3&quot;>
//                 <li className=&quot;flex items-start&quot;>
//                   <span className=&quot;text-indigo-600 font-extrabold&quot;>✓</span>
//                   <span className=&quot;ml-2&quot;>Overview of Frontend Development in 2025</span>
//                 </li>
//                 <li className=&quot;flex items-start&quot;>
//                   <span className=&quot;text-indigo-600 font-extrabold&quot;>✓</span>
//                   <span className=&quot;ml-2&quot;>Installing VS Code, Node.js, Git Bash and necessary extensions</span>
//                 </li>
//                 <li className=&quot;flex items-start&quot;>
//                   <span className=&quot;text-indigo-600 font-extrabold&quot;>✓</span>
//                   <span className=&quot;ml-2&quot;>Introduction to Version Control (Git & GitHub) </span>
//                 </li>
//                 <li className=&quot;flex items-start&quot;>
//                   <span className=&quot;text-indigo-600 font-extrabold&quot;>✓</span>
//                   <span className=&quot;ml-2&quot;>HTML, CSS, and Tailwind CSS Basics</span>
//                 </li>
//                 <li className=&quot;flex items-start&quot;>
//                   <span className=&quot;text-indigo-600 font-extrabold&quot;>✓</span>
//                   <span className=&quot;ml-2&quot;>JavaScript ES6+ Fundamentals</span>
//                 </li>
//               </ul>
//             </div>

//             {/* Week 3 */}
//             <div className=&quot;bg-white p-6 rounded-lg shadow-lg&quot;>
//               <h2 className=&quot;text-xl font-bold mb-4 text-indigo-600&quot;>Weeks 4: Tailwind CSS</h2>
//               <ul className=&quot;space-y-3&quot;>
//                 <li>Utility-First Fundamentals</li>
//                 <li>Responsive Design Patterns</li>
//                 <li>Dark Mode Implementation</li>
//                 <li className=&quot;mt-4 p-3 bg-indigo-50 rounded&quot;>
//                   <strong>Project:</strong> Responsive Portfolio Layout
//                 </li>
//               </ul>
//             </div>

//             {/* Weeks 5-6 */}
//             <div className=&quot;bg-white p-6 rounded-lg shadow-lg&quot;>
//               <h2 className=&quot;text-xl font-bold mb-4 text-indigo-600&quot;>Weeks 5-6: Introduction to React.js & Next.js</h2>
//               <ul className=&quot;space-y-3&quot;>
//                 <li>File-based Routing</li>
//                 <li>API Routes & Middleware</li>
//                 <li>Static Site Generation (SSG)</li>
//                 <li>Server-Side Rendering (SSR)</li>
//                 <li className=&quot;mt-4 p-3 bg-indigo-50 rounded&quot;>
//                   <strong>Project:</strong> E-commerce Product Page
//                 </li>
//               </ul>
//             </div>

//             {/* Weeks 7-8 */}
//             <div className=&quot;bg-white p-6 rounded-lg shadow-lg&quot;>
//               <h2 className=&quot;text-xl font-bold mb-4 text-indigo-600&quot;>Weeks 7-8: Git & GitHub</h2>
//               <ul className=&quot;space-y-3&quot;>
//                 <li>Version Control Fundamentals</li>
//                 <li>Branching Strategies</li>
//                 <li>Collaborative Workflows</li>
//                 <li className=&quot;mt-4 p-3 bg-indigo-50 rounded&quot;>
//                   <strong>Lab:</strong> Team Code Collaboration
//                 </li>
//               </ul>
//             </div>

//             {/* Weeks 9-10 */}
//             <div className=&quot;bg-white p-6 rounded-lg shadow-lg&quot;>
//               <h2 className=&quot;text-xl font-bold mb-4 text-indigo-600&quot;>Weeks 9-10: Deployment</h2>
//               <ul className=&quot;space-y-3&quot;>
//                 <li>Vercel Platform Deep Dive</li>
//                 <li>Netlify Features & CI/CD</li>
//                 <li>Performance Optimization</li>
//                 <li className=&quot;mt-4 p-3 bg-indigo-50 rounded&quot;>
//                   <strong>Assignment:</strong> Multi-environment Deployment
//                 </li>
//               </ul>
//             </div>

//             {/* Week 11 */}
//             <div className=&quot;bg-white p-6 rounded-lg shadow-lg&quot;>
//               <h2 className=&quot;text-xl font-bold mb-4 text-indigo-600&quot;>Week 11: Production Ready</h2>
//               <ul className=&quot;space-y-3&quot;>
//                 <li>Domain Registration (Hostinger)</li>
//                 <li>DNS Configuration</li>
//                 <li>SSL Certificates</li>
//                 <li className=&quot;mt-4 p-3 bg-indigo-50 rounded&quot;>
//                   <strong>Project:</strong> Full Deployment Pipeline
//                 </li>
//               </ul>
//             </div>

//             {/* Week 12 */}
//             <div className=&quot;bg-white p-6 rounded-lg shadow-lg md:col-span-2 lg:col-span-3&quot;>
//               <h2 className=&quot;text-xl font-bold mb-4 text-indigo-600&quot;>Week 12: Capstone</h2>
//               <div className=&quot;space-y-3&quot;>
//                 <p>✅ Final Project: E-commerce, Real Estate, and more</p>
//                 <p>✅ Code Review & Optimization</p>
//                 <p>✅ Deployment to Production</p>
//                 <div className=&quot;mt-4 p-4 bg-indigo-100 rounded-lg&quot;>
//                   <h3 className=&quot;font-bold mb-2&quot;>Outcomes:</h3>
//                   <ul className=&quot;list-disc pl-5&quot;>
//                     <li>Professional Portfolio Development</li>
//                     <li>CI/CD Pipeline Implementation</li>
//                     <li>Custom Domain Deployment</li>
//                     <li>Certificate of Completion</li>
//                   </ul>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <footer className=&quot;mt-12 text-center text-gray-600&quot;>
//             <p>Includes weekly assignments, code reviews, and 1:1 mentorship sessions</p>
//             <div className=&quot;mt-4 flex justify-center space-x-4&quot;>
//               <span className=&quot;bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm&quot;>
//                 Git & GitHub
//               </span>
//               <span className=&quot;bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm&quot;>
//                 Next.js 14
//               </span>
//               <span className=&quot;bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
//                 Tailwind CSS
//               </span>
//             </div>
//           </footer>
//         </div>
//       </div>
//     );
//   }
