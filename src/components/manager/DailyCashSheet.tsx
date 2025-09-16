import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Calendar, Save, Download, Calculator } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DailyCashData {
  [key: string]: {
    // Sales Data
    takeOut: number;
    eatIn: number;
    totalNetSales: number;
    taxTotal: number;
    giftCertSold: number;
    giftCertRedeemed: number;
    totalSalesTax: number;
    
    // POS Data
    cashDue: number;
    visa: number;
    mastercard: number;
    amex: number;
    discover: number;
    posCashCharges: number;
    
    // Actual Cash & Charges
    depositCash: number;
    actualChargeReceipts: number;
    actualCashCharges: number;
    overShort: number;
  };
}

const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function DailyCashSheet() {
  const [weekData, setWeekData] = useState<DailyCashData>(() => {
    const initialData: DailyCashData = {};
    daysOfWeek.forEach(day => {
      initialData[day] = {
        takeOut: 0,
        eatIn: 0,
        totalNetSales: 0,
        taxTotal: 0,
        giftCertSold: 0,
        giftCertRedeemed: 0,
        totalSalesTax: 0,
        cashDue: 0,
        visa: 0,
        mastercard: 0,
        amex: 0,
        discover: 0,
        posCashCharges: 0,
        depositCash: 0,
        actualChargeReceipts: 0,
        actualCashCharges: 0,
        overShort: 0
      };
    });
    return initialData;
  });

  const [selectedDate, setSelectedDate] = useState(new Date());
  const { toast } = useToast();

  const updateValue = (day: string, field: string, value: number) => {
    const newData = { ...weekData };
    newData[day] = { ...newData[day], [field]: value };
    
    // Auto-calculate derived fields
    if (['takeOut', 'eatIn'].includes(field)) {
      newData[day].totalNetSales = newData[day].takeOut + newData[day].eatIn;
      newData[day].totalSalesTax = newData[day].totalNetSales + newData[day].taxTotal + 
        newData[day].giftCertSold - newData[day].giftCertRedeemed;
    }
    
    if (['cashDue', 'visa', 'mastercard', 'amex', 'discover'].includes(field)) {
      newData[day].posCashCharges = newData[day].cashDue + newData[day].visa + 
        newData[day].mastercard + newData[day].amex + newData[day].discover;
    }
    
    if (['depositCash', 'actualChargeReceipts'].includes(field)) {
      newData[day].actualCashCharges = newData[day].depositCash + newData[day].actualChargeReceipts;
      newData[day].overShort = newData[day].actualCashCharges - newData[day].posCashCharges;
    }
    
    setWeekData(newData);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getWeekTotal = (field: string) => {
    return daysOfWeek.reduce((total, day) => {
      const dayData = weekData[day];
      return total + (dayData[field as keyof typeof dayData] as number || 0);
    }, 0);
  };

  const saveSheet = () => {
    // Here you would typically save to your database
    toast({
      title: "Cash Sheet Saved",
      description: "Daily cash sheet has been saved successfully",
    });
  };

  const exportSheet = () => {
    // Here you would typically export to Excel or PDF
    toast({
      title: "Export Started",
      description: "Cash sheet export is being prepared",
    });
  };

  const InputCell = ({ day, field, value, isCalculated = false }: { 
    day: string; 
    field: string; 
    value: number; 
    isCalculated?: boolean;
  }) => (
    <TableCell className="p-1">
      <Input
        type="number"
        step="0.01"
        value={value || ''}
        onChange={(e) => updateValue(day, field, parseFloat(e.target.value) || 0)}
        className={`text-center text-sm ${isCalculated ? 'bg-muted' : ''}`}
        disabled={isCalculated}
      />
    </TableCell>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Daily Cash Sheet - The Breakfast Club
              </CardTitle>
              <p className="text-muted-foreground">Weekly sales and cash deposit statement</p>
            </div>
            <div className="flex gap-2">
              <Button onClick={saveSheet} size="sm">
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button onClick={exportSheet} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Cash Sheet Table */}
      <Card>
        <CardContent className="p-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-48">Category</TableHead>
                  {dayLabels.map((day, index) => (
                    <TableHead key={day} className="text-center min-w-24">
                      {day}
                      <br />
                      <span className="text-xs text-muted-foreground">
                        {new Date(selectedDate.getTime() - (6 - index) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' })}
                      </span>
                    </TableHead>
                  ))}
                  <TableHead className="text-center min-w-24">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Taxable Sales Section */}
                <TableRow className="bg-muted/50">
                  <TableCell className="font-semibold">Taxable Sales</TableCell>
                  {daysOfWeek.map(day => <TableCell key={day}></TableCell>)}
                  <TableCell></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="pl-6">Take-Out</TableCell>
                  {daysOfWeek.map(day => (
                    <InputCell key={day} day={day} field="takeOut" value={weekData[day].takeOut} />
                  ))}
                  <TableCell className="text-center font-medium">
                    {formatCurrency(getWeekTotal('takeOut'))}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="pl-6">Eat-In</TableCell>
                  {daysOfWeek.map(day => (
                    <InputCell key={day} day={day} field="eatIn" value={weekData[day].eatIn} />
                  ))}
                  <TableCell className="text-center font-medium">
                    {formatCurrency(getWeekTotal('eatIn'))}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="pl-6 font-medium">= Total Net Sales</TableCell>
                  {daysOfWeek.map(day => (
                    <InputCell key={day} day={day} field="totalNetSales" value={weekData[day].totalNetSales} isCalculated />
                  ))}
                  <TableCell className="text-center font-medium bg-muted">
                    {formatCurrency(getWeekTotal('totalNetSales'))}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="pl-6">+ Tax Total (Sales Tax)</TableCell>
                  {daysOfWeek.map(day => (
                    <InputCell key={day} day={day} field="taxTotal" value={weekData[day].taxTotal} />
                  ))}
                  <TableCell className="text-center font-medium">
                    {formatCurrency(getWeekTotal('taxTotal'))}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="pl-6">+ Gift Cert Sold</TableCell>
                  {daysOfWeek.map(day => (
                    <InputCell key={day} day={day} field="giftCertSold" value={weekData[day].giftCertSold} />
                  ))}
                  <TableCell className="text-center font-medium">
                    {formatCurrency(getWeekTotal('giftCertSold'))}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="pl-6">- Gift Certs Redeemed</TableCell>
                  {daysOfWeek.map(day => (
                    <InputCell key={day} day={day} field="giftCertRedeemed" value={weekData[day].giftCertRedeemed} />
                  ))}
                  <TableCell className="text-center font-medium">
                    {formatCurrency(getWeekTotal('giftCertRedeemed'))}
                  </TableCell>
                </TableRow>
                <TableRow className="border-b-2">
                  <TableCell className="pl-6 font-medium">= Total Sales + Tax</TableCell>
                  {daysOfWeek.map(day => (
                    <InputCell key={day} day={day} field="totalSalesTax" value={weekData[day].totalSalesTax} isCalculated />
                  ))}
                  <TableCell className="text-center font-medium bg-muted">
                    {formatCurrency(getWeekTotal('totalSalesTax'))}
                  </TableCell>
                </TableRow>

                {/* POS Data Section */}
                <TableRow className="bg-muted/50">
                  <TableCell className="font-semibold">POS Data</TableCell>
                  {daysOfWeek.map(day => <TableCell key={day}></TableCell>)}
                  <TableCell></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="pl-6">Cash Due</TableCell>
                  {daysOfWeek.map(day => (
                    <InputCell key={day} day={day} field="cashDue" value={weekData[day].cashDue} />
                  ))}
                  <TableCell className="text-center font-medium">
                    {formatCurrency(getWeekTotal('cashDue'))}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="pl-6">+ VISA</TableCell>
                  {daysOfWeek.map(day => (
                    <InputCell key={day} day={day} field="visa" value={weekData[day].visa} />
                  ))}
                  <TableCell className="text-center font-medium">
                    {formatCurrency(getWeekTotal('visa'))}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="pl-6">+ MASTERCARD</TableCell>
                  {daysOfWeek.map(day => (
                    <InputCell key={day} day={day} field="mastercard" value={weekData[day].mastercard} />
                  ))}
                  <TableCell className="text-center font-medium">
                    {formatCurrency(getWeekTotal('mastercard'))}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="pl-6">+ AMEX</TableCell>
                  {daysOfWeek.map(day => (
                    <InputCell key={day} day={day} field="amex" value={weekData[day].amex} />
                  ))}
                  <TableCell className="text-center font-medium">
                    {formatCurrency(getWeekTotal('amex'))}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="pl-6">+ DISCOVER</TableCell>
                  {daysOfWeek.map(day => (
                    <InputCell key={day} day={day} field="discover" value={weekData[day].discover} />
                  ))}
                  <TableCell className="text-center font-medium">
                    {formatCurrency(getWeekTotal('discover'))}
                  </TableCell>
                </TableRow>
                <TableRow className="border-b-2">
                  <TableCell className="pl-6 font-medium">(2) POS Cash + Charges</TableCell>
                  {daysOfWeek.map(day => (
                    <InputCell key={day} day={day} field="posCashCharges" value={weekData[day].posCashCharges} isCalculated />
                  ))}
                  <TableCell className="text-center font-medium bg-muted">
                    {formatCurrency(getWeekTotal('posCashCharges'))}
                  </TableCell>
                </TableRow>

                {/* Actual Cash & Charges Section */}
                <TableRow className="bg-muted/50">
                  <TableCell className="font-semibold">Actual Cash & Charges</TableCell>
                  {daysOfWeek.map(day => <TableCell key={day}></TableCell>)}
                  <TableCell></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="pl-6">Deposit Cash</TableCell>
                  {daysOfWeek.map(day => (
                    <InputCell key={day} day={day} field="depositCash" value={weekData[day].depositCash} />
                  ))}
                  <TableCell className="text-center font-medium">
                    {formatCurrency(getWeekTotal('depositCash'))}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="pl-6">+ Actual Charge Receipts</TableCell>
                  {daysOfWeek.map(day => (
                    <InputCell key={day} day={day} field="actualChargeReceipts" value={weekData[day].actualChargeReceipts} />
                  ))}
                  <TableCell className="text-center font-medium">
                    {formatCurrency(getWeekTotal('actualChargeReceipts'))}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="pl-6 font-medium">(1) = Actual Cash + Charges</TableCell>
                  {daysOfWeek.map(day => (
                    <InputCell key={day} day={day} field="actualCashCharges" value={weekData[day].actualCashCharges} isCalculated />
                  ))}
                  <TableCell className="text-center font-medium bg-muted">
                    {formatCurrency(getWeekTotal('actualCashCharges'))}
                  </TableCell>
                </TableRow>
                <TableRow className="border-b-2">
                  <TableCell className="pl-6 font-medium">(1-2) + Over/- Short</TableCell>
                  {daysOfWeek.map(day => (
                    <TableCell key={day} className="text-center">
                      <Badge variant={weekData[day].overShort >= 0 ? "default" : "destructive"}>
                        {formatCurrency(weekData[day].overShort)}
                      </Badge>
                    </TableCell>
                  ))}
                  <TableCell className="text-center">
                    <Badge variant={getWeekTotal('overShort') >= 0 ? "default" : "destructive"}>
                      {formatCurrency(getWeekTotal('overShort'))}
                    </Badge>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}