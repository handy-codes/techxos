"use client&quot;;

import { useState } from &quot;react&quot;;
import { toast } from &quot;react-hot-toast&quot;;
import axios from &quot;axios&quot;;
import { Button } from &quot;@/components/ui/button&quot;;
import { Input } from &quot;@/components/ui/input&quot;;
import { Label } from &quot;@/components/ui/label&quot;;
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from &quot;@/components/ui/select&quot;;
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from &quot;@/components/ui/card&quot;;

export default function FixUserPage() {
  const [email, setEmail] = useState(&quot;princeowo73@gmail.com&quot;);
  const [clerkUserId, setClerkUserId] = useState(&quot;user_2pJFEDGaiczCxjyKK5zRvlcjCko&quot;);
  const [role, setRole] = useState(&quot;ADMIN&quot;);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await axios.post(&quot;/api/admin/fix-user&quot;, {
        email,
        clerkUserId,
        role
      });

      setResult(response.data);
      toast.success(&quot;User updated successfully!&quot;);
    } catch (error: any) {
      console.error(&quot;Error fixing user:&quot;, error);
      toast.error(error.response?.data?.error || &quot;Failed to update user&quot;);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=&quot;container mx-auto p-8&quot;>
      <h1 className=&quot;text-2xl font-bold mb-6&quot;>Fix User Account</h1>
      
      <Card className=&quot;mb-6&quot;>
        <CardHeader>
          <CardTitle>Fix Prince Owo&apos;s Account</CardTitle>
          <CardDescription>
            Connect the correct Clerk ID to the database user record
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className=&quot;space-y-4&quot;>
            <div className=&quot;space-y-2&quot;>
              <Label htmlFor=&quot;email&quot;>Email</Label>
              <Input 
                id=&quot;email&quot; 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder=&quot;user@example.com&quot;
                required
              />
            </div>
            
            <div className=&quot;space-y-2&quot;>
              <Label htmlFor=&quot;clerkUserId&quot;>Clerk User ID</Label>
              <Input 
                id=&quot;clerkUserId&quot; 
                value={clerkUserId} 
                onChange={(e) => setClerkUserId(e.target.value)} 
                placeholder=&quot;user_...&quot;
                required
              />
            </div>
            
            <div className=&quot;space-y-2&quot;>
              <Label htmlFor=&quot;role&quot;>Role</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger>
                  <SelectValue placeholder=&quot;Select role&quot; />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value=&quot;LEARNER&quot;>LEARNER</SelectItem>
                  <SelectItem value=&quot;LECTURER&quot;>LECTURER</SelectItem>
                  <SelectItem value=&quot;ADMIN&quot;>ADMIN</SelectItem>
                  <SelectItem value=&quot;HEAD_ADMIN&quot;>HEAD_ADMIN</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button type=&quot;submit&quot; disabled={loading}>
              {loading ? &quot;Processing...&quot; : &quot;Fix User Account&quot;}
            </Button>
          </form>
        </CardContent>
      </Card>
      
      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Result</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className=&quot;bg-gray-100 p-4 rounded overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 