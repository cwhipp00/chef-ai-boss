import { useState } from 'react';
import { Plus, Upload, Search, Filter, Package, Clock, DollarSign, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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

const orderTemplates = [
  {
    id: 1,
    name: "Weekly Produce Order",
    vendor: "Fresh Farm Supplies",
    estimatedCost: "$450",
    items: 12,
    frequency: "Weekly"
  },
  {
    id: 2,
    name: "Meat & Poultry Restock",
    vendor: "Premium Meats Co.",
    estimatedCost: "$800",
    items: 8,
    frequency: "Bi-weekly"
  },
  {
    id: 3,
    name: "Seafood Special Order",
    vendor: "Ocean Fresh Seafood",
    estimatedCost: "$600",
    items: 6,
    frequency: "As needed"
  }
];

export default function Orders() {
  const [selectedTab, setSelectedTab] = useState('active');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVendor, setSelectedVendor] = useState('all');
  const [uploadingDocument, setUploadingDocument] = useState(false);

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
    // Simulate document parsing and order creation
    setTimeout(() => {
      setUploadingDocument(false);
    }, 2000);
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesVendor = selectedVendor === 'all' || order.vendor === selectedVendor;
    return matchesSearch && matchesVendor;
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Orders Management</h1>
          <p className="text-muted-foreground">Manage supplier orders and inventory requests</p>
        </div>
        <div className="flex gap-2">
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
          <TabsTrigger value="active">Active Orders</TabsTrigger>
          <TabsTrigger value="vendors">Vendors</TabsTrigger>
          <TabsTrigger value="templates">Order Templates</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-6">
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
              <Card key={order.id} className="hover:shadow-medium transition-shadow">
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
                      <p className="text-2xl font-bold">${order.total.toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground">{order.items.length} items</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
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
                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm">View Details</Button>
                      <Button variant="outline" size="sm">Track Order</Button>
                      <Button size="sm">Reorder</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="vendors" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vendors.map((vendor) => (
              <Card key={vendor.id}>
                <CardHeader>
                  <CardTitle>{vendor.name}</CardTitle>
                  <p className="text-muted-foreground">{vendor.category}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>Rating:</span>
                    <span className="font-medium">{vendor.rating}/5.0</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Total Orders:</span>
                    <span className="font-medium">{vendor.orders}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      View Details
                    </Button>
                    <Button size="sm" className="flex-1">
                      New Order
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orderTemplates.map((template) => (
              <Card key={template.id}>
                <CardHeader>
                  <CardTitle>{template.name}</CardTitle>
                  <p className="text-muted-foreground">{template.vendor}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Estimated Cost:</span>
                      <span className="font-medium">{template.estimatedCost}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Items:</span>
                      <span className="font-medium">{template.items}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Frequency:</span>
                      <span className="font-medium">{template.frequency}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      Edit Template
                    </Button>
                    <Button size="sm" className="flex-1">
                      Use Template
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Spend</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$12,450</div>
                <p className="text-xs text-success">+8.2% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-warning">3 pending delivery</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Delivery Time</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2.3 days</div>
                <p className="text-xs text-success">-0.5 days from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cost Savings</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$890</div>
                <p className="text-xs text-success">Through bulk ordering</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Vendors by Spend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {vendors.map((vendor, index) => (
                    <div key={vendor.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                          <span className="text-xs font-medium text-primary-foreground">
                            {index + 1}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-sm">{vendor.name}</p>
                          <p className="text-xs text-muted-foreground">{vendor.category}</p>
                        </div>
                      </div>
                      <span className="font-medium">${(3000 - index * 500).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Order Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { category: 'Produce', amount: '$4,200', percentage: 34 },
                    { category: 'Meat & Poultry', amount: '$3,800', percentage: 31 },
                    { category: 'Seafood', amount: '$2,450', percentage: 20 },
                    { category: 'Dairy & Eggs', amount: '$2,000', percentage: 15 }
                  ].map((item) => (
                    <div key={item.category} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{item.category}</span>
                        <span className="font-medium">{item.amount}</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
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