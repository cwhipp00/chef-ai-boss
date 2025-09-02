import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { 
  CreditCard, 
  ShoppingCart, 
  Users, 
  TrendingUp, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  XCircle,
  RefreshCcw,
  Settings,
  Download,
  Upload,
  Eye,
  BarChart3,
  Calendar,
  Filter,
  Search,
  Receipt,
  Store,
  Utensils
} from 'lucide-react';

interface ToastOrder {
  id: string;
  order_number: string;
  customer_name?: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  total_amount: number;
  tax_amount: number;
  tip_amount: number;
  payment_method: string;
  created_at: string;
  items: ToastOrderItem[];
  table_number?: string;
  delivery_type: 'dine_in' | 'takeout' | 'delivery';
}

interface ToastOrderItem {
  id: string;
  name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  modifications?: string[];
}

interface ToastMenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  available: boolean;
  prep_time: number;
  ingredients: string[];
}

interface ToastPayment {
  id: string;
  order_id: string;
  amount: number;
  payment_method: 'cash' | 'credit' | 'debit' | 'gift_card';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  processed_at: string;
  transaction_id: string;
}

interface ToastAnalytics {
  total_sales: number;
  total_orders: number;
  average_order_value: number;
  peak_hours: { hour: number; orders: number }[];
  top_items: { name: string; quantity: number; revenue: number }[];
  payment_breakdown: { method: string; amount: number; percentage: number }[];
}

