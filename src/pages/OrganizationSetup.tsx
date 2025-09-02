import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { IntelligentDocumentUpload } from '@/components/documents/IntelligentDocumentUpload';
import { DynamicFormGenerator } from '@/components/forms/DynamicFormGenerator';
import { RealtimeCollaboration } from '@/components/realtime/RealtimeCollaboration';
import { EnhancedVideoCall } from '@/components/video/EnhancedVideoCall';
import { 
  Building, 
  Users, 
  FileText, 
  Settings, 
  CheckCircle,
  Plus,
  Video,
  MessageSquare,
  Brain
} from 'lucide-react';

interface Organization {
  id: string;
  name: string;
  domain: string;
  settings: any;
  member_role?: string;
}

export default function OrganizationSetup() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newOrgData, setNewOrgData] = useState({
    name: '',
    domain: '',
    description: ''
  });
  const [activeTab, setActiveTab] = useState<'documents' | 'forms' | 'collaboration' | 'video'>('documents');
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    loadOrganizations();
  }, []);

  const loadOrganizations = async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        navigate('/auth');
        return;
      }

      const { data, error } = await supabase
        .from('organization_members')
        .select(`
          role,
          organizations (
            id,
            name,
            domain,
            settings
          )
        `)
        .eq('user_id', user.user.id);

      if (error) throw error;

      const orgs = data?.map(item => ({
        ...item.organizations,
        member_role: item.role
      })) || [];

      setOrganizations(orgs);
      
      if (orgs.length === 1) {
        setSelectedOrg(orgs[0]);
      }
    } catch (error) {
      console.error('Error loading organizations:', error);
      toast({
        title: "Error Loading Organizations",
        description: "Could not load your organizations",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createOrganization = async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      if (!newOrgData.name.trim()) {
        toast({
          title: "Organization Name Required",
          description: "Please enter a name for your organization",
          variant: "destructive"
        });
        return;
      }

      // Create organization
      const { data: org, error: orgError } = await supabase
        .from('organizations')
        .insert({
          name: newOrgData.name.trim(),
          domain: newOrgData.domain.trim() || null,
          settings: {
            description: newOrgData.description.trim(),
            created_by: user.user.id
          }
        })
        .select()
        .single();

      if (orgError) throw orgError;

      // Add user as owner
      const { error: memberError } = await supabase
        .from('organization_members')
        .insert({
          organization_id: org.id,
          user_id: user.user.id,
          role: 'owner'
        });

      if (memberError) throw memberError;

      toast({
        title: "Organization Created",
        description: `${newOrgData.name} has been created successfully`,
      });

      setNewOrgData({ name: '', domain: '', description: '' });
      setIsCreating(false);
      loadOrganizations();

    } catch (error) {
      console.error('Error creating organization:', error);
      toast({
        title: "Creation Failed", 
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive"
      });
    }
  };

  const handleDocumentProcessed = () => {
    toast({
      title: "Document Processed",
      description: "Your document has been analyzed and forms are ready",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your organizations...</p>
        </div>
      </div>
    );
  }

  if (!selectedOrg) {
    return (
      <div className="min-h-screen p-6 bg-gradient-to-br from-background via-background/95 to-primary/5">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="p-4 bg-gradient-primary rounded-full w-20 h-20 mx-auto flex items-center justify-center">
              <Building className="h-10 w-10 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Welcome to Chef AI
              </h1>
              <p className="text-muted-foreground">
                Set up your restaurant organization to get started with AI-powered document processing
              </p>
            </div>
          </div>

          {/* Existing Organizations */}
          {organizations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Your Organizations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {organizations.map((org) => (
                    <Card 
                      key={org.id} 
                      className="cursor-pointer hover-lift transition-all border-primary/20 hover:border-primary/40"
                      onClick={() => setSelectedOrg(org)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold">{org.name}</h3>
                            {org.domain && (
                              <p className="text-sm text-muted-foreground">{org.domain}</p>
                            )}
                          </div>
                          <Badge variant={org.member_role === 'owner' ? 'default' : 'secondary'}>
                            {org.member_role}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Create New Organization */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                {organizations.length === 0 ? 'Create Your Organization' : 'Create New Organization'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!isCreating ? (
                <div className="text-center py-6">
                  <p className="text-muted-foreground mb-4">
                    Set up your restaurant organization to start using AI-powered features
                  </p>
                  <Button onClick={() => setIsCreating(true)} className="bg-gradient-primary">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Organization
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="orgName">Organization Name *</Label>
                    <Input
                      id="orgName"
                      value={newOrgData.name}
                      onChange={(e) => setNewOrgData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="TBC The Breakfast Club"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="orgDomain">Domain (Optional)</Label>
                    <Input
                      id="orgDomain"
                      value={newOrgData.domain}
                      onChange={(e) => setNewOrgData(prev => ({ ...prev, domain: e.target.value }))}
                      placeholder="breakfast-club.com"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="orgDescription">Description (Optional)</Label>
                    <Textarea
                      id="orgDescription"
                      value={newOrgData.description}
                      onChange={(e) => setNewOrgData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="A description of your restaurant..."
                      rows={3}
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button onClick={createOrganization} className="bg-gradient-primary">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Create Organization
                    </Button>
                    <Button variant="outline" onClick={() => setIsCreating(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            {selectedOrg.name}
          </h1>
          <p className="text-muted-foreground">
            AI-powered document processing and collaboration platform
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">{selectedOrg.member_role}</Badge>
          <Button variant="outline" onClick={() => setSelectedOrg(null)}>
            Switch Organization
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={activeTab === 'documents' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('documents')}
              className={activeTab === 'documents' ? 'bg-gradient-primary' : ''}
            >
              <FileText className="h-4 w-4 mr-2" />
              Documents
            </Button>
            <Button
              variant={activeTab === 'forms' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('forms')}
              className={activeTab === 'forms' ? 'bg-gradient-primary' : ''}
            >
              <Brain className="h-4 w-4 mr-2" />
              AI Forms
            </Button>
            <Button
              variant={activeTab === 'collaboration' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('collaboration')}
              className={activeTab === 'collaboration' ? 'bg-gradient-primary' : ''}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Collaboration
            </Button>
            <Button
              variant={activeTab === 'video' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('video')}
              className={activeTab === 'video' ? 'bg-gradient-primary' : ''}
            >
              <Video className="h-4 w-4 mr-2" />
              Video Calls
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Content */}
      <div className="space-y-6">
        {activeTab === 'documents' && (
          <IntelligentDocumentUpload
            organizationId={selectedOrg.id}
            onDocumentProcessed={handleDocumentProcessed}
          />
        )}

        {activeTab === 'forms' && (
          <DynamicFormGenerator organizationId={selectedOrg.id} />
        )}

        {activeTab === 'collaboration' && (
          <RealtimeCollaboration 
            organizationId={selectedOrg.id}
            currentPage="organization-setup" 
          />
        )}

        {activeTab === 'video' && (
          <EnhancedVideoCall
            roomName={`${selectedOrg.name.replace(/\s+/g, '-').toLowerCase()}-meeting`}
            userName={selectedOrg.member_role || 'Member'}
          />
        )}
      </div>
    </div>
  );
}
