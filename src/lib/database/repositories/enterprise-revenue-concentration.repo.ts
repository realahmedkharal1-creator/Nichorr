import { createClient } from '@/lib/supabase/server';

export class EnterpriseRevenueConcentrationRepository {
  async get(workspaceId: string) {
    const supabase = await createClient(); const { data, error } = await supabase.from('enterprise_revenue_concentrations').select('*').eq('workspace_id', workspaceId);
    if (error) throw error;
    return data || [];
  }
}
