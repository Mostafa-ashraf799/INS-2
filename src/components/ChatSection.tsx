import { useState, useEffect, useRef } from 'react';
import { Send, Reply, X, CornerDownLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getMessages, addMessage, type ChatMessage } from '../store';

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = Math.floor((now - then) / 1000);
  if (diff < 60) return 'الآن';
  if (diff < 3600) return `منذ ${Math.floor(diff / 60)} د`;
  if (diff < 86400) return `منذ ${Math.floor(diff / 3600)} س`;
  if (diff < 604800) return `منذ ${Math.floor(diff / 86400)} ي`;
  return new Date(dateStr).toLocaleDateString('ar-EG');
}

export default function ChatSection({ category }: { category: string }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMsg, setNewMsg] = useState('');
  const [replyTo, setReplyTo] = useState<ChatMessage | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMessages(getMessages(category));
    const interval = setInterval(() => {
      setMessages(getMessages(category));
    }, 2000);
    return () => clearInterval(interval);
  }, [category]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!newMsg.trim() || !user) return;

    // Extract mentions
    const mentionRegex = /@(\w+)/g;
    const mentions: string[] = [];
    let match;
    while ((match = mentionRegex.exec(newMsg)) !== null) {
      mentions.push(match[1]);
    }

    addMessage({
      content: newMsg.trim(),
      userId: user.id,
      username: user.username,
      category,
      replyTo: replyTo ? { id: replyTo.id, username: replyTo.username, content: replyTo.content.substring(0, 100) } : null,
      mentions,
    });

    setNewMsg('');
    setReplyTo(null);
    setMessages(getMessages(category));
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getInitials = (username: string) => username.substring(0, 2).toUpperCase();

  const colors = [
    'from-blue-500 to-cyan-500',
    'from-purple-500 to-pink-500',
    'from-green-500 to-emerald-500',
    'from-orange-500 to-amber-500',
    'from-red-500 to-rose-500',
    'from-indigo-500 to-violet-500',
    'from-teal-500 to-green-500',
    'from-fuchsia-500 to-purple-500',
  ];

  const getColor = (userId: string) => {
    let hash = 0;
    for (let i = 0; i < userId.length; i++) hash = userId.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
  };

  const highlightMentions = (text: string) => {
    const parts = text.split(/(@\w+)/g);
    return parts.map((part, i) => {
      if (part.startsWith('@')) {
        const isMentioningMe = user && part === `@${user.username}`;
        return (
          <span
            key={i}
            className={`font-semibold ${isMentioningMe ? 'text-amber-400 bg-amber-400/10 px-1 rounded' : 'text-primary-400'}`}
          >
            {part}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 border-b border-dark-700/50 bg-dark-800/50">
        <h3 className="font-bold text-white flex items-center gap-2">
          💬 المحادثة الجماعية
          <span className="text-xs text-dark-400 font-normal">({messages.length} رسالة)</span>
        </h3>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-dark-500">
            <div className="text-5xl mb-3">💬</div>
            <p className="text-lg font-semibold">لا توجد رسائل بعد</p>
            <p className="text-sm">كن أول من يبدأ المحادثة!</p>
          </div>
        )}
        {messages.map((msg) => {
          const isMe = msg.userId === user?.id;
          return (
            <div
              key={msg.id}
              className={`group flex gap-3 animate-fade-in ${isMe ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${getColor(msg.userId)} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                {getInitials(msg.username)}
              </div>
              <div className={`max-w-[75%] ${isMe ? 'items-end' : 'items-start'}`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold text-primary-400">@{msg.username}</span>
                  <span className="text-[10px] text-dark-500">{timeAgo(msg.createdAt)}</span>
                </div>

                {msg.replyTo && (
                  <div className="flex items-start gap-2 mb-1 p-2 rounded-lg bg-dark-700/30 border-r-2 border-primary-500/50 text-xs text-dark-400">
                    <CornerDownLeft size={12} className="shrink-0 mt-0.5" />
                    <div>
                      <span className="text-primary-400 font-semibold">@{msg.replyTo.username}</span>
                      <p className="truncate max-w-[200px]">{msg.replyTo.content}</p>
                    </div>
                  </div>
                )}

                <div className={`px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                  isMe
                    ? 'bg-primary-600/20 text-dark-100 rounded-tl-sm'
                    : 'bg-dark-700/50 text-dark-200 rounded-tr-sm'
                }`}>
                  {highlightMentions(msg.content)}
                </div>

                <button
                  onClick={() => { setReplyTo(msg); inputRef.current?.focus(); }}
                  className="opacity-0 group-hover:opacity-100 mt-1 flex items-center gap-1 text-[10px] text-dark-500 hover:text-primary-400 transition-all"
                >
                  <Reply size={12} /> رد
                </button>
              </div>
            </div>
          );
        })}
        <div ref={chatEndRef} />
      </div>

      {/* Reply indicator */}
      {replyTo && (
        <div className="px-4 py-2 bg-dark-800/80 border-t border-dark-700/50 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-dark-400">
            <Reply size={14} className="text-primary-400" />
            <span>رد على <span className="text-primary-400 font-semibold">@{replyTo.username}</span></span>
            <span className="truncate max-w-[150px] text-dark-500">{replyTo.content}</span>
          </div>
          <button onClick={() => setReplyTo(null)} className="text-dark-500 hover:text-red-400">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Input */}
      <div className="p-3 border-t border-dark-700/50 bg-dark-800/50">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={newMsg}
            onChange={(e) => setNewMsg(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="اكتب رسالتك... (استخدم @ للمنشن)"
            className="flex-1 bg-dark-700/50 text-white placeholder-dark-500 px-4 py-2.5 rounded-xl border border-dark-600/50 focus:border-primary-500/50 focus:outline-none text-sm transition-colors"
          />
          <button
            onClick={handleSend}
            disabled={!newMsg.trim()}
            className="p-2.5 bg-primary-600 hover:bg-primary-500 disabled:bg-dark-700 disabled:text-dark-500 text-white rounded-xl transition-colors"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
