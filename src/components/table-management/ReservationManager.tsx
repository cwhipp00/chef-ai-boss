import { useState, useMemo } from 'react';
import { Calendar, Clock, Users, Phone, Mail, Plus, Search, Filter, MapPin, ChefHat } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Reservation {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  partySize: number;
  date: string;
  time: string;
  status: 'confirmed' | 'pending' | 'cancelled' | 'seated' | 'no-show';
  specialRequests?: string;
  tableNumber?: number;
  preferredSection?: string;
  dietaryRestrictions?: string[];
  occasionType?: string;
  estimatedDuration?: number;
  source: 'phone' | 'online' | 'walk-in' | 'app';
  createdAt: string;
  updatedAt: string;
}

interface Table {
  id: string;
  number: number;
  capacity: number;
  status: 'available' | 'occupied' | 'reserved' | 'cleaning' | 'out-of-order';
  section: string;
  shape: 'square' | 'round' | 'rectangle';
  preferredFor?: string[];
}

const mockReservations: Reservation[] = [
  {
    id: '1',
    customerName: 'John Smith',
    email: 'john.smith@email.com',
    phone: '(555) 123-4567',
    partySize: 4,
    date: '2024-01-15',
    time: '19:00',
    status: 'confirmed',
    specialRequests: 'Anniversary dinner, quiet table preferred',
    tableNumber: 12,
    preferredSection: 'window',
    dietaryRestrictions: ['vegetarian'],
    occasionType: 'anniversary',
    estimatedDuration: 120,
    source: 'online',
    createdAt: '2024-01-10T10:00:00Z',
    updatedAt: '2024-01-12T15:30:00Z',
  },
  {
    id: '2',
    customerName: 'Sarah Johnson',
    email: 'sarah.j@email.com',
    phone: '(555) 987-6543',
    partySize: 2,
    date: '2024-01-15',
    time: '18:30',
    status: 'pending',
    specialRequests: 'High chair needed for toddler',
    preferredSection: 'family',
    occasionType: 'casual',
    estimatedDuration: 90,
    source: 'phone',
    createdAt: '2024-01-14T09:15:00Z',
    updatedAt: '2024-01-14T09:15:00Z',
  },
  {
    id: '3',
    customerName: 'Michael Rodriguez',
    email: 'mike.r@email.com',
    phone: '(555) 456-7890',
    partySize: 8,
    date: '2024-01-16',
    time: '20:00',
    status: 'confirmed',
    specialRequests: 'Business dinner, need receipt and separate checks',
    tableNumber: 5,
    preferredSection: 'private',
    dietaryRestrictions: ['gluten-free', 'nut-free'],
    occasionType: 'business',
    estimatedDuration: 150,
    source: 'app',
    createdAt: '2024-01-08T14:20:00Z',
    updatedAt: '2024-01-09T11:45:00Z',
  },
];

const mockTables: Table[] = [
  { id: '1', number: 1, capacity: 2, status: 'available', section: 'window', shape: 'round' },
  { id: '2', number: 2, capacity: 2, status: 'occupied', section: 'center', shape: 'square' },
  { id: '3', number: 5, capacity: 8, status: 'reserved', section: 'private', shape: 'rectangle', preferredFor: ['business', 'large-party'] },
  { id: '4', number: 12, capacity: 4, status: 'occupied', section: 'window', shape: 'round', preferredFor: ['romantic', 'anniversary'] },
  { id: '5', number: 15, capacity: 6, status: 'available', section: 'center', shape: 'rectangle' },
  { id: '6', number: 18, capacity: 4, status: 'cleaning', section: 'family', shape: 'square', preferredFor: ['family'] },
];

