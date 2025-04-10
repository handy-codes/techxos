"use client&quot;;

import { useEffect, useState } from &quot;react&quot;;
import { Button } from &quot;@/components/ui/button&quot;;
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from &quot;@/components/ui/card&quot;;
import { Input } from &quot;@/components/ui/input&quot;;
import { Label } from &quot;@/components/ui/label&quot;;
import { Switch } from &quot;@/components/ui/switch&quot;;
import { toast } from &quot;react-hot-toast&quot;;
import { Tabs, TabsContent, TabsList, TabsTrigger } from &quot;@/components/ui/tabs&quot;;
import { ScrollArea } from &quot;@/components/ui/scroll-area&quot;;
import { Settings, Mail, BellRing, Shield, Loader2 } from &quot;lucide-react&quot;;
import axios from &quot;axios&quot;;

interface SystemSettings {
  id: string;
  siteName: string;
  siteUrl: string;
  maintenanceMode: boolean;
  emailNotifications: boolean;
  studentEnrollmentNotifications: boolean;
  paymentNotifications: boolean;
  twoFactorAuth: boolean;
  sessionTimeout: boolean;
  sessionTimeoutMinutes: number;
}

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [settings, setSettings] = useState<SystemSettings>({
    id: &quot;",
    siteName: &quot;TechXOS Academy&quot;,
    siteUrl: &quot;https://techxos.com&quot;,
    maintenanceMode: false,
    emailNotifications: true,
    studentEnrollmentNotifications: true,
    paymentNotifications: true,
    twoFactorAuth: false,
    sessionTimeout: true,
    sessionTimeoutMinutes: 60
  });
  const [password, setPassword] = useState(&quot;&quot;);

  // Fetch settings on page load
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get(&quot;/api/admin/settings&quot;);
        setSettings(response.data);
        console.log(&quot;Fetched settings:&quot;, response.data);
      } catch (error) {
        console.error(&quot;Error fetching settings:&quot;, error);
        toast.error(&quot;Failed to load settings. Using defaults.&quot;);
      } finally {
        setIsInitialLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Remove the password field from settings update
      const { id, ...settingsToUpdate } = settings;
      
      const response = await axios.put(&quot;/api/admin/settings&quot;, settingsToUpdate);
      setSettings(response.data);
      toast.success(&quot;Settings updated successfully!&quot;);
    } catch (error) {
      console.error(&quot;Error saving settings:&quot;, error);
      toast.error(&quot;Failed to save settings. Please try again.&quot;);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleChange = (field: keyof SystemSettings) => (checked: boolean) => {
    setSettings(prev => ({ ...prev, [field]: checked }));
  };

  const handleInputChange = (field: keyof SystemSettings) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === &apos;number&apos; ? parseInt(e.target.value, 10) : e.target.value;
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handlePasswordChange = async () => {
    if (!password) {
      toast.error(&quot;Please enter a new password&quot;);
      return;
    }

    setIsLoading(true);
    try {
      await axios.put(&quot;/api/admin/settings/password&quot;, { password });
      toast.success(&quot;Password updated successfully!&quot;);
      setPassword(&quot;&quot;);
    } catch (error) {
      console.error(&quot;Error updating password:&quot;, error);
      toast.error(&quot;Failed to update password. Please try again.&quot;);
    } finally {
      setIsLoading(false);
    }
  };

  if (isInitialLoading) {
    return (
      <div className="flex justify-center items-center h-full&quot;>
        <Loader2 className=&quot;h-8 w-8 animate-spin text-primary&quot; />
      </div>
    );
  }

  return (
    <ScrollArea className=&quot;h-full&quot;>
      <div className=&quot;p-6 space-y-6&quot;>
        <div className=&quot;flex justify-between items-center&quot;>
          <h1 className=&quot;text-2xl font-bold&quot;>Settings</h1>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? &quot;Saving...&quot; : &quot;Save Changes&quot;}
          </Button>
        </div>

        <Tabs defaultValue=&quot;general&quot;>
          <TabsList className=&quot;mb-4&quot;>
            <TabsTrigger value=&quot;general&quot;>General</TabsTrigger>
            <TabsTrigger value=&quot;notifications&quot;>Notifications</TabsTrigger>
            <TabsTrigger value=&quot;security&quot;>Security</TabsTrigger>
          </TabsList>

          <TabsContent value=&quot;general&quot;>
            <Card>
              <CardHeader>
                <CardTitle className=&quot;flex items-center gap-2&quot;>
                  <Settings className=&quot;h-5 w-5&quot; />
                  General Settings
                </CardTitle>
                <CardDescription>
                  Manage your system preferences and site settings
                </CardDescription>
              </CardHeader>
              <CardContent className=&quot;space-y-4&quot;>
                <div className=&quot;space-y-2&quot;>
                  <Label htmlFor=&quot;site-name&quot;>Site Name</Label>
                  <Input 
                    id=&quot;site-name&quot; 
                    value={settings.siteName}
                    onChange={handleInputChange(&apos;siteName&apos;)}
                  />
                </div>
                <div className=&quot;space-y-2&quot;>
                  <Label htmlFor=&quot;site-url&quot;>Site URL</Label>
                  <Input 
                    id=&quot;site-url&quot; 
                    value={settings.siteUrl}
                    onChange={handleInputChange(&apos;siteUrl&apos;)}
                  />
                </div>
                <div className=&quot;flex items-center justify-between&quot;>
                  <div>
                    <Label htmlFor=&quot;maintenance-mode&quot;>Maintenance Mode</Label>
                    <p className=&quot;text-sm text-muted-foreground&quot;>
                      Put the site in maintenance mode
                    </p>
                  </div>
                  <Switch 
                    id=&quot;maintenance-mode&quot;
                    checked={settings.maintenanceMode}
                    onCheckedChange={handleToggleChange(&apos;maintenanceMode&apos;)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value=&quot;notifications&quot;>
            <Card>
              <CardHeader>
                <CardTitle className=&quot;flex items-center gap-2&quot;>
                  <BellRing className=&quot;h-5 w-5&quot; />
                  Notification Settings
                </CardTitle>
                <CardDescription>
                  Configure how and when you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className=&quot;space-y-4&quot;>
                <div className=&quot;flex items-center justify-between&quot;>
                  <div>
                    <Label htmlFor=&quot;email-notifications&quot;>Email Notifications</Label>
                    <p className=&quot;text-sm text-muted-foreground&quot;>
                      Receive email notifications for important events
                    </p>
                  </div>
                  <Switch 
                    id=&quot;email-notifications&quot; 
                    checked={settings.emailNotifications}
                    onCheckedChange={handleToggleChange(&apos;emailNotifications&apos;)}
                  />
                </div>
                <div className=&quot;flex items-center justify-between&quot;>
                  <div>
                    <Label htmlFor=&quot;student-enrollment&quot;>Student Enrollment</Label>
                    <p className=&quot;text-sm text-muted-foreground&quot;>
                      Notify when new students enroll in a course
                    </p>
                  </div>
                  <Switch 
                    id=&quot;student-enrollment&quot; 
                    checked={settings.studentEnrollmentNotifications}
                    onCheckedChange={handleToggleChange(&apos;studentEnrollmentNotifications&apos;)}
                  />
                </div>
                <div className=&quot;flex items-center justify-between&quot;>
                  <div>
                    <Label htmlFor=&quot;payment-notifications&quot;>Payment Notifications</Label>
                    <p className=&quot;text-sm text-muted-foreground&quot;>
                      Notify when payments are received
                    </p>
                  </div>
                  <Switch 
                    id=&quot;payment-notifications&quot; 
                    checked={settings.paymentNotifications}
                    onCheckedChange={handleToggleChange(&apos;paymentNotifications&apos;)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value=&quot;security&quot;>
            <Card>
              <CardHeader>
                <CardTitle className=&quot;flex items-center gap-2&quot;>
                  <Shield className=&quot;h-5 w-5&quot; />
                  Security Settings
                </CardTitle>
                <CardDescription>
                  Configure your account security preferences
                </CardDescription>
              </CardHeader>
              <CardContent className=&quot;space-y-4&quot;>
                <div className=&quot;flex items-center justify-between&quot;>
                  <div>
                    <Label htmlFor=&quot;two-factor&quot;>Two-Factor Authentication</Label>
                    <p className=&quot;text-sm text-muted-foreground&quot;>
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <Switch 
                    id=&quot;two-factor&quot; 
                    checked={settings.twoFactorAuth}
                    onCheckedChange={handleToggleChange(&apos;twoFactorAuth&apos;)}
                  />
                </div>
                <div className=&quot;space-y-2&quot;>
                  <Label htmlFor=&quot;password&quot;>Change Password</Label>
                  <div className=&quot;flex gap-2&quot;>
                    <Input 
                      id=&quot;password&quot; 
                      type=&quot;password&quot; 
                      placeholder=&quot;Enter new password&quot; 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button onClick={handlePasswordChange} disabled={isLoading || !password}>
                      Update
                    </Button>
                  </div>
                </div>
                <div className=&quot;flex items-center justify-between&quot;>
                  <div>
                    <Label htmlFor=&quot;session-timeout&quot;>Session Timeout</Label>
                    <p className=&quot;text-sm text-muted-foreground&quot;>
                      Automatically log out after period of inactivity
                    </p>
                  </div>
                  <Switch 
                    id=&quot;session-timeout&quot; 
                    checked={settings.sessionTimeout}
                    onCheckedChange={handleToggleChange(&apos;sessionTimeout&apos;)}
                  />
                </div>
                {settings.sessionTimeout && (
                  <div className=&quot;space-y-2&quot;>
                    <Label htmlFor=&quot;timeout-minutes&quot;>Timeout Period (minutes)</Label>
                    <Input 
                      id=&quot;timeout-minutes&quot; 
                      type=&quot;number" 
                      value={settings.sessionTimeoutMinutes}
                      onChange={handleInputChange(&apos;sessionTimeoutMinutes&apos;)}
                      min={1}
                      max={1440}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ScrollArea>
  );
} 