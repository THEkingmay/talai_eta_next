import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabase } from "@/lib/supabase";
import jwt from "jsonwebtoken";

interface UserPayload extends jwt.JwtPayload {
  id: string
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) {
      return NextResponse.json({ user: null }, { status: 200 });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET!)
    const payload = decoded as UserPayload;
    if (!payload.id) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const { data: users, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", payload.id)

    if (error || !users) {
      return NextResponse.json({ user: null }, { status: 200 });
    } 
    return NextResponse.json({ user: users[0] }, { status: 200 });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ user: null }, { status: 500 });
  }
}
