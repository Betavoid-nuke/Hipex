// /app/api/toggle-publish/route.ts
import { publishToggle } from "@/lib/actions/user.action";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { CDID } = body;

    if (!CDID) {
      return NextResponse.json({ error: "Missing CDID" }, { status: 400 });
    }

    await publishToggle(CDID);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
