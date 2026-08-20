import { createClient } from '@/lib/supabase/server';

export class EnterpriseCommercialPipelineRepository {
  async get(workspaceId: string) {
    const supabase = await createClient(); const { data, error } = await supabase.from('enterprise_commercial_pipelines').select('*').eq('workspace_id', workspaceId);
    if (error) throw error;
    return data || [];
  }
}
