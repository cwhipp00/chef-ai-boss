import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { OrderAnalyzer } from '@/components/ai/OrderAnalyzer';
import { AutomationHub } from '@/components/automation/AutomationHub';
import { 
  ShoppingCart, 
  Plus, 
  Search, 
  Filter, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Brain,
  Zap,
  TrendingUp,
  Users,
  Package,
  Upload,
  DollarSign
} from 'lucide-react';

const orders = [
  {
    id: "ORD-001",
    vendor: "Fresh Farm Supplies",
    items: [
      { name: "Organic Tomatoes", quantity: 50, unit: "lbs", price: 125.00 },
      { name: "Fresh Basil", quantity: 10, unit: "bunches", price: 35.00 },
      { name: "Mozzarella Cheese", quantity: 20, unit: "lbs", price: 80.00 }
    ],
    total: 240.00,
    status: "pending",
    orderDate: "2024-01-15",
    expectedDelivery: "2024-01-17",
    type: "produce"
  },
  {
    id: "ORD-002",
    vendor: "Premium Meats Co.",
    items: [
      { name: "Ribeye Steaks", quantity: 30, unit: "pieces", price: 450.00 },
      { name: "Ground Beef", quantity: 25, unit: "lbs", price: 125.00 },
      { name: "Chicken Breast", quantity: 40, unit: "lbs", price: 160.00 }
    ],
    total: 735.00,
    status: "delivered",
    orderDate: "2024-01-14",
    expectedDelivery: "2024-01-16",
    type: "meat"
  },
  {
    id: "ORD-003",
    vendor: "Ocean Fresh Seafood",
    items: [
      { name: "Atlantic Salmon", quantity: 15, unit: "lbs", price: 225.00 },
      { name: "Shrimp (Large)", quantity: 10, unit: "lbs", price: 120.00 }
    ],
    total: 345.00,
    status: "shipped",
    orderDate: "2024-01-13",
    expectedDelivery: "2024-01-16",
    type: "seafood"
  }
];

const vendors = [
  { id: 1, name: "Fresh Farm Supplies", category: "Produce", rating: 4.8, orders: 45 },
  { id: 2, name: "Premium Meats Co.", category: "Meat & Poultry", rating: 4.9, orders: 32 },
  { id: 3, name: "Ocean Fresh Seafood", category: "Seafood", rating: 4.7, orders: 28 },
  { id: 4, name: "Dairy Direct", category: "Dairy Products", rating: 4.6, orders: 38 }
];