export function ToastPOSIntegration() {
  const [selectedTab, setSelectedTab] = useState('orders');
  const [orders, setOrders] = useState<ToastOrder[]>([]);
  const [menuItems, setMenuItems] = useState<ToastMenuItem[]>([]);
  const [payments, setPayments] = useState<ToastPayment[]>([]);
  const [analytics, setAnalytics] = useState<ToastAnalytics | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const { toast } = useToast();

  // Mock data
  const mockOrders: ToastOrder[] = [
    {
      id: '1',
      order_number: 'T-001',
      customer_name: 'John Smith',
      status: 'preparing',
      total_amount: 45.99,
      tax_amount: 3.68,
      tip_amount: 9.20,
      payment_method: 'Credit Card',
      created_at: new Date().toISOString(),
      delivery_type: 'dine_in',
      table_number: '12',
      items: [
        { id: '1', name: 'Grilled Salmon', quantity: 1, unit_price: 24.99, total_price: 24.99 },
        { id: '2', name: 'Caesar Salad', quantity: 1, unit_price: 12.99, total_price: 12.99 },
        { id: '3', name: 'House Wine', quantity: 2, unit_price: 4.00, total_price: 8.00 }
      ]
    },
    {
      id: '2',
      order_number: 'T-002',
      customer_name: 'Sarah Johnson',
      status: 'ready',
      total_amount: 28.50,
      tax_amount: 2.28,
      tip_amount: 5.70,
      payment_method: 'Cash',
      created_at: new Date(Date.now() - 1800000).toISOString(),
      delivery_type: 'takeout',
      items: [
        { id: '1', name: 'Chicken Burger', quantity: 2, unit_price: 14.25, total_price: 28.50 }
      ]
    }
  ];

  const mockMenuItems: ToastMenuItem[] = [
    {
      id: '1',
      name: 'Grilled Salmon',
      description: 'Fresh Atlantic salmon with herbs and lemon',
      price: 24.99,
      category: 'Entrees',
      available: true,
      prep_time: 15,
      ingredients: ['salmon', 'herbs', 'lemon', 'vegetables']
    },
    {
      id: '2',
      name: 'Caesar Salad',
      description: 'Crisp romaine with Caesar dressing and croutons',
      price: 12.99,
      category: 'Salads',
      available: true,
      prep_time: 5,
      ingredients: ['romaine', 'caesar dressing', 'croutons', 'parmesan']
    },
    {
      id: '3',
      name: 'Ribeye Steak',
      description: '12oz prime ribeye cooked to perfection',
      price: 32.99,
      category: 'Entrees',
      available: false,
      prep_time: 20,
      ingredients: ['ribeye', 'seasoning', 'butter']
    }
  ];

  const mockAnalytics: ToastAnalytics = {
    total_sales: 15420.50,
    total_orders: 247,
    average_order_value: 62.43,
    peak_hours: [
      { hour: 12, orders: 45 },
      { hour: 18, orders: 62 },
      { hour: 19, orders: 58 }
    ],
    top_items: [
      { name: 'Grilled Salmon', quantity: 89, revenue: 2223.11 },
      { name: 'Caesar Salad', quantity: 156, revenue: 2026.44 },
      { name: 'Chicken Burger', quantity: 134, revenue: 1909.50 }
    ],
    payment_breakdown: [
      { method: 'Credit Card', amount: 12336.40, percentage: 80 },
      { method: 'Cash', amount: 2314.08, percentage: 15 },
      { method: 'Gift Card', amount: 770.02, percentage: 5 }
    ]
  };

  useEffect(() => {
    // Simulate loading data
    setOrders(mockOrders);
    setMenuItems(mockMenuItems);
    setAnalytics(mockAnalytics);
    setIsConnected(true);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-success text-success-foreground';
      case 'ready':
        return 'bg-primary text-primary-foreground';
      case 'preparing':
        return 'bg-warning text-warning-foreground';
      case 'pending':
        return 'bg-muted text-muted-foreground';
      case 'cancelled':
        return 'bg-destructive text-destructive-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const handleSyncData = () => {
    toast({
      title: "Syncing Toast POS Data",
      description: "Fetching latest orders and menu updates...",
    });
    
    // Simulate data sync
    setTimeout(() => {
      toast({
        title: "Sync Complete",
        description: "Successfully updated orders and menu items",
      });
    }, 2000);
  };

  const handleOrderStatusUpdate = (orderId: string, newStatus: string) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: newStatus as any } : order
    ));
    
    toast({
      title: "Order Updated",
      description: `Order ${orderId} status changed to ${newStatus}`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gradient">Toast POS Integration</h2>
          <p className="text-muted-foreground">Manage orders, menu, and payments from Toast POS</p>
        </div>
        <div className="flex gap-3">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-success animate-pulse' : 'bg-destructive'}`} />
            <span className="text-sm">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          <Button variant="outline" onClick={handleSyncData} className="hover-scale">
            <RefreshCcw className="h-4 w-4 mr-2" />
            Sync Data
          </Button>
          <Dialog open={isConfigOpen} onOpenChange={setIsConfigOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="hover-scale">
                <Settings className="h-4 w-4 mr-2" />
                Configure
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Toast POS Configuration</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Restaurant GUID</label>
                  <Input placeholder="Enter your Toast restaurant GUID" />
                </div>
                <div>
                  <label className="text-sm font-medium">Client ID</label>
                  <Input placeholder="Enter Toast API client ID" />
                </div>
                <div>
                  <label className="text-sm font-medium">Client Secret</label>
                  <Input type="password" placeholder="Enter Toast API client secret" />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsConfigOpen(false)}>Cancel</Button>
                  <Button onClick={() => {
                    toast({ title: "Configuration saved successfully" });
                    setIsConfigOpen(false);
                  }}>Save Configuration</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid grid-cols-4 w-full max-w-2xl h-14 bg-gradient-to-r from-muted/20 via-muted/10 to-muted/20 backdrop-blur-sm border border-border/50 shadow-lg">
          <TabsTrigger value="orders" className="text-sm font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/80 data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg hover-scale transition-all duration-300">
            <ShoppingCart className="h-4 w-4 mr-2" />
            Orders
          </TabsTrigger>
          <TabsTrigger value="menu" className="text-sm font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/80 data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg hover-scale transition-all duration-300">
            <Utensils className="h-4 w-4 mr-2" />
            Menu
          </TabsTrigger>
          <TabsTrigger value="payments" className="text-sm font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/80 data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg hover-scale transition-all duration-300">
            <CreditCard className="h-4 w-4 mr-2" />
            Payments
          </TabsTrigger>
          <TabsTrigger value="analytics" className="text-sm font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/80 data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg hover-scale transition-all duration-300">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* Orders Tab */}
        <TabsContent value="orders" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {orders.map((order) => (
              <Card key={order.id} className="glass-card hover-scale">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">#{order.order_number}</CardTitle>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {order.customer_name && `${order.customer_name} • `}
                    {order.delivery_type.replace('_', ' ')}
                    {order.table_number && ` • Table ${order.table_number}`}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span>{item.quantity}x {item.name}</span>
                        <span>${item.total_price.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t pt-3 space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal:</span>
                      <span>${(order.total_amount - order.tax_amount).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Tax:</span>
                      <span>${order.tax_amount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Tip:</span>
                      <span>${order.tip_amount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-medium">
                      <span>Total:</span>
                      <span>${(order.total_amount + order.tip_amount).toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    {order.status === 'pending' && (
                      <Button 
                        size="sm" 
                        onClick={() => handleOrderStatusUpdate(order.id, 'confirmed')}
                        className="flex-1"
                      >
                        Confirm
                      </Button>
                    )}
                    {order.status === 'confirmed' && (
                      <Button 
                        size="sm" 
                        onClick={() => handleOrderStatusUpdate(order.id, 'preparing')}
                        className="flex-1"
                      >
                        Start Prep
                      </Button>
                    )}
                    {order.status === 'preparing' && (
                      <Button 
                        size="sm" 
                        onClick={() => handleOrderStatusUpdate(order.id, 'ready')}
                        className="flex-1"
                      >
                        Mark Ready
                      </Button>
                    )}
                    {order.status === 'ready' && (
                      <Button 
                        size="sm" 
                        onClick={() => handleOrderStatusUpdate(order.id, 'completed')}
                        className="flex-1"
                      >
                        Complete
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Menu Tab */}
        <TabsContent value="menu" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {menuItems.map((item) => (
              <Card key={item.id} className="glass-card hover-scale">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{item.name}</CardTitle>
                    <Badge variant={item.available ? 'default' : 'secondary'}>
                      {item.available ? 'Available' : 'Unavailable'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold">${item.price}</span>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      {item.prep_time} min
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-1">Ingredients:</h4>
                    <div className="flex flex-wrap gap-1">
                      {item.ingredients.map((ingredient, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {ingredient}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                    <Button 
                      size="sm" 
                      variant={item.available ? 'outline' : 'default'}
                      className="flex-1"
                      onClick={() => {
                        setMenuItems(prev => prev.map(menuItem => 
                          menuItem.id === item.id 
                            ? { ...menuItem, available: !menuItem.available }
                            : menuItem
                        ));
                        toast({
                          title: `${item.name} ${item.available ? 'disabled' : 'enabled'}`,
                        });
                      }}
                    >
                      {item.available ? 'Disable' : 'Enable'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Payments Tab */}
        <TabsContent value="payments" className="mt-6">
          <div className="text-center py-12">
            <CreditCard className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-medium mb-2">Payment Processing</h3>
            <p className="text-muted-foreground mb-6">View and manage Toast POS payment transactions</p>
            <Button className="bg-gradient-primary hover-scale">
              <Receipt className="h-4 w-4 mr-2" />
              View Payment History
            </Button>
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="mt-6">
          {analytics && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <Card className="glass-card">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <DollarSign className="h-8 w-8 text-success" />
                    <div>
                      <p className="text-sm text-muted-foreground">Total Sales</p>
                      <p className="text-2xl font-bold">${analytics.total_sales.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <ShoppingCart className="h-8 w-8 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Total Orders</p>
                      <p className="text-2xl font-bold">{analytics.total_orders}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <TrendingUp className="h-8 w-8 text-warning" />
                    <div>
                      <p className="text-sm text-muted-foreground">Avg Order Value</p>
                      <p className="text-2xl font-bold">${analytics.average_order_value.toFixed(2)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <Clock className="h-8 w-8 text-accent" />
                    <div>
                      <p className="text-sm text-muted-foreground">Peak Hour</p>
                      <p className="text-2xl font-bold">7 PM</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Top Selling Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics?.top_items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">{item.quantity} sold</p>
                      </div>
                      <p className="font-bold">${item.revenue.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics?.payment_breakdown.map((payment, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between">
                        <span>{payment.method}</span>
                        <span className="font-medium">{payment.percentage}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-gradient-primary h-2 rounded-full" 
                          style={{ width: `${payment.percentage}%` }}
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