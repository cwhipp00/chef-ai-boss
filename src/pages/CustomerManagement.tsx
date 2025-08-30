import { useState } from 'react';
import { User, Mail, Phone, Star, Gift, Calendar, Search, Plus, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const customers = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah.j@email.com",
    phone: "(555) 123-4567",
    visits: 24,
    totalSpent: 1250.75,
    avgSpend: 52.11,
    lastVisit: "2024-01-12",
    tier: "gold",
    preferences: ["vegetarian", "outdoor seating"],
    rating: 4.8,
    loyaltyPoints: 2450
  },
  {
    id: 2,
    name: "Michael Rodriguez",
    email: "mike.r@email.com",
    phone: "(555) 987-6543",
    visits: 18,
    totalSpent: 890.30,
    avgSpend: 49.46,
    lastVisit: "2024-01-10",
    tier: "silver",
    preferences: ["wine pairing", "business dining"],
    rating: 4.6,
    loyaltyPoints: 1780
  },
  {
    id: 3,
    name: "Emily Chen",
    email: "emily.c@email.com",
    phone: "(555) 456-7890",
    visits: 45,
    totalSpent: 2780.90,
    avgSpend: 61.80,
    lastVisit: "2024-01-14",
    tier: "platinum",
    preferences: ["gluten-free", "quiet table"],
    rating: 4.9,
    loyaltyPoints: 5560
  },
  {
    id: 4,
    name: "David Park",
    email: "david.p@email.com",
    phone: "(555) 234-5678",
    visits: 8,
    totalSpent: 340.25,
    avgSpend: 42.53,
    lastVisit: "2024-01-08",
    tier: "bronze",
    preferences: ["family dining", "kids menu"],
    rating: 4.4,
    loyaltyPoints: 680
  }
];

const loyaltyProgram = {
  tiers: [
    { name: "Bronze", minSpend: 0, benefits: ["5% discount", "Birthday reward"], color: "bg-amber-600" },
    { name: "Silver", minSpend: 500, benefits: ["10% discount", "Priority seating"], color: "bg-gray-400" },
    { name: "Gold", minSpend: 1000, benefits: ["15% discount", "Free appetizer"], color: "bg-yellow-500" },
    { name: "Platinum", minSpend: 2000, benefits: ["20% discount", "Exclusive events"], color: "bg-purple-600" }
  ]
};

const marketingCampaigns = [
  {
    id: 1,
    name: "Birthday Special",
    type: "automated",
    target: "all customers",
    sent: 142,
    opened: 89,
    clicked: 23,
    status: "active"
  },
  {
    id: 2,
    name: "Weekend Brunch",
    type: "promotional",
    target: "gold & platinum",
    sent: 67,
    opened: 51,
    clicked: 18,
    status: "completed"
  },
  {
    id: 3,
    name: "New Menu Launch",
    type: "announcement",
    target: "all customers",
    sent: 385,
    opened: 231,
    clicked: 67,
    status: "active"
  }
];

