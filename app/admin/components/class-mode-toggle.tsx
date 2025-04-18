"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";

export const ClassModeToggle = () => {
  const { user, isLoaded } = useUser();
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchMode = async () => {
      try {
        const response = await fetch("/api/maths-demo/mode");
        if (response.ok) {
          const data = await response.json();
          setIsDemoMode(data.mode === "demo");
        }
      } catch (error) {
        console.error("Error fetching class mode:", error);
      }
    };

    fetchMode();
  }, []);

  const handleToggle = async () => {
    if (!isLoaded) {
      toast.error("You must be logged in to change the class mode");
      return;
    }

    if (!user) {
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
        const error = await response.text();
        throw new Error(error);
      }

      setIsDemoMode(!isDemoMode);
      toast.success(`Class mode changed to ${newMode} mode`);
    } catch (error) {
      console.error("Error updating class mode:", error);
      toast.error("Failed to update class mode. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Switch
        id="class-mode"
        checked={isDemoMode}
        onCheckedChange={handleToggle}
        disabled={isLoading}
      />
      <Label htmlFor="class-mode">
        {isDemoMode ? "Demo Mode" : "Paid Mode"}
      </Label>
    </div>
  );
}; 