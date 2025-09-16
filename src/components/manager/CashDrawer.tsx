import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { DollarSign, Plus, Minus, Users, Clock, Brain, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface CashAnalysis {
  status: 'positive' | 'negative' | 'balanced';
  netAmount: number;
  summary: string;
  patterns: string[];
  recommendations: string[];
  alerts: string[];
}

interface CashTransaction {
  id: string;
  type: 'in' | 'out';
  amount: number;
  reason: string;
  serverName: string;
  timestamp: Date;
  notes?: string;
}

export default function CashDrawer() {
  const [transactions, setTransactions] = useState<CashTransaction[]>([]);
  const [currentBalance, setCurrentBalance] = useState(500); // Starting cash
  const [analysis, setAnalysis] = useState<CashAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    type: 'out' as 'in' | 'out',
    amount: '',
    reason: '',
    serverName: '',
    notes: ''
  });
  const { toast } = useToast();

  const addTransaction = () => {
    if (!newTransaction.amount || !newTransaction.reason || !newTransaction.serverName) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const amount = parseFloat(newTransaction.amount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount",
        variant: "destructive"
      });
      return;
    }

    const transaction: CashTransaction = {
      id: Date.now().toString(),
      type: newTransaction.type,
      amount,
      reason: newTransaction.reason,
      serverName: newTransaction.serverName,
      timestamp: new Date(),
      notes: newTransaction.notes
    };

    setTransactions([transaction, ...transactions]);
    
    // Update balance
    const newBalance = newTransaction.type === 'in' 
      ? currentBalance + amount 
      : currentBalance - amount;
    setCurrentBalance(newBalance);

    // Reset form
    setNewTransaction({
      type: 'out',
      amount: '',
      reason: '',
      serverName: '',
      notes: ''
    });

    toast({
      title: "Transaction Added",
      description: `${newTransaction.type === 'in' ? 'Added' : 'Removed'} $${amount.toFixed(2)} ${newTransaction.type === 'in' ? 'to' : 'from'} cash drawer`,
    });
  };

  const getTransactionColor = (type: 'in' | 'out') => {
    return type === 'in' ? 'text-success' : 'text-destructive';
  };

  const getTransactionIcon = (type: 'in' | 'out') => {
    return type === 'in' ? <Plus className="h-4 w-4" /> : <Minus className="h-4 w-4" />;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const runAIAnalysis = async () => {
    if (transactions.length === 0) {
      toast({
        title: "No Data",
        description: "Add some transactions first to analyze",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-cash-analyzer', {
        body: {
          transactions: transactions.map(t => ({
            ...t,
            timestamp: t.timestamp.toISOString()
          })), 
          currentBalance
        }
      });

      if (error) throw error;

      setAnalysis(data);
      toast({
        title: "Analysis Complete",
        description: "Cash flow analysis generated successfully"
      });
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Analysis Failed",
        description: "Unable to analyze transactions. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Current Balance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Cash Drawer Balance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-center py-4">
            {formatCurrency(currentBalance)}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Add Transaction */}
        <Card>
          <CardHeader>
            <CardTitle>Add Transaction</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Transaction Type</Label>
                <Select 
                  value={newTransaction.type} 
                  onValueChange={(value: 'in' | 'out') => 
                    setNewTransaction({...newTransaction, type: value})
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="in">Cash In</SelectItem>
                    <SelectItem value="out">Cash Out</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Amount</Label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={newTransaction.amount}
                  onChange={(e) => setNewTransaction({...newTransaction, amount: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Server Name</Label>
              <Input
                placeholder="Enter server name"
                value={newTransaction.serverName}
                onChange={(e) => setNewTransaction({...newTransaction, serverName: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label>Reason</Label>
              <Select 
                value={newTransaction.reason} 
                onValueChange={(value) => setNewTransaction({...newTransaction, reason: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tip-out">Tip Out</SelectItem>
                  <SelectItem value="server-owed">Server Owed Money</SelectItem>
                  <SelectItem value="register-shortage">Register Shortage</SelectItem>
                  <SelectItem value="change-fund">Change Fund</SelectItem>
                  <SelectItem value="petty-cash">Petty Cash</SelectItem>
                  <SelectItem value="deposit">Cash Deposit</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Notes (Optional)</Label>
              <Textarea
                placeholder="Additional notes..."
                value={newTransaction.notes}
                onChange={(e) => setNewTransaction({...newTransaction, notes: e.target.value})}
              />
            </div>

            <Button onClick={addTransaction} className="w-full">
              Add Transaction
            </Button>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {transactions.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No transactions yet</p>
              ) : (
                transactions.map((transaction, index) => (
                  <div key={transaction.id}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`flex items-center gap-1 ${getTransactionColor(transaction.type)}`}>
                          {getTransactionIcon(transaction.type)}
                          <span className="font-medium">
                            {formatCurrency(transaction.amount)}
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <Users className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm font-medium">{transaction.serverName}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">{transaction.reason}</p>
                          {transaction.notes && (
                            <p className="text-xs text-muted-foreground italic">{transaction.notes}</p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className="text-xs">
                          {formatTime(transaction.timestamp)}
                        </Badge>
                      </div>
                    </div>
                    {index < transactions.length - 1 && <Separator className="mt-3" />}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Analysis */}
      {transactions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              AI Cash Flow Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={runAIAnalysis} 
              disabled={isAnalyzing}
              className="w-full"
            >
              {isAnalyzing ? 'Analyzing...' : 'Analyze Cash Flow'}
            </Button>

            {analysis && (
              <div className="space-y-4">
                {/* Status */}
                <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                  {analysis.status === 'positive' ? (
                    <TrendingUp className="h-5 w-5 text-success" />
                  ) : analysis.status === 'negative' ? (
                    <TrendingDown className="h-5 w-5 text-destructive" />
                  ) : (
                    <DollarSign className="h-5 w-5 text-muted-foreground" />
                  )}
                  <div>
                    <h4 className="font-semibold">
                      Cash Flow: {formatCurrency(analysis.netAmount)}
                    </h4>
                    <p className="text-sm text-muted-foreground">{analysis.summary}</p>
                  </div>
                </div>

                {/* Alerts */}
                {analysis.alerts.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium flex items-center gap-2 text-destructive">
                      <AlertTriangle className="h-4 w-4" />
                      Alerts
                    </h4>
                    <ul className="space-y-1">
                      {analysis.alerts.map((alert, index) => (
                        <li key={index} className="text-sm text-destructive bg-destructive/10 p-2 rounded">
                          {alert}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Patterns */}
                <div className="space-y-2">
                  <h4 className="font-medium">Key Patterns</h4>
                  <ul className="space-y-1">
                    {analysis.patterns.map((pattern, index) => (
                      <li key={index} className="text-sm text-muted-foreground">
                        • {pattern}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Recommendations */}
                <div className="space-y-2">
                  <h4 className="font-medium">Recommendations</h4>
                  <ul className="space-y-1">
                    {analysis.recommendations.map((rec, index) => (
                      <li key={index} className="text-sm text-muted-foreground">
                        • {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}