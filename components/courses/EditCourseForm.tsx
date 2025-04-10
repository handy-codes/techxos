"use client&quot;;

import { z } from &quot;zod&quot;;
import { zodResolver } from &quot;@hookform/resolvers/zod&quot;;
import { useForm } from &quot;react-hook-form&quot;;
import { Course } from &quot;@prisma/client&quot;;

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
import RichEditor from &quot;@/components/custom/RichEditor&quot;;
import { ComboBox } from &quot;../custom/ComboBox&quot;;
import FileUpload from &quot;../custom/FileUpload&quot;;
import Link from &quot;next/link&quot;;
import axios from &quot;axios&quot;;
import { usePathname, useRouter } from &quot;next/navigation&quot;;
import toast from &quot;react-hot-toast&quot;;
import { Loader2, Trash } from &quot;lucide-react&quot;;
import Delete from &quot;../custom/Delete&quot;;
import PublishButton from &quot;../custom/PublishButton&quot;;

const formSchema = z.object({
  title: z.string().min(2, {
    message: &quot;Title is required and must be at least 2 characters long&quot;,
  }),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  categoryId: z.string().min(1, {
    message: &quot;Category is required&quot;,
  }),
  subCategoryId: z.string().min(1, {
    message: &quot;Subcategory is required&quot;,
  }),
  levelId: z.string().optional(),
  imageUrl: z.string().optional(),
  price: z.coerce.number().optional(),
});

interface EditCourseFormProps {
  course: Course;
  categories: {
    label: string; // name of category
    value: string; // categoryId
    subCategories: { label: string; value: string }[];
  }[];
  levels: { label: string; value: string }[];
  isCompleted: boolean;
}

const EditCourseForm = ({
  course,
  categories,
  levels,
  isCompleted,
}: EditCourseFormProps) => {
  const router = useRouter();
  const pathname = usePathname();

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: course.title,
      subtitle: course.subtitle || &quot;",
      description: course.description || &quot;&quot;,
      categoryId: course.categoryId,
      subCategoryId: course.subCategoryId,
      levelId: course.levelId || &quot;&quot;,
      imageUrl: course.imageUrl || &quot;&quot;,
      price: course.price || undefined,
    },
  });

  const { isValid, isSubmitting } = form.formState;

  // 2. Define a submit handler.
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${course.id}`, values);
      toast.success(&quot;Course Updated&quot;);
      router.refresh();
    } catch (err) {
      console.log(&quot;Failed to update the course&quot;, err);
      toast.error(&quot;Something went wrong!&quot;);
    }
  };

  const routes = [
    {
      label: &quot;Basic Information&quot;,
      path: `/instructor/courses/${course.id}/basic`,
    },
    { label: &quot;Chapters&quot;, path: `/instructor/courses/${course.id}/sections` },
  ];

  return (
    <>
      <div className="flex flex-col gap-2 sm:flex-row sm:justify-between mb-7&quot;>
        <div className=&quot;flex gap-5&quot;>
          {routes.map((route) => (
            <Link key={route.path} href={route.path}>
              <Button variant={pathname === route.path ? &quot;default&quot; : &quot;outline&quot;}>
                {route.label}
              </Button>
            </Link>
          ))}
        </div>

        <div className=&quot;flex gap-5 items-start&quot;>
          <PublishButton
            disabled={!isCompleted}
            courseId={course.id}
            isPublished={course.isPublished}
            page=&quot;Course&quot;
          />
          <Delete item=&quot;course&quot; courseId={course.id} />
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className=&quot;space-y-8&quot;>
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
                    placeholder=&quot;Ex: Web Development for Beginners&quot;
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name=&quot;subtitle&quot;
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subtitle</FormLabel>
                <FormControl>
                  <Input
                    placeholder=&quot;Ex: Become a Full-stack Developer with just ONE course. HTML, CSS, Javascript, Node, React, MongoDB and more!&quot;
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
                    placeholder=&quot;What is this course about?&quot;
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className=&quot;flex flex-wrap gap-10&quot;>
            <FormField
              control={form.control}
              name=&quot;categoryId&quot;
              render={({ field }) => (
                <FormItem className=&quot;flex flex-col&quot;>
                  <FormLabel>
                    Category <span className=&quot;text-red-500&quot;>*</span>
                  </FormLabel>
                  <FormControl>
                    <ComboBox options={categories} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name=&quot;subCategoryId&quot;
              render={({ field }) => (
                <FormItem className=&quot;flex flex-col&quot;>
                  <FormLabel>
                    Subcategory <span className=&quot;text-red-500&quot;>*</span>
                  </FormLabel>
                  <FormControl>
                    <ComboBox
                      options={
                        categories.find(
                          (category) =>
                            category.value === form.watch(&quot;categoryId&quot;)
                        )?.subCategories || []
                      }
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name=&quot;levelId&quot;
              render={({ field }) => (
                <FormItem className=&quot;flex flex-col&quot;>
                  <FormLabel>
                    Level <span className=&quot;text-red-500&quot;>*</span>
                  </FormLabel>
                  <FormControl>
                    <ComboBox options={levels} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name=&quot;imageUrl&quot;
            render={({ field }) => (
              <FormItem className=&quot;flex flex-col&quot;>
                <FormLabel>
                  Course Banner <span className=&quot;text-red-500&quot;>*</span>
                </FormLabel>
                <FormControl>
                  <FileUpload
                    value={field.value || &quot;"}
                    onChange={(url) => field.onChange(url)}
                    endpoint=&quot;courseBanner&quot;
                    page=&quot;Edit Course&quot;
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name=&quot;price&quot;
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Price <span className="text-red-500&quot;>*</span> (NGN)
                </FormLabel>
                <FormControl>
                  <Input
                    type=&quot;number&quot;
                    step=&quot;0.01&quot;
                    placeholder=&quot;5,000&quot;
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className=&quot;flex gap-5&quot;>
            <Link href=&quot;/instructor/courses&quot;>
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
    </>
  );
};

export default EditCourseForm; 