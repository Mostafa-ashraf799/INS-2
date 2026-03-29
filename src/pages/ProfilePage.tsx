import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  User, Mail, FileText, Link2, Save, Check,
  Globe, ExternalLink, Calendar, Edit3
} from 'lucide-react';

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);

  const [fullName, setFullName] = useState(user?.fullName || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [twitter, setTwitter] = useState(user?.socialLinks.twitter || '');
  const [facebook, setFacebook] = useState(user?.socialLinks.facebook || '');
  const [instagram, setInstagram] = useState(user?.socialLinks.instagram || '');
  const [linkedin, setLinkedin] = useState(user?.socialLinks.linkedin || '');
  const [github, setGithub] = useState(user?.socialLinks.github || '');
  const [youtube, setYoutube] = useState(user?.socialLinks.youtube || '');
  const [website, setWebsite] = useState(user?.socialLinks.website || '');

  const handleSave = () => {
    updateProfile({
      fullName,
      bio,
      socialLinks: { twitter, facebook, instagram, linkedin, github, youtube, website },
    });
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const initials = user?.fullName
    ? user.fullName.split(' ').map(n => n[0]).join('').substring(0, 2)
    : user?.username?.substring(0, 2) || '??';

  const socialLinks = [
    { label: 'Twitter / X', value: twitter, setter: setTwitter, icon: '𝕏', color: 'text-sky-400' },
    { label: 'Facebook', value: facebook, setter: setFacebook, icon: 'f', color: 'text-blue-500' },
    { label: 'Instagram', value: instagram, setter: setInstagram, icon: '📷', color: 'text-pink-500' },
    { label: 'LinkedIn', value: linkedin, setter: setLinkedin, icon: 'in', color: 'text-blue-400' },
    { label: 'GitHub', value: github, setter: setGithub, icon: '⚙️', color: 'text-gray-300' },
    { label: 'YouTube', value: youtube, setter: setYoutube, icon: '▶', color: 'text-red-500' },
    { label: 'الموقع الشخصي', value: website, setter: setWebsite, icon: '🌐', color: 'text-green-400' },
  ];

  if (!user) return null;

  return (
    <div className="p-4 lg:p-8 max-w-4xl mx-auto">
      {/* Success message */}
      {saved && (
        <div className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm flex items-center gap-2 animate-fade-in">
          <Check size={18} />
          تم حفظ التغييرات بنجاح!
        </div>
      )}

      {/* Profile Header Card */}
      <div className="glass rounded-2xl p-6 lg:p-8 mb-6 gradient-border">
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Avatar */}
          <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-primary-500 to-accent-600 flex items-center justify-center text-white text-4xl font-black shadow-2xl shadow-primary-500/30">
            {initials}
          </div>

          <div className="flex-1 text-center md:text-right">
            <h1 className="text-2xl lg:text-3xl font-black text-white mb-1">{user.fullName || user.username}</h1>
            <p className="text-primary-400 font-semibold mb-2">@{user.username}</p>
            <p className="text-dark-400 text-sm max-w-lg">{user.bio || 'لم تتم إضافة نبذة شخصية بعد'}</p>
            <div className="flex items-center gap-4 mt-3 justify-center md:justify-start text-xs text-dark-500">
              <span className="flex items-center gap-1">
                <Mail size={12} />
                {user.email}
              </span>
              <span className="flex items-center gap-1">
                <Calendar size={12} />
                انضم {new Date(user.createdAt).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long' })}
              </span>
            </div>
          </div>

          <button
            onClick={() => setEditing(!editing)}
            className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 ${
              editing
                ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                : 'bg-primary-600 text-white hover:bg-primary-500'
            }`}
          >
            <Edit3 size={16} />
            {editing ? 'إلغاء' : 'تعديل'}
          </button>
        </div>
      </div>

      {/* Edit Form */}
      {editing && (
        <div className="space-y-6 animate-fade-in-up">
          {/* Personal Info */}
          <div className="glass rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <User size={20} className="text-primary-400" />
              المعلومات الشخصية
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-dark-400 mb-1.5">الاسم الكامل</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-dark-800/50 text-white px-4 py-3 rounded-xl border border-dark-600/50 focus:border-primary-500 focus:outline-none text-sm"
                  placeholder="اكتب اسمك الكامل"
                />
              </div>
              <div>
                <label className="block text-sm text-dark-400 mb-1.5">النبذة الشخصية</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={4}
                  className="w-full bg-dark-800/50 text-white px-4 py-3 rounded-xl border border-dark-600/50 focus:border-primary-500 focus:outline-none text-sm resize-none"
                  placeholder="اكتب نبذة عنك..."
                />
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="glass rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Link2 size={20} className="text-primary-400" />
              روابط التواصل الاجتماعي
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {socialLinks.map((link) => (
                <div key={link.label}>
                  <label className="block text-sm text-dark-400 mb-1.5 flex items-center gap-1.5">
                    <span className={link.color}>{link.icon}</span>
                    {link.label}
                  </label>
                  <input
                    type="url"
                    value={link.value}
                    onChange={(e) => link.setter(e.target.value)}
                    className="w-full bg-dark-800/50 text-white px-4 py-2.5 rounded-xl border border-dark-600/50 focus:border-primary-500 focus:outline-none text-sm"
                    placeholder={`رابط ${link.label}`}
                    dir="ltr"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            className="w-full py-3.5 bg-gradient-to-l from-primary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-primary-500/20 flex items-center justify-center gap-2"
          >
            <Save size={18} />
            حفظ التغييرات
          </button>
        </div>
      )}

      {/* Display Social Links (when not editing) */}
      {!editing && (
        <div className="glass rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Globe size={20} className="text-primary-400" />
            روابط التواصل
          </h2>
          <div className="grid md:grid-cols-2 gap-3">
            {socialLinks.filter(l => l.value).map((link) => (
              <a
                key={link.label}
                href={link.value}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-xl glass glass-hover transition-all group"
              >
                <span className={`text-xl ${link.color}`}>{link.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white">{link.label}</p>
                  <p className="text-xs text-dark-400 truncate" dir="ltr">{link.value}</p>
                </div>
                <ExternalLink size={14} className="text-dark-500 group-hover:text-primary-400 transition-colors" />
              </a>
            ))}
            {socialLinks.every(l => !l.value) && (
              <div className="col-span-2 text-center py-8 text-dark-500">
                <FileText size={32} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">لم تتم إضافة أي روابط بعد</p>
                <button
                  onClick={() => setEditing(true)}
                  className="text-primary-400 text-sm mt-1 hover:underline"
                >
                  أضف روابطك الآن
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
