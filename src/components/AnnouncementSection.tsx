import { useState, useEffect } from 'react';
import { Plus, X, Megaphone, Clock, User, Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getAnnouncements, addAnnouncement, deleteAnnouncement, type Announcement } from '../store';

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  const now = Date.now();
  const diff = Math.floor((now - d.getTime()) / 1000);
  if (diff < 60) return 'الآن';
  if (diff < 3600) return `منذ ${Math.floor(diff / 60)} دقيقة`;
  if (diff < 86400) return `منذ ${Math.floor(diff / 3600)} ساعة`;
  if (diff < 604800) return `منذ ${Math.floor(diff / 86400)} يوم`;
  return d.toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default function AnnouncementSection({ category }: { category: string }) {
  const { user } = useAuth();
  const [items, setItems] = useState<Announcement[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadAnnouncements = async () => {
    const data = await getAnnouncements(category);
    setItems(data);
  };

  useEffect(() => {
    loadAnnouncements();
    const interval = setInterval(loadAnnouncements, 5000);
    return () => clearInterval(interval);
  }, [category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !user || submitting) return;

    setSubmitting(true);
    try {
      await addAnnouncement({
        title: title.trim(),
        content: content.trim(),
        userId: user.id,
        username: user.username,
        category,
      });
      setTitle('');
      setContent('');
      setShowForm(false);
      await loadAnnouncements();
    } catch (err) {
      console.error('فشل نشر الإعلان:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteAnnouncement(id);
    await loadAnnouncements();
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 border-b border-dark-700/50 bg-dark-800/50 flex items-center justify-between">
        <h3 className="font-bold text-white flex items-center gap-2">
          📢 الإعلانات
          <span className="text-xs text-dark-400 font-normal">({items.length})</span>
        </h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className={`p-1.5 rounded-lg transition-colors ${
            showForm ? 'bg-red-500/20 text-red-400' : 'bg-primary-600/20 text-primary-400 hover:bg-primary-600/30'
          }`}
        >
          {showForm ? <X size={16} /> : <Plus size={16} />}
        </button>
      </div>

      {/* New Announcement Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="p-4 border-b border-dark-700/50 bg-dark-800/30 space-y-3 animate-fade-in">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="عنوان الإعلان"
            className="w-full bg-dark-700/50 text-white placeholder-dark-500 px-3 py-2 rounded-lg border border-dark-600/50 focus:border-primary-500/50 focus:outline-none text-sm"
            required
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="محتوى الإعلان..."
            rows={3}
            className="w-full bg-dark-700/50 text-white placeholder-dark-500 px-3 py-2 rounded-lg border border-dark-600/50 focus:border-primary-500/50 focus:outline-none text-sm resize-none"
            required
          />
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-primary-600 hover:bg-primary-500 disabled:opacity-60 text-white py-2 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <Megaphone size={16} />
            {submitting ? 'جاري النشر...' : 'نشر الإعلان'}
          </button>
        </form>
      )}

      {/* Announcements List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {items.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-dark-500">
            <div className="text-5xl mb-3">📢</div>
            <p className="text-lg font-semibold">لا توجد إعلانات</p>
            <p className="text-sm">اضغط + لنشر أول إعلان</p>
          </div>
        )}
        {items.map((item) => (
          <div
            key={item.id}
            className="glass rounded-xl p-4 hover:border-primary-500/20 transition-all animate-fade-in"
          >
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-bold text-white text-sm">{item.title}</h4>
              {(user?.id === item.userId || user?.isAdmin) && (
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-dark-500 hover:text-red-400 transition-colors p-1"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
            <p className="text-dark-300 text-sm leading-relaxed mb-3">{item.content}</p>
            <div className="flex items-center justify-between text-[11px] text-dark-500">
              <div className="flex items-center gap-1">
                <User size={11} />
                <span>@{item.username}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock size={11} />
                <span>{formatDate(item.createdAt)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
