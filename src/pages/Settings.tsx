import { useState, useEffect } from 'react';
import { Moon, Sun, Monitor, Bell, User, Shield, Database, Zap, MapPin, Users, Settings as SettingsIcon, Accessibility, HardDrive, Gauge } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useTheme } from 'next-themes';

export default function Settings() {
  const [selectedTab, setSelectedTab] = useState('general');
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: true,
    slack: false
  });

  const [preferences, setPreferences] = useState({
    language: 'en',
    timezone: 'UTC-5',
    dateFormat: 'MM/DD/YYYY',
    currency: 'USD',
    units: 'imperial',
    serviceType: 'full-service'
  });

  const [restaurantSettings, setRestaurantSettings] = useState({
    name: 'Chef AI Restaurant',
    address: '123 Main St, City, State',
    phone: '(555) 123-4567',
    email: 'info@chefai.com',
    website: 'www.chefai.com',
    operatingHours: {
      monday: { open: '09:00', close: '22:00', closed: false },
      tuesday: { open: '09:00', close: '22:00', closed: false },
      wednesday: { open: '09:00', close: '22:00', closed: false },
      thursday: { open: '09:00', close: '22:00', closed: false },
      friday: { open: '09:00', close: '23:00', closed: false },
      saturday: { open: '09:00', close: '23:00', closed: false },
      sunday: { open: '10:00', close: '21:00', closed: false }
    }
  });

  const [staffSettings, setStaffSettings] = useState({
    maxStaffCount: 50,
    shiftDuration: 8,
    breakDuration: 30,
    overtimeThreshold: 40
  });

  const [operationalSettings, setOperationalSettings] = useState({
    kitchenDisplayTimeout: 300,
    orderAutoComplete: false,
    inventoryAlerts: true,
    lowStockThreshold: 10,
    autoReorder: false
  });

  const [accessibilitySettings, setAccessibilitySettings] = useState({
    fontSize: 'medium',
    highContrast: false,
    keyboardShortcuts: true,
    screenReader: false,
    colorBlindMode: 'none'
  });

  const [dataSettings, setDataSettings] = useState({
    autoBackup: true,
    backupFrequency: 'daily',
    dataRetention: 365,
    exportFormat: 'json',
    syncEnabled: true
  });

  // Handle hydration issues with next-themes
  useEffect(() => {
    setMounted(true);
  }, []);

  const themeOptions = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor }
  ];

  // Don't render theme buttons until mounted to prevent hydration mismatch
  if (!mounted) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">Manage your Chef AI preferences</p>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="restaurant">Restaurant</TabsTrigger>
          <TabsTrigger value="staff">Staff</TabsTrigger>
          <TabsTrigger value="operations">Operations</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="accessibility">Accessibility</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sun className="h-5 w-5" />
                Appearance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label className="text-base font-medium">Theme</Label>
                <div className="grid grid-cols-3 gap-3">
                  {themeOptions.map((option) => (
                    <Button
                      key={option.value}
                      variant={theme === option.value ? 'default' : 'outline'}
                      size="lg"
                      onClick={() => setTheme(option.value)}
                      className="justify-start gap-2 h-16"
                    >
                      <option.icon className="h-5 w-5" />
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                User Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select value={preferences.language} onValueChange={(value) => 
                    setPreferences(prev => ({ ...prev, language: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={preferences.timezone} onValueChange={(value) => 
                    setPreferences(prev => ({ ...prev, timezone: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC-8">Pacific Time (UTC-8)</SelectItem>
                      <SelectItem value="UTC-7">Mountain Time (UTC-7)</SelectItem>
                      <SelectItem value="UTC-6">Central Time (UTC-6)</SelectItem>
                      <SelectItem value="UTC-5">Eastern Time (UTC-5)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateFormat">Date Format</Label>
                  <Select value={preferences.dateFormat} onValueChange={(value) => 
                    setPreferences(prev => ({ ...prev, dateFormat: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select value={preferences.currency} onValueChange={(value) => 
                    setPreferences(prev => ({ ...prev, currency: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                      <SelectItem value="GBP">GBP (£)</SelectItem>
                      <SelectItem value="CAD">CAD (C$)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="units">Measurement Units</Label>
                  <Select value={preferences.units} onValueChange={(value) => 
                    setPreferences(prev => ({ ...prev, units: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="imperial">Imperial (lbs, oz, °F)</SelectItem>
                      <SelectItem value="metric">Metric (kg, g, °C)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="serviceType">Service Type</Label>
                  <Select value={preferences.serviceType} onValueChange={(value) => 
                    setPreferences(prev => ({ ...prev, serviceType: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full-service">Full Service</SelectItem>
                      <SelectItem value="fast-casual">Fast Casual</SelectItem>
                      <SelectItem value="quick-service">Quick Service</SelectItem>
                      <SelectItem value="catering">Catering</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <Label className="text-base font-medium">Application Name</Label>
                <div className="flex items-center gap-4">
                  <Input value="Chef AI" readOnly className="max-w-sm" />
                  <p className="text-sm text-muted-foreground">
                    Your restaurant management system
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="restaurant" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Restaurant Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="restaurantName">Restaurant Name</Label>
                  <Input 
                    id="restaurantName" 
                    value={restaurantSettings.name}
                    onChange={(e) => setRestaurantSettings(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input 
                    id="phone" 
                    value={restaurantSettings.phone}
                    onChange={(e) => setRestaurantSettings(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email"
                    value={restaurantSettings.email}
                    onChange={(e) => setRestaurantSettings(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input 
                    id="website" 
                    value={restaurantSettings.website}
                    onChange={(e) => setRestaurantSettings(prev => ({ ...prev, website: e.target.value }))}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <Input 
                    id="address" 
                    value={restaurantSettings.address}
                    onChange={(e) => setRestaurantSettings(prev => ({ ...prev, address: e.target.value }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Operating Hours</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(restaurantSettings.operatingHours).map(([day, hours]) => (
                  <div key={day} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="min-w-[100px]">
                        <Label className="capitalize font-medium">{day}</Label>
                      </div>
                      <Switch
                        checked={!hours.closed}
                        onCheckedChange={(checked) => 
                          setRestaurantSettings(prev => ({
                            ...prev,
                            operatingHours: {
                              ...prev.operatingHours,
                              [day]: { ...hours, closed: !checked }
                            }
                          }))
                        }
                      />
                    </div>
                    {!hours.closed && (
                      <div className="flex items-center gap-2">
                        <Input
                          type="time"
                          value={hours.open}
                          onChange={(e) => 
                            setRestaurantSettings(prev => ({
                              ...prev,
                              operatingHours: {
                                ...prev.operatingHours,
                                [day]: { ...hours, open: e.target.value }
                              }
                            }))
                          }
                          className="w-32"
                        />
                        <span className="text-muted-foreground">to</span>
                        <Input
                          type="time"
                          value={hours.close}
                          onChange={(e) => 
                            setRestaurantSettings(prev => ({
                              ...prev,
                              operatingHours: {
                                ...prev.operatingHours,
                                [day]: { ...hours, close: e.target.value }
                              }
                            }))
                          }
                          className="w-32"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="staff" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Staff Management Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="maxStaff">Maximum Staff Count</Label>
                  <Input 
                    id="maxStaff" 
                    type="number"
                    value={staffSettings.maxStaffCount}
                    onChange={(e) => setStaffSettings(prev => ({ ...prev, maxStaffCount: parseInt(e.target.value) }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shiftDuration">Default Shift Duration (hours)</Label>
                  <Input 
                    id="shiftDuration" 
                    type="number"
                    value={staffSettings.shiftDuration}
                    onChange={(e) => setStaffSettings(prev => ({ ...prev, shiftDuration: parseInt(e.target.value) }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="breakDuration">Break Duration (minutes)</Label>
                  <Input 
                    id="breakDuration" 
                    type="number"
                    value={staffSettings.breakDuration}
                    onChange={(e) => setStaffSettings(prev => ({ ...prev, breakDuration: parseInt(e.target.value) }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="overtimeThreshold">Overtime Threshold (hours/week)</Label>
                  <Input 
                    id="overtimeThreshold" 
                    type="number"
                    value={staffSettings.overtimeThreshold}
                    onChange={(e) => setStaffSettings(prev => ({ ...prev, overtimeThreshold: parseInt(e.target.value) }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Role Permissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { role: 'Manager', permissions: ['Full Access', 'Staff Management', 'Financial Reports', 'System Settings'] },
                  { role: 'Supervisor', permissions: ['Staff Scheduling', 'Inventory Management', 'Order Management', 'Basic Reports'] },
                  { role: 'Chef', permissions: ['Recipe Management', 'Prep Lists', 'Inventory View', 'Kitchen Display'] },
                  { role: 'Server', permissions: ['Order Taking', 'Table Management', 'Customer Info', 'Basic Schedule View'] },
                  { role: 'Host', permissions: ['Reservations', 'Table Management', 'Customer Check-in', 'Basic Reports'] }
                ].map((roleInfo, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <Label className="font-medium text-base">{roleInfo.role}</Label>
                      <Button variant="outline" size="sm">Edit Permissions</Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {roleInfo.permissions.map((permission, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {permission}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="operations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SettingsIcon className="h-5 w-5" />
                Operational Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="kitchenTimeout">Kitchen Display Timeout (seconds)</Label>
                  <Input 
                    id="kitchenTimeout" 
                    type="number"
                    value={operationalSettings.kitchenDisplayTimeout}
                    onChange={(e) => setOperationalSettings(prev => ({ ...prev, kitchenDisplayTimeout: parseInt(e.target.value) }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lowStockThreshold">Low Stock Threshold (%)</Label>
                  <Input 
                    id="lowStockThreshold" 
                    type="number"
                    value={operationalSettings.lowStockThreshold}
                    onChange={(e) => setOperationalSettings(prev => ({ ...prev, lowStockThreshold: parseInt(e.target.value) }))}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Auto-Complete Orders</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically mark orders as complete when all items are prepared
                    </p>
                  </div>
                  <Switch
                    checked={operationalSettings.orderAutoComplete}
                    onCheckedChange={(checked) => 
                      setOperationalSettings(prev => ({ ...prev, orderAutoComplete: checked }))
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Inventory Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications when items are running low
                    </p>
                  </div>
                  <Switch
                    checked={operationalSettings.inventoryAlerts}
                    onCheckedChange={(checked) => 
                      setOperationalSettings(prev => ({ ...prev, inventoryAlerts: checked }))
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Auto-Reorder</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically reorder items when they reach low stock threshold
                    </p>
                  </div>
                  <Switch
                    checked={operationalSettings.autoReorder}
                    onCheckedChange={(checked) => 
                      setOperationalSettings(prev => ({ ...prev, autoReorder: checked }))
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications via email
                    </p>
                  </div>
                  <Switch
                    checked={notifications.email}
                    onCheckedChange={(checked) => 
                      setNotifications(prev => ({ ...prev, email: checked }))
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Browser push notifications
                    </p>
                  </div>
                  <Switch
                    checked={notifications.push}
                    onCheckedChange={(checked) => 
                      setNotifications(prev => ({ ...prev, push: checked }))
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">SMS Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Text message alerts for urgent items
                    </p>
                  </div>
                  <Switch
                    checked={notifications.sms}
                    onCheckedChange={(checked) => 
                      setNotifications(prev => ({ ...prev, sms: checked }))
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Slack Integration</Label>
                    <p className="text-sm text-muted-foreground">
                      Send notifications to Slack channels
                    </p>
                  </div>
                  <Switch
                    checked={notifications.slack}
                    onCheckedChange={(checked) => 
                      setNotifications(prev => ({ ...prev, slack: checked }))
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notification Types</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">High Priority</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Equipment failures</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Food safety alerts</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Security incidents</span>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Regular Updates</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Daily reports</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Inventory alerts</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Schedule changes</span>
                      <Switch />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input id="currentPassword" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input id="newPassword" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input id="confirmPassword" type="password" />
                </div>
                <Button>Update Password</Button>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Session Timeout</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically log out after inactivity
                    </p>
                  </div>
                  <Select defaultValue="30">
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 mins</SelectItem>
                      <SelectItem value="30">30 mins</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Access Log</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { time: '2 hours ago', action: 'Login', location: 'New York, NY', device: 'Chrome on MacOS' },
                  { time: '1 day ago', action: 'Password changed', location: 'New York, NY', device: 'Chrome on MacOS' },
                  { time: '3 days ago', action: 'Login', location: 'New York, NY', device: 'Mobile Safari' }
                ].map((log, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{log.action}</p>
                      <p className="text-xs text-muted-foreground">{log.device} • {log.location}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{log.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="accessibility" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Accessibility className="h-5 w-5" />
                Accessibility Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fontSize">Font Size</Label>
                  <Select value={accessibilitySettings.fontSize} onValueChange={(value) => 
                    setAccessibilitySettings(prev => ({ ...prev, fontSize: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                      <SelectItem value="extra-large">Extra Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="colorBlindMode">Color Blind Support</Label>
                  <Select value={accessibilitySettings.colorBlindMode} onValueChange={(value) => 
                    setAccessibilitySettings(prev => ({ ...prev, colorBlindMode: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="protanopia">Protanopia</SelectItem>
                      <SelectItem value="deuteranopia">Deuteranopia</SelectItem>
                      <SelectItem value="tritanopia">Tritanopia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">High Contrast Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Increase contrast for better visibility
                    </p>
                  </div>
                  <Switch
                    checked={accessibilitySettings.highContrast}
                    onCheckedChange={(checked) => 
                      setAccessibilitySettings(prev => ({ ...prev, highContrast: checked }))
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Keyboard Shortcuts</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable keyboard navigation shortcuts
                    </p>
                  </div>
                  <Switch
                    checked={accessibilitySettings.keyboardShortcuts}
                    onCheckedChange={(checked) => 
                      setAccessibilitySettings(prev => ({ ...prev, keyboardShortcuts: checked }))
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Screen Reader Support</Label>
                    <p className="text-sm text-muted-foreground">
                      Optimize interface for screen readers
                    </p>
                  </div>
                  <Switch
                    checked={accessibilitySettings.screenReader}
                    onCheckedChange={(checked) => 
                      setAccessibilitySettings(prev => ({ ...prev, screenReader: checked }))
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Keyboard Shortcuts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { action: 'New Order', shortcut: 'Ctrl + N' },
                  { action: 'Search', shortcut: 'Ctrl + K' },
                  { action: 'Quick Actions', shortcut: 'Ctrl + /' },
                  { action: 'Calendar View', shortcut: 'Ctrl + C' },
                  { action: 'Inventory', shortcut: 'Ctrl + I' },
                  { action: 'Recipes', shortcut: 'Ctrl + R' },
                  { action: 'Settings', shortcut: 'Ctrl + ,' },
                  { action: 'Help', shortcut: 'F1' }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <span className="text-sm font-medium">{item.action}</span>
                    <Badge variant="outline" className="font-mono text-xs">
                      {item.shortcut}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Connected Services
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Database className="h-8 w-8 text-primary" />
                      <div>
                        <h4 className="font-medium">Supabase</h4>
                        <p className="text-sm text-muted-foreground">Database & Auth</p>
                      </div>
                    </div>
                    <Badge className="bg-success text-success-foreground">Connected</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Backend database and authentication services
                  </p>
                  <Button variant="outline" size="sm">Configure</Button>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Bell className="h-8 w-8 text-muted-foreground" />
                      <div>
                        <h4 className="font-medium">Slack</h4>
                        <p className="text-sm text-muted-foreground">Team Communication</p>
                      </div>
                    </div>
                    <Badge variant="outline">Not Connected</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Send notifications and updates to Slack channels
                  </p>
                  <Button size="sm">Connect</Button>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">API Settings</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-medium">API Access</Label>
                      <p className="text-sm text-muted-foreground">
                        Enable API access for third-party integrations
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="apiKey">API Key</Label>
                    <div className="flex gap-2">
                      <Input 
                        id="apiKey" 
                        value="cc_api_****************************" 
                        readOnly 
                        className="font-mono"
                      />
                      <Button variant="outline">Regenerate</Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Available Integrations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { name: 'POS System', description: 'Connect your point of sale', status: 'Available', category: 'Operations' },
                  { name: 'Accounting', description: 'QuickBooks integration', status: 'Available', category: 'Finance' },
                  { name: 'Delivery Apps', description: 'DoorDash, Uber Eats', status: 'Available', category: 'Operations' },
                  { name: 'Inventory', description: 'Real-time stock tracking', status: 'Available', category: 'Inventory' },
                  { name: 'Analytics', description: 'Google Analytics', status: 'Available', category: 'Analytics' },
                  { name: 'Email Marketing', description: 'Mailchimp integration', status: 'Available', category: 'Marketing' },
                  { name: 'Reservation System', description: 'OpenTable integration', status: 'Available', category: 'Operations' },
                  { name: 'Payment Processing', description: 'Stripe, Square', status: 'Available', category: 'Finance' },
                  { name: 'Social Media', description: 'Facebook, Instagram', status: 'Available', category: 'Marketing' },
                  { name: 'Food Safety', description: 'HACCP compliance', status: 'Available', category: 'Operations' },
                  { name: 'Loyalty Programs', description: 'Customer rewards', status: 'Coming Soon', category: 'Marketing' },
                  { name: 'HR Management', description: 'Staff management', status: 'Available', category: 'Staff' }
                ].map((integration, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <h5 className="font-medium text-sm">{integration.name}</h5>
                      <Badge 
                        variant="outline" 
                        className="text-xs"
                      >
                        {integration.category}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{integration.description}</p>
                    <div className="flex items-center justify-between">
                      <Badge 
                        variant={integration.status === 'Available' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {integration.status}
                      </Badge>
                      {integration.status === 'Available' && (
                        <Button variant="outline" size="sm" className="text-xs h-6 px-2">
                          Setup
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HardDrive className="h-5 w-5" />
                    Data Management
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="backupFreq">Backup Frequency</Label>
                      <Select value={dataSettings.backupFrequency} onValueChange={(value) => 
                        setDataSettings(prev => ({ ...prev, backupFrequency: value }))
                      }>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hourly">Hourly</SelectItem>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dataRetention">Data Retention (days)</Label>
                      <Input 
                        id="dataRetention" 
                        type="number"
                        value={dataSettings.dataRetention}
                        onChange={(e) => setDataSettings(prev => ({ ...prev, dataRetention: parseInt(e.target.value) }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="exportFormat">Export Format</Label>
                      <Select value={dataSettings.exportFormat} onValueChange={(value) => 
                        setDataSettings(prev => ({ ...prev, exportFormat: value }))
                      }>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="json">JSON</SelectItem>
                          <SelectItem value="csv">CSV</SelectItem>
                          <SelectItem value="excel">Excel</SelectItem>
                          <SelectItem value="pdf">PDF</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base font-medium">Auto Backup</Label>
                        <p className="text-sm text-muted-foreground">
                          Automatically backup your data according to schedule
                        </p>
                      </div>
                      <Switch
                        checked={dataSettings.autoBackup}
                        onCheckedChange={(checked) => 
                          setDataSettings(prev => ({ ...prev, autoBackup: checked }))
                        }
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base font-medium">Cloud Sync</Label>
                        <p className="text-sm text-muted-foreground">
                          Sync data across multiple devices and locations
                        </p>
                      </div>
                      <Switch
                        checked={dataSettings.syncEnabled}
                        onCheckedChange={(checked) => 
                          setDataSettings(prev => ({ ...prev, syncEnabled: checked }))
                        }
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="flex gap-2">
                    <Button variant="outline">
                      Export All Data
                    </Button>
                    <Button variant="outline">
                      Import Data
                    </Button>
                    <Button variant="outline">
                      Create Backup Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}