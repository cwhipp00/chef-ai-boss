import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Settings as SettingsIcon, Crown, User, Bell, Shield, Palette } from 'lucide-react';
import { UsageDashboard } from '@/components/subscription/UsageDashboard';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { useAuth } from '@/contexts/AuthContext';

export default function Settings() {
  const { user } = useAuth();
  const { isPremium, subscriptionTier } = useSubscription();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight flex items-center gap-3">
            <SettingsIcon className="h-8 w-8" />
            Settings
          </h1>
          <p className="text-muted-foreground mt-2">Manage your account and preferences</p>
        </div>
        <Badge variant={isPremium ? "default" : "secondary"} className={`${isPremium ? "bg-primary" : ""} text-sm`}>
          {isPremium && <Crown className="h-3 w-3 mr-1" />}
          {subscriptionTier.toUpperCase()} PLAN
        </Badge>
      </div>

      <Tabs defaultValue="subscription" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="subscription" className="flex items-center gap-2">
            <Crown className="h-4 w-4" />
            Subscription
          </TabsTrigger>
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Appearance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="subscription" className="mt-6">
          <UsageDashboard />
        </TabsContent>

        <TabsContent value="profile" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">User ID</label>
                <p className="text-sm text-muted-foreground font-mono">{user?.id}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Member Since</label>
                <p className="text-sm text-muted-foreground">
                  {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Notification settings coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Security settings coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Theme & Colors
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-3">Color Theme</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button className="flex items-center gap-3 p-4 rounded-lg border-2 border-primary bg-primary/5 hover:bg-primary/10 transition-all">
                      <div className="flex gap-1">
                        <div className="w-4 h-4 rounded-full bg-primary"></div>
                        <div className="w-4 h-4 rounded-full bg-accent"></div>
                        <div className="w-4 h-4 rounded-full bg-success"></div>
                      </div>
                      <div className="text-left">
                        <div className="text-sm font-medium">Warm Amber</div>
                        <div className="text-xs text-muted-foreground">Current theme</div>
                      </div>
                    </button>
                    
                    <button className="flex items-center gap-3 p-4 rounded-lg border hover:border-primary/50 transition-all">
                      <div className="flex gap-1">
                        <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                        <div className="w-4 h-4 rounded-full bg-indigo-500"></div>
                        <div className="w-4 h-4 rounded-full bg-purple-500"></div>
                      </div>
                      <div className="text-left">
                        <div className="text-sm font-medium">Ocean Blue</div>
                        <div className="text-xs text-muted-foreground">Professional</div>
                      </div>
                    </button>
                    
                    <button className="flex items-center gap-3 p-4 rounded-lg border hover:border-primary/50 transition-all">
                      <div className="flex gap-1">
                        <div className="w-4 h-4 rounded-full bg-emerald-500"></div>
                        <div className="w-4 h-4 rounded-full bg-teal-500"></div>
                        <div className="w-4 h-4 rounded-full bg-green-500"></div>
                      </div>
                      <div className="text-left">
                        <div className="text-sm font-medium">Fresh Green</div>
                        <div className="text-xs text-muted-foreground">Natural</div>
                      </div>
                    </button>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="text-sm font-medium mb-3">Display Mode</h4>
                  <div className="grid grid-cols-3 gap-3">
                    <button className="flex flex-col items-center gap-2 p-4 rounded-lg border hover:border-primary/50 transition-all">
                      <div className="w-8 h-6 bg-white border rounded flex items-center justify-center">
                        <div className="w-1 h-3 bg-gray-300 rounded-full"></div>
                      </div>
                      <span className="text-sm font-medium">Light</span>
                    </button>
                    
                    <button className="flex flex-col items-center gap-2 p-4 rounded-lg border hover:border-primary/50 transition-all">
                      <div className="w-8 h-6 bg-gray-900 border rounded flex items-center justify-center">
                        <div className="w-1 h-3 bg-gray-600 rounded-full"></div>
                      </div>
                      <span className="text-sm font-medium">Dark</span>
                    </button>
                    
                    <button className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-primary bg-primary/5 hover:bg-primary/10 transition-all">
                      <div className="w-8 h-6 bg-gradient-to-r from-white to-gray-900 border rounded flex items-center justify-center">
                        <div className="w-1 h-3 bg-gray-500 rounded-full"></div>
                      </div>
                      <span className="text-sm font-medium">Auto</span>
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Typography & Layout</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-3 block">Font Size</label>
                  <div className="grid grid-cols-4 gap-3">
                    <button className="flex flex-col items-center gap-2 p-3 rounded-lg border hover:border-primary/50 transition-all">
                      <span className="text-xs font-medium">Aa</span>
                      <span className="text-xs">Small</span>
                    </button>
                    <button className="flex flex-col items-center gap-2 p-3 rounded-lg border-2 border-primary bg-primary/5 hover:bg-primary/10 transition-all">
                      <span className="text-sm font-medium">Aa</span>
                      <span className="text-xs">Normal</span>
                    </button>
                    <button className="flex flex-col items-center gap-2 p-3 rounded-lg border hover:border-primary/50 transition-all">
                      <span className="text-base font-medium">Aa</span>
                      <span className="text-xs">Large</span>
                    </button>
                    <button className="flex flex-col items-center gap-2 p-3 rounded-lg border hover:border-primary/50 transition-all">
                      <span className="text-lg font-medium">Aa</span>
                      <span className="text-xs">X-Large</span>
                    </button>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <label className="text-sm font-medium mb-3 block">Interface Density</label>
                  <div className="grid grid-cols-3 gap-3">
                    <button className="flex flex-col items-center gap-2 p-3 rounded-lg border hover:border-primary/50 transition-all">
                      <div className="space-y-1">
                        <div className="w-6 h-1 bg-muted rounded"></div>
                        <div className="w-4 h-1 bg-muted rounded"></div>
                      </div>
                      <span className="text-xs">Compact</span>
                    </button>
                    <button className="flex flex-col items-center gap-2 p-3 rounded-lg border-2 border-primary bg-primary/5 hover:bg-primary/10 transition-all">
                      <div className="space-y-1.5">
                        <div className="w-6 h-1.5 bg-muted rounded"></div>
                        <div className="w-4 h-1.5 bg-muted rounded"></div>
                      </div>
                      <span className="text-xs">Normal</span>
                    </button>
                    <button className="flex flex-col items-center gap-2 p-3 rounded-lg border hover:border-primary/50 transition-all">
                      <div className="space-y-2">
                        <div className="w-6 h-2 bg-muted rounded"></div>
                        <div className="w-4 h-2 bg-muted rounded"></div>
                      </div>
                      <span className="text-xs">Comfortable</span>
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Animation & Effects</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">Hover Effects</div>
                  <div className="text-xs text-muted-foreground">Card lift and scale animations</div>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" defaultChecked className="rounded border-gray-300" />
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">Smooth Transitions</div>
                  <div className="text-xs text-muted-foreground">Page and component animations</div>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" defaultChecked className="rounded border-gray-300" />
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">Loading Animations</div>
                  <div className="text-xs text-muted-foreground">Spinners and progress indicators</div>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" defaultChecked className="rounded border-gray-300" />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">Reduced Motion</div>
                  <div className="text-xs text-muted-foreground">Accessibility mode for motion sensitivity</div>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded border-gray-300" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-gradient-to-br from-card via-card to-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-primary" />
                Preview Your Theme
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-4 rounded-lg bg-gradient-card border">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">Sample Card Header</div>
                      <div className="text-xs text-muted-foreground">This is how your cards will look</div>
                    </div>
                  </div>
                  <Button size="sm" className="w-full">
                    Action Button
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  Changes will apply immediately across the entire application
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}