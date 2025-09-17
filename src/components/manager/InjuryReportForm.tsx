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
import { AlertTriangle, Plus, Calendar, Clock, User, MapPin, FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useUserOrganization } from '@/hooks/useUserOrganization';

export default function InjuryReportForm() {
  const [loading, setLoading] = useState(false);
  const [submittedReports, setSubmittedReports] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const { organization } = useUserOrganization();

  const [formData, setFormData] = useState({
    injuredPersonName: '',
    injuredPersonRole: '',
    injuryDate: '',
    injuryTime: '',
    location: '',
    injuryType: '',
    bodyPart: '',
    description: '',
    immediateAction: '',
    medicalAttentionRequired: false,
    medicalFacility: '',
    witnessNames: ['']
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !organization) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('injury_reports' as any)
        .insert([{
          organization_id: organization.id,
          injured_person_name: formData.injuredPersonName,
          injured_person_role: formData.injuredPersonRole,
          injury_date: formData.injuryDate,
          injury_time: formData.injuryTime,
          location: formData.location,
          injury_type: formData.injuryType,
          body_part: formData.bodyPart,
          description: formData.description,
          immediate_action: formData.immediateAction,
          medical_attention_required: formData.medicalAttentionRequired,
          medical_facility: formData.medicalFacility,
          witness_names: formData.witnessNames.filter(name => name.trim()),
          reported_by: user.id,
          status: 'pending'
        }])
        .select();

      if (error) throw error;

      toast({
        title: "Injury Report Submitted",
        description: "The injury report has been successfully submitted for manager review.",
      });

      // Reset form
      setFormData({
        injuredPersonName: '',
        injuredPersonRole: '',
        injuryDate: '',
        injuryTime: '',
        location: '',
        injuryType: '',
        bodyPart: '',
        description: '',
        immediateAction: '',
        medicalAttentionRequired: false,
        medicalFacility: '',
        witnessNames: ['']
      });
      setShowForm(false);
      loadReports();
    } catch (error) {
      console.error('Error submitting injury report:', error);
      toast({
        title: "Error",
        description: "Failed to submit injury report. Please try again.",
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
        .from('injury_reports' as any)
        .select('*')
        .eq('organization_id', organization.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSubmittedReports(data || []);
    } catch (error) {
      console.error('Error loading injury reports:', error);
    }
  };

  React.useEffect(() => {
    loadReports();
  }, [organization]);

  const addWitnessField = () => {
    setFormData(prev => ({
      ...prev,
      witnessNames: [...prev.witnessNames, '']
    }));
  };

  const updateWitnessName = (index: number, value: string) => {
    const updated = [...formData.witnessNames];
    updated[index] = value;
    setFormData(prev => ({ ...prev, witnessNames: updated }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-destructive" />
            Injury Report Management
          </h2>
          <p className="text-muted-foreground">Track and manage workplace injury incidents</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="bg-gradient-primary">
          <Plus className="h-4 w-4 mr-2" />
          New Injury Report
        </Button>
      </div>

      {showForm && (
        <Card className="border-destructive/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              New Injury Report
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="injuredPersonName">Injured Person Name</Label>
                  <Input
                    id="injuredPersonName"
                    value={formData.injuredPersonName}
                    onChange={(e) => setFormData(prev => ({ ...prev, injuredPersonName: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="injuredPersonRole">Role/Position</Label>
                  <Input
                    id="injuredPersonRole"
                    value={formData.injuredPersonRole}
                    onChange={(e) => setFormData(prev => ({ ...prev, injuredPersonRole: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="injuryDate">Date of Injury</Label>
                  <Input
                    id="injuryDate"
                    type="date"
                    value={formData.injuryDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, injuryDate: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="injuryTime">Time of Injury</Label>
                  <Input
                    id="injuryTime"
                    type="time"
                    value={formData.injuryTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, injuryTime: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="location">Location of Injury</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="Kitchen, Dining Room, etc."
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="injuryType">Type of Injury</Label>
                  <Select value={formData.injuryType} onValueChange={(value) => setFormData(prev => ({ ...prev, injuryType: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select injury type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cut">Cut/Laceration</SelectItem>
                      <SelectItem value="burn">Burn</SelectItem>
                      <SelectItem value="slip">Slip/Fall</SelectItem>
                      <SelectItem value="strain">Muscle Strain</SelectItem>
                      <SelectItem value="bruise">Bruise</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="bodyPart">Body Part Injured</Label>
                <Input
                  id="bodyPart"
                  value={formData.bodyPart}
                  onChange={(e) => setFormData(prev => ({ ...prev, bodyPart: e.target.value }))}
                  placeholder="Hand, Back, Leg, etc."
                  required
                />
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
                <Label htmlFor="immediateAction">Immediate Action Taken</Label>
                <Textarea
                  id="immediateAction"
                  value={formData.immediateAction}
                  onChange={(e) => setFormData(prev => ({ ...prev, immediateAction: e.target.value }))}
                  placeholder="First aid, called ambulance, etc."
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="medicalAttention"
                  checked={formData.medicalAttentionRequired}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, medicalAttentionRequired: !!checked }))}
                />
                <Label htmlFor="medicalAttention">Medical attention required</Label>
              </div>

              {formData.medicalAttentionRequired && (
                <div>
                  <Label htmlFor="medicalFacility">Medical Facility</Label>
                  <Input
                    id="medicalFacility"
                    value={formData.medicalFacility}
                    onChange={(e) => setFormData(prev => ({ ...prev, medicalFacility: e.target.value }))}
                    placeholder="Hospital, Clinic, etc."
                  />
                </div>
              )}

              <div>
                <Label>Witnesses</Label>
                <div className="space-y-2">
                  {formData.witnessNames.map((witness, index) => (
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
          <CardTitle>Previous Injury Reports</CardTitle>
        </CardHeader>
        <CardContent>
          {submittedReports.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No injury reports submitted yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {submittedReports.map((report) => (
                <div key={report.id} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {report.injured_person_name}
                    </h4>
                    <Badge variant={report.status === 'pending' ? 'secondary' : 'default'}>
                      {report.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(report.injury_date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {report.injury_time}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {report.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <FileText className="h-4 w-4" />
                      {report.injury_type}
                    </div>
                  </div>
                  <p className="text-sm">{report.description}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}