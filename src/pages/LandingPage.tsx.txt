import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  Mail, Lock, User, Eye, EyeOff, ArrowDown,
  Code, Users, Zap, Shield, Globe, Brain,
  ChevronLeft, Sparkles, Heart
} from 'lucide-react';

export default function LandingPage() {
  const { login, register } = useAuth();
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [_success] = useState('');

  // Login
  const [loginId, setLoginId] = useState('');
  const [loginPass, setLoginPass] = useState('');

  // Register
  const [regName, setRegName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPass, setRegPass] = useState('');
  const [regConfirm, setRegConfirm] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!loginId.trim() || !loginPass.trim()) {
      setError('يرجى ملء جميع الحقول');
      return;
    }
    const res = login(loginId.trim(), loginPass);
    if (!res.success) setError(res.error || 'حدث خطأ');
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!regName.trim() || !regUsername.trim() || !regEmail.trim() || !regPass) {
      setError('يرجى ملء جميع الحقول');
      return;
    }
    if (regPass !== regConfirm) {
      setError('كلمات المرور غير متطابقة');
      return;
    }
    if (regPass.length < 6) {
      setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      return;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(regUsername)) {
      setError('اسم المستخدم يجب أن يحتوي على أحرف إنجليزية وأرقام فقط');
      return;
    }
    const res = register(regUsername.trim(), regEmail.trim(), regPass, regName.trim());
    if (!res.success) setError(res.error || 'حدث خطأ');
  };

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const developers = [
    { name: 'أحمد محمد', role: 'المؤسس والمطور الرئيسي', emoji: '👨‍💻', color: 'from-blue-500 to-cyan-500' },
    { name: 'سارة أحمد', role: 'مصممة واجهات المستخدم', emoji: '🎨', color: 'from-purple-500 to-pink-500' },
    { name: 'محمد علي', role: 'مطور الواجهة الخلفية', emoji: '⚙️', color: 'from-green-500 to-emerald-500' },
    { name: 'نور الدين', role: 'مهندس قواعد البيانات', emoji: '🗄️', color: 'from-orange-500 to-amber-500' },
  ];

  const features = [
    { icon: <Users size={28} />, title: 'مجتمع نشط', desc: 'تواصل مع آلاف المطورين العرب وشارك خبراتك' },
    { icon: <Code size={28} />, title: 'مجالات متنوعة', desc: 'برمجة، ذكاء اصطناعي، أمن سيبراني والمزيد' },
    { icon: <Zap size={28} />, title: 'محتوى حصري', desc: 'أخبار تقنية حصرية ومحدثة على مدار الساعة' },
    { icon: <Shield size={28} />, title: 'بيئة آمنة', desc: 'مجتمع محمي ومُدار باحترافية عالية' },
    { icon: <Globe size={28} />, title: 'عربي بالكامل', desc: 'واجهة ومحتوى عربي كامل لتجربة مريحة' },
    { icon: <Brain size={28} />, title: 'تعلم مستمر', desc: 'شارك واستفد من خبرات المجتمع التقني' },
  ];

  return (
    <div className="min-h-screen bg-dark-950 text-white">
      {/* ==================== HERO ==================== */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Animated BG */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/40 via-dark-950 to-accent-600/20 animate-gradient" />
        <div className="absolute top-20 right-20 w-72 h-72 bg-primary-500/10 rounded-full blur-[120px] animate-float" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-accent-500/10 rounded-full blur-[120px] animate-float" style={{ animationDelay: '3s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-primary-500/5 rounded-full animate-spin-slow" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] border border-accent-500/5 rounded-full animate-spin-slow" style={{ animationDirection: 'reverse' }} />

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          {/* Logo */}
          <div className="mb-8 animate-fade-in-up">
            <div className="w-28 h-28 mx-auto rounded-3xl bg-gradient-to-br from-primary-500 via-accent-500 to-primary-600 flex items-center justify-center shadow-2xl shadow-primary-500/30 animate-pulse-glow">
              <span className="text-5xl font-black text-white tracking-tight">INS</span>
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-black mb-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <span className="gradient-text">مجتمع INS</span>
            <br />
            <span className="text-white">التقني العربي</span>
          </h1>

          <p className="text-xl md:text-2xl text-dark-300 mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            أكبر مجتمع عربي للمطورين والتقنيين. انضم إلينا وشارك في بناء مستقبل التقنية العربية
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            <button
              onClick={() => scrollToSection('auth-section')}
              className="px-8 py-3.5 bg-gradient-to-l from-primary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500 text-white rounded-xl font-bold text-lg transition-all shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 hover:scale-105"
            >
              انضم الآن مجاناً ✨
            </button>
            <button
              onClick={() => scrollToSection('about-section')}
              className="px-8 py-3.5 glass hover:bg-white/10 text-white rounded-xl font-bold text-lg transition-all"
            >
              اكتشف المزيد
            </button>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-md mx-auto animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
            {[
              { num: '+1000', label: 'عضو نشط' },
              { num: '10+', label: 'مجال تقني' },
              { num: '24/7', label: 'دعم متواصل' },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl md:text-3xl font-black gradient-text">{s.num}</div>
                <div className="text-xs text-dark-400 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <button
          onClick={() => scrollToSection('about-section')}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-dark-500 animate-bounce"
        >
          <ArrowDown size={28} />
        </button>
      </section>

      {/* ==================== ABOUT ==================== */}
      <section id="about-section" className="py-24 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-dark-950 via-primary-900/5 to-dark-950" />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold bg-primary-500/10 text-primary-400 border border-primary-500/20 mb-4">
              من نحن
            </span>
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              أكثر من مجرد <span className="gradient-text">منصة</span>
            </h2>
            <p className="text-dark-400 text-lg max-w-3xl mx-auto leading-relaxed">
              INS هو مجتمع تقني عربي متكامل يهدف إلى جمع المطورين والتقنيين العرب في مكان واحد
              لتبادل الخبرات والمعرفة. نؤمن بأن التقنية ليس لها حدود وأن المحتوى العربي يستحق أن يكون في المقدمة.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div
                key={i}
                className="glass rounded-2xl p-6 glass-hover transition-all duration-300 hover:translate-y-[-4px] group"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center text-primary-400 mb-4 group-hover:scale-110 transition-transform">
                  {f.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
                <p className="text-dark-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== DEVELOPERS ==================== */}
      <section className="py-24 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold bg-accent-500/10 text-accent-400 border border-accent-500/20 mb-4">
              <Heart size={12} className="inline ml-1" /> فريق التطوير
            </span>
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              الأشخاص خلف <span className="gradient-text">INS</span>
            </h2>
            <p className="text-dark-400 text-lg max-w-2xl mx-auto">
              فريق متحمس من المطورين العرب يعملون على بناء أفضل مجتمع تقني عربي
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {developers.map((dev, i) => (
              <div
                key={i}
                className="glass rounded-2xl p-6 text-center glass-hover transition-all duration-300 hover:translate-y-[-4px] group"
              >
                <div className={`w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br ${dev.color} flex items-center justify-center text-4xl mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                  {dev.emoji}
                </div>
                <h3 className="text-lg font-bold text-white mb-1">{dev.name}</h3>
                <p className="text-dark-400 text-sm">{dev.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== AUTH ==================== */}
      <section id="auth-section" className="py-24 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-primary-900/5 to-dark-950" />
        <div className="max-w-md mx-auto relative z-10">
          <div className="text-center mb-8">
            <Sparkles size={32} className="inline text-primary-400 mb-3" />
            <h2 className="text-3xl font-black mb-2">
              {authMode === 'login' ? 'مرحباً بعودتك' : 'انضم إلى INS'}
            </h2>
            <p className="text-dark-400">
              {authMode === 'login' ? 'سجل دخولك للمتابعة' : 'أنشئ حسابك وابدأ رحلتك'}
            </p>
          </div>

          {/* Auth Card */}
          <div className="glass rounded-2xl p-6 gradient-border">
            {/* Tabs */}
            <div className="flex mb-6 bg-dark-800/50 rounded-xl p-1">
              <button
                onClick={() => { setAuthMode('login'); setError(''); }}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  authMode === 'login'
                    ? 'bg-primary-600 text-white shadow-lg'
                    : 'text-dark-400 hover:text-white'
                }`}
              >
                تسجيل الدخول
              </button>
              <button
                onClick={() => { setAuthMode('register'); setError(''); }}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  authMode === 'register'
                    ? 'bg-primary-600 text-white shadow-lg'
                    : 'text-dark-400 hover:text-white'
                }`}
              >
                حساب جديد
              </button>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center animate-fade-in">
                {error}
              </div>
            )}

            {_success && (
              <div className="mb-4 p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm text-center animate-fade-in">
                {_success}
              </div>
            )}

            {/* Login Form */}
            {authMode === 'login' && (
              <form onSubmit={handleLogin} className="space-y-4 animate-fade-in">
                <div className="relative">
                  <Mail size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-500" />
                  <input
                    type="text"
                    value={loginId}
                    onChange={(e) => setLoginId(e.target.value)}
                    placeholder="البريد الإلكتروني أو اسم المستخدم"
                    className="w-full bg-dark-800/50 text-white placeholder-dark-500 pr-10 pl-4 py-3 rounded-xl border border-dark-600/50 focus:border-primary-500 focus:outline-none text-sm transition-colors"
                    required
                  />
                </div>
                <div className="relative">
                  <Lock size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={loginPass}
                    onChange={(e) => setLoginPass(e.target.value)}
                    placeholder="كلمة المرور"
                    className="w-full bg-dark-800/50 text-white placeholder-dark-500 pr-10 pl-10 py-3 rounded-xl border border-dark-600/50 focus:border-primary-500 focus:outline-none text-sm transition-colors"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500 hover:text-dark-300"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-l from-primary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-primary-500/20 hover:shadow-primary-500/30 flex items-center justify-center gap-2"
                >
                  <ChevronLeft size={18} />
                  تسجيل الدخول
                </button>
              </form>
            )}

            {/* Register Form */}
            {authMode === 'register' && (
              <form onSubmit={handleRegister} className="space-y-4 animate-fade-in">
                <div className="relative">
                  <User size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-500" />
                  <input
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="الاسم الكامل"
                    className="w-full bg-dark-800/50 text-white placeholder-dark-500 pr-10 pl-4 py-3 rounded-xl border border-dark-600/50 focus:border-primary-500 focus:outline-none text-sm transition-colors"
                    required
                  />
                </div>
                <div className="relative">
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-500 text-sm font-mono">@</span>
                  <input
                    type="text"
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g, ''))}
                    placeholder="اسم المستخدم (بالإنجليزية)"
                    className="w-full bg-dark-800/50 text-white placeholder-dark-500 pr-10 pl-4 py-3 rounded-xl border border-dark-600/50 focus:border-primary-500 focus:outline-none text-sm transition-colors"
                    dir="ltr"
                    required
                  />
                </div>
                <div className="relative">
                  <Mail size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-500" />
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="البريد الإلكتروني"
                    className="w-full bg-dark-800/50 text-white placeholder-dark-500 pr-10 pl-4 py-3 rounded-xl border border-dark-600/50 focus:border-primary-500 focus:outline-none text-sm transition-colors"
                    dir="ltr"
                    required
                  />
                </div>
                <div className="relative">
                  <Lock size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={regPass}
                    onChange={(e) => setRegPass(e.target.value)}
                    placeholder="كلمة المرور (6 أحرف على الأقل)"
                    className="w-full bg-dark-800/50 text-white placeholder-dark-500 pr-10 pl-10 py-3 rounded-xl border border-dark-600/50 focus:border-primary-500 focus:outline-none text-sm transition-colors"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500 hover:text-dark-300"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <div className="relative">
                  <Lock size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-500" />
                  <input
                    type="password"
                    value={regConfirm}
                    onChange={(e) => setRegConfirm(e.target.value)}
                    placeholder="تأكيد كلمة المرور"
                    className="w-full bg-dark-800/50 text-white placeholder-dark-500 pr-10 pl-4 py-3 rounded-xl border border-dark-600/50 focus:border-primary-500 focus:outline-none text-sm transition-colors"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-l from-primary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-primary-500/20 hover:shadow-primary-500/30 flex items-center justify-center gap-2"
                >
                  <Sparkles size={18} />
                  إنشاء الحساب
                </button>
              </form>
            )}

            {/* Divider */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-dark-700/50" />
              <span className="text-xs text-dark-500">أو سجل باستخدام</span>
              <div className="flex-1 h-px bg-dark-700/50" />
            </div>

            {/* Social Auth */}
            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center gap-2 py-2.5 glass rounded-xl text-sm text-dark-300 hover:text-white hover:bg-white/5 transition-all">
                <span className="text-red-400 text-lg">G</span>
                Google
              </button>
              <button className="flex items-center justify-center gap-2 py-2.5 glass rounded-xl text-sm text-dark-300 hover:text-white hover:bg-white/5 transition-all">
                <span className="text-lg">⚙️</span>
                GitHub
              </button>
              <button className="flex items-center justify-center gap-2 py-2.5 glass rounded-xl text-sm text-dark-300 hover:text-white hover:bg-white/5 transition-all">
                <span className="text-sky-400 text-lg">𝕏</span>
                Twitter / X
              </button>
              <button className="flex items-center justify-center gap-2 py-2.5 glass rounded-xl text-sm text-dark-300 hover:text-white hover:bg-white/5 transition-all">
                <span className="text-blue-400 text-lg">f</span>
                Facebook
              </button>
            </div>

            <p className="text-center text-xs text-dark-500 mt-4">
              بالتسجيل أنت توافق على شروط الاستخدام وسياسة الخصوصية
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-dark-800/50">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center font-bold text-white text-sm">
              IN
            </div>
            <span className="font-bold gradient-text">INS Community</span>
          </div>
          <p className="text-dark-500 text-sm">© 2026 INS Community. جميع الحقوق محفوظة</p>
        </div>
      </footer>
    </div>
  );
}
