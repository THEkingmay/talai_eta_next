import {  NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabase } from '@/lib/supabase';
import jwt from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';

export async function GET() {
    try{
        const token = (await cookies()).get('token')?.value;
        if (!token) {
            return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
        const userId = decoded.id;
        if (!userId) {
            return new Response(JSON.stringify({ message: 'Invalid token' }), { status: 401 });
        }
        const { data, error } = await supabase
            .from('locations')
            .select('id, latitude_longitude, created_at')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(100); // ดึงข้อมูลล่าสุด 100 รายการ   
        if (error) {
            console.error('Supabase error:', error);
            return new Response(JSON.stringify({ message: 'Database error', error }), { status: 500 });
        }   
        return NextResponse.json({ message: 'Locations fetched', data });
    } catch(err){
        console.error('Error processing request:', err);
        return new Response(JSON.stringify({ message: "เกิดข้อผิดพลาด", err }), { status: 500 });
    }
}

export async function POST(request: Request) {

    try{
        const text = await request.text();
        if (!text) {
        return new Response(JSON.stringify({ message: 'Request body is empty' }), { status: 400 });
        }
        const { latitude, longitude } = JSON.parse(text);
        // console.log('Received location:', { latitude, longitude });
        
        const token = (await cookies()).get('token')?.value;
        if (!token) {
            return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
        }
        const decoded  = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
        const userId = decoded.id;
        if (!userId) {
            return new Response(JSON.stringify({ message: 'Invalid token' }), { status: 401 });
        }       
        const { data, error } = await supabase 
            .from('locations')
            .insert([{ user_id: userId , latitude : Number(latitude), longitude: Number(longitude) }]);

        console.log('Location saved to DB from user ', userId)

        if (error) {
            console.error('Supabase error:', error);
            return new Response(JSON.stringify({ message: 'Database error', error }), { status: 500 });
        }
        return NextResponse.json({ message: 'Location updated', data });

    }catch(err){
        console.error('Error processing request:', err);
        return new Response(JSON.stringify({ message: "เกิดข้อผิดพลาด", err }), { status: 500 });
    }   
}
