import { createClient } from '@/lib/supabase/server';

export class EnterpriseCommercialLearningRepository {
  async get(workspaceId: string) {
    const supabase = await createClient(); const { data, error } = await supabase.from('enterprise_commercial_learnings').select('*').eq('workspace_id', workspaceId);
    if (error) throw error;
    return data || [];
  }
}
