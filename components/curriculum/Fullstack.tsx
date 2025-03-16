export default function Fullstack() {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 text-center mb-12">
            Fullstack Development Masterclass
            <span className="block mt-2 text-2xl text-indigo-600">
              (16-Week Intensive Program)
            </span>
          </h1>
  
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Weeks 1-3 */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-bold mb-4 text-indigo-600">Weeks 1-3: Core Foundations</h2>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-indigo-600 font-extrabold">✓</span>
                  <span className="ml-2">Frontend Review (Html, CSS, React.js)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 font-extrabold">✓</span>
                  <span className="ml-2">Modern JavaScript & TypeScript</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 font-extrabold">✓</span>
                  <span className="ml-2">React 19 with Hooks & Context API</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 font-extrabold">✓</span>
                  <span className="ml-2">Next.js 15 App Router & SSR</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 font-extrabold">✓</span>
                  <span className="ml-2">Tailwind CSS Advanced Patterns</span>
                </li>
                <li className="flex items-start mt-4 p-3 bg-indigo-50 rounded">
                  <span className="ml-2">
                    <strong className="text-white p-2 rounded-sm bg-green-500 shadow-md">Project:</strong> Admin Dashboard UI
                  </span>
                </li>
              </ul>
            </div>
  
            {/* Weeks 4-5 */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-bold mb-4 text-indigo-600">Weeks 4-5: Backend Fundamentals</h2>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-indigo-600 font-extrabold">✓</span>
                  <span className="ml-2">Node.js & Express.js Framework</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 font-extrabold">✓</span>
                  <span className="ml-2">REST API Design & Best Practices</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 font-extrabold">✓</span>
                  <span className="ml-2">Middleware & Error Handling</span>
                </li>
                <li className="flex items-start mt-4 p-3 bg-indigo-50 rounded">
                  <span className="ml-2">
                    <strong className="text-white p-2 rounded-sm bg-green-500 shadow-md">Lab:</strong> E-commerce API
                  </span>
                </li>
              </ul>
            </div>
  
            {/* Weeks 6-7 */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-bold mb-4 text-indigo-600">Weeks 6-7: Database Mastery</h2>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-indigo-600 font-extrabold">✓</span>
                  <span className="ml-2">MongoDB & Mongoose ODM</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 font-extrabold">✓</span>
                  <span className="ml-2">PostgreSQL & Prisma ORM</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 font-extrabold">✓</span>
                  <span className="ml-2">Database Relationships & Indexing</span>
                </li>
                <li className="flex items-start mt-4 p-3 bg-indigo-50 rounded">
                  <span className="ml-2">
                    <strong className="text-white p-2 rounded-sm bg-green-500 shadow-md">Project:</strong> Inventory Management System
                  </span>
                </li>
              </ul>
            </div>
  
            {/* Week 8 */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-bold mb-4 text-indigo-600">Week 8: Authentication</h2>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-indigo-600 font-extrabold">✓</span>
                  <span className="ml-2">JWT & Session-based Auth</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 font-extrabold">✓</span>
                  <span className="ml-2">OAuth 2.0 (Google/GitHub)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 font-extrabold">✓</span>
                  <span className="ml-2">Role-based Access Control</span>
                </li>
                <li className="flex items-start mt-4 p-3 bg-indigo-50 rounded">
                  <span className="ml-2">
                    <strong className="text-white p-2 rounded-sm bg-green-500 shadow-md">Lab:</strong> Secure Auth System
                  </span>
                </li>
              </ul>
            </div>
  
            {/* Weeks 9-10 */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-bold mb-4 text-indigo-600">Weeks 9-10: Fullstack Integration</h2>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-indigo-600 font-extrabold">✓</span>
                  <span className="ml-2">Next.js API Routes</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 font-extrabold">✓</span>
                  <span className="ml-2">GraphQL with Apollo</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 font-extrabold">✓</span>
                  <span className="ml-2">WebSockets & Real-time Features</span>
                </li>
                <li className="flex items-start mt-4 p-3 bg-indigo-50 rounded">
                  <span className="ml-2">
                    <strong className="text-white p-2 rounded-sm bg-green-500 shadow-md">Project:</strong> Real-time Chat App
                  </span>
                </li>
              </ul>
            </div>
  
            {/* Week 11 */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-bold mb-4 text-indigo-600">Week 11: DevOps & CI/CD</h2>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-indigo-600 font-extrabold">✓</span>
                  <span className="ml-2">Git Workflows & GitHub Actions</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 font-extrabold">✓</span>
                  <span className="ml-2">Docker Fundamentals</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 font-extrabold">✓</span>
                  <span className="ml-2">Testing Strategies (Unit/E2E)</span>
                </li>
                <li className="flex items-start mt-4 p-3 bg-indigo-50 rounded">
                  <span className="ml-2">
                    <strong className="text-white p-2 rounded-sm bg-green-500 shadow-md">Lab:</strong> CI/CD Pipeline Setup
                  </span>
                </li>
              </ul>
            </div>
  
            {/* Weeks 12-13 */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-bold mb-4 text-indigo-600">Weeks 12-13: Production Deployment</h2>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-indigo-600 font-extrabold">✓</span>
                  <span className="ml-2">Vercel & Netlify Advanced Features</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 font-extrabold">✓</span>
                  <span className="ml-2">Serverless Functions</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 font-extrabold">✓</span>
                  <span className="ml-2">Performance Optimization</span>
                </li>
                <li className="flex items-start mt-4 p-3 bg-indigo-50 rounded">
                  <span className="ml-2">
                    <strong className="text-white p-2 rounded-sm bg-green-500 shadow-md">Project:</strong> Fullstack Deployment
                  </span>
                </li>
              </ul>
            </div>
  
            {/* Weeks 14-15 */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-bold mb-4 text-indigo-600">Weeks 14-15: Advanced Patterns</h2>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-indigo-600 font-extrabold">✓</span>
                  <span className="ml-2">Microservices Architecture</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 font-extrabold">✓</span>
                  <span className="ml-2">Payment Integration (Stripe)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 font-extrabold">✓</span>
                  <span className="ml-2">Advanced Prisma Patterns</span>
                </li>
                <li className="flex items-start mt-4 p-3 bg-indigo-50 rounded">
                  <span className="ml-2">
                    <strong className="text-white p-2 rounded-sm bg-green-500 shadow-md">Project:</strong> SaaS Application
                  </span>
                </li>
              </ul>
            </div>
  
            {/* Week 16 */}
            <div className="bg-white p-6 rounded-lg shadow-lg md:col-span-2 lg:col-span-3">
              <h2 className="text-xl font-bold mb-4 text-indigo-600">Week 16: Capstone Project</h2>
              <div className="space-y-3">
                <p>✅ Fullstack Application Development</p>
                <p>✅ Code Review & Optimization</p>
                <p>✅ Production Deployment</p>
                <div className="mt-4 p-4 bg-indigo-100 rounded-lg">
                  <h3 className="font-bold mb-2">Final Deliverables:</h3>
                  <ul className="list-disc pl-5">
                    <li>Complete MERN Stack Application</li>
                    <li>CI/CD Pipeline Implementation</li>
                    <li>Custom Domain with SSL</li>
                    <li>Performance Audit Report</li>
                    <li>Certificate of Excellence</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
  
          <footer className="mt-12 text-center text-gray-600">
            <p>Includes weekly code katas, pair programming sessions, and expert mentorship</p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                React 19
              </span>
              <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                Next.js 15
              </span>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                Node.js 20
              </span>
              <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">
                MongoDB
              </span>
              <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                PostgreSQL
              </span>
              <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm">
                Prisma ORM
              </span>
              <span className="bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-sm">
                TypeScript 5
              </span>
            </div>
          </footer>
        </div>
      </div>
    );
  }