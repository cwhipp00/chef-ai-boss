import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface UserOrganization {
  id: string;
  name: string;
  role: string;
}

export function useUserOrganization() {
  const [organization, setOrganization] = useState<UserOrganization | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    async function fetchUserOrganization() {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Get user's organization membership first
        const { data: membership, error: membershipError } = await supabase
          .from('organization_members')
          .select('role, organization_id')
          .eq('user_id', user.id)
          .single();

        if (membershipError) {
          if (membershipError.code === 'PGRST116') {
            setError('No organization membership found');
          } else {
            throw membershipError;
          }
          return;
        }

        // Then get the organization details
        const { data: org, error: orgError } = await supabase
          .from('organizations')
          .select('id, name')
          .eq('id', membership.organization_id)
          .single();

        if (orgError) {
          throw orgError;
        }

        if (org) {
          setOrganization({
            id: org.id,
            name: org.name,
            role: membership.role
          });
        } else {
          setError('Organization not found');
        }
      } catch (err) {
        console.error('Error fetching organization:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchUserOrganization();
  }, [user?.id]);

  return { organization, loading, error };
}