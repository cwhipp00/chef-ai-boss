import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useUserOrganization } from '@/hooks/useUserOrganization';

export interface Reservation {
  id: string;
  customer_name: string;
  customer_email?: string;
  customer_phone?: string;
  party_size: number;
  reservation_date: string;
  reservation_time: string;
  table_number?: number;
  status: string;
  special_requests?: string;
  notes?: string;
}

export function useReservations() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { organization } = useUserOrganization();
  const organizationId = organization?.id;

  const fetchReservations = async () => {
    if (!organizationId) return;

    try {
      // Try to fetch from main table first (managers/owners get full access)
      let { data, error } = await supabase
        .from('reservations')
        .select('*')
        .eq('organization_id', organizationId)
        .order('reservation_date', { ascending: true })
        .order('reservation_time', { ascending: true });

      // If access denied, try the staff view (regular members get masked data)
      if (error && error.code === 'PGRST301') {
        const { data: staffData, error: staffError } = await supabase
          .from('staff_reservations')
          .select('*')
          .eq('organization_id', organizationId)
          .order('reservation_date', { ascending: true })
          .order('reservation_time', { ascending: true });
        
        data = staffData;
        error = staffError;
      }

      if (error) throw error;

      setReservations(data || []);
    } catch (error: any) {
      console.error('Error fetching reservations:', error);
      toast({
        title: "Error",
        description: "Failed to fetch reservations",
        variant: "destructive"
      });
    }
  };

  const createReservation = async (reservationData: Omit<Reservation, 'id'>) => {
    if (!organizationId) return;

    try {
      const { data, error } = await supabase
        .from('reservations')
        .insert({
          organization_id: organizationId,
          ...reservationData,
          created_by: (await supabase.auth.getUser()).data.user?.id
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Reservation created successfully"
      });

      fetchReservations();
      return data;
    } catch (error: any) {
      console.error('Error creating reservation:', error);
      toast({
        title: "Error",
        description: "Failed to create reservation",
        variant: "destructive"
      });
    }
  };

  const updateReservation = async (id: string, updates: Partial<Reservation>) => {
    try {
      const { error } = await supabase
        .from('reservations')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Reservation updated successfully"
      });

      fetchReservations();
    } catch (error: any) {
      console.error('Error updating reservation:', error);
      toast({
        title: "Error",
        description: "Failed to update reservation",
        variant: "destructive"
      });
    }
  };

  const deleteReservation = async (id: string) => {
    try {
      const { error } = await supabase
        .from('reservations')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Reservation deleted successfully"
      });

      fetchReservations();
    } catch (error: any) {
      console.error('Error deleting reservation:', error);
      toast({
        title: "Error",
        description: "Failed to delete reservation",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    if (organizationId) {
      setLoading(true);
      fetchReservations().finally(() => {
        setLoading(false);
      });
    }
  }, [organizationId]);

  return {
    reservations,
    loading,
    createReservation,
    updateReservation,
    deleteReservation,
    refetch: fetchReservations
  };
}