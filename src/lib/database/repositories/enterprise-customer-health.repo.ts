import { createClient } from '@/lib/supabase/server';

export class EnterpriseCustomerHealthRepository {
  async get(workspaceId: string) {
    const supabase = await createClient(); const { data, error } = await supabase.from('enterprise_customer_healths').select('*').eq('workspace_id', workspaceId);
    if (error) throw error;
    return data || [];
  }
}
