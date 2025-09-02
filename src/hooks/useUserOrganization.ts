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
        
        // Get user's organization membership
        const { data: membership, error: membershipError } = await supabase
          .from('organization_members')
          .select(`
            role,
            organization_id,
            organizations(
              id,
              name
            )
          `)
          .eq('user_id', user.id)
          .single();

        if (membershipError) {
          // If no membership exists, try to create one
          if (membershipError.code === 'PGRST116') {
            // User has no organization membership, which should be handled by the trigger
            // But let's make sure they have a profile first
            const { data: profile } = await supabase
              .from('profiles')
              .select('company_name')
              .eq('id', user.id)
              .single();
            
            if (profile) {
              // Refresh the page to trigger the organization creation
              window.location.reload();
              return;
            }
          }
          throw membershipError;
        }

        if (membership?.organizations) {
          setOrganization({
            id: membership.organizations.id,
            name: membership.organizations.name,
            role: membership.role
          });
        } else {
          setError('No organization found');
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