import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const result = await pool.query(
      "SELECT DISTINCT site FROM events_active ORDER BY site"
    );
    const categories = result.rows.map((row) => row.site);
    return NextResponse.json(["전체", ...categories]);
  } catch (err) {
    console.error("❌ Category API 오류:", err);
    return NextResponse.json({ error: "DB query failed" }, { status: 500 });
  }
}
