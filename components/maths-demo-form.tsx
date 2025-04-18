"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export const MathsDemoForm = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    class: "",
    topic: "",
    trainingDate: "19th April 5:00pm",
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
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/maths-demo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }

      toast.success("Free Demo Request Successful!");
      // Reload the page to update the UI and show the Join Live Class button
      window.location.reload();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to submit form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Register for Free Demo Class</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name*</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Enter your full name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="class">Class*</Label>
          <Input
            id="class"
            name="class"
            value={formData.class}
            onChange={handleChange}
            required
            placeholder="Enter your class (e.g., JSS1, JSS2)"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="topic">Topic</Label>
          <Input
            id="topic"
            name="topic"
            value={formData.topic}
            onChange={handleChange}
            placeholder="What topic would you like to learn? (optional)"
          />
        </div>

        <div className="space-y-2">
          <Label>Training Date*</Label>
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

        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </div>
  );
}; 