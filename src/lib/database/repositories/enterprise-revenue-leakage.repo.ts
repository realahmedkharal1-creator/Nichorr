import { createClient } from '@/lib/supabase/server';

export class EnterpriseRevenueLeakageRepository {
  async get(workspaceId: string) {
    const supabase = await createClient(); const { data, error } = await supabase.from('enterprise_revenue_leakages').select('*').eq('workspace_id', workspaceId);
    if (error) throw error;
    return data || [];
  }
}
