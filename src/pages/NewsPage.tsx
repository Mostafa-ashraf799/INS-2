import { useState, useEffect } from 'react';
import { getNews, type NewsItem } from '../store';
import { Clock, User, TrendingUp, Newspaper } from 'lucide-react';

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

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    setNews(getNews());
    const interval = setInterval(() => setNews(getNews()), 5000);
    return () => clearInterval(interval);
  }, []);

  const filtered = filter === 'all' ? news :
    filter === 'image' ? news.filter(n => n.mediaType === 'image') :
    news.filter(n => n.mediaType === 'video');

  return (
    <div className="p-4 lg:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center">
            <TrendingUp size={24} className="text-primary-400" />
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-black text-white">آخر الأخبار</h1>
            <p className="text-dark-400 text-sm">أحدث الأخبار والمقالات التقنية</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mt-4">
          {[
            { id: 'all', label: 'الكل' },
            { id: 'image', label: '📷 صور' },
            { id: 'video', label: '🎬 فيديو' },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                filter === f.id
                  ? 'bg-primary-600 text-white'
                  : 'glass text-dark-400 hover:text-white'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* News Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-dark-500">
          <Newspaper size={64} className="mb-4 opacity-50" />
          <p className="text-xl font-bold">لا توجد أخبار حالياً</p>
          <p className="text-sm">ترقبوا الأخبار القادمة!</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item, i) => (
            <article
              key={item.id}
              className="glass rounded-2xl overflow-hidden glass-hover transition-all duration-300 hover:translate-y-[-4px] group animate-fade-in-up"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              {/* Media */}
              <div className="relative h-48 bg-dark-800 overflow-hidden">
                {item.mediaType === 'image' ? (
                  <img
                    src={item.mediaUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '';
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="relative w-full h-full">
                    <video
                      src={item.mediaUrl}
                      className="w-full h-full object-cover"
                      muted
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <div className="w-0 h-0 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-r-[16px] border-r-white mr-[-2px] rotate-180" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Badge */}
                <div className="absolute top-3 right-3">
                  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold backdrop-blur-sm ${
                    item.mediaType === 'image'
                      ? 'bg-blue-500/80 text-white'
                      : 'bg-purple-500/80 text-white'
                  }`}>
                    {item.mediaType === 'image' ? '📷 صورة' : '🎬 فيديو'}
                  </span>
                </div>

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 to-transparent" />
              </div>

              {/* Content */}
              <div className="p-5">
                <h2 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-primary-400 transition-colors">
                  {item.title}
                </h2>
                <p className="text-dark-400 text-sm leading-relaxed line-clamp-3 mb-4">
                  {item.content}
                </p>
                <div className="flex items-center justify-between text-xs text-dark-500">
                  <div className="flex items-center gap-1.5">
                    <User size={12} />
                    <span>{item.authorName}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock size={12} />
                    <span>{formatDate(item.createdAt)}</span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
