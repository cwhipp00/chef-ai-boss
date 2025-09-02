import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Zap, 
  CreditCard, 
  MessageCircle, 
  MapPin, 
  Cloud, 
  BarChart, 
  Mail, 
  Phone,
  Settings,
  CheckCircle,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface APIIntegration {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: 'payment' | 'communication' | 'analytics' | 'pos' | 'delivery' | 'ai' | 'accounting';
  isConnected: boolean;
  isPremium?: boolean;
  features: string[];
  setupUrl?: string;
}

export function APIManager() {
  const { toast } = useToast();
  const [selectedIntegration, setSelectedIntegration] = useState<APIIntegration | null>(null);

  const integrations: APIIntegration[] = [
    {
      id: 'openai',
      name: 'OpenAI GPT',
      description: 'AI-powered recipe generation, menu optimization, and customer service',
      icon: <Zap className="h-5 w-5" />,
      category: 'ai',
      isConnected: false,
      features: ['Recipe Generation', 'Menu Analysis', 'Customer Chat Bot', 'Inventory Optimization']
    },
    {
      id: 'stripe',
      name: 'Stripe Payments',
      description: 'Accept credit cards, digital wallets, and online payments',
      icon: <CreditCard className="h-5 w-5" />,
      category: 'payment',
      isConnected: false,
      features: ['Credit Card Processing', 'Digital Wallets', 'Subscription Billing', 'Analytics']
    },
    {
      id: 'twilio',
      name: 'Twilio SMS',
      description: 'Send SMS notifications to staff and customers',
      icon: <MessageCircle className="h-5 w-5" />,
      category: 'communication',
      isConnected: false,
      features: ['SMS Notifications', 'Order Updates', 'Staff Alerts', 'Customer Communications']
    },
    {
      id: 'google-maps',
      name: 'Google Maps API',
      description: 'Location services and delivery tracking',
      icon: <MapPin className="h-5 w-5" />,
      category: 'delivery',
      isConnected: false,
      features: ['Location Services', 'Delivery Tracking', 'Distance Calculation', 'Route Optimization']
    },
    {
      id: 'quickbooks',
      name: 'QuickBooks Online',
      description: 'Automatic accounting and financial reporting',
      icon: <BarChart className="h-5 w-5" />,
      category: 'accounting',
      isConnected: false,
      isPremium: true,
      features: ['Automated Bookkeeping', 'Financial Reports', 'Tax Preparation', 'Expense Tracking']
    },
    {
      id: 'sendgrid',
      name: 'SendGrid Email',
      description: 'Reliable email delivery for receipts and marketing',
      icon: <Mail className="h-5 w-5" />,
      category: 'communication',
      isConnected: false,
      features: ['Transactional Emails', 'Marketing Campaigns', 'Email Analytics', 'Templates']
    },
    {
      id: 'square-pos',
      name: 'Square POS',
      description: 'Point of sale system integration',
      icon: <Settings className="h-5 w-5" />,
      category: 'pos',
      isConnected: false,
      features: ['POS Integration', 'Inventory Sync', 'Payment Processing', 'Sales Analytics']
    },
    {
      id: 'weather-api',
      name: 'Weather API',
      description: 'Weather-based menu planning and inventory management',
      icon: <Cloud className="h-5 w-5" />,
      category: 'analytics',
      isConnected: false,
      features: ['Weather Forecasts', 'Menu Recommendations', 'Inventory Planning', 'Seasonal Analytics']
    }
  ];

  const categoryColors = {
    payment: 'bg-success/10 text-success border-success/20',
    communication: 'bg-primary/10 text-primary border-primary/20',
    analytics: 'bg-warning/10 text-warning border-warning/20',
    pos: 'bg-accent/10 text-accent border-accent/20',
    delivery: 'bg-info/10 text-info border-info/20',
    ai: 'bg-gradient-primary text-primary-foreground border-primary/20',
    accounting: 'bg-destructive/10 text-destructive border-destructive/20'
  };

  const handleConnect = (integration: APIIntegration) => {
    setSelectedIntegration(integration);
  };

  const handleDisconnect = (integrationId: string) => {
    toast({
      title: "Integration Disconnected",
      description: `Successfully disconnected from ${integrations.find(i => i.id === integrationId)?.name}`,
    });
  };

  const handleSaveConnection = () => {
    if (selectedIntegration) {
      toast({
        title: "Integration Connected",
        description: `Successfully connected to ${selectedIntegration.name}`,
      });
      setSelectedIntegration(null);
    }
  };

  const groupedIntegrations = integrations.reduce((acc, integration) => {
    if (!acc[integration.category]) {
      acc[integration.category] = [];
    }
    acc[integration.category].push(integration);
    return acc;
  }, {} as Record<string, APIIntegration[]>);

  const categoryNames = {
    payment: 'Payment Processing',
    communication: 'Communications',
    analytics: 'Analytics & Insights', 
    pos: 'Point of Sale',
    delivery: 'Delivery & Location',
    ai: 'Artificial Intelligence',
    accounting: 'Accounting & Finance'
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gradient">API Integrations</h2>
        <p className="text-muted-foreground mt-2">Connect your restaurant to powerful third-party services</p>
      </div>

      {Object.entries(groupedIntegrations).map(([category, categoryIntegrations]) => (
        <div key={category} className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Badge className={categoryColors[category as keyof typeof categoryColors]}>
              {categoryNames[category as keyof typeof categoryNames]}
            </Badge>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categoryIntegrations.map((integration) => (
              <Card key={integration.id} className="glass-card hover-lift">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-muted/50">
                        {integration.icon}
                      </div>
                      <div>
                        <CardTitle className="text-base flex items-center gap-2">
                          {integration.name}
                          {integration.isPremium && (
                            <Badge variant="outline" className="text-xs">Premium</Badge>
                          )}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {integration.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {integration.isConnected ? (
                        <CheckCircle className="h-5 w-5 text-success" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Features:</Label>
                    <div className="flex flex-wrap gap-1">
                      {integration.features.map((feature) => (
                        <Badge key={feature} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2">
                      <Switch 
                        checked={integration.isConnected}
                        disabled={!integration.isConnected}
                      />
                      <span className="text-sm">
                        {integration.isConnected ? 'Connected' : 'Disconnected'}
                      </span>
                    </div>
                    
                    <div className="flex gap-2">
                      {integration.setupUrl && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={integration.setupUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-3 w-3 mr-1" />
                            Docs
                          </a>
                        </Button>
                      )}
                      
                      {integration.isConnected ? (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDisconnect(integration.id)}
                        >
                          Disconnect
                        </Button>
                      ) : (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              size="sm"
                              className="bg-gradient-primary hover-scale"
                              onClick={() => handleConnect(integration)}
                            >
                              Connect
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle className="flex items-center gap-2">
                                {integration.icon}
                                Connect {integration.name}
                              </DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <p className="text-sm text-muted-foreground">
                                {integration.description}
                              </p>
                              
                              <div className="space-y-4">
                                <div className="space-y-2">
                                  <Label>API Key / Token</Label>
                                  <Input placeholder="Enter your API key here..." type="password" />
                                  <p className="text-xs text-muted-foreground">
                                    Get your API key from the {integration.name} dashboard
                                  </p>
                                </div>
                                
                                {integration.id === 'stripe' && (
                                  <div className="space-y-2">
                                    <Label>Webhook Secret</Label>
                                    <Input placeholder="Webhook signing secret..." type="password" />
                                  </div>
                                )}
                                
                                {integration.id === 'twilio' && (
                                  <div className="space-y-2">
                                    <Label>Phone Number</Label>
                                    <Input placeholder="+1234567890" />
                                  </div>
                                )}
                              </div>
                              
                              <div className="flex justify-end gap-2">
                                <Button variant="outline">Cancel</Button>
                                <Button onClick={handleSaveConnection}>
                                  Connect Integration
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
      
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Custom Integration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Need a custom integration? Contact our team to build a tailored solution for your restaurant.
          </p>
          <Button variant="outline" className="hover-scale">
            <Mail className="h-4 w-4 mr-2" />
            Request Custom Integration
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}