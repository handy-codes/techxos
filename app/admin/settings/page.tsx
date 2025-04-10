"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "react-hot-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Settings, Mail, BellRing, Shield, Loader2 } from "lucide-react";
import axios from "axios";

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
    id: "",
    siteName: "TechXOS Academy",
    siteUrl: "https://techxos.com",
    maintenanceMode: false,
    emailNotifications: true,
    studentEnrollmentNotifications: true,
    paymentNotifications: true,
    twoFactorAuth: false,
    sessionTimeout: true,
    sessionTimeoutMinutes: 60
  });
  const [password, setPassword] = useState("");

  // Fetch settings on page load
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get("/api/admin/settings");
        setSettings(response.data);
        console.log("Fetched settings:", response.data);
      } catch (error) {
        console.error("Error fetching settings:", error);
        toast.error("Failed to load settings. Using defaults.");
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
      
      const response = await axios.put("/api/admin/settings", settingsToUpdate);
      setSettings(response.data);
      toast.success("Settings updated successfully!");
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleChange = (field: keyof SystemSettings) => (checked: boolean) => {
    setSettings(prev => ({ ...prev, [field]: checked }));
  };

  const handleInputChange = (field: keyof SystemSettings) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === 'number' ? parseInt(e.target.value, 10) : e.target.value;
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handlePasswordChange = async () => {
    if (!password) {
      toast.error("Please enter a new password");
      return;
    }

    setIsLoading(true);
    try {
      await axios.put("/api/admin/settings/password", { password });
      toast.success("Password updated successfully!");
      setPassword("");
    } catch (error) {
      console.error("Error updating password:", error);
      toast.error("Failed to update password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isInitialLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Settings</h1>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>

        <Tabs defaultValue="general">
          <TabsList className="mb-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  General Settings
                </CardTitle>
                <CardDescription>
                  Manage your system preferences and site settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="site-name">Site Name</Label>
                  <Input 
                    id="site-name" 
                    value={settings.siteName}
                    onChange={handleInputChange('siteName')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="site-url">Site URL</Label>
                  <Input 
                    id="site-url" 
                    value={settings.siteUrl}
                    onChange={handleInputChange('siteUrl')}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="maintenance-mode">Maintenance Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Put the site in maintenance mode
                    </p>
                  </div>
                  <Switch 
                    id="maintenance-mode"
                    checked={settings.maintenanceMode}
                    onCheckedChange={handleToggleChange('maintenanceMode')}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BellRing className="h-5 w-5" />
                  Notification Settings
                </CardTitle>
                <CardDescription>
                  Configure how and when you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive email notifications for important events
                    </p>
                  </div>
                  <Switch 
                    id="email-notifications" 
                    checked={settings.emailNotifications}
                    onCheckedChange={handleToggleChange('emailNotifications')}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="student-enrollment">Student Enrollment</Label>
                    <p className="text-sm text-muted-foreground">
                      Notify when new students enroll in a course
                    </p>
                  </div>
                  <Switch 
                    id="student-enrollment" 
                    checked={settings.studentEnrollmentNotifications}
                    onCheckedChange={handleToggleChange('studentEnrollmentNotifications')}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="payment-notifications">Payment Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Notify when payments are received
                    </p>
                  </div>
                  <Switch 
                    id="payment-notifications" 
                    checked={settings.paymentNotifications}
                    onCheckedChange={handleToggleChange('paymentNotifications')}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Settings
                </CardTitle>
                <CardDescription>
                  Configure your account security preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <Switch 
                    id="two-factor" 
                    checked={settings.twoFactorAuth}
                    onCheckedChange={handleToggleChange('twoFactorAuth')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Change Password</Label>
                  <div className="flex gap-2">
                    <Input 
                      id="password" 
                      type="password" 
                      placeholder="Enter new password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button onClick={handlePasswordChange} disabled={isLoading || !password}>
                      Update
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="session-timeout">Session Timeout</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically log out after period of inactivity
                    </p>
                  </div>
                  <Switch 
                    id="session-timeout" 
                    checked={settings.sessionTimeout}
                    onCheckedChange={handleToggleChange('sessionTimeout')}
                  />
                </div>
                {settings.sessionTimeout && (
                  <div className="space-y-2">
                    <Label htmlFor="timeout-minutes">Timeout Period (minutes)</Label>
                    <Input 
                      id="timeout-minutes" 
                      type="number" 
                      value={settings.sessionTimeoutMinutes}
                      onChange={handleInputChange('sessionTimeoutMinutes')}
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