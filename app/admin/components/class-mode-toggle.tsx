"use client";

import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from "@clerk/nextjs";

export function ClassModeToggle() {
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { isLoaded, userId } = useAuth();

  useEffect(() => {
    if (isLoaded) {
      fetchMode();
    }
  }, [isLoaded]);

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
      toast.error("Failed to fetch class mode");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = async () => {
    if (!isLoaded || !userId) {
      toast.error("You must be logged in to change the class mode");
      return;
    }

    setIsLoading(true);
    try {
      const newMode = isDemoMode ? "paid" : "demo";
      const response = await fetch("/api/maths-demo/mode", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mode: newMode }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update mode");
      }

      const data = await response.json();
      setIsDemoMode(data.mode === "demo");
      toast.success(`Class mode changed to ${data.mode}`);
    } catch (error) {
      console.error("Error updating mode:", error);
      toast.error(error instanceof Error ? error.message : "Failed to update class mode");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Switch
        id="demo-mode"
        checked={isDemoMode}
        onCheckedChange={handleToggle}
        disabled={isLoading}
      />
      <Label htmlFor="demo-mode">
        {isDemoMode ? "Demo Mode" : "Paid Mode"}
      </Label>
    </div>
  );
} 