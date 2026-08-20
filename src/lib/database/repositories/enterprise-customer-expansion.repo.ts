import { createClient } from '@/lib/supabase/server';

export class EnterpriseCustomerExpansionRepository {
  async get(workspaceId: string) {
    const supabase = await createClient(); const { data, error } = await supabase.from('enterprise_customer_expansions').select('*').eq('workspace_id', workspaceId);
    if (error) throw error;
    return data || [];
  }
}
