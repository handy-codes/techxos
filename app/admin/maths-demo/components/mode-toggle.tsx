"use client";

import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";

export default function ModeToggle() {
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { isLoaded } = useAuth();

  const fetchMode = async () => {
    try {
      const response = await fetch("/api/maths-demo/mode");
      if (!response.ok) throw new Error("Failed to fetch mode");
      const data = await response.json();
      setIsDemoMode(data.mode === "demo");
    } catch (error) {
      console.error("Error fetching mode:", error);
      toast.error("Failed to fetch class mode");
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
    if (!isLoaded) {
      toast.error("Authentication not ready");
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

      if (!response.ok) throw new Error("Failed to update mode");
      
      const data = await response.json();
      setIsDemoMode(data.mode === "demo");
      toast.success(`Mode changed to ${data.mode}`);
      router.refresh();
    } catch (error) {
      console.error("Error updating mode:", error);
      toast.error("Failed to update class mode");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || !isLoaded) {
    return <div className="text-sm text-muted-foreground">Loading mode...</div>;
  }

  return (
    <div className="flex items-center space-x-2">
      <Label htmlFor="mode-toggle" className="text-sm font-medium">
        Paid
      </Label>
      <Switch
        id="mode-toggle"
        checked={isDemoMode}
        onCheckedChange={handleToggle}
        disabled={isLoading}
      />
      <Label htmlFor="mode-toggle" className="text-sm font-medium">
        Demo
      </Label>
    </div>
  );
} 