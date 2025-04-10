"use client&quot;;

import { Resource, Section } from &quot;@prisma/client&quot;;
import Link from &quot;next/link&quot;;
import { useRouter } from &quot;next/navigation&quot;;
import { z } from &quot;zod&quot;;
import { zodResolver } from &quot;@hookform/resolvers/zod&quot;;
import { useForm } from &quot;react-hook-form&quot;;
import toast from &quot;react-hot-toast&quot;;
import axios from &quot;axios&quot;;
import { File, Loader2, PlusCircle, X } from &quot;lucide-react&quot;;

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
import FileUpload from &quot;@/components/custom/FileUpload&quot;;

const formSchema = z.object({
  name: z.string().min(2, {
    message: &quot;Name is required and must be at least 2 characters long&quot;,
  }),
  fileUrl: z.string().min(1, {
    message: &quot;File is required&quot;,
  }),
});

interface ResourceFormProps {
  section: Section & { resources: Resource[] };
  courseId: string;
}

const ResourceForm = ({ section, courseId }: ResourceFormProps) => {
  const router = useRouter();

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: &quot;",
      fileUrl: &quot;&quot;,
    },
  });

  const { isValid, isSubmitting } = form.formState;

  // 2. Define a submit handler.
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(
        `/api/courses/${courseId}/sections/${section.id}/resources`,
        values
      );
      toast.success(&quot;New Resource uploaded!&quot;);
      form.reset();
      router.refresh();
    } catch (err) {
      toast.error(&quot;Something went wrong!&quot;);
      console.log(&quot;Failed to upload resource&quot;, err);
    }
  };

  const onDelete = async (id: string) => {
    try {
      await axios.post(
        `/api/courses/${courseId}/sections/${section.id}/resources/${id}`
      );
      toast.success(&quot;Resource deleted!&quot;);
      router.refresh();
    } catch (err) {
      toast.error(&quot;Something went wrong!&quot;);
      console.log(&quot;Failed to delete resource&quot;, err);
    }
  };

  return (
    <>
      <div className="flex gap-2 items-center text-xl font-bold mt-12&quot;>
        <PlusCircle />
        Add Resources (optional)
      </div>

      <p className=&quot;text-sm font-medium mt-2&quot;>
        Add resources to this section to help students learn better.
      </p>

      <div className=&quot;mt-5 flex flex-col gap-5&quot;>
        {section.resources.map((resource: Resource) => (
          <div key={resource.id} className=&quot;flex justify-between bg-[#FFF8EB] rounded-lg text-sm font-medium p-3&quot;>
            <div className=&quot;flex items-center&quot;>
              <File className=&quot;h-4 w-4 mr-4&quot; />
              {resource.name}
            </div>
            <button
              className=&quot;text-[#FDAB04]&quot;
              disabled={isSubmitting}
              onClick={() => onDelete(resource.id)}
            >
              {isSubmitting ? (
                <Loader2 className=&quot;h-4 w-4 animate-spin&quot; />
              ) : (
                <X className=&quot;h-4 w-4&quot; />
              )}
            </button>
          </div>
        ))}

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className=&quot;space-y-8 my-5&quot;
          >
            <FormField
              control={form.control}
              name=&quot;name&quot;
              render={({ field }) => (
                <FormItem>
                  <FormLabel>File Name</FormLabel>
                  <FormControl>
                    <Input placeholder=&quot;Ex: Textbook&quot; {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name=&quot;fileUrl&quot;
              render={({ field }) => (
                <FormItem className=&quot;flex flex-col&quot;>
                  <FormLabel>Upload File</FormLabel>
                  <FormControl>
                    <FileUpload
                      value={field.value || &quot;"}
                      onChange={(url: string) => field.onChange(url)}
                      endpoint=&quot;sectionResource&quot;
                      page=&quot;Edit Section&quot;
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type=&quot;submit&quot; disabled={!isValid || isSubmitting}>
              {isSubmitting ? (
                <Loader2 className=&quot;h-4 w-4 animate-spin&quot; />
              ) : (
                &quot;Upload&quot;
              )}
            </Button>
          </form>
        </Form>
      </div>
    </>
  );
};

export default ResourceForm;
