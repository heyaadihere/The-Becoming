import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronUp, LogOut, Users, MessageSquare, Eye, EyeOff } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'TheBecoming@2026';

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState('signups');
  const [signups, setSignups] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedRow, setExpandedRow] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const auth = sessionStorage.getItem('admin_auth');
    if (auth === 'true') setIsAuthenticated(true);
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin_auth', 'true');
      setLoginError('');
    } else {
      setLoginError('Invalid credentials. Please try again.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('admin_auth');
  };

  useEffect(() => {
    if (isAuthenticated) fetchData();
  }, [isAuthenticated]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [signupsRes, contactsRes] = await Promise.all([
        fetch(`${API}/admin/signups`),
        fetch(`${API}/admin/contacts`)
      ]);
      if (signupsRes.ok) setSignups(await signupsRes.json());
      if (contactsRes.ok) setContacts(await contactsRes.json());
    } catch (err) {
      console.error('Failed to fetch data', err);
    }
    setLoading(false);
  };

  const parseQuestionnaire = (data) => {
    try { return JSON.parse(data); } catch { return null; }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <img src="/images/logo-dark.png" alt="The Becoming" className="h-16 mx-auto mb-4 object-contain" />
            <h1 className="font-serif text-2xl text-deep-charcoal">Admin Dashboard</h1>
            <p className="font-sans text-charcoal/60 text-sm mt-1">Sign in to view submissions</p>
          </div>
          <form onSubmit={handleLogin} className="bg-white/60 border border-sand p-8 space-y-4" data-testid="admin-login-form">
            <div>
              <label className="font-sans text-sm text-charcoal/70 block mb-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => { setUsername(e.target.value); setLoginError(''); }}
                className="w-full bg-white/80 border border-sand px-4 py-3 text-deep-charcoal focus:border-accent-gold focus:outline-none font-sans"
                data-testid="admin-username"
                autoFocus
              />
            </div>
            <div>
              <label className="font-sans text-sm text-charcoal/70 block mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setLoginError(''); }}
                  className="w-full bg-white/80 border border-sand px-4 py-3 pr-12 text-deep-charcoal focus:border-accent-gold focus:outline-none font-sans"
                  data-testid="admin-password"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal/40 hover:text-charcoal">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            {loginError && <p className="text-red-500 font-sans text-sm" data-testid="login-error">{loginError}</p>}
            <button
              type="submit"
              className="w-full bg-accent-gold text-white font-sans py-3 tracking-wider uppercase text-sm hover:bg-accent-bronze transition-colors"
              data-testid="admin-login-btn"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <header className="bg-white/60 border-b border-sand py-4 px-6 flex items-center justify-between sticky top-0 z-20 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <img src="/images/logo-dark.png" alt="The Becoming" className="h-8 object-contain" />
          <h1 className="font-serif text-lg text-deep-charcoal hidden sm:block">Admin Dashboard</h1>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={fetchData} className="font-sans text-sm text-accent-gold hover:underline" data-testid="refresh-btn">
            Refresh
          </button>
          <button onClick={handleLogout} className="flex items-center gap-1 font-sans text-sm text-charcoal/60 hover:text-deep-charcoal" data-testid="logout-btn">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white/50 border border-sand p-5" data-testid="signup-count">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-accent-gold" />
              <span className="font-sans text-sm text-charcoal/60">Sign-up Submissions</span>
            </div>
            <p className="font-serif text-3xl text-deep-charcoal mt-2">{signups.length}</p>
          </div>
          <div className="bg-white/50 border border-sand p-5" data-testid="contact-count">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-5 h-5 text-accent-gold" />
              <span className="font-sans text-sm text-charcoal/60">Contact Messages</span>
            </div>
            <p className="font-serif text-3xl text-deep-charcoal mt-2">{contacts.length}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 border-b border-sand">
          <button
            onClick={() => setActiveTab('signups')}
            className={`px-6 py-3 font-sans text-sm transition-colors ${activeTab === 'signups' ? 'text-accent-gold border-b-2 border-accent-gold' : 'text-charcoal/60 hover:text-deep-charcoal'}`}
            data-testid="tab-signups"
          >
            Sign-ups ({signups.length})
          </button>
          <button
            onClick={() => setActiveTab('contacts')}
            className={`px-6 py-3 font-sans text-sm transition-colors ${activeTab === 'contacts' ? 'text-accent-gold border-b-2 border-accent-gold' : 'text-charcoal/60 hover:text-deep-charcoal'}`}
            data-testid="tab-contacts"
          >
            Contacts ({contacts.length})
          </button>
        </div>

        {loading && <p className="font-sans text-charcoal/50 text-center py-8">Loading...</p>}

        {/* Signups Table */}
        {!loading && activeTab === 'signups' && (
          <div className="space-y-2" data-testid="signups-table">
            {signups.length === 0 ? (
              <p className="text-center font-sans text-charcoal/50 py-12">No sign-up submissions yet.</p>
            ) : (
              signups.map((s, idx) => {
                const questionnaire = parseQuestionnaire(s.questionnaire_data);
                const isExpanded = expandedRow === `signup-${idx}`;
                return (
                  <div key={s.id || idx} className="bg-white/50 border border-sand" data-testid={`signup-row-${idx}`}>
                    <button
                      onClick={() => setExpandedRow(isExpanded ? null : `signup-${idx}`)}
                      className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-accent-gold/5 transition-colors"
                    >
                      <div className="flex items-center gap-4 flex-wrap">
                        <span className="font-serif text-deep-charcoal">{s.name || 'No name'}</span>
                        <span className="font-sans text-sm text-charcoal/60">{s.email}</span>
                        <span className="font-sans text-sm text-charcoal/40">{s.phone}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-sans text-xs text-charcoal/40">{s.submitted_at ? new Date(s.submitted_at).toLocaleDateString() : ''}</span>
                        {isExpanded ? <ChevronUp className="w-4 h-4 text-charcoal/40" /> : <ChevronDown className="w-4 h-4 text-charcoal/40" />}
                      </div>
                    </button>
                    {isExpanded && (
                      <div className="px-5 pb-5 border-t border-sand/50">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                          <div>
                            <p className="font-sans text-xs text-charcoal/40 uppercase tracking-wider mb-1">Alt Phone</p>
                            <p className="font-sans text-sm text-deep-charcoal">{s.alt_phone || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="font-sans text-xs text-charcoal/40 uppercase tracking-wider mb-1">Social Media</p>
                            <p className="font-sans text-sm text-deep-charcoal">{s.social_media || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="font-sans text-xs text-charcoal/40 uppercase tracking-wider mb-1">Status</p>
                            <p className="font-sans text-sm text-deep-charcoal">{s.status || 'pending'}</p>
                          </div>
                          <div>
                            <p className="font-sans text-xs text-charcoal/40 uppercase tracking-wider mb-1">Submitted</p>
                            <p className="font-sans text-sm text-deep-charcoal">{s.submitted_at ? new Date(s.submitted_at).toLocaleString() : 'N/A'}</p>
                          </div>
                        </div>
                        {questionnaire && (
                          <div className="mt-4 pt-4 border-t border-sand/50">
                            <p className="font-sans text-xs text-charcoal/40 uppercase tracking-wider mb-3">Questionnaire Responses</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {Object.entries(questionnaire).filter(([k]) => !['name','email','phone','altPhone','socialMedia','socialHandle'].includes(k)).map(([key, value]) => (
                                <div key={key} className="bg-soft-cream/50 p-3 border border-sand/30">
                                  <p className="font-sans text-xs text-accent-gold capitalize mb-1">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                                  <p className="font-sans text-sm text-deep-charcoal">{Array.isArray(value) ? value.join(', ') : value || 'N/A'}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Contacts Table */}
        {!loading && activeTab === 'contacts' && (
          <div className="space-y-2" data-testid="contacts-table">
            {contacts.length === 0 ? (
              <p className="text-center font-sans text-charcoal/50 py-12">No contact messages yet.</p>
            ) : (
              contacts.map((c, idx) => {
                const isExpanded = expandedRow === `contact-${idx}`;
                return (
                  <div key={c.id || idx} className="bg-white/50 border border-sand" data-testid={`contact-row-${idx}`}>
                    <button
                      onClick={() => setExpandedRow(isExpanded ? null : `contact-${idx}`)}
                      className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-accent-gold/5 transition-colors"
                    >
                      <div className="flex items-center gap-4 flex-wrap">
                        <span className="font-serif text-deep-charcoal">{c.name || 'Anonymous'}</span>
                        <span className="font-sans text-sm text-charcoal/60">{c.email}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-sans text-xs text-charcoal/40">{c.submitted_at ? new Date(c.submitted_at).toLocaleDateString() : ''}</span>
                        {isExpanded ? <ChevronUp className="w-4 h-4 text-charcoal/40" /> : <ChevronDown className="w-4 h-4 text-charcoal/40" />}
                      </div>
                    </button>
                    {isExpanded && (
                      <div className="px-5 pb-5 border-t border-sand/50 mt-0">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                          <div>
                            <p className="font-sans text-xs text-charcoal/40 uppercase tracking-wider mb-1">Phone</p>
                            <p className="font-sans text-sm text-deep-charcoal">{c.phone}</p>
                          </div>
                          <div>
                            <p className="font-sans text-xs text-charcoal/40 uppercase tracking-wider mb-1">Submitted</p>
                            <p className="font-sans text-sm text-deep-charcoal">{c.submitted_at ? new Date(c.submitted_at).toLocaleString() : 'N/A'}</p>
                          </div>
                        </div>
                        <div className="mt-4">
                          <p className="font-sans text-xs text-charcoal/40 uppercase tracking-wider mb-1">Message</p>
                          <p className="font-sans text-sm text-deep-charcoal bg-soft-cream/50 p-3 border border-sand/30">{c.message}</p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}
