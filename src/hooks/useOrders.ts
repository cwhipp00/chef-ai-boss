import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useUserOrganization } from '@/hooks/useUserOrganization';

export interface OrderItem {
  name: string;
  quantity: number;
  unit: string;
  price: number;
}

export interface Order {
  id: string;
  order_number: string;
  vendor_id: string;
  vendor_name?: string;
  items: OrderItem[];
  total_amount: number;
  status: string;
  order_date: string;
  expected_delivery?: string;
  actual_delivery?: string;
  order_type: string;
  notes?: string;
}

export interface Vendor {
  id: string;
  name: string;
  category: string;
  email?: string;
  phone?: string;
  rating: number;
}

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { organization } = useUserOrganization();
  const organizationId = organization?.id;

  const fetchOrders = async () => {
    if (!organizationId) return;

    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          vendors(name, category, rating)
        `)
        .eq('organization_id', organizationId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedOrders = data?.map(order => ({
        id: order.id,
        order_number: order.order_number,
        vendor_id: order.vendor_id,
        vendor_name: order.vendors?.name,
        items: Array.isArray(order.items) ? (order.items as unknown as OrderItem[]) : [],
        total_amount: order.total_amount,
        status: order.status,
        order_date: order.order_date,
        expected_delivery: order.expected_delivery,
        actual_delivery: order.actual_delivery,
        order_type: order.order_type,
        notes: order.notes
      })) || [];

      setOrders(formattedOrders);
    } catch (error: any) {
      console.error('Error fetching orders:', error);
      toast({
        title: "Error",
        description: "Failed to fetch orders",
        variant: "destructive"
      });
    }
  };

  const fetchVendors = async () => {
    if (!organizationId) return;

    try {
      const { data, error } = await supabase
        .from('vendors')
        .select('*')
        .eq('organization_id', organizationId)
        .eq('is_active', true)
        .order('name');

      if (error) throw error;

      setVendors(data || []);
    } catch (error: any) {
      console.error('Error fetching vendors:', error);
      toast({
        title: "Error",
        description: "Failed to fetch vendors",
        variant: "destructive"
      });
    }
  };

  const createOrder = async (orderData: Partial<Order>) => {
    if (!organizationId) return;

    try {
      const { data, error } = await supabase
        .from('orders')
        .insert({
          organization_id: organizationId,
          order_number: `ORD-${Date.now()}`,
          vendor_id: orderData.vendor_id,
          items: JSON.stringify(orderData.items || []),
          total_amount: orderData.total_amount || 0,
          status: orderData.status || 'pending',
          expected_delivery: orderData.expected_delivery,
          order_type: orderData.order_type || 'standard',
          notes: orderData.notes,
          created_by: (await supabase.auth.getUser()).data.user?.id
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Order created successfully"
      });

      fetchOrders();
      return data;
    } catch (error: any) {
      console.error('Error creating order:', error);
      toast({
        title: "Error",
        description: "Failed to create order",
        variant: "destructive"
      });
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Order status updated"
      });

      fetchOrders();
    } catch (error: any) {
      console.error('Error updating order:', error);
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive"
      });
    }
  };

  const createVendor = async (vendorData: Omit<Vendor, 'id'>) => {
    if (!organizationId) return;

    try {
      const { data, error } = await supabase
        .from('vendors')
        .insert({
          organization_id: organizationId,
          name: vendorData.name,
          category: vendorData.category,
          email: vendorData.email,
          phone: vendorData.phone,
          rating: vendorData.rating || 5.0
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Vendor created successfully"
      });

      fetchVendors();
      return data;
    } catch (error: any) {
      console.error('Error creating vendor:', error);
      toast({
        title: "Error", 
        description: "Failed to create vendor",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    if (organizationId) {
      setLoading(true);
      Promise.all([fetchOrders(), fetchVendors()]).finally(() => {
        setLoading(false);
      });
    }
  }, [organizationId]);

  return {
    orders,
    vendors,
    loading,
    createOrder,
    updateOrderStatus,
    createVendor,
    refetch: () => {
      fetchOrders();
      fetchVendors();
    }
  };
}