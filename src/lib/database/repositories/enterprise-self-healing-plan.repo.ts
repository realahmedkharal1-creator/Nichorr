import { createClient } from "@supabase/supabase-js";

export class EnterpriseSelfHealingPlanRepository {
    private supabase;
    private fallback: any[] = [];
    constructor() {
        this.supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321', process.env.SUPABASE_SERVICE_ROLE_KEY || 'dummy');
    }

    async getPlans(...args: any[]) {
        return { data: this.fallback, error: null };
    }

    async getPlanById(...args: any[]) {
        return { data: this.fallback, error: null };
    }

}
