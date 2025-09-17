import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ToastAPIConfig {
  clientId: string;
  clientSecret: string;
  restaurantGuid: string;
  accessToken?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, config, orderId, status, menuItemId, availability } = await req.json();
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    switch (action) {
      case 'authenticate':
        return await authenticateToast(config);
        
      case 'fetch_orders':
        return await fetchOrders(config);
        
      case 'update_order_status':
        return await updateOrderStatus(config, orderId, status);
        
      case 'fetch_menu':
        return await fetchMenu(config);
        
      case 'update_menu_item':
        return await updateMenuItem(config, menuItemId, availability);
        
      case 'fetch_analytics':
        return await fetchAnalytics(config);
        
      default:
        throw new Error('Invalid action');
    }

  } catch (error) {
    console.error('Toast POS Integration error:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function authenticateToast(config: ToastAPIConfig) {
  try {
    const response = await fetch('https://ws-api.toasttab.com/usermgmt/v1/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${btoa(`${config.clientId}:${config.clientSecret}`)}`
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials'
      })
    });

    if (!response.ok) {
      throw new Error(`Toast authentication failed: ${response.status}`);
    }

    const data = await response.json();
    
    return new Response(JSON.stringify({
      success: true,
      access_token: data.access_token,
      expires_in: data.expires_in,
      message: 'Successfully authenticated with Toast POS'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: `Authentication failed: ${error.message}`
    }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

async function fetchOrders(config: ToastAPIConfig) {
  try {
    if (!config.accessToken) {
      throw new Error('Access token required');
    }

    const today = new Date().toISOString().split('T')[0];
    const response = await fetch(
      `https://ws-api.toasttab.com/orders/v2/orders?restaurantGuid=${config.restaurantGuid}&startDate=${today}&endDate=${today}`,
      {
        headers: {
          'Authorization': `Bearer ${config.accessToken}`,
          'Toast-Restaurant-External-ID': config.restaurantGuid,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch orders: ${response.status}`);
    }

    const orders = await response.json();
    
    return new Response(JSON.stringify({
      success: true,
      orders: orders || [],
      count: orders?.length || 0
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      orders: []
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

async function updateOrderStatus(config: ToastAPIConfig, orderId: string, status: string) {
  try {
    if (!config.accessToken) {
      throw new Error('Access token required');
    }

    const response = await fetch(
      `https://ws-api.toasttab.com/orders/v2/orders/${orderId}`,
      {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${config.accessToken}`,
          'Toast-Restaurant-External-ID': config.restaurantGuid,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: status
        })
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to update order: ${response.status}`);
    }

    return new Response(JSON.stringify({
      success: true,
      message: `Order ${orderId} updated to ${status}`
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

async function fetchMenu(config: ToastAPIConfig) {
  try {
    if (!config.accessToken) {
      throw new Error('Access token required');
    }

    const response = await fetch(
      `https://ws-api.toasttab.com/config/v2/restaurants/${config.restaurantGuid}/menus`,
      {
        headers: {
          'Authorization': `Bearer ${config.accessToken}`,
          'Toast-Restaurant-External-ID': config.restaurantGuid,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch menu: ${response.status}`);
    }

    const menus = await response.json();
    
    return new Response(JSON.stringify({
      success: true,
      menus: menus || [],
      count: menus?.length || 0
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      menus: []
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

async function updateMenuItem(config: ToastAPIConfig, menuItemId: string, availability: boolean) {
  try {
    if (!config.accessToken) {
      throw new Error('Access token required');
    }

    const response = await fetch(
      `https://ws-api.toasttab.com/config/v2/menuItems/${menuItemId}`,
      {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${config.accessToken}`,
          'Toast-Restaurant-External-ID': config.restaurantGuid,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          available: availability
        })
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to update menu item: ${response.status}`);
    }

    return new Response(JSON.stringify({
      success: true,
      message: `Menu item ${menuItemId} availability updated`
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

async function fetchAnalytics(config: ToastAPIConfig) {
  try {
    if (!config.accessToken) {
      throw new Error('Access token required');
    }

    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    const response = await fetch(
      `https://ws-api.toasttab.com/reporting/v1/reports/sales_summary?restaurantGuid=${config.restaurantGuid}&startDate=${startDate}&endDate=${endDate}`,
      {
        headers: {
          'Authorization': `Bearer ${config.accessToken}`,
          'Toast-Restaurant-External-ID': config.restaurantGuid,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch analytics: ${response.status}`);
    }

    const analytics = await response.json();
    
    return new Response(JSON.stringify({
      success: true,
      analytics: analytics || {},
      period: `${startDate} to ${endDate}`
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      analytics: {}
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}