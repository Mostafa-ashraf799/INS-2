import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  getUsers, getNews, addNews, deleteNews,
  getAnnouncements, deleteAnnouncement, deleteUser,
  type User, type NewsItem, type Announcement,
  loginUser
} from '../store';
import {
  Shield, Users, Newspaper, Megaphone, Trash2, Plus, X,
  Mail, Lock, Eye, EyeOff, LogIn, AlertTriangle,
  Image, Video, Clock, User as UserIcon, Search
} from 'lucide-react';

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('ar-EG', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
}

export default function AdminPage() {
  const { user, refresh } = useAuth();
  const [adminAuth, setAdminAuth] = useState(false);

  // Admin login
  const [adminId, setAdminId] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Tabs
  const [tab, setTab] = useState<'news' | 'users' | 'announcements'>('news');

  // Data
  const [users, setUsers] = useState<User[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // New article form
  const [showForm, setShowForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newMediaUrl, setNewMediaUrl] = useState('');
  const [newMediaType, setNewMediaType] = useState<'image' | 'video'>('image');
  const [publishing, setPublishing] = useState(false);

  useEffect(() => {
    if (user?.isAdmin) {
      setAdminAuth(true);
    }
  }, [user]);

  const loadData = async () => {
    const [u, n, a] = await Promise.all([getUsers(), getNews(), getAnnouncements()]);
    setUsers(u);
    setNews(n);
    setAnnouncements(a);
  };

  useEffect(() => {
    if (adminAuth) {
      loadData();
      const interval = setInterval(loadData, 5000);
      return () => clearInterval(interval);
    }
  }, [adminAuth]);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);
    try {
      const res = await loginUser(adminId, adminPass);
      if (res.success && res.user?.isAdmin) {
        setAdminAuth(true);
        await refresh();
      } else if (res.success && !res.user?.isAdmin) {
        setLoginError('هذا الحساب ليس حساب مدير');
      } else {
        setLoginError(res.error || 'بيانات خاطئة');
      }
    } catch {
      setLoginError('حدث خطأ، حاول مجدداً');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleAddNews = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim() || publishing) return;
    setPublishing(true);
    try {
      await addNews({
        title: newTitle.trim(),
        content: newContent.trim(),
        mediaUrl: newMediaUrl.trim(),
        mediaType: newMediaType,
        authorId: user?.id || 'admin-001',
        authorName: user?.fullName || 'مدير النظام',
      });
      setNewTitle('');
      setNewContent('');
      setNewMediaUrl('');
      setShowForm(false);
      await loadData();
    } catch (err) {
      console.error('فشل نشر الخبر:', err);
    } finally {
      setPublishing(false);
    }
  };

  const handleDeleteNews = async (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا الخبر؟')) {
      await deleteNews(id);
      await loadData();
    }
  };

  const handleDeleteAnnouncement = async (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا الإعلان؟')) {
      await deleteAnnouncement(id);
      await loadData();
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (id === user?.id) return;
    if (confirm('هل أنت متأكد من حذف هذا المستخدم؟')) {
      await deleteUser(id);
      await loadData();
    }
  };

  const filteredUsers = users.filter(u =>
    u.username.includes(searchQuery) ||
    u.email.includes(searchQuery) ||
    u.fullName.includes(searchQuery)
  );

  // ==================== Admin Login ====================
  if (!adminAuth) {
    return (
      <div className="min-h-full flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-red-500/20 to-orange-500/20 flex items-center justify-center mb-4">
              <Shield size={40} className="text-red-400" />
            </div>
            <h1 className="text-2xl font-black text-white mb-2">لوحة الإدارة</h1>
            <p className="text-dark-400 text-sm">يرجى تسجيل الدخول بحساب المدير</p>
          </div>

          <div className="glass rounded-2xl p-6 gradient-border">
            {loginError && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center flex items-center justify-center gap-2">
                <AlertTriangle size={16} />
                {loginError}
              </div>
            )}

            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div className="relative">
                <Mail size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-500" />
                <input
                  type="text"
                  value={adminId}
                  onChange={(e) => setAdminId(e.target.value)}
                  placeholder="البريد الإلكتروني"
                  className="w-full bg-dark-800/50 text-white placeholder-dark-500 pr-10 pl-4 py-3 rounded-xl border border-dark-600/50 focus:border-primary-500 focus:outline-none text-sm"
                  required
                />
              </div>
              <div className="relative">
                <Lock size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-500" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={adminPass}
                  onChange={(e) => setAdminPass(e.target.value)}
                  placeholder="كلمة المرور"
                  className="w-full bg-dark-800/50 text-white placeholder-dark-500 pr-10 pl-10 py-3 rounded-xl border border-dark-600/50 focus:border-primary-500 focus:outline-none text-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500 hover:text-dark-300"
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <button
                type="submit"
                disabled={loginLoading}
                className="w-full py-3 bg-gradient-to-l from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 disabled:opacity-60 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2"
              >
                <LogIn size={18} />
                {loginLoading ? 'جاري الدخول...' : 'دخول لوحة الإدارة'}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // ==================== Admin Dashboard ====================
  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500/20 to-orange-500/20 flex items-center justify-center">
            <Shield size={24} className="text-red-400" />
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-black text-white">لوحة الإدارة</h1>
            <p className="text-dark-400 text-sm">إدارة المحتوى والمستخدمين</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-4">
          {[
            { label: 'المستخدمين', count: users.length, icon: <Users size={20} />, color: 'from-blue-500/20 to-cyan-500/20 text-blue-400' },
            { label: 'الأخبار', count: news.length, icon: <Newspaper size={20} />, color: 'from-green-500/20 to-emerald-500/20 text-green-400' },
            { label: 'الإعلانات', count: announcements.length, icon: <Megaphone size={20} />, color: 'from-purple-500/20 to-pink-500/20 text-purple-400' },
          ].map((s, i) => (
            <div key={i} className="glass rounded-xl p-4">
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${s.color} flex items-center justify-center mb-2`}>
                {s.icon}
              </div>
              <p className="text-2xl font-black text-white">{s.count}</p>
              <p className="text-xs text-dark-400">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 bg-dark-900/50 p-1.5 rounded-xl">
        {[
          { id: 'news' as const, label: 'إدارة الأخبار', icon: <Newspaper size={16} /> },
          { id: 'users' as const, label: 'المستخدمين', icon: <Users size={16} /> },
          { id: 'announcements' as const, label: 'الإعلانات', icon: <Megaphone size={16} /> },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
              tab === t.id ? 'bg-primary-600 text-white shadow-lg' : 'text-dark-400 hover:text-white'
            }`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* ==================== NEWS TAB ==================== */}
      {tab === 'news' && (
        <div className="space-y-4">
          <button
            onClick={() => setShowForm(!showForm)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${
              showForm
                ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                : 'bg-primary-600 text-white hover:bg-primary-500'
            }`}
          >
            {showForm ? <X size={16} /> : <Plus size={16} />}
            {showForm ? 'إلغاء' : 'إضافة خبر جديد'}
          </button>

          {showForm && (
            <form onSubmit={handleAddNews} className="glass rounded-2xl p-6 space-y-4 animate-fade-in">
              <h3 className="font-bold text-white mb-2">خبر جديد</h3>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="عنوان الخبر"
                className="w-full bg-dark-800/50 text-white placeholder-dark-500 px-4 py-3 rounded-xl border border-dark-600/50 focus:border-primary-500 focus:outline-none text-sm"
                required
              />
              <textarea
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="محتوى الخبر..."
                rows={4}
                className="w-full bg-dark-800/50 text-white placeholder-dark-500 px-4 py-3 rounded-xl border border-dark-600/50 focus:border-primary-500 focus:outline-none text-sm resize-none"
                required
              />
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="url"
                  value={newMediaUrl}
                  onChange={(e) => setNewMediaUrl(e.target.value)}
                  placeholder="رابط الصورة أو الفيديو"
                  className="w-full bg-dark-800/50 text-white placeholder-dark-500 px-4 py-3 rounded-xl border border-dark-600/50 focus:border-primary-500 focus:outline-none text-sm"
                  dir="ltr"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setNewMediaType('image')}
                    className={`flex-1 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                      newMediaType === 'image' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'glass text-dark-400'
                    }`}
                  >
                    <Image size={16} /> صورة
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewMediaType('video')}
                    className={`flex-1 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                      newMediaType === 'video' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'glass text-dark-400'
                    }`}
                  >
                    <Video size={16} /> فيديو
                  </button>
                </div>
              </div>
              <button
                type="submit"
                disabled={publishing}
                className="w-full py-3 bg-gradient-to-l from-primary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500 disabled:opacity-60 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2"
              >
                <Newspaper size={16} /> {publishing ? 'جاري النشر...' : 'نشر الخبر'}
              </button>
            </form>
          )}

          {/* News list */}
          <div className="space-y-3">
            {news.map(item => (
              <div key={item.id} className="glass rounded-xl p-4 flex items-start gap-4">
                {item.mediaUrl && (
                  <div className="w-20 h-20 rounded-lg bg-dark-800 overflow-hidden shrink-0">
                    <img src={item.mediaUrl} alt="" className="w-full h-full object-cover" onError={(e) => (e.target as HTMLImageElement).style.display = 'none'} />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-white text-sm mb-1 truncate">{item.title}</h3>
                  <p className="text-dark-400 text-xs line-clamp-2 mb-2">{item.content}</p>
                  <div className="flex items-center gap-3 text-[11px] text-dark-500">
                    <span className="flex items-center gap-1"><UserIcon size={10} />{item.authorName}</span>
                    <span className="flex items-center gap-1"><Clock size={10} />{formatDate(item.createdAt)}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] ${item.mediaType === 'image' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'}`}>
                      {item.mediaType === 'image' ? 'صورة' : 'فيديو'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteNews(item.id)}
                  className="p-2 text-dark-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors shrink-0"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================== USERS TAB ==================== */}
      {tab === 'users' && (
        <div className="space-y-4">
          <div className="relative">
            <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="بحث بالاسم أو البريد أو اسم المستخدم..."
              className="w-full bg-dark-800/50 text-white placeholder-dark-500 pr-10 pl-4 py-3 rounded-xl border border-dark-600/50 focus:border-primary-500 focus:outline-none text-sm"
            />
          </div>

          <div className="glass rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-dark-800/50 text-dark-400">
                    <th className="text-right px-4 py-3 font-semibold">المستخدم</th>
                    <th className="text-right px-4 py-3 font-semibold">البريد</th>
                    <th className="text-right px-4 py-3 font-semibold">تاريخ التسجيل</th>
                    <th className="text-right px-4 py-3 font-semibold">النوع</th>
                    <th className="text-center px-4 py-3 font-semibold">إجراء</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(u => (
                    <tr key={u.id} className="border-t border-dark-700/30 hover:bg-dark-800/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-xs font-bold">
                            {u.username.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-white text-xs">{u.fullName || u.username}</p>
                            <p className="text-dark-500 text-[10px]">@{u.username}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-dark-300 text-xs" dir="ltr">{u.email}</td>
                      <td className="px-4 py-3 text-dark-400 text-xs">{formatDate(u.createdAt)}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          u.isAdmin ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'
                        }`}>
                          {u.isAdmin ? 'مدير' : 'مستخدم'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {!u.isAdmin && (
                          <button
                            onClick={() => handleDeleteUser(u.id)}
                            className="p-1.5 text-dark-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ==================== ANNOUNCEMENTS TAB ==================== */}
      {tab === 'announcements' && (
        <div className="space-y-3">
          {announcements.length === 0 ? (
            <div className="text-center py-12 text-dark-500">
              <Megaphone size={48} className="mx-auto mb-3 opacity-50" />
              <p className="font-semibold">لا توجد إعلانات</p>
            </div>
          ) : (
            announcements.map(ann => (
              <div key={ann.id} className="glass rounded-xl p-4 flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-bold text-white text-sm mb-1">{ann.title}</h3>
                  <p className="text-dark-400 text-xs mb-2 line-clamp-2">{ann.content}</p>
                  <div className="flex items-center gap-3 text-[11px] text-dark-500">
                    <span className="flex items-center gap-1"><UserIcon size={10} />@{ann.username}</span>
                    <span className="flex items-center gap-1"><Clock size={10} />{formatDate(ann.createdAt)}</span>
                    <span className="px-1.5 py-0.5 rounded bg-dark-700/50 text-dark-400">{ann.category}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteAnnouncement(ann.id)}
                  className="p-2 text-dark-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors shrink-0"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
