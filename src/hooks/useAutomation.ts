import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useUserOrganization } from '@/hooks/useUserOrganization';

export interface AutomationRule {
  id: string;
  name: string;
  description?: string;
  category: string;
  trigger_config: any;
  action_config: any;
  is_active: boolean;
  execution_count: number;
  last_execution?: string;
}

export interface AutomationLog {
  id: string;
  rule_id: string;
  execution_status: string;
  execution_result?: any;
  error_message?: string;
  execution_time?: number;
  triggered_at: string;
}

export function useAutomation() {
  const [rules, setRules] = useState<AutomationRule[]>([]);
  const [logs, setLogs] = useState<AutomationLog[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { organization } = useUserOrganization();
  const organizationId = organization?.id;

  const fetchRules = async () => {
    if (!organizationId) return;

    try {
      const { data, error } = await supabase
        .from('automation_rules')
        .select('*')
        .eq('organization_id', organizationId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setRules(data || []);
    } catch (error: any) {
      console.error('Error fetching automation rules:', error);
      toast({
        title: "Error",
        description: "Failed to fetch automation rules",
        variant: "destructive"
      });
    }
  };

  const fetchLogs = async (ruleId?: string) => {
    if (!organizationId) return;

    try {
      let query = supabase
        .from('automation_logs')
        .select(`
          *,
          automation_rules(name, organization_id)
        `)
        .order('triggered_at', { ascending: false })
        .limit(50);

      if (ruleId) {
        query = query.eq('rule_id', ruleId);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Filter for organization rules
      const filteredLogs = data?.filter(log => 
        log.automation_rules?.organization_id === organizationId
      ) || [];

      setLogs(filteredLogs);
    } catch (error: any) {
      console.error('Error fetching automation logs:', error);
      toast({
        title: "Error",
        description: "Failed to fetch automation logs",
        variant: "destructive"
      });
    }
  };

  const createRule = async (ruleData: Omit<AutomationRule, 'id' | 'execution_count' | 'last_execution'>) => {
    if (!organizationId) return;

    try {
      const { data, error } = await supabase
        .from('automation_rules')
        .insert({
          organization_id: organizationId,
          ...ruleData,
          created_by: (await supabase.auth.getUser()).data.user?.id
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Automation rule created successfully"
      });

      fetchRules();
      return data;
    } catch (error: any) {
      console.error('Error creating automation rule:', error);
      toast({
        title: "Error",
        description: "Failed to create automation rule",
        variant: "destructive"
      });
    }
  };

  const updateRule = async (id: string, updates: Partial<AutomationRule>) => {
    try {
      const { error } = await supabase
        .from('automation_rules')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Automation rule updated successfully"
      });

      fetchRules();
    } catch (error: any) {
      console.error('Error updating automation rule:', error);
      toast({
        title: "Error",
        description: "Failed to update automation rule",
        variant: "destructive"
      });
    }
  };

  const toggleRule = async (id: string, isActive: boolean) => {
    await updateRule(id, { is_active: isActive });
  };

  const executeRule = async (ruleId: string) => {
    try {
      const rule = rules.find(r => r.id === ruleId);
      if (!rule) return;

      // Create log entry
      const { data: logData, error: logError } = await supabase
        .from('automation_logs')
        .insert({
          rule_id: ruleId,
          execution_status: 'running'
        })
        .select()
        .single();

      if (logError) throw logError;

      toast({
        title: "Executing",
        description: `Running automation: ${rule.name}`
      });

      // Mock execution logic - in real implementation, this would call the automation engine
      const startTime = Date.now();
      
      // Simulate execution time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const executionTime = Date.now() - startTime;
      const success = Math.random() > 0.1; // 90% success rate

      // Update log with results
      await supabase
        .from('automation_logs')
        .update({
          execution_status: success ? 'completed' : 'failed',
          execution_result: success ? { message: 'Automation completed successfully' } : null,
          error_message: success ? null : 'Mock execution failure',
          execution_time: executionTime
        })
        .eq('id', logData.id);

      // Update rule execution count and last execution
      await supabase
        .from('automation_rules')
        .update({
          execution_count: rule.execution_count + 1,
          last_execution: new Date().toISOString()
        })
        .eq('id', ruleId);

      toast({
        title: success ? "Success" : "Error",
        description: success ? `${rule.name} executed successfully` : `${rule.name} execution failed`,
        variant: success ? "default" : "destructive"
      });

      fetchRules();
      fetchLogs();

    } catch (error: any) {
      console.error('Error executing automation rule:', error);
      toast({
        title: "Error",
        description: "Failed to execute automation rule",
        variant: "destructive"
      });
    }
  };

  const deleteRule = async (id: string) => {
    try {
      const { error } = await supabase
        .from('automation_rules')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Automation rule deleted successfully"
      });

      fetchRules();
    } catch (error: any) {
      console.error('Error deleting automation rule:', error);
      toast({
        title: "Error",
        description: "Failed to delete automation rule",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    if (organizationId) {
      setLoading(true);
      Promise.all([fetchRules(), fetchLogs()]).finally(() => {
        setLoading(false);
      });
    }
  }, [organizationId]);

  return {
    rules,
    logs,
    loading,
    createRule,
    updateRule,
    toggleRule,
    executeRule,
    deleteRule,
    refetch: () => {
      fetchRules();
      fetchLogs();
    }
  };
}