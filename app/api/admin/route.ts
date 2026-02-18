import { NextResponse } from 'next/server';
import { kv } from '@/lib/redis';

// API สำหรับหน้าเว็บ Dashboard (CRUD Keys)
export async function GET(req: Request) {
    // SECURITY: ควรเพิ่มการเช็ค Password หรือ Token ตรงนี้
    const keys = await kv.keys('license:*');
    const licenses = [];
    
    for (const k of keys) {
        const data = await kv.hgetall(k);
        licenses.push({ key: k.replace('license:', ''), ...data });
    }
    
    return NextResponse.json(licenses);
}

export async function POST(req: Request) {
    const { action, key, note } = await req.json();
    
    if (action === 'create') {
        const newKey = key || Math.random().toString(36).substring(2, 15).toUpperCase();
        await kv.hset(`license:${newKey}`, { 
            status: 'active', 
            hwid: '', 
            note: note || '',
            created_at: Date.now() 
        });
        return NextResponse.json({ success: true, key: newKey });
    }

    if (action === 'delete') {
        await kv.del(`license:${key}`);
        return NextResponse.json({ success: true });
    }

    if (action === 'reset_hwid') {
        await kv.hset(`license:${key}`, { hwid: '' });
        return NextResponse.json({ success: true });
    }

    if (action === 'ban') {
        await kv.hset(`license:${key}`, { status: 'banned' });
        return NextResponse.json({ success: true });
    }
    
    if (action === 'unban') {
        await kv.hset(`license:${key}`, { status: 'active' });
        return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false });
}
