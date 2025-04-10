"use client&quot;;

import { useState } from &quot;react&quot;;
import { toast } from &quot;react-hot-toast&quot;;
import axios from &quot;axios&quot;;
import { Button } from &quot;@/components/ui/button&quot;;
import { Input } from &quot;@/components/ui/input&quot;;
import { Label } from &quot;@/components/ui/label&quot;;
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from &quot;@/components/ui/select&quot;;
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from &quot;@/components/ui/card&quot;;
import { Loader2 } from &quot;lucide-react&quot;;

export default function AddRolePage() {
  const [email, setEmail] = useState(&quot;");
  const [name, setName] = useState(&quot;&quot;);
  const [role, setRole] = useState(&quot;ADMIN&quot;);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const response = await axios.post(&quot;/api/admin/create-role&quot;, {
        email,
        name,
        role
      });

      setResult(response.data);
      toast.success(response.data.message || &quot;User role set successfully!&quot;);
      
      // Clear form
      setEmail(&quot;&quot;);
      setName(&quot;&quot;);
    } catch (error: any) {
      console.error(&quot;Error setting user role:&quot;, error);
      setError(error.response?.data?.error || &quot;Failed to set user role&quot;);
      toast.error(error.response?.data?.error || &quot;Failed to set user role&quot;);
    } finally {
      setLoading(false);
    }
  };

  // Quick access buttons
  const quickSetup = [
    { email: &quot;emekaowo@yahoo.com&quot;, name: &quot;Emeka Owo&quot;, role: &quot;ADMIN&quot; },
    { email: &quot;careers@techxos.com&quot;, name: &quot;Techxos Lecturer&quot;, role: &quot;LECTURER&quot; }
  ];

  const handleQuickSetup = (preset: { email: string, name: string, role: string }) => {
    setEmail(preset.email);
    setName(preset.name);
    setRole(preset.role);
  };

  return (
    <div className="container mx-auto py-8 px-4&quot;>
      <h1 className=&quot;text-3xl font-bold mb-6&quot;>Add User Role</h1>
      
      <div className=&quot;mb-6&quot;>
        <h2 className=&quot;text-xl font-semibold mb-3&quot;>Quick Setup</h2>
        <div className=&quot;flex flex-wrap gap-2&quot;>
          {quickSetup.map((preset, index) => (
            <Button 
              key={index} 
              variant=&quot;outline&quot; 
              onClick={() => handleQuickSetup(preset)}
            >
              {preset.email} as {preset.role}
            </Button>
          ))}
        </div>
      </div>
      
      <Card className=&quot;mb-6&quot;>
        <CardHeader>
          <CardTitle>Add User Role</CardTitle>
          <CardDescription>
            Pre-register a user with a specified role. When they sign up with this email,
            they&apos;ll automatically have the assigned permissions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className=&quot;space-y-4&quot;>
            <div className=&quot;space-y-2&quot;>
              <Label htmlFor=&quot;email&quot;>Email Address*</Label>
              <Input
                id=&quot;email&quot;
                type=&quot;email&quot;
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder=&quot;user@example.com&quot;
                required
              />
            </div>
            
            <div className=&quot;space-y-2&quot;>
              <Label htmlFor=&quot;name&quot;>Name (Optional)</Label>
              <Input
                id=&quot;name&quot;
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder=&quot;User&apos;s full name&quot;
              />
            </div>
            
            <div className=&quot;space-y-2&quot;>
              <Label htmlFor=&quot;role&quot;>Role*</Label>
              <Select 
                value={role} 
                onValueChange={setRole}
              >
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
              {loading ? (
                <>
                  <Loader2 className=&quot;mr-2 h-4 w-4 animate-spin&quot; />
                  Processing...
                </>
              ) : (
                &quot;Set User Role&quot;
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
      
      {error && (
        <div className=&quot;p-4 border border-red-300 bg-red-50 rounded-md mb-6&quot;>
          <h3 className=&quot;text-red-700 font-semibold mb-1&quot;>Error</h3>
          <p className=&quot;text-red-600&quot;>{error}</p>
        </div>
      )}
      
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