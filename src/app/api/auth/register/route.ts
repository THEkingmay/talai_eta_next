import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

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
      .insert([{ email, hash_password: hashedPassword }])
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json(
        { message: "ไม่สามารถสมัครสมาชิกได้", error },
        { status: 500 }
      );
    }
    const user = data;
      const token = jwt.sign(
        { id: user.id}, // อย่าใส่ user ทั้ง object
        process.env.JWT_SECRET!,
        { expiresIn: "2h" }
      );
    // set cookie (token)
    const cookieStore = cookies();
    (await cookieStore).set("token", token, {
      httpOnly: true,
      path: "/",
    });

    return NextResponse.json(
      { message: "สมัครสมาชิกสำเร็จ", user: data },
      { status: 201 }
    );
  } catch (err) {
    console.error("Registration error:", err);
    return NextResponse.json(
      { message: "เกิดข้อผิดพลาด", error: err },
      { status: 500 }
    );
  }
}
