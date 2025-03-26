
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';
import { Save } from 'lucide-react';

const Settings = () => {
  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Your settings have been saved successfully.",
    });
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold">Settings</h2>
      </div>

      <Tabs defaultValue="profile" className="mb-8">
        <TabsList className="mb-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal information and profile settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" defaultValue="John" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" defaultValue="Doe" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" defaultValue="john@example.com" />
                <p className="text-xs text-muted-foreground">
                  This email will be used for notifications and login
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" defaultValue="(555) 123-4567" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea 
                  id="bio" 
                  placeholder="Tell us a bit about yourself and your business"
                  defaultValue="Real estate investor focusing on residential properties in the Southwest region."
                />
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <Label>Profile Visibility</Label>
                <div className="flex items-center space-x-2">
                  <Switch id="visibility" defaultChecked />
                  <Label htmlFor="visibility">Make profile visible to team members</Label>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Manage your account security and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input id="currentPassword" type="password" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input id="newPassword" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input id="confirmPassword" type="password" />
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Enable Two-Factor Authentication</p>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                  </div>
                  <Switch id="2fa" />
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">User Preferences</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="timezone">Time Zone</Label>
                    <div className="w-[250px]">
                      <select id="timezone" className="w-full rounded-md border px-3 py-2">
                        <option>Pacific Time (US & Canada)</option>
                        <option>Mountain Time (US & Canada)</option>
                        <option>Central Time (US & Canada)</option>
                        <option>Eastern Time (US & Canada)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Control how and when you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Email Notifications</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">New Lead Alerts</p>
                      <p className="text-xs text-muted-foreground">Receive an email when a new lead is added to the system</p>
                    </div>
                    <Switch id="new-lead" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Campaign Updates</p>
                      <p className="text-xs text-muted-foreground">Get notified when a campaign completes or requires attention</p>
                    </div>
                    <Switch id="campaign-updates" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Lead Status Changes</p>
                      <p className="text-xs text-muted-foreground">Get alerts when lead status changes (hot, warm, etc.)</p>
                    </div>
                    <Switch id="status-changes" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Weekly Reports</p>
                      <p className="text-xs text-muted-foreground">Receive a weekly summary of your account activity</p>
                    </div>
                    <Switch id="weekly-reports" defaultChecked />
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">SMS Notifications</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Urgent Lead Alerts</p>
                      <p className="text-xs text-muted-foreground">Get texted when a high-priority lead is identified</p>
                    </div>
                    <Switch id="urgent-leads" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">System Downtime</p>
                      <p className="text-xs text-muted-foreground">Get texted if there are any system outages</p>
                    </div>
                    <Switch id="system-downtime" />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" />
                Save Preferences
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="integrations">
          <Card>
            <CardHeader>
              <CardTitle>Connected Services</CardTitle>
              <CardDescription>Manage your connected third-party services and integrations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-md border">
                <div className="flex items-center justify-between p-4 border-b">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold">SF</span>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Salesforce</h3>
                      <p className="text-xs text-muted-foreground">CRM Integration</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-xs text-green-600 font-medium px-2 py-1 bg-green-100 rounded-full">Connected</div>
                    <Button variant="outline" size="sm">Disconnect</Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 border-b">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 bg-red-100 rounded-full flex items-center justify-center">
                      <span className="text-red-600 font-semibold">TW</span>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Twilio</h3>
                      <p className="text-xs text-muted-foreground">SMS and Phone Integration</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-xs text-green-600 font-medium px-2 py-1 bg-green-100 rounded-full">Connected</div>
                    <Button variant="outline" size="sm">Disconnect</Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 border-b">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <span className="text-orange-600 font-semibold">HB</span>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">HubSpot</h3>
                      <p className="text-xs text-muted-foreground">Marketing Integration</p>
                    </div>
                  </div>
                  <div>
                    <Button>Connect</Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-purple-600 font-semibold">ZP</span>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Zapier</h3>
                      <p className="text-xs text-muted-foreground">Automation Integration</p>
                    </div>
                  </div>
                  <div>
                    <Button>Connect</Button>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline">
                Refresh Connections
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="billing">
          <Card>
            <CardHeader>
              <CardTitle>Billing Information</CardTitle>
              <CardDescription>Manage your subscription and payment methods</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-muted/30 rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Advanced Plan</h3>
                  <Badge className="bg-primary">Current Plan</Badge>
                </div>
                <p className="text-sm">$199/month, billed monthly</p>
                <ul className="text-sm space-y-1 mt-2">
                  <li className="flex items-center">
                    <svg className="w-4 h-4 mr-1.5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Unlimited Flows
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 mr-1.5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    100 phone numbers/record
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 mr-1.5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    50k properties/month
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 mr-1.5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    AI optimization
                  </li>
                </ul>
                <div className="mt-4">
                  <Button variant="outline">Change Plan</Button>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Payment Method</h3>
                <div className="rounded-md border p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="h-8 w-12 bg-black rounded flex items-center justify-center">
                        <span className="text-white text-xs">VISA</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Visa ending in 4242</p>
                        <p className="text-xs text-muted-foreground">Expires 12/2024</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Update</Button>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Billing History</h3>
                <div className="rounded-md border">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="p-3 text-left font-medium">Date</th>
                        <th className="p-3 text-left font-medium">Description</th>
                        <th className="p-3 text-right font-medium">Amount</th>
                        <th className="p-3 text-right font-medium">Receipt</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t border-border">
                        <td className="p-3">May 1, 2023</td>
                        <td className="p-3">Advanced Plan - Monthly</td>
                        <td className="p-3 text-right">$199.00</td>
                        <td className="p-3 text-right">
                          <Button variant="ghost" size="sm">Download</Button>
                        </td>
                      </tr>
                      <tr className="border-t border-border">
                        <td className="p-3">Apr 1, 2023</td>
                        <td className="p-3">Advanced Plan - Monthly</td>
                        <td className="p-3 text-right">$199.00</td>
                        <td className="p-3 text-right">
                          <Button variant="ghost" size="sm">Download</Button>
                        </td>
                      </tr>
                      <tr className="border-t border-border">
                        <td className="p-3">Mar 1, 2023</td>
                        <td className="p-3">Advanced Plan - Monthly</td>
                        <td className="p-3 text-right">$199.00</td>
                        <td className="p-3 text-right">
                          <Button variant="ghost" size="sm">Download</Button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default Settings;
