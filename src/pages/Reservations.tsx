import { useState } from 'react';
import { Calendar, Clock, Users, Phone, Mail, Plus, Search, Filter, LayoutGrid, List, Settings2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import FloorPlanEditor from '@/components/table-management/FloorPlanEditor';
import ReservationManager from '@/components/table-management/ReservationManager';
import { useReservations } from '@/hooks/useReservations';

export default function Reservations() {
  const [selectedTab, setSelectedTab] = useState('reservations');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'floor' | 'list'>('floor');
  const { reservations, loading } = useReservations();

  // Mock tables data for UI demonstration
  const tables = [
    { id: 1, number: 1, capacity: 2, status: "available", location: "window" },
    { id: 2, number: 2, capacity: 2, status: "occupied", location: "center" },
    { id: 3, number: 5, capacity: 8, status: "reserved", location: "private" },
    { id: 4, number: 12, capacity: 4, status: "occupied", location: "patio" },
    { id: 5, number: 15, capacity: 6, status: "available", location: "center" }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed': return <Badge className="bg-success text-success-foreground">Confirmed</Badge>;
      case 'pending': return <Badge className="bg-warning text-warning-foreground">Pending</Badge>;
      case 'cancelled': return <Badge variant="destructive">Cancelled</Badge>;
      case 'seated': return <Badge>Seated</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTableStatusBadge = (status: string) => {
    switch (status) {
      case 'available': return <Badge className="bg-success text-success-foreground">Available</Badge>;
      case 'occupied': return <Badge variant="destructive">Occupied</Badge>;
      case 'reserved': return <Badge className="bg-warning text-warning-foreground">Reserved</Badge>;
      case 'cleaning': return <Badge variant="secondary">Cleaning</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredReservations = reservations.filter(reservation =>
    reservation.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reservation.customer_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reservation.customer_phone?.includes(searchTerm)
  );

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reservations</h1>
          <p className="text-muted-foreground">Manage table bookings and guest services</p>
        </div>
        <Button size="lg" className="bg-gradient-primary hover-scale">
          <Plus className="h-4 w-4 mr-2" />
          New Reservation
        </Button>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="reservations">Reservations</TabsTrigger>
          <TabsTrigger value="floor-plan">Floor Plan</TabsTrigger>
          <TabsTrigger value="tables">Table Management</TabsTrigger>
          <TabsTrigger value="waitlist">Waitlist</TabsTrigger>
        </TabsList>

        <TabsContent value="reservations" className="space-y-6">
          <ReservationManager />
        </TabsContent>

        <TabsContent value="floor-plan" className="space-y-6 h-[calc(100vh-200px)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h3 className="text-lg font-semibold">Interactive Floor Plan</h3>
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'floor' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('floor')}
                  className="gap-2"
                >
                  <LayoutGrid className="h-4 w-4" />
                  Floor View
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="gap-2"
                >
                  <List className="h-4 w-4" />
                  List View
                </Button>
              </div>
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <Settings2 className="h-4 w-4" />
              Layout Settings
            </Button>
          </div>
          <div className="h-full border rounded-lg bg-background">
            <FloorPlanEditor />
          </div>
        </TabsContent>

        <TabsContent value="tables" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Available Tables</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-success">
                  {tables.filter(t => t.status === 'available').length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Occupied Tables</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-destructive">
                  {tables.filter(t => t.status === 'occupied').length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Reserved Tables</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-warning">
                  {tables.filter(t => t.status === 'reserved').length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Total Capacity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">
                  {tables.reduce((sum, table) => sum + table.capacity, 0)}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tables.map((table) => (
              <Card key={table.id} className="hover:shadow-medium transition-all duration-200">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Table {table.number}</CardTitle>
                    {getTableStatusBadge(table.status)}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {table.capacity} seats
                    </div>
                    <span className="capitalize">{table.location}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Button 
                      variant={table.status === 'available' ? 'default' : 'outline'} 
                      size="sm" 
                      className="flex-1"
                      disabled={table.status === 'occupied'}
                    >
                      {table.status === 'available' ? 'Reserve' : 'View'}
                    </Button>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="waitlist" className="space-y-6">
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium">Waitlist Management</h3>
            <p className="text-muted-foreground mb-4">Manage walk-in customers and waiting queues</p>
            <Button>Add to Waitlist</Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}