"use client";

import { useState } from "react";
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
    trainingDate: registration.trainingDate,
    whatsappGroup: registration.whatsappGroup,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRadioChange = (value: string) => {
    setFormData((prev) => ({ ...prev, trainingDate: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`/api/maths-demo/${registration.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
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
            <Label>Training Date</Label>
            <RadioGroup
              value={formData.trainingDate}
              onValueChange={handleRadioChange}
              className="flex flex-col space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="19th April 5:00pm" id="date1" />
                <Label htmlFor="date1">19th April 5:00pm</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="20th April 5:00pm" id="date2" />
                <Label htmlFor="date2">20th April 5:00pm</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Both" id="date3" />
                <Label htmlFor="date3">Both</Label>
              </div>
            </RadioGroup>
          </div>

          <DialogFooter>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 