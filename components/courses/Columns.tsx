"use client&quot;;

import { Course } from &quot;@prisma/client&quot;;
import { ColumnDef } from &quot;@tanstack/react-table&quot;;
import { Pencil } from &quot;lucide-react&quot;;
import Link from &quot;next/link&quot;;
import { ArrowUpDown } from &quot;lucide-react&quot;;

import { Badge } from &quot;../ui/badge&quot;;
import { Button } from &quot;../ui/button&quot;;

export const columns: ColumnDef<Course>[] = [
  {
    accessorKey: &quot;title&quot;, // course.title
    header: ({ column }) => {
      return (
        <Button
          variant=&quot;ghost&quot;
          onClick={() => column.toggleSorting(column.getIsSorted() === &quot;asc&quot;)}
        >
          Title
          <ArrowUpDown className=&quot;ml-2 h-4 w-4&quot; />
        </Button>
      );
    },
  },
  {
    accessorKey: &quot;price&quot;,
    header: ({ column }) => {
      return (
        <Button
          variant=&quot;ghost&quot;
          onClick={() => column.toggleSorting(column.getIsSorted() === &quot;asc&quot;)}
        >
          Price
          <ArrowUpDown className=&quot;ml-2 h-4 w-4&quot; />
        </Button>
      );
    },
    cell: ({ row }) => {
      const price = parseFloat(row.getValue(&quot;price&quot;));
      const formatted = new Intl.NumberFormat(&quot;en-US&quot;, {
        style: &quot;currency&quot;,
        currency: &quot;NGN&quot;,
      }).format(price);

      return <div>{formatted}</div>;
    },
  },
  {
    accessorKey: &quot;isPublished&quot;,
    header: &quot;Status&quot;,
    cell: ({ row }) => {
      const isPublished = row.getValue(&quot;isPublished&quot;) || false;

      return (
        <Badge
          className={`${
            isPublished && &quot;bg-[#FDAB04] text-black hover:bg-[#FDAB04]&quot;
          }`}
        >
          {isPublished ? &quot;Published&quot; : &quot;Draft&quot;}
        </Badge>
      );
    },
  },
  {
    id: &quot;actions&quot;,
    cell: ({ row }) => (
      <Link
        href={`/instructor/courses/${row.original.id}/basic`}
        className=&quot;flex gap-2 items-center hover:text-[#FDAB04]&quot;
      >
        <Pencil className=&quot;h-4 w-4" /> Edit
      </Link>
    ),
  },
];
