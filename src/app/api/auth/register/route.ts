import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "กรุณากรอก email และ password" },
        { status: 400 }
      );
    }

    // เช็คว่ามี user อยู่แล้วหรือยัง
    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { message: "อีเมลนี้ถูกใช้งานแล้ว" },
        { status: 400 }
      );
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // insert user
    const { data, error } = await supabase
      .from("users")
      .insert([{ email, password: hashedPassword }])
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { message: "ไม่สามารถสมัครสมาชิกได้", error },
        { status: 500 }
      );
    }

    // set cookie (token)
    const cookieStore = cookies();
    (await cookieStore).set("token", data.id, {
      httpOnly: true,
      path: "/",
    });

    return NextResponse.json(
      { message: "สมัครสมาชิกสำเร็จ", user: data },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json(
      { message: "เกิดข้อผิดพลาด", error: err },
      { status: 500 }
    );
  }
}
