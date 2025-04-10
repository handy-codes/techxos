export default function Cybersecurity() {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 text-center mb-12">
            Cybersecurity Professional Bootcamp
            <span className="block mt-2 text-2xl text-red-600">
              (16-Week Career Accelerator)
            </span>
          </h1>
  
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Weeks 1-2 */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-bold mb-4 text-red-600">Weeks 1-2: Cybersecurity Foundations</h2>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-red-600 font-extrabold">✓</span>
                  <span className="ml-2">Modern Threat Landscape Overview</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 font-extrabold">✓</span>
                  <span className="ml-2">Security Frameworks (NIST, ISO 27001)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 font-extrabold">✓</span>
                  <span className="ml-2">Network Fundamentals & Protocol Analysis</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 font-extrabold">✓</span>
                  <span className="ml-2">Linux Security Essentials</span>
                </li>
                <li className="flex items-start mt-4 p-3 bg-red-50 rounded">
                  <span className="ml-2">
                    <strong className="text-white p-2 rounded-sm bg-blue-500 shadow-md">Lab:</strong> Secure Network Configuration
                  </span>
                </li>
              </ul>
            </div>
  
            {/* Weeks 3-4 */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-bold mb-4 text-red-600">Weeks 3-4: System Hardening</h2>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-red-600 font-extrabold">✓</span>
                  <span className="ml-2">Windows/Linux Hardening Techniques</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 font-extrabold">✓</span>
                  <span className="ml-2">Cloud Security Fundamentals (AWS/Azure/GCP)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 font-extrabold">✓</span>
                  <span className="ml-2">Container Security (Docker, Kubernetes)</span>
                </li>
                <li className="flex items-start mt-4 p-3 bg-red-50 rounded">
                  <span className="ml-2">
                    <strong className="text-white p-2 rounded-sm bg-blue-500 shadow-md">Project:</strong> Secure Cloud Deployment
                  </span>
                </li>
              </ul>
            </div>
  
            {/* Weeks 5-6 */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-bold mb-4 text-red-600">Weeks 5-6: Cryptography & PKI</h2>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-red-600 font-extrabold">✓</span>
                  <span className="ml-2">Modern Encryption Algorithms</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 font-extrabold">✓</span>
                  <span className="ml-2">Quantum-Resistant Cryptography</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 font-extrabold">✓</span>
                  <span className="ml-2">Digital Certificates & CA Management</span>
                </li>
                <li className="flex items-start mt-4 p-3 bg-red-50 rounded">
                  <span className="ml-2">
                    <strong className="text-white p-2 rounded-sm bg-blue-500 shadow-md">Lab:</strong> PKI Implementation
                  </span>
                </li>
              </ul>
            </div>
  
            {/* Weeks 7-8 */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-bold mb-4 text-red-600">Weeks 7-8: Network Defense</h2>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-red-600 font-extrabold">✓</span>
                  <span className="ml-2">Next-Gen Firewalls (Palo Alto, Fortinet)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 font-extrabold">✓</span>
                  <span className="ml-2">IDS/IPS Systems</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 font-extrabold">✓</span>
                  <span className="ml-2">Zero Trust Architecture</span>
                </li>
                <li className="flex items-start mt-4 p-3 bg-red-50 rounded">
                  <span className="ml-2">
                    <strong className="text-white p-2 rounded-sm bg-blue-500 shadow-md">Project:</strong> Network Monitoring System
                  </span>
                </li>
              </ul>
            </div>
  
            {/* Weeks 9-10 */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-bold mb-4 text-red-600">Weeks 9-10: Ethical Hacking</h2>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-red-600 font-extrabold">✓</span>
                  <span className="ml-2">Penetration Testing Methodologies</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 font-extrabold">✓</span>
                  <span className="ml-2">OWASP Top 10 2025</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 font-extrabold">✓</span>
                  <span className="ml-2">AI-Powered Vulnerability Scanning</span>
                </li>
                <li className="flex items-start mt-4 p-3 bg-red-50 rounded">
                  <span className="ml-2">
                    <strong className="text-white p-2 rounded-sm bg-blue-500 shadow-md">Lab:</strong> Full Infrastructure Pentest
                  </span>
                </li>
              </ul>
            </div>
  
            {/* Weeks 11-12 */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-bold mb-4 text-red-600">Weeks 11-12: SOC Operations</h2>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-red-600 font-extrabold">✓</span>
                  <span className="ml-2">SIEM Solutions (Splunk, Elastic)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 font-extrabold">✓</span>
                  <span className="ml-2">Threat Hunting Techniques</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 font-extrabold">✓</span>
                  <span className="ml-2">Incident Response Playbooks</span>
                </li>
                <li className="flex items-start mt-4 p-3 bg-red-50 rounded">
                  <span className="ml-2">
                    <strong className="text-white p-2 rounded-sm bg-blue-500 shadow-md">Project:</strong> Live Attack Simulation
                  </span>
                </li>
              </ul>
            </div>
  
            {/* Weeks 13-14 */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-bold mb-4 text-red-600">Weeks 13-14: Cloud Security</h2>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-red-600 font-extrabold">✓</span>
                  <span className="ml-2">CSPM Tools</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 font-extrabold">✓</span>
                  <span className="ml-2">Serverless Security</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 font-extrabold">✓</span>
                  <span className="ml-2">IaC Security (Terraform, CloudFormation)</span>
                </li>
                <li className="flex items-start mt-4 p-3 bg-red-50 rounded">
                  <span className="ml-2">
                    <strong className="text-white p-2 rounded-sm bg-blue-500 shadow-md">Project:</strong> Multi-Cloud Security Audit
                  </span>
                </li>
              </ul>
            </div>
  
            {/* Week 15 */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-bold mb-4 text-red-600">Week 15: Compliance & Governance</h2>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-red-600 font-extrabold">✓</span>
                  <span className="ml-2">GDPR, CCPA, HIPAA</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 font-extrabold">✓</span>
                  <span className="ml-2">Risk Assessment Frameworks</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 font-extrabold">✓</span>
                  <span className="ml-2">Security Policy Development</span>
                </li>
                <li className="flex items-start mt-4 p-3 bg-red-50 rounded">
                  <span className="ml-2">
                    <strong className="text-white p-2 rounded-sm bg-blue-500 shadow-md">Lab:</strong> Compliance Audit Simulation
                  </span>
                </li>
              </ul>
            </div>
  
            {/* Week 16 */}
            <div className="bg-white p-6 rounded-lg shadow-lg md:col-span-2 lg:col-span-3">
              <h2 className="text-xl font-bold mb-4 text-red-600">Week 16: Capstone Project</h2>
              <div className="space-y-3">
                <p>✅ Full Enterprise Security Assessment</p>
                <p>✅ Incident Response Simulation</p>
                <p>✅ Executive Reporting</p>
                <div className="mt-4 p-4 bg-red-100 rounded-lg">
                  <h3 className="font-bold mb-2">Final Deliverables:</h3>
                  <ul className="list-disc pl-5">
                    <li>Complete Security Audit Report</li>
                    <li>Live Penetration Test Demo</li>
                    <li>SOC Playbook Documentation</li>
                    <li>Compliance Certification Package</li>
                    <li>CompTIA Security+ & CISSP Prep</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
  
          <footer className="mt-12 text-center text-gray-600">
            <p>Includes daily CTF challenges, red/blue team exercises, and career mentorship</p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                CrowdStrike
              </span>
              <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                Palo Alto
              </span>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                AWS Security
              </span>
              <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">
                Azure Defender
              </span>
              <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                Splunk
              </span>
              <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm">
                Wireshark
              </span>
              <span className="bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-sm">
                Metasploit
              </span>
            </div>
          </footer>
        </div>
      </div>
    );
  }