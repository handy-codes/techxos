"use client&quot;;

import { Course, Section } from &quot;@prisma/client&quot;;
import Link from &quot;next/link&quot;;
import { usePathname, useRouter } from &quot;next/navigation&quot;;
import { z } from &quot;zod&quot;;
import { zodResolver } from &quot;@hookform/resolvers/zod&quot;;
import { useForm } from &quot;react-hook-form&quot;;

import { Button } from &quot;@/components/ui/button&quot;;
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from &quot;@/components/ui/form&quot;;
import { Input } from &quot;@/components/ui/input&quot;;
import toast from &quot;react-hot-toast&quot;;
import axios from &quot;axios&quot;;
import SectionList from &quot;@/components/sections/SectionList&quot;;
import { Loader2 } from &quot;lucide-react&quot;;

const formSchema = z.object({
  title: z.string().min(2, {
    message: &quot;Title is required and must be at least 2 characters long&quot;,
  }),
});

interface Route {
  label: string;
  path: string;
}

const CreateSectionForm = ({
  course,
}: {
  course: Course & { sections: Section[] };
}) => {
  const pathname = usePathname();
  const router = useRouter();

  const routes: Route[] = [
    {
      label: &quot;Basic Information&quot;,
      path: `/instructor/courses/${course.id}/basic`,
    },
    { label: &quot;Chapters&quot;, path: `/instructor/courses/${course.id}/sections` },
  ];

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: &quot;",
    },
  });

  const { isValid, isSubmitting } = form.formState;

  // 2. Define a submit handler.
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.post(
        `/api/courses/${course.id}/sections`,
        values
      );
      router.push(
        `/instructor/courses/${course.id}/sections/${response.data.id}`
      );
      toast.success(&quot;New Chapter created!&quot;);
    } catch (error: unknown) {
      console.error(&quot;Failed to create a new section:&quot;, error);
      toast.error(&quot;Something went wrong!&quot;);
    }
  };

  const onReorder = async (updateData: { id: string; position: number }[]) => {
    try {
      await axios.put(`/api/courses/${course.id}/sections/reorder`, {
        list: updateData,
      });
      toast.success(&quot;Chapters reordered successfully&quot;);
    } catch (error: unknown) {
      console.error(&quot;Failed to reorder sections:&quot;, error);
      toast.error(&quot;Something went wrong!&quot;);
    }
  };

  return (
    <div className="px-10 py-6&quot;>
      <div className=&quot;flex gap-5&quot;>
        {routes.map((route: Route) => (
          <Link key={route.path} href={route.path}>
            <Button variant={pathname === route.path ? &quot;default&quot; : &quot;outline&quot;}>
              {route.label}
            </Button>
          </Link>
        ))}
      </div>

      <SectionList
        items={course.sections || []}
        onReorder={onReorder}
        onEdit={(id) =>
          router.push(`/instructor/courses/${course.id}/sections/${id}`)
        }
      />

      <h1 className=&quot;text-xl font-bold mt-5&quot;>Add New Chapter</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className=&quot;space-y-8 mt-5&quot;>
          <FormField
            control={form.control}
            name=&quot;title&quot;
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder=&quot;Ex: Introduction&quot; {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className=&quot;flex gap-5&quot;>
            <Link href={`/instructor/courses/${course.id}/basic`}>
              <Button variant=&quot;outline&quot; type=&quot;button&quot;>
                Cancel
              </Button>
            </Link>
            <Button type=&quot;submit&quot; disabled={!isValid || isSubmitting}>
              {isSubmitting ? (
                <Loader2 className=&quot;h-4 w-4 animate-spin&quot; />
              ) : (
                &quot;Create"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CreateSectionForm;
