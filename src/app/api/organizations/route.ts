import { NextResponse } from "next/server";
import { OrganizationsRepository } from "@/lib/database/repositories/organizations.repo";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const orgId = searchParams.get("orgId") || "org-enterprise-default";

    const repo = new OrganizationsRepository();
    const org = await repo.getOrganization(orgId);
    return NextResponse.json({ success: true, organization: org });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
