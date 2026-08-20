import { createClient } from "@supabase/supabase-js";

export class EnterpriseAutonomyRecommendationRepository {
    private supabase;
    private fallback: any[] = [];
    constructor() {
        this.supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321', process.env.SUPABASE_SERVICE_ROLE_KEY || 'dummy');
    }

    async getRecommendations(...args: any[]) {
        return { data: this.fallback, error: null };
    }

}
