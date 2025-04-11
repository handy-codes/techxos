"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from "date-fns";
import { CalendarIcon } from "lucide-react";

export type PurchaseColumn = {
  id: string;
  studentId: string;
  liveClassId: string;
  amount: number;
  status: string;
  createdAt: string;
  student: {
    name: string;
    email: string;
  };
  liveClass: {
    title: string;
  };
};

export const columns: ColumnDef<PurchaseColumn>[] = [
  {
    accessorKey: "student.name",
    header: "Student",
  },
  {
    accessorKey: "student.email",
    header: "Email",
  },
  {
    accessorKey: "liveClass.title",
    header: "Course",
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);
      return <div>{formatted}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge variant={status === "completed" ? "default" : "destructive"}>
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Purchase Date",
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as string;
      const parsedDate = parseISO(date);
      return (
        <div className="flex items-center">
          <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
          <div>
            <div className="font-medium">{format(parsedDate, "MMM dd, yyyy")}</div>
            <div className="text-xs text-muted-foreground">{format(parsedDate, "h:mm a")}</div>
          </div>
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
]; 