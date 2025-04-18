"use client";

import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";

export const ClassModeToggle = () => {
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { userId, isLoaded } = useAuth();

  const fetchMode = async () => {
    try {
      const response = await fetch("/api/maths-demo/mode");
      if (!response.ok) {
        throw new Error("Failed to fetch mode");
      }
      const data = await response.json();
      setIsDemoMode(data.mode === "demo");
    } catch (error) {
      console.error("Error fetching mode:", error);
      toast.error("Failed to load class mode");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isLoaded) {
      fetchMode();
    }
  }, [isLoaded]);

  const handleToggle = async () => {
    if (!isLoaded || !userId) {
      toast.error("Please sign in to change class mode");
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch("/api/maths-demo/mode", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mode: isDemoMode ? "paid" : "demo" }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "Failed to update mode");
      }

      const data = await response.json();
      setIsDemoMode(data.mode === "demo");
      toast.success(`Class mode changed to ${data.mode}`);
      router.refresh();
    } catch (error) {
      console.error("Error updating mode:", error);
      toast.error(error instanceof Error ? error.message : "Failed to update class mode");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="flex items-center space-x-2">Loading...</div>;
  }

  return (
    <div className="flex items-center space-x-4">
      <Label htmlFor="class-mode" className="text-sm font-medium">
        Paid
      </Label>
      <Switch
        id="class-mode"
        checked={isDemoMode}
        onCheckedChange={handleToggle}
        disabled={isLoading}
      />
      <Label htmlFor="class-mode" className="text-sm font-medium">
        Demo
      </Label>
    </div>
  );
}; 