import pool from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { format } from "date-fns";

export async function GET(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0] || req.ip || "unknown";
  const today = format(new Date(), "yyyy-MM-dd");

  try {
    await pool.query(
      `INSERT INTO site_visits (ip_address, visit_date)
       VALUES ($1, $2)
       ON CONFLICT (ip_address, visit_date) DO NOTHING`,
      [ip, today]
    );
    return NextResponse.json({ status: "ok" });
  } catch (err) {
    console.error("Visit log failed:", err);
    return NextResponse.json({ status: "error" }, { status: 500 });
  }
}