export default function CustomerManagement() {
  const [selectedTab, setSelectedTab] = useState('customers');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTier, setSelectedTier] = useState('all');

  const getTierBadge = (tier: string) => {
    const tierInfo = loyaltyProgram.tiers.find(t => t.name.toLowerCase() === tier.toLowerCase());
    if (!tierInfo) return <Badge variant="outline">{tier}</Badge>;
    
    return (
      <Badge className={`${tierInfo.color} text-white`}>
        {tierInfo.name}
      </Badge>
    );
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('');
  };

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTier = selectedTier === 'all' || customer.tier === selectedTier;
    return matchesSearch && matchesTier;
  });

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Customer Management</h1>
          <p className="text-muted-foreground">CRM, loyalty programs, and customer analytics</p>
        </div>
        <Button size="lg" className="bg-gradient-primary hover-scale">
          <Plus className="h-4 w-4 mr-2" />
          Add Customer
        </Button>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="loyalty">Loyalty Program</TabsTrigger>
          <TabsTrigger value="marketing">Marketing</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="customers" className="space-y-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedTier} onValueChange={setSelectedTier}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Tiers" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tiers</SelectItem>
                <SelectItem value="bronze">Bronze</SelectItem>
                <SelectItem value="silver">Silver</SelectItem>
                <SelectItem value="gold">Gold</SelectItem>
                <SelectItem value="platinum">Platinum</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredCustomers.map((customer) => (
              <Card key={customer.id} className="hover:shadow-medium transition-all duration-200 hover-scale">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback>
                          {getInitials(customer.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{customer.name}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 text-yellow-500 fill-current" />
                            <span className="text-sm">{customer.rating}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">•</span>
                          <span className="text-sm text-muted-foreground">{customer.visits} visits</span>
                        </div>
                      </div>
                    </div>
                    {getTierBadge(customer.tier)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Mail className="h-3 w-3 text-muted-foreground" />
                        <span className="truncate">{customer.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-3 w-3 text-muted-foreground" />
                        <span>{customer.phone}</span>
                      </div>
                    </div>
                    <div className="space-y-1 text-right">
                      <div>
                        <span className="font-medium">${customer.totalSpent.toLocaleString()}</span>
                        <p className="text-xs text-muted-foreground">Total Spent</p>
                      </div>
                      <div>
                        <span className="font-medium">${customer.avgSpend}</span>
                        <p className="text-xs text-muted-foreground">Avg Spend</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Loyalty Points</span>
                      <span className="font-medium">{customer.loyaltyPoints.toLocaleString()}</span>
                    </div>
                    <Progress value={(customer.loyaltyPoints % 1000) / 10} className="h-2" />
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {customer.preferences.map((pref) => (
                      <Badge key={pref} variant="outline" className="text-xs">
                        {pref}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      View Profile
                    </Button>
                    <Button size="sm" className="flex-1">
                      Send Offer
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="loyalty" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {loyaltyProgram.tiers.map((tier) => (
              <Card key={tier.name} className="hover:shadow-medium transition-all duration-200">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-lg ${tier.color} flex items-center justify-center`}>
                      <Gift className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{tier.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        ${tier.minSpend}+ spent
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Benefits:</h4>
                    <ul className="text-sm space-y-1">
                      {tier.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <div className="w-1 h-1 rounded-full bg-primary" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-4 text-center">
                    <span className="text-2xl font-bold">
                      {customers.filter(c => c.tier === tier.name.toLowerCase()).length}
                    </span>
                    <p className="text-xs text-muted-foreground">members</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Loyalty Program Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary">78%</p>
                  <p className="text-sm text-muted-foreground">Program Participation</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-success">$18,450</p>
                  <p className="text-sm text-muted-foreground">Points Redeemed This Month</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-warning">2.3x</p>
                  <p className="text-sm text-muted-foreground">Avg Visit Frequency Increase</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="marketing" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Campaign Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {marketingCampaigns.map((campaign) => (
                    <div key={campaign.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{campaign.name}</h4>
                        <Badge variant={campaign.status === 'active' ? 'default' : 'secondary'}>
                          {campaign.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {campaign.type} • {campaign.target}
                      </p>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="text-center">
                          <p className="font-medium">{campaign.sent}</p>
                          <p className="text-xs text-muted-foreground">Sent</p>
                        </div>
                        <div className="text-center">
                          <p className="font-medium">{campaign.opened}</p>
                          <p className="text-xs text-muted-foreground">Opened</p>
                        </div>
                        <div className="text-center">
                          <p className="font-medium">{campaign.clicked}</p>
                          <p className="text-xs text-muted-foreground">Clicked</p>
                        </div>
                      </div>
                      <div className="mt-3">
                        <div className="flex justify-between text-xs mb-1">
                          <span>Open Rate</span>
                          <span>{((campaign.opened / campaign.sent) * 100).toFixed(1)}%</span>
                        </div>
                        <Progress value={(campaign.opened / campaign.sent) * 100} className="h-1" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Customer Segments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { segment: 'Frequent Diners', count: 67, percentage: 42 },
                    { segment: 'Occasional Visitors', count: 89, percentage: 56 },
                    { segment: 'New Customers', count: 23, percentage: 15 },
                    { segment: 'VIP Members', count: 15, percentage: 9 }
                  ].map((segment) => (
                    <div key={segment.segment} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{segment.segment}</span>
                        <span className="font-medium">{segment.count} customers</span>
                      </div>
                      <Progress value={segment.percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Quick Campaign Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="h-20 flex-col gap-2">
                  <Mail className="h-6 w-6" />
                  <span>Email Campaign</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2">
                  <Gift className="h-6 w-6" />
                  <span>Loyalty Rewards</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2">
                  <Calendar className="h-6 w-6" />
                  <span>Event Invitation</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{customers.length}</div>
                <p className="text-xs text-success">+12% this month</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Avg Customer Value</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${(customers.reduce((sum, c) => sum + c.totalSpent, 0) / customers.length).toFixed(0)}
                </div>
                <p className="text-xs text-success">+8% this month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Retention Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">84.5%</div>
                <p className="text-xs text-success">+2.3% this month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4.7</div>
                <p className="text-xs text-success">+0.2 this month</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Lifetime Value</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {loyaltyProgram.tiers.map((tier) => {
                    const tierCustomers = customers.filter(c => c.tier === tier.name.toLowerCase());
                    const avgLTV = tierCustomers.length > 0 
                      ? tierCustomers.reduce((sum, c) => sum + c.totalSpent, 0) / tierCustomers.length 
                      : 0;
                    
                    return (
                      <div key={tier.name} className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${tier.color}`} />
                          <span className="text-sm">{tier.name}</span>
                        </div>
                        <span className="font-medium">${avgLTV.toFixed(0)}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Customer Acquisition</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { source: 'Referrals', customers: 45, percentage: 38 },
                    { source: 'Social Media', customers: 32, percentage: 27 },
                    { source: 'Walk-ins', customers: 28, percentage: 24 },
                    { source: 'Online Reviews', customers: 13, percentage: 11 }
                  ].map((source) => (
                    <div key={source.source} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{source.source}</span>
                        <span className="font-medium">{source.customers} customers</span>
                      </div>
                      <Progress value={source.percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}