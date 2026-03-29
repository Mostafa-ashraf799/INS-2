// INS Community Data Store
// Uses localStorage to simulate Supabase backend
// To migrate to Supabase: replace localStorage calls with supabase client queries

const KEYS = {
  USERS: 'ins_users',
  CURRENT_USER: 'ins_current_user',
  NEWS: 'ins_news',
  MESSAGES: 'ins_messages',
  ANNOUNCEMENTS: 'ins_announcements',
};

// ==================== Types ====================

export interface SocialLinks {
  twitter: string;
  facebook: string;
  instagram: string;
  linkedin: string;
  github: string;
  youtube: string;
  website: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  fullName: string;
  bio: string;
  avatar: string;
  socialLinks: SocialLinks;
  createdAt: string;
  isAdmin: boolean;
}

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  createdAt: string;
  authorId: string;
  authorName: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  userId: string;
  username: string;
  category: string;
  replyTo: { id: string; username: string; content: string } | null;
  mentions: string[];
  createdAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  userId: string;
  username: string;
  category: string;
  createdAt: string;
}

// ==================== Helpers ====================

function genId(): string {
  return Math.random().toString(36).substring(2, 12) + Date.now().toString(36);
}

function get<T>(key: string): T[] {
  try {
    const d = localStorage.getItem(key);
    return d ? JSON.parse(d) : [];
  } catch { return []; }
}

function set(key: string, data: unknown) {
  localStorage.setItem(key, JSON.stringify(data));
}

const emptySocial: SocialLinks = { twitter: '', facebook: '', instagram: '', linkedin: '', github: '', youtube: '', website: '' };

// ==================== Initialize ====================

export function initStore() {
  if (localStorage.getItem(KEYS.USERS)) return;

  const admin: User = {
    id: 'admin-001',
    username: 'admin',
    email: 'admin@ins.com',
    password: 'admin123',
    fullName: 'مدير النظام',
    bio: 'مدير مجتمع INS التقني العربي',
    avatar: '',
    socialLinks: { ...emptySocial },
    createdAt: new Date().toISOString(),
    isAdmin: true,
  };

  set(KEYS.USERS, [admin]);

  const now = new Date();
  const sampleNews: NewsItem[] = [
    {
      id: genId(),
      title: 'إطلاق الجيل الجديد من نماذج الذكاء الاصطناعي',
      content: 'أعلنت شركات التقنية الكبرى عن إطلاق جيل جديد من نماذج الذكاء الاصطناعي بقدرات مذهلة في فهم اللغة العربية والبرمجة والتحليل. هذه النماذج تمثل نقلة نوعية في عالم التقنية وستغير طريقة تعاملنا مع التكنولوجيا بشكل جذري.',
      mediaUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80',
      mediaType: 'image',
      createdAt: new Date(now.getTime() - 1000 * 60 * 30).toISOString(),
      authorId: 'admin-001',
      authorName: 'مدير النظام',
    },
    {
      id: genId(),
      title: 'مستقبل تطوير الويب في 2026',
      content: 'تشهد صناعة تطوير الويب تحولات جذرية مع ظهور أطر عمل جديدة وتقنيات مبتكرة. من React Server Components إلى تقنيات WebAssembly المتقدمة، يبدو أن مستقبل الويب سيكون أسرع وأكثر تفاعلية من أي وقت مضى.',
      mediaUrl: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80',
      mediaType: 'image',
      createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 2).toISOString(),
      authorId: 'admin-001',
      authorName: 'مدير النظام',
    },
    {
      id: genId(),
      title: 'أمن المعلومات: تهديدات جديدة وحلول مبتكرة',
      content: 'مع تزايد الهجمات السيبرانية، تبرز حلول أمنية جديدة تعتمد على الذكاء الاصطناعي لحماية البيانات والأنظمة. تعرف على أحدث التهديدات وكيفية حماية نفسك ومؤسستك.',
      mediaUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80',
      mediaType: 'image',
      createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 5).toISOString(),
      authorId: 'admin-001',
      authorName: 'مدير النظام',
    },
    {
      id: genId(),
      title: 'الحوسبة السحابية: خدمات جديدة من AWS و Azure',
      content: 'أطلقت كل من Amazon Web Services و Microsoft Azure خدمات سحابية جديدة تستهدف المطورين في المنطقة العربية مع مراكز بيانات محلية ودعم كامل للغة العربية.',
      mediaUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80',
      mediaType: 'image',
      createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 10).toISOString(),
      authorId: 'admin-001',
      authorName: 'مدير النظام',
    },
    {
      id: genId(),
      title: 'تطبيقات الموبايل: Flutter vs React Native في 2026',
      content: 'المقارنة الشاملة بين أشهر أطر عمل تطوير تطبيقات الهاتف المحمول. أيهما أفضل لمشروعك القادم؟ نستعرض المميزات والعيوب والأداء لكل منهما.',
      mediaUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80',
      mediaType: 'image',
      createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 24).toISOString(),
      authorId: 'admin-001',
      authorName: 'مدير النظام',
    },
    {
      id: genId(),
      title: 'علم البيانات والتحليلات المتقدمة',
      content: 'كيف تبدأ رحلتك في علم البيانات؟ دليل شامل للمبتدئين يغطي Python و R والأدوات الأساسية التي تحتاجها لتصبح محلل بيانات محترف.',
      mediaUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
      mediaType: 'image',
      createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 48).toISOString(),
      authorId: 'admin-001',
      authorName: 'مدير النظام',
    },
  ];

  set(KEYS.NEWS, sampleNews);
  set(KEYS.MESSAGES, []);
  set(KEYS.ANNOUNCEMENTS, []);
}

