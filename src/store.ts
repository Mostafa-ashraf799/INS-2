// src/store.ts
// INS Community Data Store — Supabase Version

import { supabase } from './lib/supabase';

export interface SocialLinks {
  twitter: string; facebook: string; instagram: string;
  linkedin: string; github: string; youtube: string; website: string;
}
export interface User {
  id: string; username: string; email: string;
  fullName: string; bio: string; avatar: string;
  socialLinks: SocialLinks; createdAt: string; isAdmin: boolean;
}
export interface NewsItem {
  id: string; title: string; content: string;
  mediaUrl: string; mediaType: 'image' | 'video';
  createdAt: string; authorId: string; authorName: string;
}
export interface ChatMessage {
  id: string; content: string; userId: string; username: string;
  category: string; replyTo: { id: string; username: string; content: string } | null;
  mentions: string[]; createdAt: string;
}
export interface Announcement {
  id: string; title: string; content: string;
  userId: string; username: string; category: string; createdAt: string;
}

function mapProfile(row: any, email = ''): User {
  return { id: row.id, username: row.username, email, fullName: row.full_name, bio: row.bio, avatar: row.avatar, socialLinks: row.social_links, createdAt: row.created_at, isAdmin: row.is_admin };
}
function mapNews(row: any): NewsItem {
  return { id: row.id, title: row.title, content: row.content, mediaUrl: row.media_url, mediaType: row.media_type, createdAt: row.created_at, authorId: row.author_id, authorName: row.author_name };
}
function mapMessage(row: any): ChatMessage {
  return { id: row.id, content: row.content, userId: row.user_id, username: row.username, category: row.category, replyTo: row.reply_to ?? null, mentions: row.mentions ?? [], createdAt: row.created_at };
}
function mapAnnouncement(row: any): Announcement {
  return { id: row.id, title: row.title, content: row.content, userId: row.user_id, username: row.username, category: row.category, createdAt: row.created_at };
}

// Auth
export async function registerUser(username: string, email: string, password: string, fullName: string) {
  const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { username, full_name: fullName } } });
  if (error) return { success: false, error: error.message };
  if (!data.user) return { success: false, error: 'فشل إنشاء الحساب' };
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', data.user.id).single();
  return { success: true, user: profile ? mapProfile(profile, email) : undefined };
}
export async function loginUser(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { success: false, error: 'بيانات الدخول غير صحيحة' };
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', data.user.id).single();
  return { success: true, user: profile ? mapProfile(profile, email) : undefined };
}
export async function logoutUser() { await supabase.auth.signOut(); }
export async function getCurrentUser(): Promise<User | null> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return null;
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
  return profile ? mapProfile(profile, session.user.email ?? '') : null;
}
export async function getUsers(): Promise<User[]> {
  const { data } = await supabase.from('profiles').select('*').order('created_at');
  return (data ?? []).map(p => mapProfile(p));
}
export async function deleteUser(userId: string) { await supabase.from('profiles').delete().eq('id', userId); }
export async function updateUser(userId: string, updates: Partial<User>): Promise<User | null> {
  const db: any = {};
  if (updates.fullName !== undefined) db.full_name = updates.fullName;
  if (updates.bio !== undefined) db.bio = updates.bio;
  if (updates.avatar !== undefined) db.avatar = updates.avatar;
  if (updates.socialLinks !== undefined) db.social_links = updates.socialLinks;
  if (updates.isAdmin !== undefined) db.is_admin = updates.isAdmin;
  const { data } = await supabase.from('profiles').update(db).eq('id', userId).select().single();
  return data ? mapProfile(data) : null;
}

// News
export async function getNews(): Promise<NewsItem[]> {
  const { data } = await supabase.from('news').select('*').order('created_at', { ascending: false });
  return (data ?? []).map(mapNews);
}
export async function addNews(item: Omit<NewsItem, 'id' | 'createdAt'>): Promise<NewsItem> {
  const { data, error } = await supabase.from('news').insert({ title: item.title, content: item.content, media_url: item.mediaUrl, media_type: item.mediaType, author_id: item.authorId, author_name: item.authorName }).select().single();
  if (error) throw new Error(error.message);
  return mapNews(data);
}
export async function deleteNews(id: string) { await supabase.from('news').delete().eq('id', id); }

// Messages
export async function getMessages(category: string): Promise<ChatMessage[]> {
  const { data } = await supabase.from('messages').select('*').eq('category', category).order('created_at', { ascending: true });
  return (data ?? []).map(mapMessage);
}
export async function addMessage(msg: Omit<ChatMessage, 'id' | 'createdAt'>): Promise<ChatMessage> {
  const { data, error } = await supabase.from('messages').insert({ content: msg.content, user_id: msg.userId, username: msg.username, category: msg.category, reply_to: msg.replyTo, mentions: msg.mentions }).select().single();
  if (error) throw new Error(error.message);
  return mapMessage(data);
}
export async function deleteMessage(id: string) { await supabase.from('messages').delete().eq('id', id); }
export function subscribeToMessages(category: string, callback: (msg: ChatMessage) => void) {
  return supabase.channel(`messages:${category}`)
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `category=eq.${category}` }, (payload) => callback(mapMessage(payload.new)))
    .subscribe();
}

// Announcements
export async function getAnnouncements(category?: string): Promise<Announcement[]> {
  let q = supabase.from('announcements').select('*').order('created_at', { ascending: false });
  if (category) q = q.eq('category', category);
  const { data } = await q;
  return (data ?? []).map(mapAnnouncement);
}
export async function addAnnouncement(ann: Omit<Announcement, 'id' | 'createdAt'>): Promise<Announcement> {
  const { data, error } = await supabase.from('announcements').insert({ title: ann.title, content: ann.content, user_id: ann.userId, username: ann.username, category: ann.category }).select().single();
  if (error) throw new Error(error.message);
  return mapAnnouncement(data);
}
export async function deleteAnnouncement(id: string) { await supabase.from('announcements').delete().eq('id', id); }

// Categories
export const TECH_CATEGORIES = [
  { id: 'programming', name: 'البرمجة', icon: 'Code', desc: 'مناقشات حول لغات البرمجة وأفضل الممارسات' },
  { id: 'ai', name: 'الذكاء الاصطناعي', icon: 'Brain', desc: 'تعلم الآلة والتعلم العميق والشبكات العصبية' },
  { id: 'cybersecurity', name: 'الأمن السيبراني', icon: 'Shield', desc: 'أمن المعلومات والاختراق الأخلاقي' },
  { id: 'web-dev', name: 'تطوير الويب', icon: 'Globe', desc: 'Front-end و Back-end وكل ما يتعلق بالويب' },
  { id: 'mobile-dev', name: 'تطوير التطبيقات', icon: 'Smartphone', desc: 'Android و iOS و Cross-platform' },
  { id: 'data-science', name: 'علم البيانات', icon: 'BarChart3', desc: 'تحليل البيانات والإحصاء والتصور البياني' },
  { id: 'cloud', name: 'الحوسبة السحابية', icon: 'Cloud', desc: 'AWS و Azure و Google Cloud' },
  { id: 'gaming', name: 'تطوير الألعاب', icon: 'Gamepad2', desc: 'Unity و Unreal Engine وتصميم الألعاب' },
  { id: 'devops', name: 'DevOps', icon: 'Container', desc: 'Docker و Kubernetes و CI/CD' },
  { id: 'networking', name: 'الشبكات', icon: 'Network', desc: 'بروتوكولات الشبكات والبنية التحتية' },
];
