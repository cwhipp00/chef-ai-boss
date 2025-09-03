import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Settings as SettingsIcon, Crown, User, Bell, Shield, Palette, Check, Loader2 } from 'lucide-react';
import { UsageDashboard } from '@/components/subscription/UsageDashboard';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { useAuth } from '@/contexts/AuthContext';
import { useAppearance, type ColorTheme, type DisplayMode, type FontSize, type InterfaceDensity } from '@/contexts/AppearanceContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export default function Settings() {
  const { user } = useAuth();
  const { isPremium, subscriptionTier } = useSubscription();
  const { toast } = useToast();
  const { 
    settings, 
    updateColorTheme, 
    updateDisplayMode, 
    updateFontSize, 
    updateInterfaceDensity, 
    updateAnimationSetting 
  } = useAppearance();

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Notification settings state
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: {
      courseUpdates: true,
      assignmentReminders: true,
      teamUpdates: true,
      marketing: false,
    },
    pushNotifications: {
      realTimeAlerts: true,
      soundNotifications: true,
      desktopNotifications: false,
    },
    emailFrequency: 'daily',
    preferredTime: 'morning',
  });
  const [isSavingNotifications, setIsSavingNotifications] = useState(false);

  // Load notification settings
  useEffect(() => {
    if (user) {
      loadNotificationSettings();
    }
  }, [user]);

  const loadNotificationSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading notification settings:', error);
        return;
      }

      if (data && (data as any).notification_settings) {
        setNotificationSettings(prev => ({
          ...prev,
          ...(data as any).notification_settings
        }));
      }
    } catch (error) {
      console.error('Error loading notification settings:', error);
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "New password and confirmation don't match",
        variant: "destructive"
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 6 characters long",
        variant: "destructive"
      });
      return;
    }

    setIsUpdatingPassword(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        toast({
          title: "Password Update Failed",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Password Updated",
          description: "Your password has been successfully changed",
        });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (error) {
      toast({
        title: "Password Update Failed",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const updateNotificationSetting = (category: string, setting: string, value: any) => {
    if (category === 'emailFrequency' || category === 'preferredTime') {
      setNotificationSettings(prev => ({
        ...prev,
        [category]: value
      }));
    } else {
      setNotificationSettings(prev => ({
        ...prev,
        [category]: {
          ...prev[category as keyof typeof prev.emailNotifications],
          [setting]: value
        }
      }));
    }
  };

  const saveNotificationSettings = async () => {
    setIsSavingNotifications(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          notification_settings: notificationSettings
        } as any)
        .eq('id', user?.id);

      if (error) {
        toast({
          title: "Save Failed",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Settings Saved",
          description: "Your notification preferences have been updated",
        });
      }
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsSavingNotifications(false);
    }
  };

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

        <TabsContent value="notifications" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-4">Email Notifications</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <label className="text-sm font-medium">Course Updates</label>
                        <p className="text-xs text-muted-foreground">
                          Get notified about new courses and content updates
                        </p>
                      </div>
                      <Switch 
                        checked={notificationSettings.emailNotifications.courseUpdates}
                        onCheckedChange={(checked) => updateNotificationSetting('emailNotifications', 'courseUpdates', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <label className="text-sm font-medium">Assignment Reminders</label>
                        <p className="text-xs text-muted-foreground">
                          Receive reminders about pending assignments and deadlines
                        </p>
                      </div>
                      <Switch 
                        checked={notificationSettings.emailNotifications.assignmentReminders}
                        onCheckedChange={(checked) => updateNotificationSetting('emailNotifications', 'assignmentReminders', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <label className="text-sm font-medium">Team Updates</label>
                        <p className="text-xs text-muted-foreground">
                          Stay informed about team activities and announcements
                        </p>
                      </div>
                      <Switch 
                        checked={notificationSettings.emailNotifications.teamUpdates}
                        onCheckedChange={(checked) => updateNotificationSetting('emailNotifications', 'teamUpdates', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <label className="text-sm font-medium">Marketing Communications</label>
                        <p className="text-xs text-muted-foreground">
                          Receive product updates and promotional content
                        </p>
                      </div>
                      <Switch 
                        checked={notificationSettings.emailNotifications.marketing}
                        onCheckedChange={(checked) => updateNotificationSetting('emailNotifications', 'marketing', checked)}
                      />
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="text-sm font-medium mb-4">In-App Notifications</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <label className="text-sm font-medium">Real-time Alerts</label>
                        <p className="text-xs text-muted-foreground">
                          Show instant notifications for important events
                        </p>
                      </div>
                      <Switch 
                        checked={notificationSettings.pushNotifications.realTimeAlerts}
                        onCheckedChange={(checked) => updateNotificationSetting('pushNotifications', 'realTimeAlerts', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <label className="text-sm font-medium">Sound Notifications</label>
                        <p className="text-xs text-muted-foreground">
                          Play sounds for new notifications and messages
                        </p>
                      </div>
                      <Switch 
                        checked={notificationSettings.pushNotifications.soundNotifications}
                        onCheckedChange={(checked) => updateNotificationSetting('pushNotifications', 'soundNotifications', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <label className="text-sm font-medium">Desktop Notifications</label>
                        <p className="text-xs text-muted-foreground">
                          Show browser notifications even when tab is not active
                        </p>
                      </div>
                      <Switch 
                        checked={notificationSettings.pushNotifications.desktopNotifications}
                        onCheckedChange={(checked) => updateNotificationSetting('pushNotifications', 'desktopNotifications', checked)}
                      />
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="text-sm font-medium mb-4">Communication Preferences</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Email Frequency</label>
                      <select 
                        className="w-full p-2 border border-input rounded-md bg-background text-sm"
                        value={notificationSettings.emailFrequency}
                        onChange={(e) => updateNotificationSetting('emailFrequency', '', e.target.value)}
                      >
                        <option value="immediate">Immediate</option>
                        <option value="daily">Daily Digest</option>
                        <option value="weekly">Weekly Summary</option>
                        <option value="never">Never</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">Preferred Communication Time</label>
                      <select 
                        className="w-full p-2 border border-input rounded-md bg-background text-sm"
                        value={notificationSettings.preferredTime}
                        onChange={(e) => updateNotificationSetting('preferredTime', '', e.target.value)}
                      >
                        <option value="morning">Morning (8-12 PM)</option>
                        <option value="afternoon">Afternoon (12-6 PM)</option>
                        <option value="evening">Evening (6-10 PM)</option>
                        <option value="any">Any Time</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <Button 
                  onClick={saveNotificationSettings}
                  disabled={isSavingNotifications}
                  className="w-full sm:w-auto"
                >
                  {isSavingNotifications ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Preferences'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Password & Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-3">Change Password</h4>
                  <div className="space-y-4 max-w-md">
                    <div>
                      <label className="text-sm font-medium block mb-2">Current Password</label>
                      <Input 
                        type="password" 
                        placeholder="Enter current password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-2">New Password</label>
                      <Input 
                        type="password" 
                        placeholder="Enter new password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-2">Confirm New Password</label>
                      <Input 
                        type="password" 
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                    <Button 
                      onClick={handlePasswordChange}
                      disabled={isUpdatingPassword || !currentPassword || !newPassword || !confirmPassword}
                      className="w-full"
                    >
                      {isUpdatingPassword ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Updating Password...
                        </>
                      ) : (
                        'Update Password'
                      )}
                    </Button>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="text-sm font-medium mb-3">Account Security</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium">Email Address</div>
                        <div className="text-xs text-muted-foreground">{user?.email}</div>
                      </div>
                      <Badge variant="secondary">Verified</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium">Account Created</div>
                        <div className="text-xs text-muted-foreground">
                          {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium">Last Sign In</div>
                        <div className="text-xs text-muted-foreground">
                          {user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : 'Unknown'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
                    <button 
                      onClick={() => updateColorTheme('warm-amber')}
                      className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
                        settings.colorTheme === 'warm-amber' 
                          ? 'border-primary bg-primary/5 hover:bg-primary/10' 
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="flex gap-1">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: 'hsl(25, 95%, 53%)' }}></div>
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: 'hsl(15, 85%, 60%)' }}></div>
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: 'hsl(142, 76%, 36%)' }}></div>
                      </div>
                      <div className="text-left flex-1">
                        <div className="text-sm font-medium">Warm Amber</div>
                        <div className="text-xs text-muted-foreground">Restaurant warmth</div>
                      </div>
                      {settings.colorTheme === 'warm-amber' && (
                        <Check className="h-4 w-4 text-primary" />
                      )}
                    </button>
                    
                    <button 
                      onClick={() => updateColorTheme('ocean-blue')}
                      className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
                        settings.colorTheme === 'ocean-blue' 
                          ? 'border-primary bg-primary/5 hover:bg-primary/10' 
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="flex gap-1">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: 'hsl(221, 83%, 53%)' }}></div>
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: 'hsl(262, 83%, 58%)' }}></div>
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: 'hsl(142, 71%, 45%)' }}></div>
                      </div>
                      <div className="text-left flex-1">
                        <div className="text-sm font-medium">Ocean Blue</div>
                        <div className="text-xs text-muted-foreground">Professional</div>
                      </div>
                      {settings.colorTheme === 'ocean-blue' && (
                        <Check className="h-4 w-4 text-primary" />
                      )}
                    </button>
                    
                    <button 
                      onClick={() => updateColorTheme('fresh-green')}
                      className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
                        settings.colorTheme === 'fresh-green' 
                          ? 'border-primary bg-primary/5 hover:bg-primary/10' 
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="flex gap-1">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: 'hsl(142, 76%, 36%)' }}></div>
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: 'hsl(173, 58%, 39%)' }}></div>
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: 'hsl(160, 84%, 39%)' }}></div>
                      </div>
                      <div className="text-left flex-1">
                        <div className="text-sm font-medium">Fresh Green</div>
                        <div className="text-xs text-muted-foreground">Natural</div>
                      </div>
                      {settings.colorTheme === 'fresh-green' && (
                        <Check className="h-4 w-4 text-primary" />
                      )}
                    </button>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="text-sm font-medium mb-3">Display Mode</h4>
                  <div className="grid grid-cols-3 gap-3">
                    <button 
                      onClick={() => updateDisplayMode('light')}
                      className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                        settings.displayMode === 'light' 
                          ? 'border-primary bg-primary/5 hover:bg-primary/10' 
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="w-8 h-6 bg-white border rounded flex items-center justify-center relative">
                        <div className="w-1 h-3 bg-gray-300 rounded-full"></div>
                        {settings.displayMode === 'light' && (
                          <Check className="h-3 w-3 absolute -top-1 -right-1 text-primary bg-background rounded-full" />
                        )}
                      </div>
                      <span className="text-sm font-medium">Light</span>
                    </button>
                    
                    <button 
                      onClick={() => updateDisplayMode('dark')}
                      className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                        settings.displayMode === 'dark' 
                          ? 'border-primary bg-primary/5 hover:bg-primary/10' 
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="w-8 h-6 bg-gray-900 border rounded flex items-center justify-center relative">
                        <div className="w-1 h-3 bg-gray-600 rounded-full"></div>
                        {settings.displayMode === 'dark' && (
                          <Check className="h-3 w-3 absolute -top-1 -right-1 text-primary bg-background rounded-full" />
                        )}
                      </div>
                      <span className="text-sm font-medium">Dark</span>
                    </button>
                    
                    <button 
                      onClick={() => updateDisplayMode('auto')}
                      className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                        settings.displayMode === 'auto' 
                          ? 'border-primary bg-primary/5 hover:bg-primary/10' 
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="w-8 h-6 bg-gradient-to-r from-white to-gray-900 border rounded flex items-center justify-center relative">
                        <div className="w-1 h-3 bg-gray-500 rounded-full"></div>
                        {settings.displayMode === 'auto' && (
                          <Check className="h-3 w-3 absolute -top-1 -right-1 text-primary bg-background rounded-full" />
                        )}
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
                    <button 
                      onClick={() => updateFontSize('small')}
                      className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                        settings.fontSize === 'small' 
                          ? 'border-primary bg-primary/5 hover:bg-primary/10' 
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <span className="text-xs font-medium">Aa</span>
                      <span className="text-xs">Small</span>
                      {settings.fontSize === 'small' && <Check className="h-3 w-3 text-primary" />}
                    </button>
                    <button 
                      onClick={() => updateFontSize('normal')}
                      className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                        settings.fontSize === 'normal' 
                          ? 'border-primary bg-primary/5 hover:bg-primary/10' 
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <span className="text-sm font-medium">Aa</span>
                      <span className="text-xs">Normal</span>
                      {settings.fontSize === 'normal' && <Check className="h-3 w-3 text-primary" />}
                    </button>
                    <button 
                      onClick={() => updateFontSize('large')}
                      className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                        settings.fontSize === 'large' 
                          ? 'border-primary bg-primary/5 hover:bg-primary/10' 
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <span className="text-base font-medium">Aa</span>
                      <span className="text-xs">Large</span>
                      {settings.fontSize === 'large' && <Check className="h-3 w-3 text-primary" />}
                    </button>
                    <button 
                      onClick={() => updateFontSize('x-large')}
                      className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                        settings.fontSize === 'x-large' 
                          ? 'border-primary bg-primary/5 hover:bg-primary/10' 
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <span className="text-lg font-medium">Aa</span>
                      <span className="text-xs">X-Large</span>
                      {settings.fontSize === 'x-large' && <Check className="h-3 w-3 text-primary" />}
                    </button>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <label className="text-sm font-medium mb-3 block">Interface Density</label>
                  <div className="grid grid-cols-3 gap-3">
                    <button 
                      onClick={() => updateInterfaceDensity('compact')}
                      className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                        settings.interfaceDensity === 'compact' 
                          ? 'border-primary bg-primary/5 hover:bg-primary/10' 
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="w-6 h-1 bg-muted rounded"></div>
                        <div className="w-4 h-1 bg-muted rounded"></div>
                      </div>
                      <span className="text-xs">Compact</span>
                      {settings.interfaceDensity === 'compact' && <Check className="h-3 w-3 text-primary" />}
                    </button>
                    <button 
                      onClick={() => updateInterfaceDensity('normal')}
                      className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                        settings.interfaceDensity === 'normal' 
                          ? 'border-primary bg-primary/5 hover:bg-primary/10' 
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="space-y-1.5">
                        <div className="w-6 h-1.5 bg-muted rounded"></div>
                        <div className="w-4 h-1.5 bg-muted rounded"></div>
                      </div>
                      <span className="text-xs">Normal</span>
                      {settings.interfaceDensity === 'normal' && <Check className="h-3 w-3 text-primary" />}
                    </button>
                    <button 
                      onClick={() => updateInterfaceDensity('comfortable')}
                      className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                        settings.interfaceDensity === 'comfortable' 
                          ? 'border-primary bg-primary/5 hover:bg-primary/10' 
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="w-6 h-2 bg-muted rounded"></div>
                        <div className="w-4 h-2 bg-muted rounded"></div>
                      </div>
                      <span className="text-xs">Comfortable</span>
                      {settings.interfaceDensity === 'comfortable' && <Check className="h-3 w-3 text-primary" />}
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
                <Switch 
                  checked={settings.hoverEffects} 
                  onCheckedChange={(checked) => updateAnimationSetting('hoverEffects', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">Smooth Transitions</div>
                  <div className="text-xs text-muted-foreground">Page and component animations</div>
                </div>
                <Switch 
                  checked={settings.smoothTransitions} 
                  onCheckedChange={(checked) => updateAnimationSetting('smoothTransitions', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">Loading Animations</div>
                  <div className="text-xs text-muted-foreground">Spinners and progress indicators</div>
                </div>
                <Switch 
                  checked={settings.loadingAnimations} 
                  onCheckedChange={(checked) => updateAnimationSetting('loadingAnimations', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">Reduced Motion</div>
                  <div className="text-xs text-muted-foreground">Accessibility mode for motion sensitivity</div>
                </div>
                <Switch 
                  checked={settings.reducedMotion} 
                  onCheckedChange={(checked) => updateAnimationSetting('reducedMotion', checked)}
                />
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