export default function Orders() {
  const [selectedTab, setSelectedTab] = useState('orders');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVendor, setSelectedVendor] = useState('all');
  const [uploadingDocument, setUploadingDocument] = useState(false);
  const { toast } = useToast();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <Badge className="bg-warning text-warning-foreground">Pending</Badge>;
      case 'shipped': return <Badge>Shipped</Badge>;
      case 'delivered': return <Badge className="bg-success text-success-foreground">Delivered</Badge>;
      case 'cancelled': return <Badge variant="destructive">Cancelled</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'produce': return <Badge variant="secondary">Produce</Badge>;
      case 'meat': return <Badge className="bg-destructive text-destructive-foreground">Meat</Badge>;
      case 'seafood': return <Badge className="bg-info text-info-foreground">Seafood</Badge>;
      case 'dairy': return <Badge className="bg-success text-success-foreground">Dairy</Badge>;
      default: return <Badge variant="outline">{type}</Badge>;
    }
  };

  const handleDocumentUpload = () => {
    setUploadingDocument(true);
    toast({
      title: "Document Upload",
      description: "Processing invoice and creating order automatically...",
    });
    
    setTimeout(() => {
      setUploadingDocument(false);
      toast({
        title: "Order Created",
        description: "AI has parsed the invoice and created a new order automatically",
      });
    }, 2000);
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesVendor = selectedVendor === 'all' || order.vendor === selectedVendor;
    return matchesSearch && matchesVendor;
  });

  return (
    <div className="p-6 space-y-6 ml-0 sm:ml-8 lg:ml-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground ml-4 sm:ml-0">Orders Management</h1>
          <p className="text-muted-foreground ml-4 sm:ml-0">AI-powered order management with automation and analytics</p>
        </div>
        <div className="flex gap-2 mr-4 sm:mr-0">
          <Button
            variant="outline"
            onClick={handleDocumentUpload}
            disabled={uploadingDocument}
          >
            <Upload className="h-4 w-4 mr-2" />
            {uploadingDocument ? 'Processing...' : 'Upload Invoice'}
          </Button>
          <Button size="lg" className="bg-gradient-primary">
            <Plus className="h-4 w-4 mr-2" />
            New Order
          </Button>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="orders">Active Orders</TabsTrigger>
          <TabsTrigger value="ai-analysis">AI Analysis</TabsTrigger>
          <TabsTrigger value="automation">Automation</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search orders or vendors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedVendor} onValueChange={setSelectedVendor}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Vendors" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Vendors</SelectItem>
                {vendors.map((vendor) => (
                  <SelectItem key={vendor.id} value={vendor.name}>
                    {vendor.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <Card key={order.id} className="hover-lift transition-all cursor-pointer">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {order.id}
                        {getStatusBadge(order.status)}
                        {getTypeBadge(order.type)}
                      </CardTitle>
                      <p className="text-muted-foreground">{order.vendor}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">${order.total.toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground">{order.items.length} items</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">Order Items:</h4>
                        <ul className="text-sm space-y-1">
                          {order.items.slice(0, 3).map((item, index) => (
                            <li key={index} className="flex justify-between">
                              <span>{item.name}</span>
                              <span className="text-muted-foreground">
                                {item.quantity} {item.unit}
                              </span>
                            </li>
                          ))}
                          {order.items.length > 3 && (
                            <li className="text-primary">+{order.items.length - 3} more items</li>
                          )}
                        </ul>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Order Date:</span>
                          <span>{new Date(order.orderDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Expected Delivery:</span>
                          <span className="font-medium">{new Date(order.expectedDelivery).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* AI Insights for each order */}
                    <div className="p-3 bg-primary/5 rounded-lg border-l-2 border-primary/20">
                      <div className="flex items-center gap-2 mb-2">
                        <Brain className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium text-primary">AI Insights</span>
                      </div>
                      <div className="text-xs text-muted-foreground space-y-1">
                        <p>• Price 8% lower than last order - great deal!</p>
                        <p>• Delivery timing aligns with weekend rush</p>
                        <p>• Vendor performance: 98% on-time delivery</p>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm">View Details</Button>
                      <Button variant="outline" size="sm">Track Order</Button>
                      <Button size="sm" className="bg-gradient-primary">Reorder</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="ai-analysis">
          <OrderAnalyzer />
        </TabsContent>

        <TabsContent value="automation">
          <AutomationHub />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="hover-lift">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Spend</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">$12,450</div>
                <p className="text-xs text-success">+8.2% from last month</p>
                <div className="mt-2 text-xs text-muted-foreground">
                  🤖 AI suggests bulk ordering to save $340
                </div>
              </CardContent>
            </Card>

            <Card className="hover-lift">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">24</div>
                <p className="text-xs text-warning">3 pending delivery</p>
                <div className="mt-2 text-xs text-muted-foreground">
                  🤖 2 orders may arrive late
                </div>
              </CardContent>
            </Card>

            <Card className="hover-lift">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Delivery Time</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">2.3 days</div>
                <p className="text-xs text-success">-0.5 days from last month</p>
                <div className="mt-2 text-xs text-muted-foreground">
                  🤖 Switch vendors to save 0.8 days
                </div>
              </CardContent>
            </Card>

            <Card className="hover-lift">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cost Savings</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">$890</div>
                <p className="text-xs text-success">Through bulk ordering</p>
                <div className="mt-2 text-xs text-muted-foreground">
                  🤖 Potential $1,200 more savings
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="hover-lift">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary" />
                  AI Vendor Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {vendors.map((vendor, index) => (
                    <div key={vendor.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
                          <span className="text-xs font-medium text-primary-foreground">
                            {index + 1}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-sm">{vendor.name}</p>
                          <p className="text-xs text-muted-foreground">{vendor.category}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-medium">${(3000 - index * 500).toLocaleString()}</span>
                        <p className="text-xs text-green-600">Save ${index * 50}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="hover-lift">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  Smart Order Predictions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { category: 'Produce', prediction: 'Order in 2 days', confidence: '94%', savings: '$120' },
                    { category: 'Meat & Poultry', prediction: 'Order next week', confidence: '87%', savings: '$85' },
                    { category: 'Seafood', prediction: 'Stock sufficient', confidence: '92%', savings: '$0' },
                    { category: 'Dairy & Eggs', prediction: 'Order tomorrow', confidence: '98%', savings: '$45' }
                  ].map((item) => (
                    <div key={item.category} className="space-y-2 p-3 border rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-sm">{item.category}</span>
                        <Badge variant="outline">{item.confidence} confident</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{item.prediction}</p>
                      <p className="text-xs text-green-600">Potential savings: {item.savings}</p>
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