export default function ReservationManager() {
  const [reservations, setReservations] = useState<Reservation[]>(mockReservations);
  const [tables, setTables] = useState<Table[]>(mockTables);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isNewReservationOpen, setIsNewReservationOpen] = useState(false);

  const [newReservation, setNewReservation] = useState({
    customerName: '',
    email: '',
    phone: '',
    partySize: 2,
    date: selectedDate,
    time: '19:00',
    specialRequests: '',
    preferredSection: '',
    dietaryRestrictions: [] as string[],
    occasionType: 'casual',
  });

  const filteredReservations = useMemo(() => {
    return reservations.filter(reservation => {
      const matchesSearch = 
        reservation.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reservation.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reservation.phone.includes(searchTerm);
      
      const matchesStatus = statusFilter === 'all' || reservation.status === statusFilter;
      const matchesDate = reservation.date === selectedDate;
      
      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [reservations, searchTerm, statusFilter, selectedDate]);

  const availableTables = useMemo(() => {
    return tables.filter(table => 
      table.status === 'available' && 
      table.capacity >= newReservation.partySize
    );
  }, [tables, newReservation.partySize]);

  const reservationStats = useMemo(() => {
    const dayReservations = reservations.filter(r => r.date === selectedDate);
    return {
      total: dayReservations.length,
      confirmed: dayReservations.filter(r => r.status === 'confirmed').length,
      pending: dayReservations.filter(r => r.status === 'pending').length,
      seated: dayReservations.filter(r => r.status === 'seated').length,
      totalGuests: dayReservations.reduce((sum, r) => sum + r.partySize, 0),
    };
  }, [reservations, selectedDate]);

  const getStatusBadge = (status: string) => {
    const variants = {
      'confirmed': 'bg-emerald-500 text-white',
      'pending': 'bg-amber-500 text-white',
      'cancelled': 'bg-red-500 text-white',
      'seated': 'bg-blue-500 text-white',
      'no-show': 'bg-gray-500 text-white',
    };
    
    return (
      <Badge className={variants[status as keyof typeof variants] || 'bg-gray-500 text-white'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'phone':
        return <Phone className="h-3 w-3" />;
      case 'online':
        return <Search className="h-3 w-3" />;
      case 'walk-in':
        return <Users className="h-3 w-3" />;
      case 'app':
        return <Phone className="h-3 w-3" />;
      default:
        return <Phone className="h-3 w-3" />;
    }
  };

  const handleCreateReservation = () => {
    const reservation: Reservation = {
      id: Date.now().toString(),
      ...newReservation,
      status: 'confirmed',
      source: 'phone',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setReservations(prev => [...prev, reservation]);
    setNewReservation({
      customerName: '',
      email: '',
      phone: '',
      partySize: 2,
      date: selectedDate,
      time: '19:00',
      specialRequests: '',
      preferredSection: '',
      dietaryRestrictions: [],
      occasionType: 'casual',
    });
    setIsNewReservationOpen(false);
  };

  const assignTable = (reservationId: string, tableId: string) => {
    const table = tables.find(t => t.id === tableId);
    if (!table) return;

    setReservations(prev =>
      prev.map(reservation =>
        reservation.id === reservationId
          ? { ...reservation, tableNumber: table.number }
          : reservation
      )
    );

    setTables(prev =>
      prev.map(t =>
        t.id === tableId
          ? { ...t, status: 'reserved' }
          : t
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Today's Reservations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{reservationStats.total}</div>
            <p className="text-xs text-muted-foreground">
              {reservationStats.totalGuests} total guests
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">{reservationStats.confirmed}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{reservationStats.pending}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Currently Seated</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{reservationStats.seated}</div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex gap-2">
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-40"
          />
        </div>
        
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search reservations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="seated">Seated</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>

        <Dialog open={isNewReservationOpen} onOpenChange={setIsNewReservationOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Reservation
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Reservation</DialogTitle>
              <DialogDescription>
                Add a new reservation to the system
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="customerName">Customer Name</Label>
                  <Input
                    id="customerName"
                    value={newReservation.customerName}
                    onChange={(e) => setNewReservation(prev => ({ ...prev, customerName: e.target.value }))}
                    placeholder="John Smith"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={newReservation.phone}
                    onChange={(e) => setNewReservation(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newReservation.email}
                  onChange={(e) => setNewReservation(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="john@example.com"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="partySize">Party Size</Label>
                  <Select 
                    value={newReservation.partySize.toString()} 
                    onValueChange={(value) => setNewReservation(prev => ({ ...prev, partySize: parseInt(value) }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1,2,3,4,5,6,7,8,9,10,12,15,20].map(num => (
                        <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={newReservation.date}
                    onChange={(e) => setNewReservation(prev => ({ ...prev, date: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={newReservation.time}
                    onChange={(e) => setNewReservation(prev => ({ ...prev, time: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="specialRequests">Special Requests</Label>
                <Textarea
                  id="specialRequests"
                  value={newReservation.specialRequests}
                  onChange={(e) => setNewReservation(prev => ({ ...prev, specialRequests: e.target.value }))}
                  placeholder="Any special requests or notes..."
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleCreateReservation} className="flex-1">
                  Create Reservation
                </Button>
                <Button variant="outline" onClick={() => setIsNewReservationOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Reservations List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredReservations.map((reservation) => (
          <Card key={reservation.id} className="hover:shadow-lg transition-all duration-200">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">{reservation.customerName}</CardTitle>
                    {getSourceIcon(reservation.source)}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {reservation.partySize} guests
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {reservation.time}
                    </div>
                    {reservation.tableNumber && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        Table {reservation.tableNumber}
                      </div>
                    )}
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
              </div>

              {reservation.dietaryRestrictions && reservation.dietaryRestrictions.length > 0 && (
                <div className="flex items-center gap-2">
                  <ChefHat className="h-3 w-3 text-muted-foreground" />
                  <div className="flex gap-1">
                    {reservation.dietaryRestrictions.map(restriction => (
                      <Badge key={restriction} variant="outline" className="text-xs">
                        {restriction}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {reservation.specialRequests && (
                <div className="p-2 bg-muted rounded text-sm">
                  <span className="font-medium">Notes: </span>
                  {reservation.specialRequests}
                </div>
              )}

              {!reservation.tableNumber && reservation.status === 'confirmed' && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Assign Table:</Label>
                  <div className="flex gap-2 flex-wrap">
                    {availableTables.slice(0, 3).map(table => (
                      <Button
                        key={table.id}
                        variant="outline"
                        size="sm"
                        onClick={() => assignTable(reservation.id, table.id)}
                        className="text-xs"
                      >
                        Table {table.number} ({table.capacity} seats)
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  Edit
                </Button>
                {reservation.status === 'confirmed' && (
                  <Button size="sm" className="flex-1">
                    Check In
                  </Button>
                )}
                {reservation.status === 'pending' && (
                  <Button size="sm" className="flex-1">
                    Confirm
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredReservations.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium">No reservations found</h3>
          <p className="text-muted-foreground mb-4">
            No reservations match your current filters for {new Date(selectedDate).toLocaleDateString()}
          </p>
          <Button onClick={() => setIsNewReservationOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add First Reservation
          </Button>
        </div>
      )}
    </div>
  );
}