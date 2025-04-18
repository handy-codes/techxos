"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "react-hot-toast";
import { MathsDemoRegistration } from "../columns";

interface EditDemoDialogProps {
  registration: MathsDemoRegistration;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditDemoDialog({
  registration,
  open,
  onOpenChange,
}: EditDemoDialogProps) {
  const [formData, setFormData] = useState({
    name: registration.name,
    class: registration.class,
    topic: registration.topic || "",
    trainingDate: registration.trainingDate ? new Date(registration.trainingDate).toISOString().split('T')[0] : "",
    whatsappGroup: registration.whatsappGroup,
  });

  // Convert the DateTime to a string format for the form
  useEffect(() => {
    if (registration.trainingDate) {
      const date = new Date(registration.trainingDate);
      
      // Check if the date matches one of our predefined dates
      const isApril19 = date.getMonth() === 3 && date.getDate() === 19 && date.getHours() === 17;
      const isApril20 = date.getMonth() === 3 && date.getDate() === 20 && date.getHours() === 17;
      
      if (isApril19) {
        setFormData(prev => ({ ...prev, trainingDate: "19th April 5:00pm" }));
      } else if (isApril20) {
        setFormData(prev => ({ ...prev, trainingDate: "20th April 5:00pm" }));
      } else {
        // Default to the first date if it doesn't match
        setFormData(prev => ({ ...prev, trainingDate: "19th April 5:00pm" }));
      }
    }
  }, [registration.trainingDate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`/api/maths-demo/${registration.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          trainingDate: new Date(formData.trainingDate).toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update registration");
      }

      toast.success("Registration updated successfully");
      onOpenChange(false);
      window.location.reload();
    } catch (error) {
      console.error("Error updating registration:", error);
      toast.error("Failed to update registration");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Demo Registration</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="class">Class</Label>
            <Input
              id="class"
              name="class"
              value={formData.class}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="topic">Topic</Label>
            <Input
              id="topic"
              name="topic"
              value={formData.topic}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="trainingDate">Training Date</Label>
            <Input
              id="trainingDate"
              name="trainingDate"
              type="date"
              value={formData.trainingDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="whatsappGroup"
              name="whatsappGroup"
              checked={formData.whatsappGroup}
              onChange={handleChange}
              className="h-4 w-4 rounded border-gray-300"
            />
            <Label htmlFor="whatsappGroup">Added to WhatsApp Group</Label>
          </div>

          <DialogFooter>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 