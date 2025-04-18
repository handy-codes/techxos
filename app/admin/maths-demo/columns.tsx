"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { EditDemoDialog } from "./components/edit-demo-dialog";
import { toast } from "react-hot-toast";

export type MathsDemoRegistration = {
  id: string;
  userId: string;
  name: string;
  class: string;
  topic: string | null;
  trainingDate: string;
  whatsappGroup: boolean;
  createdAt: Date;
  userEmail?: string | null;
  userFirstName?: string | null;
  userLastName?: string | null;
  status?: string;
  updatedAt?: Date;
};

export const columns: ColumnDef<MathsDemoRegistration>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "userEmail",
    header: "Email",
  },
  {
    accessorKey: "class",
    header: "Class",
  },
  {
    accessorKey: "topic",
    header: "Topic",
    cell: ({ row }) => {
      const topic = row.getValue("topic") as string;
      return topic || "Not specified";
    },
  },
  {
    accessorKey: "trainingDate",
    header: "Training Date",
  },
  {
    accessorKey: "whatsappGroup",
    header: "WhatsApp Group",
    cell: ({ row }) => {
      const isInGroup = row.getValue("whatsappGroup") as boolean;
      return (
        <Badge variant={isInGroup ? "default" : "secondary"}>
          {isInGroup ? "Yes" : "No"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Registered On",
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as Date;
      return format(new Date(date), "PPP");
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const registration = row.original;
      const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

      const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this registration?")) {
          return;
        }

        try {
          const response = await fetch(`/api/maths-demo/${registration.id}`, {
            method: "DELETE",
          });

          if (!response.ok) {
            throw new Error("Failed to delete registration");
          }

          toast.success("Registration deleted successfully");
          window.location.reload();
        } catch (error) {
          console.error("Error deleting registration:", error);
          toast.error("Failed to delete registration");
        }
      };

      return (
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDelete} className="text-red-600">
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <EditDemoDialog
            registration={registration}
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
          />
        </div>
      );
    },
  },
]; 