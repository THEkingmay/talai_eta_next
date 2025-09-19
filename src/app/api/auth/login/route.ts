import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabase } from "@/lib/supabase";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  // 1. ถ้ามี token อยู่แล้ว
  const existToken = (await cookies()).get("token");
  if (existToken) {
    return NextResponse.json({ message: "คุณล็อกอินไปแล้ว" }, { status: 400 });
  }

  // 2. อ่าน body
  const { email, password } = await req.json();

  // 3. เช็ค user จาก Supabase
  const { data: users, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email);

  if (error) {
    return NextResponse.json({ message: "เกิดข้อผิดพลาด", error }, { status: 500 });
  }

  if (!users || users.length === 0) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  const user = users[0];

  // 4. ตรวจสอบรหัสผ่าน (ใช้ bcrypt เท่านั้น)
  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    return NextResponse.json({ message: "รหัสผ่านไม่ถูกต้อง" }, { status: 401 });
  }

  // 5. สร้าง JWT token
  const token = jwt.sign(
    { id: user.id, email: user.email }, // อย่าใส่ user ทั้ง object
    process.env.JWT_SECRET!,
    { expiresIn: "2h" }
  );

  // 6. เก็บ token ใน cookie
  (await
        // 6. เก็บ token ใน cookie
        cookies()).set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // เฉพาะ https ใน production
    sameSite: "strict",
    maxAge: 60 * 60 * 2, // 2 ชั่วโมง
    path: "/",
  });

  return NextResponse.json({ message: "เข้าสู่ระบบสำเร็จ", user: { id: user.id, email: user.email } });
}
