"use client";

import { useState, useEffect } from "react";
import { columns, PurchaseColumn } from "./columns";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, parseISO } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";

export default function PurchasesPage() {
  const [purchases, setPurchases] = useState<PurchaseColumn[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPurchases() {
      try {
        const response = await fetch("/api/admin/purchases");
        if (!response.ok) {
          throw new Error(`Failed to fetch purchases: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        setPurchases(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error("Error fetching purchases:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchPurchases();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Loading purchases...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  // Get the most recent purchase date
  const mostRecentPurchase = purchases.length > 0 
    ? purchases.reduce((latest, purchase) => {
        const purchaseDate = new Date(purchase.createdAt);
        const latestDate = new Date(latest.createdAt);
        return purchaseDate > latestDate ? purchase : latest;
      }, purchases[0])
    : null;

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Heading title="Purchases" description="Manage your course purchases" />
        <Separator />
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Purchases</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{purchases.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${purchases.reduce((total, purchase) => total + (purchase.amount || 0), 0).toFixed(2)}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Most Recent Purchase</CardTitle>
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {mostRecentPurchase ? (
                <div className="text-sm">
                  <div className="font-medium">{mostRecentPurchase.student?.name || "Unknown"}</div>
                  <div className="text-xs text-muted-foreground">
                    {format(parseISO(mostRecentPurchase.createdAt), "MMM dd, yyyy")}
                  </div>
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">No purchases yet</div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <DataTable<PurchaseColumn, any> columns={columns} data={purchases} searchKey="student.name" />
      </div>
    </div>
  );
} 