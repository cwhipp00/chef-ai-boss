import { useState } from 'react';
import { Calendar, Clock, Users, Phone, Mail, Plus, Search, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const reservations = [
  {
    id: 1,
    customerName: "John Smith",
    email: "john.smith@email.com",
    phone: "(555) 123-4567",
    partySize: 4,
    date: "2024-01-15",
    time: "7:00 PM",
    status: "confirmed",
    specialRequests: "Anniversary dinner, quiet table",
    tableNumber: 12
  },
  {
    id: 2,
    customerName: "Sarah Johnson",
    email: "sarah.j@email.com",
    phone: "(555) 987-6543",
    partySize: 2,
    date: "2024-01-15",
    time: "6:30 PM",
    status: "pending",
    specialRequests: "Vegetarian options",
    tableNumber: null
  },
  {
    id: 3,
    customerName: "Mike Rodriguez",
    email: "mike.r@email.com",
    phone: "(555) 456-7890",
    partySize: 8,
    date: "2024-01-16",
    time: "8:00 PM",
    status: "confirmed",
    specialRequests: "Business dinner, need receipt",
    tableNumber: 5
  }
];

const tables = [
  { id: 1, number: 1, capacity: 2, status: "available", location: "window" },
  { id: 2, number: 2, capacity: 2, status: "occupied", location: "center" },
  { id: 3, number: 5, capacity: 8, status: "reserved", location: "private" },
  { id: 4, number: 12, capacity: 4, status: "occupied", location: "patio" },
  { id: 5, number: 15, capacity: 6, status: "available", location: "center" }
];

export default function Reservations() {
  const [selectedTab, setSelectedTab] = useState('reservations');
  const [searchTerm, setSearchTerm] = useState('');

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
    reservation.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reservation.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reservation.phone.includes(searchTerm)
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
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="reservations">Reservations</TabsTrigger>
          <TabsTrigger value="tables">Table Management</TabsTrigger>
          <TabsTrigger value="waitlist">Waitlist</TabsTrigger>
        </TabsList>

        <TabsContent value="reservations" className="space-y-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search reservations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select defaultValue="today">
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="tomorrow">Tomorrow</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredReservations.map((reservation) => (
              <Card key={reservation.id} className="hover:shadow-medium transition-all duration-200 hover-scale">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{reservation.customerName}</CardTitle>
                      <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {reservation.partySize} guests
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(reservation.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {reservation.time}
                        </div>
                      </div>
                    </div>
                    {getStatusBadge(reservation.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-3 w-3 text-muted-foreground" />
                      <span>{reservation.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-3 w-3 text-muted-foreground" />
                      <span>{reservation.phone}</span>
                    </div>
                    {reservation.tableNumber && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-medium">Table {reservation.tableNumber}</span>
                      </div>
                    )}
                  </div>
                  {reservation.specialRequests && (
                    <div className="p-2 bg-muted rounded text-sm">
                      <span className="font-medium">Special Requests: </span>
                      {reservation.specialRequests}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      Edit
                    </Button>
                    <Button size="sm" className="flex-1">
                      Check In
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
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