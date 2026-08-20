import { createClient } from '@/lib/supabase/server';

export class EnterpriseCustomerChurnRepository {
  async get(workspaceId: string) {
    const supabase = await createClient(); const { data, error } = await supabase.from('enterprise_customer_churns').select('*').eq('workspace_id', workspaceId);
    if (error) throw error;
    return data || [];
  }
}
