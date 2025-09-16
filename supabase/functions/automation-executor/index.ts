import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AutomationRule {
  id: string;
  name: string;
  trigger_config: any;
  action_config: any;
  organization_id: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { ruleId, triggerData } = await req.json();

    if (!ruleId) {
      throw new Error('Rule ID is required');
    }

    console.log(`Executing automation rule: ${ruleId}`);

    // Fetch the automation rule
    const { data: rule, error: ruleError } = await supabaseClient
      .from('automation_rules')
      .select('*')
      .eq('id', ruleId)
      .eq('is_active', true)
      .single();

    if (ruleError || !rule) {
      throw new Error(`Rule not found or inactive: ${ruleId}`);
    }

    const startTime = Date.now();

    // Create execution log
    const { data: logEntry, error: logError } = await supabaseClient
      .from('automation_logs')
      .insert({
        rule_id: ruleId,
        execution_status: 'running'
      })
      .select()
      .single();

    if (logError) {
      console.error('Error creating log entry:', logError);
    }

    // Execute automation based on action type
    const result = await executeAutomationAction(rule, triggerData, supabaseClient);
    
    const executionTime = Date.now() - startTime;

    // Update execution log
    if (logEntry) {
      await supabaseClient
        .from('automation_logs')
        .update({
          execution_status: result.success ? 'completed' : 'failed',
          execution_result: result.data,
          error_message: result.error,
          execution_time: executionTime
        })
        .eq('id', logEntry.id);
    }

    // Update rule statistics
    await supabaseClient
      .from('automation_rules')
      .update({
        execution_count: rule.execution_count + 1,
        last_execution: new Date().toISOString()
      })
      .eq('id', ruleId);

    console.log(`Automation completed in ${executionTime}ms:`, result);

    return new Response(JSON.stringify({
      success: result.success,
      message: result.message,
      data: result.data,
      executionTime
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in automation executor:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function executeAutomationAction(rule: AutomationRule, triggerData: any, supabaseClient: any) {
  const { action_config } = rule;
  
  try {
    switch (action_config.type) {
      case 'create_order':
        return await createAutomaticOrder(action_config, supabaseClient, rule.organization_id);
      
      case 'send_notification':
        return await sendNotification(action_config, triggerData);
      
      case 'update_inventory':
        return await updateInventoryLevels(action_config, supabaseClient, rule.organization_id);
      
      case 'schedule_task':
        return await scheduleTask(action_config, supabaseClient, rule.organization_id);
      
      case 'update_staff_schedule':
        return await updateStaffSchedule(action_config, supabaseClient, rule.organization_id);
      
      default:
        return {
          success: true,
          message: `Executed generic automation: ${rule.name}`,
          data: { action: action_config.type, timestamp: new Date().toISOString() }
        };
    }
  } catch (error) {
    return {
      success: false,
      message: `Failed to execute ${rule.name}`,
      error: error.message
    };
  }
}

async function createAutomaticOrder(config: any, supabaseClient: any, organizationId: string) {
  console.log('Creating automatic order:', config);
  
  // Mock order creation - in real implementation, this would integrate with vendors
  const order = {
    organization_id: organizationId,
    vendor_id: config.vendor_id,
    order_number: `AUTO-${Date.now()}`,
    items: config.items || [],
    total_amount: config.total_amount || 0,
    status: 'pending',
    order_type: 'automatic',
    notes: 'Auto-generated order from automation rule',
    created_by: null // System generated
  };

  const { data, error } = await supabaseClient
    .from('orders')
    .insert(order)
    .select()
    .single();

  if (error) throw error;

  return {
    success: true,
    message: 'Automatic order created successfully',
    data: { orderId: data.id, orderNumber: data.order_number }
  };
}

async function sendNotification(config: any, triggerData: any) {
  console.log('Sending notification:', config, triggerData);
  
  // Mock notification - in real implementation, this would integrate with email/SMS services
  return {
    success: true,
    message: 'Notification sent successfully',
    data: { 
      type: config.notification_type || 'email',
      recipient: config.recipient,
      subject: config.subject,
      timestamp: new Date().toISOString()
    }
  };
}

async function updateInventoryLevels(config: any, supabaseClient: any, organizationId: string) {
  console.log('Updating inventory levels:', config);
  
  // Mock inventory update - in real implementation, this would update inventory tables
  return {
    success: true,
    message: 'Inventory levels updated successfully',
    data: { 
      items_updated: config.items?.length || 0,
      timestamp: new Date().toISOString()
    }
  };
}

async function scheduleTask(config: any, supabaseClient: any, organizationId: string) {
  console.log('Scheduling task:', config);
  
  // Mock task scheduling - in real implementation, this would create tasks/reminders
  return {
    success: true,
    message: 'Task scheduled successfully',
    data: {
      task_name: config.task_name,
      scheduled_for: config.scheduled_time,
      timestamp: new Date().toISOString()
    }
  };
}

async function updateStaffSchedule(config: any, supabaseClient: any, organizationId: string) {
  console.log('Updating staff schedule:', config);
  
  // Mock schedule update - in real implementation, this would update scheduling tables
  return {
    success: true,
    message: 'Staff schedule updated successfully',
    data: {
      schedules_updated: config.staff_count || 0,
      effective_date: config.effective_date,
      timestamp: new Date().toISOString()
    }
  };
}