"use client&quot;;

import { z } from &quot;zod&quot;;
import { zodResolver } from &quot;@hookform/resolvers/zod&quot;;
import { useForm } from &quot;react-hook-form&quot;;
import { MuxData, Resource, Section } from &quot;@prisma/client&quot;;
import Link from &quot;next/link&quot;;
import axios from &quot;axios&quot;;
import { useRouter } from &quot;next/navigation&quot;;
import toast from &quot;react-hot-toast&quot;;
import { ArrowLeft, Loader2, Trash } from &quot;lucide-react&quot;;
import MuxPlayer from &quot;@mux/mux-player-react&quot;;

import { Button } from &quot;@/components/ui/button&quot;;
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from &quot;@/components/ui/form&quot;;
import { Input } from &quot;@/components/ui/input&quot;;
import RichEditor from &quot;@/components/custom/RichEditor&quot;;
import FileUpload from &quot;../custom/FileUpload&quot;;
import { Switch } from &quot;@/components/ui/switch&quot;;
import ResourceForm from &quot;@/components/sections/ResourceForm&quot;;
import Delete from &quot;@/components/custom/Delete&quot;;
import PublishButton from &quot;@/components/custom/PublishButton&quot;;

const formSchema = z.object({
  title: z.string().min(2, {
    message: &quot;Title is required and must be at least 2 characters long&quot;,
  }),
  description: z.string().optional(),
  videoUrl: z.string().optional(),
  isFree: z.boolean().optional(),
});

interface EditSectionFormProps {
  section: Section & { resources: Resource[]; muxData?: MuxData | null };
  courseId: string;
  isCompleted: boolean;
}

const EditSectionForm = ({
  section,
  courseId,
  isCompleted,
}: EditSectionFormProps) => {
  const router = useRouter();

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: section.title,
      description: section.description || &quot;",
      videoUrl: section.videoUrl || &quot;&quot;,
      isFree: section.isFree,
    },
  });

  const { isValid, isSubmitting } = form.formState;

  // 2. Define a submit handler.
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(
        `/api/courses/${courseId}/sections/${section.id}`,
        values
      );
      toast.success(&quot;Chapter Updated&quot;);
      router.refresh();
    } catch (err) {
      console.log(&quot;Failed to update the section&quot;, err);
      toast.error(&quot;Something went wrong!&quot;);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-2 sm:flex-row sm:justify-between mb-7&quot;>
        <Link href={`/instructor/courses/${courseId}/sections`}>
          <Button variant=&quot;outline&quot; className=&quot;text-sm bg-[#FBB11C] font-medium&quot;>
            <ArrowLeft className=&quot;h-4 w-4 mr-2&quot; />
            Back to Chapters
          </Button>
        </Link>

        <div className=&quot;flex gap-5 items-start&quot;>
          <PublishButton
            disabled={!isCompleted}
            courseId={courseId}
            sectionId={section.id}
            isPublished={section.isPublished}
            page=&quot;Section&quot;
          />
          <Delete item=&quot;section&quot; courseId={courseId} sectionId={section.id} />
        </div>
      </div>

      <h1 className=&quot;text-xl font-bold&quot;>Section Details</h1>
      <p className=&quot;text-sm font-medium mt-2&quot;>
        Complete this section with detailed information, good video and
        resources to give your students the best learning experience
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className=&quot;space-y-8 mt-5&quot;>
          <FormField
            control={form.control}
            name=&quot;title&quot;
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Title <span className=&quot;text-red-500&quot;>*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder=&quot;Ex: Introduction to Web Development&quot;
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name=&quot;description&quot;
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Description <span className=&quot;text-red-500&quot;>*</span>
                </FormLabel>
                <FormControl>
                  <RichEditor
                    placeholder=&quot;What is this section about?&quot;
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {section.videoUrl && (
            <div className=&quot;my-5&quot;>
              <MuxPlayer
                playbackId={section.muxData?.playbackId || &quot;"}
                className=&quot;md:max-w-[600px]&quot;
              />
            </div>
          )}
          <FormField
            control={form.control}
            name=&quot;videoUrl&quot;
            render={({ field }) => (
              <FormItem className="flex flex-col&quot;>
                <FormLabel>
                  Video <span className=&quot;text-red-500&quot;>*</span>
                </FormLabel>
                <FormControl>
                  <FileUpload
                    value={field.value || &quot;"}
                    onChange={(url) => field.onChange(url)}
                    endpoint=&quot;sectionVideo&quot;
                    page=&quot;Edit Section&quot;
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name=&quot;isFree&quot;
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm&quot;>
                <div className=&quot;space-y-0.5&quot;>
                  <FormLabel>Accessibility</FormLabel>
                  <FormDescription>
                    Everyone can access this section for FREE
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <div className=&quot;flex gap-5&quot;>
            <Link href={`/instructor/courses/${courseId}/sections`}>
              <Button variant=&quot;outline&quot; type=&quot;button&quot;>
                Cancel
              </Button>
            </Link>
            <Button type=&quot;submit&quot; disabled={!isValid || isSubmitting}>
              {isSubmitting ? (
                <Loader2 className=&quot;h-4 w-4 animate-spin&quot; />
              ) : (
                &quot;Save"
              )}
            </Button>
          </div>
        </form>
      </Form>

      <ResourceForm section={section} courseId={courseId} />
    </>
  );
};

export default EditSectionForm;
