"use client&quot;;

import { z } from &quot;zod&quot;;
import { zodResolver } from &quot;@hookform/resolvers/zod&quot;;
import { useForm } from &quot;react-hook-form&quot;;
import axios from &quot;axios&quot;;

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
import { ComboBox } from &quot;@/components/custom/ComboBox&quot;;
import { useRouter } from &quot;next/navigation&quot;;
import toast from &quot;react-hot-toast&quot;;
import { Loader2 } from &quot;lucide-react&quot;;

const formSchema = z.object({
  title: z.string().min(2, {
    message: &quot;Title is required and minimum 2 characters&quot;,
  }),
  categoryId: z.string().min(1, {
    message: &quot;Category is required&quot;,
  }),
  subCategoryId: z.string().min(1, {
    message: &quot;Subcategory is required&quot;,
  }),
});

interface CreateCourseFormProps {
  categories: {
    label: string; // name of category
    value: string; // categoryId
    subCategories: { label: string; value: string }[];
  }[];
}

const CreateCourseForm = ({ categories }: CreateCourseFormProps) => {
  const router = useRouter();

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: &quot;",
      categoryId: &quot;&quot;,
      subCategoryId: &quot;&quot;,
    },
  });

  const { isValid, isSubmitting } = form.formState;

  // 2. Define a submit handler.
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.post(&quot;/api/courses&quot;, values);
      router.push(`/instructor/courses/${response.data.id}/basic`);
      toast.success(&quot;New Course Created&quot;);
    } catch (err) {
      console.log(&quot;Failed to create new course&quot;, err);
      toast.error(&quot;Something went wrong!&quot;);
    }
  };

  return (
    <div className="p-10 -mt-[-12%]&quot;>
      <h1 className=&quot;text-xl font-bold&quot;>
        Let give some basics for your course
      </h1>
      <p className=&quot;text-sm mt-3&quot;>
        It is ok if you cannot think of a good title or correct category now.
        You can change them later.
      </p>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className=&quot;space-y-8 mt-10&quot;
        >
          <FormField
            control={form.control}
            name=&quot;title&quot;
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
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
            name=&quot;categoryId&quot;
            render={({ field }) => (
              <FormItem className=&quot;flex flex-col&quot;>
                <FormLabel>Category</FormLabel>
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
                <FormLabel>Subcategory</FormLabel>
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

          <Button type=&quot;submit&quot; disabled={!isValid || isSubmitting}>
            {isSubmitting ? (
              <Loader2 className=&quot;h-4 w-4 animate-spin&quot; />
            ) : (
              &quot;Create"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CreateCourseForm;
