import { createClient } from '@/lib/supabase/server';

export class EnterprisePricingIntelligenceRepository {
  async get(workspaceId: string) {
    const supabase = await createClient(); const { data, error } = await supabase.from('enterprise_pricing_intelligences').select('*').eq('workspace_id', workspaceId);
    if (error) throw error;
    return data || [];
  }
}
