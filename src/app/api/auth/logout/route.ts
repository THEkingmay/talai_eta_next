import { cookies } from "next/headers"

export async function GET(){
    const cookieStore = await cookies()
    cookieStore.delete("token")
    return new Response(JSON.stringify({message: "Logged out successfully"}), {status: 200})
}