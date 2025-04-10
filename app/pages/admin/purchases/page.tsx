"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";
import { formatDate, formatCurrency } from "@/lib/format-date";

export default function AdminPurchasesPage() {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userDetails, setUserDetails] = useState({});
  const router = useRouter();

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/admin/purchases");
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
          .filter(p => !p.student || p.student.name === "Unknown User")
          .map(p => p.studentId)
          .filter(id => id.startsWith("user_"));
          
        if (clerkUserIds.length > 0) {
          fetchClerkUsers(clerkUserIds);
        }
      } catch (error) {
        console.error("Error fetching purchases:", error);
        toast.error("Failed to load payment records");
      } finally {
        setLoading(false);
      }
    };
    
    fetchPurchases();
  }, []);
  
  const fetchClerkUsers = async (clerkUserIds) => {
    try {
      const response = await axios.post("/api/admin/clerk-users", { userIds: clerkUserIds });
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
      console.error("Error fetching Clerk users:", error);
    }
  };

  if (loading) {
    return <div className="p-6">Loading payment records...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Payment Records</h1>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b text-left">Transaction ID</th>
              <th className="py-2 px-4 border-b text-left">Student Name</th>
              <th className="py-2 px-4 border-b text-left">Student Email</th>
              <th className="py-2 px-4 border-b text-left">Course</th>
              <th className="py-2 px-4 border-b text-left">Amount</th>
              <th className="py-2 px-4 border-b text-left">Date</th>
              <th className="py-2 px-4 border-b text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {purchases.map((purchase) => {
              // Look up user details
              const user = userDetails[purchase.studentId] || { 
                name: "Unknown User", 
                email: "Unknown Email"
              };
              
              return (
                <tr key={purchase.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{purchase.transactionId || 'N/A'}</td>
                  <td className="py-2 px-4 border-b">
                    {user.name}
                    {user.name === "Unknown User" && (
                      <span className="text-xs text-gray-500 block">
                        ID: {purchase.studentId}
                      </span>
                    )}
                  </td>
                  <td className="py-2 px-4 border-b">{user.email}</td>
                  <td className="py-2 px-4 border-b">{purchase.liveClass?.title || "Unknown Course"}</td>
                  <td className="py-2 px-4 border-b">{formatCurrency(purchase.amount)}</td>
                  <td className="py-2 px-4 border-b">{formatDate(purchase.createdAt)}</td>
                  <td className="py-2 px-4 border-b">
                    <span className={`inline-block px-2 py-1 rounded text-xs ${
                      purchase.status === 'COMPLETED' 
                        ? 'bg-green-100 text-green-800' 
                        : purchase.status === 'PENDING'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {purchase.status}
                    </span>
                  </td>
                </tr>
              );
            })}
            
            {purchases.length === 0 && (
              <tr>
                <td colSpan={7} className="py-4 text-center text-gray-500">
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