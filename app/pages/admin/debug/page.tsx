"use client&quot;;

import { useState } from &quot;react&quot;;
import { toast } from &quot;react-hot-toast&quot;;
import axios from &quot;axios&quot;;
import { Loader2, Search, UserCheck } from &quot;lucide-react&quot;;
import { Button } from &quot;@/components/ui/button&quot;;
import { Input } from &quot;@/components/ui/input&quot;;
import { Label } from &quot;@/components/ui/label&quot;;
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from &quot;@/components/ui/select&quot;;
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from &quot;@/components/ui/card&quot;;
import { Badge } from &quot;@/components/ui/badge&quot;;

export default function DebugUserPage() {
  const [email, setEmail] = useState(&quot;careers@techxos.com&quot;);
  const [role, setRole] = useState(&quot;ADMIN&quot;);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [message, setMessage] = useState(&quot;");
  const [clerkUserId, setClerkUserId] = useState(&quot;&quot;);
  
  // Handle search by email
  const handleSearch = async () => {
    if (!email) {
      toast.error(&quot;Please enter an email to search&quot;);
      return;
    }
    
    setSearchLoading(true);
    setUsers([]);
    setMessage(&quot;&quot;);
    
    try {
      const response = await axios.get(`/api/admin/debug-user?email=${encodeURIComponent(email)}`);
      if (response.data.users) {
        setUsers(response.data.users);
        setMessage(response.data.message);
        
        // If there&apos;s a single user found, pre-fill their Clerk ID
        if (response.data.users.length === 1 && response.data.users[0].clerkUserId) {
          setClerkUserId(response.data.users[0].clerkUserId);
        }
      } else {
        setMessage(response.data.message || &quot;No users found&quot;);
      }
    } catch (error) {
      console.error(&quot;Error searching for user:&quot;, error);
      toast.error(&quot;Error searching for user&quot;);
    } finally {
      setSearchLoading(false);
    }
  };
  
  // Handle fix user role
  const handleFixRole = async () => {
    if (!email) {
      toast.error(&quot;Please enter an email&quot;);
      return;
    }
    
    if (!role) {
      toast.error(&quot;Please select a role&quot;);
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await axios.post(&quot;/api/admin/debug-user&quot;, {
        email,
        role,
        clerkUserId: clerkUserId || undefined
      });
      
      toast.success(response.data.message || &quot;User updated successfully&quot;);
      
      // Search again to refresh user data
      await handleSearch();
    } catch (error) {
      console.error(&quot;Error fixing user role:&quot;, error);
      toast.error(&quot;Error fixing user role&quot;);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto py-8 px-4&quot;>
      <h1 className=&quot;text-3xl font-bold mb-6&quot;>Debug User Role</h1>
      
      <Card className=&quot;mb-6&quot;>
        <CardHeader>
          <CardTitle>Search User</CardTitle>
          <CardDescription>
            Search for a user by email to check their current role and status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className=&quot;space-y-4&quot;>
            <div className=&quot;space-y-2&quot;>
              <Label htmlFor=&quot;email&quot;>Email Address</Label>
              <div className=&quot;flex space-x-2&quot;>
                <Input
                  id=&quot;email&quot;
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder=&quot;user@example.com&quot;
                />
                <Button 
                  onClick={handleSearch} 
                  disabled={searchLoading}
                  variant=&quot;outline&quot;
                >
                  {searchLoading ? (
                    <Loader2 className=&quot;h-4 w-4 animate-spin&quot; />
                  ) : (
                    <Search className=&quot;h-4 w-4&quot; />
                  )}
                </Button>
              </div>
            </div>
            
            {message && (
              <div className=&quot;p-4 bg-blue-50 rounded-md text-blue-800&quot;>
                {message}
              </div>
            )}
            
            {users.length > 0 && (
              <div className=&quot;space-y-4&quot;>
                <h3 className=&quot;text-lg font-semibold&quot;>Users Found:</h3>
                {users.map((user, index) => (
                  <Card key={index} className=&quot;p-4&quot;>
                    <div className=&quot;grid grid-cols-2 gap-2&quot;>
                      <div className=&quot;font-semibold&quot;>ID:</div>
                      <div>{user.id}</div>
                      
                      <div className=&quot;font-semibold&quot;>Name:</div>
                      <div>{user.name || &apos;N/A&apos;}</div>
                      
                      <div className=&quot;font-semibold&quot;>Email:</div>
                      <div>{user.email}</div>
                      
                      <div className=&quot;font-semibold&quot;>Role:</div>
                      <div>
                        <Badge
                          variant={
                            user.role === &quot;HEAD_ADMIN&quot; ? &quot;destructive&quot; : 
                            user.role === &quot;ADMIN&quot; ? &quot;default&quot; : 
                            user.role === &quot;LECTURER&quot; ? &quot;secondary&quot; : 
                            &quot;outline&quot;
                          }
                        >
                          {user.role}
                        </Badge>
                      </div>
                      
                      <div className=&quot;font-semibold&quot;>Clerk User ID:</div>
                      <div className=&quot;font-mono text-xs&quot;>{user.clerkUserId || &apos;None&apos;}</div>
                      
                      <div className=&quot;font-semibold&quot;>Active:</div>
                      <div>{user.isActive ? &apos;Yes&apos; : &apos;No&apos;}</div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Fix User Role</CardTitle>
          <CardDescription>
            Update the user&apos;s role or create a new user with the specified email and role
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className=&quot;space-y-4&quot;>
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
            
            <div className=&quot;space-y-2&quot;>
              <Label htmlFor=&quot;clerkUserId&quot;>Clerk User ID (Optional)</Label>
              <Input
                id=&quot;clerkUserId&quot;
                value={clerkUserId}
                onChange={(e) => setClerkUserId(e.target.value)}
                placeholder=&quot;user_...&quot;
              />
              <p className=&quot;text-xs text-gray-500&quot;>
                Leave empty to keep the existing Clerk ID or generate a new one
              </p>
            </div>
            
            <Button 
              onClick={handleFixRole} 
              disabled={loading}
              className=&quot;w-full&quot;
            >
              {loading ? (
                <>
                  <Loader2 className=&quot;mr-2 h-4 w-4 animate-spin&quot; />
                  Processing...
                </>
              ) : (
                <>
                  <UserCheck className=&quot;mr-2 h-4 w-4" />
                  Set User Role
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 