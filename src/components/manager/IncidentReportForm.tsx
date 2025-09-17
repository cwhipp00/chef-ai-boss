import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle, Plus, Calendar, Clock, User, FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useUserOrganization } from '@/hooks/useUserOrganization';

export default function IncidentReportForm() {
  const [loading, setLoading] = useState(false);
  const [submittedReports, setSubmittedReports] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const { organization } = useUserOrganization();

  const [formData, setFormData] = useState({
    employeeName: '',
    employeeRole: '',
    incidentDate: '',
    incidentTime: '',
    incidentType: '',
    severityLevel: 'low',
    description: '',
    witnesses: [''],
    followUpRequired: false,
    followUpDate: '',
    correctiveAction: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !organization) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('incident_reports' as any)
        .insert([{
          organization_id: organization.id,
          employee_name: formData.employeeName,
          employee_role: formData.employeeRole,
          incident_date: formData.incidentDate,
          incident_time: formData.incidentTime,
          incident_type: formData.incidentType,
          severity_level: formData.severityLevel,
          description: formData.description,
          witnesses: formData.witnesses.filter(name => name.trim()),
          follow_up_required: formData.followUpRequired,
          follow_up_date: formData.followUpDate || null,
          corrective_action: formData.correctiveAction,
          reported_by: user.id,
          status: 'pending'
        }])
        .select();

      if (error) throw error;

      toast({
        title: "Incident Report Submitted",
        description: "The incident report has been successfully submitted for manager review.",
      });

      // Reset form
      setFormData({
        employeeName: '',
        employeeRole: '',
        incidentDate: '',
        incidentTime: '',
        incidentType: '',
        severityLevel: 'low',
        description: '',
        witnesses: [''],
        followUpRequired: false,
        followUpDate: '',
        correctiveAction: ''
      });
      setShowForm(false);
      loadReports();
    } catch (error) {
      console.error('Error submitting incident report:', error);
      toast({
        title: "Error",
        description: "Failed to submit incident report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadReports = async () => {
    if (!organization) return;

    try {
      const { data, error } = await supabase
        .from('incident_reports' as any)
        .select('*')
        .eq('organization_id', organization.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSubmittedReports(data || []);
    } catch (error) {
      console.error('Error loading incident reports:', error);
    }
  };

  React.useEffect(() => {
    loadReports();
  }, [organization]);

  const addWitnessField = () => {
    setFormData(prev => ({
      ...prev,
      witnesses: [...prev.witnesses, '']
    }));
  };

  const updateWitnessName = (index: number, value: string) => {
    const updated = [...formData.witnesses];
    updated[index] = value;
    setFormData(prev => ({ ...prev, witnesses: updated }));
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <AlertCircle className="h-6 w-6 text-warning" />
            Incident Report Management
          </h2>
          <p className="text-muted-foreground">Track disciplinary issues and workplace incidents</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="bg-gradient-primary">
          <Plus className="h-4 w-4 mr-2" />
          New Incident Report
        </Button>
      </div>

      {showForm && (
        <Card className="border-warning/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              New Incident Report
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="employeeName">Employee Name</Label>
                  <Input
                    id="employeeName"
                    value={formData.employeeName}
                    onChange={(e) => setFormData(prev => ({ ...prev, employeeName: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="employeeRole">Employee Role/Position</Label>
                  <Input
                    id="employeeRole"
                    value={formData.employeeRole}
                    onChange={(e) => setFormData(prev => ({ ...prev, employeeRole: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="incidentDate">Date of Incident</Label>
                  <Input
                    id="incidentDate"
                    type="date"
                    value={formData.incidentDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, incidentDate: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="incidentTime">Time of Incident</Label>
                  <Input
                    id="incidentTime"
                    type="time"
                    value={formData.incidentTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, incidentTime: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="incidentType">Type of Incident</Label>
                  <Select value={formData.incidentType} onValueChange={(value) => setFormData(prev => ({ ...prev, incidentType: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select incident type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="insubordination">Insubordination</SelectItem>
                      <SelectItem value="tardiness">Tardiness</SelectItem>
                      <SelectItem value="no-show">No Show</SelectItem>
                      <SelectItem value="policy-violation">Policy Violation</SelectItem>
                      <SelectItem value="customer-complaint">Customer Complaint</SelectItem>
                      <SelectItem value="safety-violation">Safety Violation</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="severityLevel">Severity Level</Label>
                  <Select value={formData.severityLevel} onValueChange={(value) => setFormData(prev => ({ ...prev, severityLevel: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description of Incident</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe what happened..."
                  required
                />
              </div>

              <div>
                <Label>Witnesses</Label>
                <div className="space-y-2">
                  {formData.witnesses.map((witness, index) => (
                    <Input
                      key={index}
                      value={witness}
                      onChange={(e) => updateWitnessName(index, e.target.value)}
                      placeholder={`Witness ${index + 1} name`}
                    />
                  ))}
                  <Button type="button" variant="outline" onClick={addWitnessField}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Witness
                  </Button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="followUpRequired"
                  checked={formData.followUpRequired}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, followUpRequired: !!checked }))}
                />
                <Label htmlFor="followUpRequired">Follow-up required</Label>
              </div>

              {formData.followUpRequired && (
                <div>
                  <Label htmlFor="followUpDate">Follow-up Date</Label>
                  <Input
                    id="followUpDate"
                    type="date"
                    value={formData.followUpDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, followUpDate: e.target.value }))}
                  />
                </div>
              )}

              <div>
                <Label htmlFor="correctiveAction">Corrective Action Taken</Label>
                <Textarea
                  id="correctiveAction"
                  value={formData.correctiveAction}
                  onChange={(e) => setFormData(prev => ({ ...prev, correctiveAction: e.target.value }))}
                  placeholder="Verbal warning, written warning, suspension, etc."
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" disabled={loading}>
                  {loading ? "Submitting..." : "Submit Report"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Previous Incident Reports</CardTitle>
        </CardHeader>
        <CardContent>
          {submittedReports.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No incident reports submitted yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {submittedReports.map((report) => (
                <div key={report.id} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {report.employee_name}
                    </h4>
                    <div className="flex gap-2">
                      <Badge variant={getSeverityColor(report.severity_level)}>
                        {report.severity_level} severity
                      </Badge>
                      <Badge variant={report.status === 'pending' ? 'secondary' : 'default'}>
                        {report.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(report.incident_date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {report.incident_time}
                    </div>
                    <div className="flex items-center gap-1">
                      <FileText className="h-4 w-4" />
                      {report.incident_type}
                    </div>
                    <div className="flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {report.employee_role}
                    </div>
                  </div>
                  <p className="text-sm">{report.description}</p>
                  {report.corrective_action && (
                    <div className="mt-2 p-2 bg-muted rounded text-sm">
                      <strong>Action Taken:</strong> {report.corrective_action}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}