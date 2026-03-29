// src/lib/supabase.ts
// ملف واحد للـ Supabase client — استخدمه في أي مكان تحتاجه

import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !key) {
  throw new Error('❌ مفاتيح Supabase مش موجودة — تأكد من ملف .env');
}

export const supabase = createClient(url, key);
