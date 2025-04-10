"use client&quot;;

import { useState, useEffect } from &quot;react&quot;;
import { useRouter } from &quot;next/navigation&quot;;
import axios from &quot;axios&quot;;
import { toast } from &quot;react-hot-toast&quot;;
import { formatDate, formatCurrency } from &quot;@/lib/format-date&quot;;

export default function AdminPurchasesPage() {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userDetails, setUserDetails] = useState({});
  const router = useRouter();

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        setLoading(true);
        const response = await axios.get(&quot;/api/admin/purchases&quot;);
        setPurchases(response.data);
        
        // Extract user details from the enhanced purchases
        const userMap = {};
        response.data.forEach(purchase => {
          if (purchase.student) {
            userMap[purchase.studentId] = purchase.student;
          }
        });
        
        setUserDetails(userMap);
        
        // For any missing user details, fetch from Clerk
        const clerkUserIds = response.data
          .filter(p => !p.student || p.student.name === &quot;Unknown User&quot;)
          .map(p => p.studentId)
          .filter(id => id.startsWith(&quot;user_&quot;));
          
        if (clerkUserIds.length > 0) {
          fetchClerkUsers(clerkUserIds);
        }
      } catch (error) {
        console.error(&quot;Error fetching purchases:&quot;, error);
        toast.error(&quot;Failed to load payment records&quot;);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPurchases();
  }, []);
  
  const fetchClerkUsers = async (clerkUserIds) => {
    try {
      const response = await axios.post(&quot;/api/admin/clerk-users&quot;, { userIds: clerkUserIds });
      const newUserDetails = { ...userDetails };
      
      response.data.forEach(user => {
        newUserDetails[user.id] = {
          name: user.name,
          email: user.email,
          clerkUserId: user.id
        };
      });
      
      setUserDetails(newUserDetails);
    } catch (error) {
      console.error(&quot;Error fetching Clerk users:&quot;, error);
    }
  };

  if (loading) {
    return <div className=&quot;p-6&quot;>Loading payment records...</div>;
  }

  return (
    <div className=&quot;p-6&quot;>
      <h1 className=&quot;text-2xl font-bold mb-6&quot;>Payment Records</h1>
      
      <div className=&quot;overflow-x-auto&quot;>
        <table className=&quot;min-w-full bg-white border border-gray-200&quot;>
          <thead>
            <tr className=&quot;bg-gray-100&quot;>
              <th className=&quot;py-2 px-4 border-b text-left&quot;>Transaction ID</th>
              <th className=&quot;py-2 px-4 border-b text-left&quot;>Student Name</th>
              <th className=&quot;py-2 px-4 border-b text-left&quot;>Student Email</th>
              <th className=&quot;py-2 px-4 border-b text-left&quot;>Course</th>
              <th className=&quot;py-2 px-4 border-b text-left&quot;>Amount</th>
              <th className=&quot;py-2 px-4 border-b text-left&quot;>Date</th>
              <th className=&quot;py-2 px-4 border-b text-left&quot;>Status</th>
            </tr>
          </thead>
          <tbody>
            {purchases.map((purchase) => {
              // Look up user details
              const user = userDetails[purchase.studentId] || { 
                name: &quot;Unknown User&quot;, 
                email: &quot;Unknown Email&quot;
              };
              
              return (
                <tr key={purchase.id} className=&quot;hover:bg-gray-50&quot;>
                  <td className=&quot;py-2 px-4 border-b&quot;>{purchase.transactionId || &apos;N/A&apos;}</td>
                  <td className=&quot;py-2 px-4 border-b&quot;>
                    {user.name}
                    {user.name === &quot;Unknown User&quot; && (
                      <span className=&quot;text-xs text-gray-500 block&quot;>
                        ID: {purchase.studentId}
                      </span>
                    )}
                  </td>
                  <td className=&quot;py-2 px-4 border-b&quot;>{user.email}</td>
                  <td className=&quot;py-2 px-4 border-b&quot;>{purchase.liveClass?.title || &quot;Unknown Course&quot;}</td>
                  <td className=&quot;py-2 px-4 border-b&quot;>{formatCurrency(purchase.amount)}</td>
                  <td className=&quot;py-2 px-4 border-b&quot;>{formatDate(purchase.createdAt)}</td>
                  <td className=&quot;py-2 px-4 border-b&quot;>
                    <span className={`inline-block px-2 py-1 rounded text-xs ${
                      purchase.status === &apos;COMPLETED&apos; 
                        ? &apos;bg-green-100 text-green-800&apos; 
                        : purchase.status === &apos;PENDING&apos;
                        ? &apos;bg-yellow-100 text-yellow-800&apos;
                        : &apos;bg-red-100 text-red-800&apos;
                    }`}>
                      {purchase.status}
                    </span>
                  </td>
                </tr>
              );
            })}
            
            {purchases.length === 0 && (
              <tr>
                <td colSpan={7} className=&quot;py-4 text-center text-gray-500">
                  No purchase records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
} 