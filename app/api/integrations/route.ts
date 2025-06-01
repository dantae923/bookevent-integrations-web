import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const result = await pool.query(
      "SELECT id, site, event_title, book_title, special_goods, link, image, period FROM events_active WHERE sold_out = 'N' AND is_active = 'Y'"
    );
    return NextResponse.json(result.rows);
  } catch (err) {
    console.error("❌ DB 오류:", err);
    return NextResponse.json({ error: "DB query failed" }, { status: 500 });
  }
}