// ==================== Auth ====================

export function registerUser(username: string, email: string, password: string, fullName: string): { success: boolean; error?: string; user?: User } {
  const users = get<User>(KEYS.USERS);
  if (users.find(u => u.email === email)) return { success: false, error: 'البريد الإلكتروني مستخدم بالفعل' };
  if (users.find(u => u.username === username)) return { success: false, error: 'اسم المستخدم مستخدم بالفعل' };
  if (password.length < 6) return { success: false, error: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' };

  const user: User = {
    id: genId(),
    username, email, password, fullName,
    bio: '',
    avatar: '',
    socialLinks: { ...emptySocial },
    createdAt: new Date().toISOString(),
    isAdmin: false,
  };

  users.push(user);
  set(KEYS.USERS, users);
  set(KEYS.CURRENT_USER, user);
  return { success: true, user };
}

export function loginUser(identifier: string, password: string): { success: boolean; error?: string; user?: User } {
  const users = get<User>(KEYS.USERS);
  const user = users.find(u => (u.email === identifier || u.username === identifier) && u.password === password);
  if (!user) return { success: false, error: 'بيانات الدخول غير صحيحة' };
  set(KEYS.CURRENT_USER, user);
  return { success: true, user };
}

export function logoutUser() {
  localStorage.removeItem(KEYS.CURRENT_USER);
}

export function getCurrentUser(): User | null {
  try {
    const d = localStorage.getItem(KEYS.CURRENT_USER);
    return d ? JSON.parse(d) : null;
  } catch { return null; }
}

export function getUsers(): User[] {
  return get<User>(KEYS.USERS);
}

export function deleteUser(userId: string) {
  const users = get<User>(KEYS.USERS).filter(u => u.id !== userId);
  set(KEYS.USERS, users);
}

export function updateUser(userId: string, updates: Partial<User>): User | null {
  const users = get<User>(KEYS.USERS);
  const idx = users.findIndex(u => u.id === userId);
  if (idx === -1) return null;
  users[idx] = { ...users[idx], ...updates };
  set(KEYS.USERS, users);
  const cur = getCurrentUser();
  if (cur && cur.id === userId) set(KEYS.CURRENT_USER, users[idx]);
  return users[idx];
}

// ==================== News ====================

export function getNews(): NewsItem[] {
  return get<NewsItem>(KEYS.NEWS).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function addNews(item: Omit<NewsItem, 'id' | 'createdAt'>): NewsItem {
  const items = get<NewsItem>(KEYS.NEWS);
  const n: NewsItem = { ...item, id: genId(), createdAt: new Date().toISOString() };
  items.unshift(n);
  set(KEYS.NEWS, items);
  return n;
}

export function deleteNews(id: string) {
  set(KEYS.NEWS, get<NewsItem>(KEYS.NEWS).filter(n => n.id !== id));
}

// ==================== Messages ====================

export function getMessages(category: string): ChatMessage[] {
  return get<ChatMessage>(KEYS.MESSAGES).filter(m => m.category === category).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
}

export function addMessage(msg: Omit<ChatMessage, 'id' | 'createdAt'>): ChatMessage {
  const all = get<ChatMessage>(KEYS.MESSAGES);
  const m: ChatMessage = { ...msg, id: genId(), createdAt: new Date().toISOString() };
  all.push(m);
  set(KEYS.MESSAGES, all);
  return m;
}

export function deleteMessage(id: string) {
  set(KEYS.MESSAGES, get<ChatMessage>(KEYS.MESSAGES).filter(m => m.id !== id));
}

// ==================== Announcements ====================

export function getAnnouncements(category?: string): Announcement[] {
  const all = get<Announcement>(KEYS.ANNOUNCEMENTS);
  const filtered = category ? all.filter(a => a.category === category) : all;
  return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function addAnnouncement(ann: Omit<Announcement, 'id' | 'createdAt'>): Announcement {
  const all = get<Announcement>(KEYS.ANNOUNCEMENTS);
  const a: Announcement = { ...ann, id: genId(), createdAt: new Date().toISOString() };
  all.unshift(a);
  set(KEYS.ANNOUNCEMENTS, all);
  return a;
}

export function deleteAnnouncement(id: string) {
  set(KEYS.ANNOUNCEMENTS, get<Announcement>(KEYS.ANNOUNCEMENTS).filter(a => a.id !== id));
}

// ==================== Categories ====================

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

// Initialize on import
initStore();
