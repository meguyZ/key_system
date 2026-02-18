import { createClient } from '@vercel/kv';

// ดึงค่า Environment Variables
const url = process.env.KV_REST_API_URL;
const token = process.env.KV_REST_API_TOKEN;

// สร้างค่าสำรอง (Fallback) เพื่อป้องกัน Build พังถ้ายังไม่ได้ต่อ Database
// ถ้าไม่มี URL ของจริง ให้ใช้ URL ปลอมไปก่อน เพื่อให้ขั้นตอน Build ผ่านไปได้
const safeUrl = url || 'https://placeholder-url.vercel-storage.com';
const safeToken = token || 'placeholder-token';

// แจ้งเตือนใน Log ถ้าไม่มีค่า (เฉพาะตอน Production)
if (!url && process.env.NODE_ENV === 'production') {
    console.warn("⚠️ WARNING: Vercel KV Environment Variables are missing. Please connect your KV Store in Vercel Dashboard > Storage.");
}

export const kv = createClient({
  url: safeUrl,
  token: safeToken,
});
