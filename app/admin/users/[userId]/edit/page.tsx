"use client&quot;;

import { useState, useEffect } from &quot;react&quot;;
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
import { ArrowLeft, Loader2 } from &quot;lucide-react&quot;;
import { useUser } from &quot;@clerk/nextjs&quot;;

const formSchema = z.object({
  name: z.string().min(2, &quot;Name must be at least 2 characters&quot;),
  email: z.string().email(&quot;Invalid email address&quot;),
  role: z.enum([&quot;ADMIN&quot;, &quot;LECTURER&quot;], {
    required_error: &quot;Please select a role&quot;,
  }),
  isActive: z.boolean(),
});

interface User {
  id: string;
  email: string;
  name: string;
  role: &quot;HEAD_ADMIN&quot; | &quot;ADMIN&quot; | &quot;LECTURER&quot;;
  isActive: boolean;
}

export default function EditUserPage({ params }: { params: { userId: string } }) {
  const router = useRouter();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: &quot;",
      email: &quot;&quot;,
      isActive: true,
    },
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`/api/admin/users/${params.userId}`);
        setUserData(response.data);
        form.reset({
          name: response.data.name,
          email: response.data.email,
          role: response.data.role,
          isActive: response.data.isActive,
        });
      } catch (error) {
        toast.error(&quot;Failed to fetch user data&quot;);
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [params.userId, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      await axios.patch(`/api/admin/users/${params.userId}`, values);
      toast.success(&quot;User updated successfully&quot;);
      router.push(&quot;/admin/users&quot;);
      router.refresh();
    } catch (error) {
      toast.error(&quot;Failed to update user&quot;);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen&quot;>
        <Loader2 className=&quot;w-8 h-8 animate-spin&quot; />
      </div>
    );
  }

  if (!userData) {
    return <div>User not found</div>;
  }

  // Prevent editing HEAD_ADMIN users
  if (userData.role === &quot;HEAD_ADMIN&quot;) {
    return (
      <div className=&quot;p-6&quot;>
        <div className=&quot;flex items-center gap-4 mb-6&quot;>
          <Button
            variant=&quot;ghost&quot;
            size=&quot;sm&quot;
            onClick={() => router.push(&quot;/admin/users&quot;)}
          >
            <ArrowLeft className=&quot;w-4 h-4 mr-2&quot; />
            Back to Users
          </Button>
        </div>
        <div className=&quot;text-red-500&quot;>
          Head Admin users cannot be edited.
        </div>
      </div>
    );
  }

  return (
    <div className=&quot;p-6&quot;>
      <div className=&quot;flex items-center gap-4 mb-6&quot;>
        <Button
          variant=&quot;ghost&quot;
          size=&quot;sm&quot;
          onClick={() => router.push(&quot;/admin/users&quot;)}
        >
          <ArrowLeft className=&quot;w-4 h-4 mr-2&quot; />
          Back to Users
        </Button>
        <h1 className=&quot;text-2xl font-bold&quot;>Edit User</h1>
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

            <FormField
              control={form.control}
              name=&quot;isActive&quot;
              render={({ field }) => (
                <FormItem className=&quot;flex items-center gap-2&quot;>
                  <FormLabel>Active Status</FormLabel>
                  <FormControl>
                    <input
                      type=&quot;checkbox&quot;
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                      className=&quot;h-4 w-4 rounded border-gray-300&quot;
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className=&quot;flex gap-4&quot;>
              <Button type=&quot;submit&quot; disabled={loading}>
                {loading ? &quot;Updating...&quot; : &quot;Update User&quot;}
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