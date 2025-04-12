"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { toast } from "react-hot-toast";
import { LiveClassPurchase } from "@prisma/client";

// Define the purchase type
type Purchase = LiveClassPurchase & {
  courseName?: string;
  studentName?: string;
  studentEmail?: string;
};

// Define form data type
type FormData = {
  status: string;
  transactionId: string;
  txRef: string;
};

export default function UpdatePaymentPage() {
  const { isSignedIn, userId } = useAuth();
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null);
  const [formData, setFormData] = useState<FormData>({
    status: "COMPLETED",
    transactionId: "",
    txRef: ""
  });

  useEffect(() => {
    if (isSignedIn) {
      fetchPurchases();
    }
  }, [isSignedIn]);

  const fetchPurchases = async () => {
    try {
      const response = await fetch("/api/admin/purchases");
      if (response.ok) {
        const data = await response.json();
        setPurchases(data.purchases);
      } else {
        toast.error("Failed to fetch purchases");
      }
    } catch (error) {
      console.error("Error fetching purchases:", error);
      toast.error("Error fetching purchases");
    } finally {
      setLoading(false);
    }
  };

  const handlePurchaseSelect = (purchase: Purchase) => {
    setSelectedPurchase(purchase);
    setFormData({
      status: purchase.status || "COMPLETED",
      transactionId: purchase.transactionId || "",
      txRef: purchase.txRef || ""
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedPurchase) return;

    try {
      const response = await fetch("/api/admin/update-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          purchaseId: selectedPurchase.id,
          ...formData
        })
      });

      if (response.ok) {
        toast.success("Payment details updated successfully");
        fetchPurchases(); // Refresh the list
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to update payment");
      }
    } catch (error) {
      console.error("Error updating payment:", error);
      toast.error("Error updating payment");
    }
  };

  if (!isSignedIn) {
    return <div className="p-8 text-center">Please sign in to access this page.</div>;
  }

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Update Payment Details</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Select a Purchase</h2>
          <div className="border rounded-lg overflow-hidden">
            {purchases.length === 0 ? (
              <div className="p-4 text-center text-gray-500">No purchases found</div>
            ) : (
              <ul className="divide-y">
                {purchases.map(purchase => (
                  <li 
                    key={purchase.id}
                    className={`p-4 cursor-pointer hover:bg-gray-50 ${selectedPurchase?.id === purchase.id ? 'bg-blue-50' : ''}`}
                    onClick={() => handlePurchaseSelect(purchase)}
                  >
                    <div className="font-medium">{purchase.courseName}</div>
                    <div className="text-sm text-gray-500">
                      Student: {purchase.studentName} ({purchase.studentEmail})
                    </div>
                    <div className="text-sm">
                      Status: <span className={`font-medium ${purchase.status === 'COMPLETED' ? 'text-green-600' : 'text-yellow-600'}`}>{purchase.status}</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      Amount: {purchase.amount.toLocaleString()} NGN
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">Update Payment</h2>
          {selectedPurchase ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="PENDING">Pending</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="FAILED">Failed</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Transaction ID</label>
                <input
                  type="text"
                  name="transactionId"
                  value={formData.transactionId}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Transaction Reference</label>
                <input
                  type="text"
                  name="txRef"
                  value={formData.txRef}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
              >
                Update Payment
              </button>
            </form>
          ) : (
            <div className="text-center text-gray-500 p-4 border rounded">
              Select a purchase to update
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 