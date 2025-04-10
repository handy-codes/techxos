"use client&quot;;

import { useState } from &quot;react&quot;;
import { useRouter } from &quot;next/navigation&quot;;
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from &quot;@/components/ui/select&quot;;
import { toast } from &quot;react-hot-toast&quot;;
import axios from &quot;axios&quot;;
import { zodResolver } from &quot;@hookform/resolvers/zod&quot;;
import { useForm } from &quot;react-hook-form&quot;;
import * as z from &quot;zod&quot;;
import { ArrowLeft } from &quot;lucide-react&quot;;

const formSchema = z.object({
  name: z.string().min(2, &quot;Name must be at least 2 characters&quot;),
  email: z.string().email(&quot;Invalid email address&quot;),
  role: z.enum([&quot;ADMIN&quot;, &quot;LECTURER&quot;], {
    required_error: &quot;Please select a role&quot;,
  }),
});

export default function NewUserPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: &quot;",
      email: &quot;&quot;,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      await axios.post(&quot;/api/admin/users&quot;, values);
      toast.success(&quot;User created successfully&quot;);
      router.push(&quot;/admin/users&quot;);
      router.refresh();
    } catch (error) {
      toast.error(&quot;Something went wrong&quot;);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6&quot;>
      <div className=&quot;flex items-center gap-4 mb-6&quot;>
        <Button
          variant=&quot;ghost&quot;
          size=&quot;sm&quot;
          onClick={() => router.push(&quot;/admin/users&quot;)}
        >
          <ArrowLeft className=&quot;w-4 h-4 mr-2&quot; />
          Back to Users
        </Button>
        <h1 className=&quot;text-2xl font-bold&quot;>Add New User</h1>
      </div>

      <div className=&quot;max-w-2xl&quot;>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className=&quot;space-y-6&quot;>
            <FormField
              control={form.control}
              name=&quot;name&quot;
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder=&quot;Enter user&apos;s name&quot; {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name=&quot;email&quot;
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder=&quot;Enter user&apos;s email&quot; {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name=&quot;role&quot;
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder=&quot;Select a role&quot; />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value=&quot;ADMIN&quot;>Admin</SelectItem>
                      <SelectItem value=&quot;LECTURER&quot;>Lecturer</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className=&quot;flex gap-4&quot;>
              <Button type=&quot;submit&quot; disabled={loading}>
                {loading ? &quot;Creating...&quot; : &quot;Create User&quot;}
              </Button>
              <Button
                type=&quot;button&quot;
                variant=&quot;outline&quot;
                onClick={() => router.push(&quot;/admin/users")}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
} 