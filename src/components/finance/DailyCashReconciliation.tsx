import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  Calculator, 
  CreditCard, 
  Banknote, 
  CheckCircle, 
  AlertTriangle,
  X,
  Plus,
  Save,
  FileText,
  Clock
} from 'lucide-react';

interface PaymentMethod {
  method: string;
  posTotal: number;
  actualCount: number;
  difference: number;
  status: 'matched' | 'over' | 'short';
}

interface CashBreakdown {
  denomination: string;
  count: number;
  value: number;
  total: number;
}

interface Discrepancy {
  id: string;
  type: string;
  amount: number;
  description: string;
  resolved: boolean;
}

export const DailyCashReconciliation = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [reconciliationComplete, setReconciliationComplete] = useState(false);
  
  // Mock data - will be populated from Toast POS API
  const [posData] = useState({
    totalSales: 15420.75,
    cashSales: 2840.50,
    cardSales: 11680.25,
    otherPayments: 900.00,
    tips: 1250.00,
    voids: 45.50,
    discounts: 125.75
  });

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    { method: 'Cash', posTotal: 2840.50, actualCount: 2795.00, difference: -45.50, status: 'short' },
    { method: 'Credit Cards', posTotal: 8420.25, actualCount: 8420.25, difference: 0, status: 'matched' },
    { method: 'Debit Cards', posTotal: 3260.00, actualCount: 3260.00, difference: 0, status: 'matched' },
    { method: 'Gift Cards', posTotal: 450.00, actualCount: 470.00, difference: 20.00, status: 'over' },
    { method: 'Mobile Pay', posTotal: 450.00, actualCount: 450.00, difference: 0, status: 'matched' }
  ]);

  const [cashBreakdown, setCashBreakdown] = useState<CashBreakdown[]>([
    { denomination: '$100', count: 15, value: 100, total: 1500 },
    { denomination: '$50', count: 8, value: 50, total: 400 },
    { denomination: '$20', count: 25, value: 20, total: 500 },
    { denomination: '$10', count: 18, value: 10, total: 180 },
    { denomination: '$5', count: 12, value: 5, total: 60 },
    { denomination: '$1', count: 85, value: 1, total: 85 },
    { denomination: 'Quarters', count: 280, value: 0.25, total: 70 }
  ]);

  const [discrepancies, setDiscrepancies] = useState<Discrepancy[]>([
    {
      id: '1',
      type: 'Cash Short',
      amount: -45.50,
      description: 'Missing cash from register 2, investigating with evening shift',
      resolved: false
    }
  ]);

  const [notes, setNotes] = useState('');

  const updateCashCount = (index: number, count: number) => {
    const updated = [...cashBreakdown];
    updated[index].count = count;
    updated[index].total = count * updated[index].value;
    setCashBreakdown(updated);
    
    // Update actual cash count in payment methods
    const totalCash = updated.reduce((sum, item) => sum + item.total, 0);
    const updatedPayments = [...paymentMethods];
    const cashIndex = updatedPayments.findIndex(p => p.method === 'Cash');
    if (cashIndex !== -1) {
      updatedPayments[cashIndex].actualCount = totalCash;
      updatedPayments[cashIndex].difference = totalCash - updatedPayments[cashIndex].posTotal;
      updatedPayments[cashIndex].status = 
        totalCash === updatedPayments[cashIndex].posTotal ? 'matched' :
        totalCash > updatedPayments[cashIndex].posTotal ? 'over' : 'short';
      setPaymentMethods(updatedPayments);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'matched': return 'text-success';
      case 'over': return 'text-warning';
      case 'short': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'matched': return { color: 'bg-success', text: 'Matched' };
      case 'over': return { color: 'bg-warning', text: 'Over' };
      case 'short': return { color: 'bg-destructive', text: 'Short' };
      default: return { color: 'bg-muted', text: 'Unknown' };
    }
  };

  const getTotalActual = () => {
    return paymentMethods.reduce((sum, method) => sum + method.actualCount, 0);
  };

  const getTotalDifference = () => {
    return paymentMethods.reduce((sum, method) => sum + method.difference, 0);
  };

  const addDiscrepancy = () => {
    const newDiscrepancy: Discrepancy = {
      id: Date.now().toString(),
      type: 'Other',
      amount: 0,
      description: '',
      resolved: false
    };
    setDiscrepancies([...discrepancies, newDiscrepancy]);
  };

  const removeDiscrepancy = (id: string) => {
    setDiscrepancies(discrepancies.filter(d => d.id !== id));
  };

  const completeReconciliation = () => {
    setReconciliationComplete(true);
    // In real implementation, this would save to database
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Daily Cash Reconciliation</h2>
          <p className="text-muted-foreground">Match POS data with actual cash deposits</p>
        </div>
        <div className="flex items-center gap-3">
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-40"
          />
          <Button 
            onClick={completeReconciliation}
            disabled={reconciliationComplete}
            className="bg-gradient-primary"
          >
            <Save className="h-4 w-4 mr-2" />
            {reconciliationComplete ? 'Completed' : 'Complete Reconciliation'}
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="glass-card hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">POS Total Sales</CardTitle>
            <Calculator className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${posData.totalSales.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">System recorded</p>
          </CardContent>
        </Card>

        <Card className="glass-card hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Actual Counted</CardTitle>
            <Banknote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${getTotalActual().toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Physical count</p>
          </CardContent>
        </Card>

        <Card className="glass-card hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Difference</CardTitle>
            {getTotalDifference() === 0 ? (
              <CheckCircle className="h-4 w-4 text-success" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-warning" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getTotalDifference() === 0 ? 'text-success' : getTotalDifference() > 0 ? 'text-warning' : 'text-destructive'}`}>
              {getTotalDifference() >= 0 ? '+' : ''}${getTotalDifference().toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              {getTotalDifference() === 0 ? 'Perfect match' : getTotalDifference() > 0 ? 'Overage' : 'Shortage'}
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
            {reconciliationComplete ? (
              <CheckCircle className="h-4 w-4 text-success" />
            ) : (
              <Clock className="h-4 w-4 text-warning" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-sm font-bold ${reconciliationComplete ? 'text-success' : 'text-warning'}`}>
              {reconciliationComplete ? 'Complete' : 'In Progress'}
            </div>
            <p className="text-xs text-muted-foreground">
              {reconciliationComplete ? 'Reconciliation finished' : 'Awaiting completion'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Payment Methods Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Methods Reconciliation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {paymentMethods.map((method, index) => {
            const badge = getStatusBadge(method.status);
            
            return (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <h4 className="font-medium">{method.method}</h4>
                    <Badge className={`${badge.color} text-white`}>
                      {badge.text}
                    </Badge>
                  </div>
                  <div className={`font-medium ${getStatusColor(method.status)}`}>
                    {method.difference >= 0 ? '+' : ''}${method.difference.toFixed(2)}
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">POS Total</p>
                    <p className="font-medium">${method.posTotal.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Actual Count</p>
                    <p className="font-medium">${method.actualCount.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Difference</p>
                    <p className={`font-medium ${getStatusColor(method.status)}`}>
                      {method.difference >= 0 ? '+' : ''}${method.difference.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Cash Count Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Banknote className="h-5 w-5" />
            Cash Count Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {cashBreakdown.map((item, index) => (
              <div key={index} className="p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{item.denomination}</span>
                  <span className="text-sm text-muted-foreground">
                    ${item.value === 1 ? '1.00' : item.value.toFixed(2)}
                  </span>
                </div>
                <div className="space-y-2">
                  <Input
                    type="number"
                    value={item.count}
                    onChange={(e) => updateCashCount(index, parseInt(e.target.value) || 0)}
                    placeholder="Count"
                    className="text-center"
                  />
                  <div className="text-center font-medium">
                    ${item.total.toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-muted/30 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-medium">Total Cash Count:</span>
              <span className="text-xl font-bold">
                ${cashBreakdown.reduce((sum, item) => sum + item.total, 0).toFixed(2)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Discrepancies */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Discrepancies & Issues
            </CardTitle>
            <Button onClick={addDiscrepancy} size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Issue
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {discrepancies.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle className="h-12 w-12 mx-auto mb-2 text-success" />
              <p>No discrepancies reported</p>
            </div>
          ) : (
            discrepancies.map((discrepancy) => (
              <div key={discrepancy.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <Input
                        value={discrepancy.type}
                        onChange={(e) => {
                          const updated = discrepancies.map(d => 
                            d.id === discrepancy.id ? { ...d, type: e.target.value } : d
                          );
                          setDiscrepancies(updated);
                        }}
                        placeholder="Issue type"
                        className="w-40"
                      />
                      <Input
                        type="number"
                        step="0.01"
                        value={discrepancy.amount}
                        onChange={(e) => {
                          const updated = discrepancies.map(d => 
                            d.id === discrepancy.id ? { ...d, amount: parseFloat(e.target.value) || 0 } : d
                          );
                          setDiscrepancies(updated);
                        }}
                        placeholder="Amount"
                        className="w-32"
                      />
                    </div>
                    <Textarea
                      value={discrepancy.description}
                      onChange={(e) => {
                        const updated = discrepancies.map(d => 
                          d.id === discrepancy.id ? { ...d, description: e.target.value } : d
                        );
                        setDiscrepancies(updated);
                      }}
                      placeholder="Description of the issue..."
                      className="min-h-[60px]"
                    />
                  </div>
                  <Button
                    onClick={() => removeDiscrepancy(discrepancy.id)}
                    size="sm"
                    variant="ghost"
                    className="text-destructive hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Notes & Comments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Notes & Comments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any additional notes about today's reconciliation..."
            className="min-h-[100px]"
          />
        </CardContent>
      </Card>

      {/* Reconciliation Summary */}
      {reconciliationComplete && (
        <Card className="border-success">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-success">
              <CheckCircle className="h-5 w-5" />
              Reconciliation Complete
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Completed By</p>
                <p className="font-medium">Current User</p>
              </div>
              <div>
                <p className="text-muted-foreground">Completed At</p>
                <p className="font-medium">{new Date().toLocaleString()}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Final Variance</p>
                <p className={`font-medium ${getTotalDifference() === 0 ? 'text-success' : 'text-warning'}`}>
                  ${Math.abs(getTotalDifference()).toFixed(2)}
                </p>
              </div>
            </div>
            <div className="p-3 bg-success/10 rounded-lg">
              <p className="text-sm text-success">
                Daily reconciliation has been completed and saved. All discrepancies have been documented.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};