"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { DataTable } from "@/components/ui/data-table";
import { columns, MathsDemoRegistration } from "./columns";
import AdminCheck from "@/components/admin/AdminCheck";
import ModeToggle from "./components/mode-toggle";
import axios from "axios";
import { toast } from "sonner";

export default function MathsDemoPage() {
  const { user, isLoaded } = useUser();
  const [registrations, setRegistrations] = useState<MathsDemoRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  // Fix hydration issues by ensuring components only render on client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/maths-demo");
        setRegistrations(response.data);
      } catch (error) {
        console.error("Error fetching registrations:", error);
        toast.error("Failed to fetch registrations");
      } finally {
        setLoading(false);
      }
    };

    if (isLoaded && user) {
      fetchRegistrations();
    }
  }, [isLoaded, user]);

  if (!isMounted) {
    return null;
  }

  if (!isLoaded) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <AdminCheck>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Maths Demo Registrations</h1>
          <ModeToggle />
        </div>
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">Loading registrations...</div>
          </div>
        ) : (
          <DataTable 
            columns={columns} 
            data={registrations} 
            searchKey="name" 
          />
        )}
      </div>
    </AdminCheck>
  );
} 