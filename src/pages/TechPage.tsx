import { useParams } from 'react-router-dom';
import { TECH_CATEGORIES } from '../store';
import ChatSection from '../components/ChatSection';
import AnnouncementSection from '../components/AnnouncementSection';
import {
  Code, Brain, Shield, Globe, Smartphone,
  BarChart3, Cloud, Gamepad2, Server, Network
} from 'lucide-react';
import { useState } from 'react';

const iconMap: Record<string, React.ReactNode> = {
  Code: <Code size={28} />,
  Brain: <Brain size={28} />,
  Shield: <Shield size={28} />,
  Globe: <Globe size={28} />,
  Smartphone: <Smartphone size={28} />,
  BarChart3: <BarChart3 size={28} />,
  Cloud: <Cloud size={28} />,
  Gamepad2: <Gamepad2 size={28} />,
  Container: <Server size={28} />,
  Network: <Network size={28} />,
};

export default function TechPage() {
  const { categoryId } = useParams();
  const category = TECH_CATEGORIES.find(c => c.id === categoryId);
  const [activeTab, setActiveTab] = useState<'chat' | 'announcements'>('chat');

  if (!category) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-dark-500 p-8">
        <div className="text-6xl mb-4">🔍</div>
        <h2 className="text-2xl font-bold text-white mb-2">القسم غير موجود</h2>
        <p>عذراً، لم يتم العثور على هذا القسم</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Category Header */}
      <div className="px-4 lg:px-8 py-4 bg-dark-900/50 border-b border-dark-700/50 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center text-primary-400">
            {iconMap[category.icon] || <Code size={28} />}
          </div>
          <div>
            <h1 className="text-xl lg:text-2xl font-bold text-white">{category.name}</h1>
            <p className="text-dark-400 text-sm">{category.desc}</p>
          </div>
        </div>

        {/* Mobile Tabs */}
        <div className="flex gap-2 mt-3 lg:hidden">
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'chat' ? 'bg-primary-600 text-white' : 'glass text-dark-400'
            }`}
          >
            💬 المحادثة
          </button>
          <button
            onClick={() => setActiveTab('announcements')}
            className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'announcements' ? 'bg-primary-600 text-white' : 'glass text-dark-400'
            }`}
          >
            📢 الإعلانات
          </button>
        </div>
      </div>

      {/* Content - Split View */}
      <div className="flex-1 flex min-h-0">
        {/* Chat Section */}
        <div className={`flex-1 border-l border-dark-700/50 flex flex-col min-h-0 ${
          activeTab !== 'chat' ? 'hidden lg:flex' : ''
        }`}>
          <ChatSection category={category.id} />
        </div>

        {/* Announcements Section */}
        <div className={`w-full lg:w-96 flex flex-col min-h-0 ${
          activeTab !== 'announcements' ? 'hidden lg:flex' : ''
        }`}>
          <AnnouncementSection category={category.id} />
        </div>
      </div>
    </div>
  );
}
