import { createClient } from '@/lib/supabase/server';

export class EnterpriseCommercialRecommendationRepository {
  async get(workspaceId: string) {
    const supabase = await createClient(); const { data, error } = await supabase.from('enterprise_commercial_recommendations').select('*').eq('workspace_id', workspaceId);
    if (error) throw error;
    return data || [];
  }
}
