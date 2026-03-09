import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronUp, LogOut, Users, MessageSquare, Eye, EyeOff, Download, Send } from 'lucide-react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

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
  const [partials, setPartials] = useState([]);
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
      const [signupsRes, contactsRes, partialsRes] = await Promise.all([
        fetch(`${API}/admin/signups`),
        fetch(`${API}/admin/contacts`),
        fetch(`${API}/admin/partial-signups`)
      ]);
      if (signupsRes.ok) setSignups(await signupsRes.json());
      if (contactsRes.ok) setContacts(await contactsRes.json());
      if (partialsRes.ok) setPartials(await partialsRes.json());
    } catch (err) {
      console.error('Failed to fetch data', err);
    }
    setLoading(false);
  };

  const WA_MESSAGE = "Hey. You didn't come this far to stop halfway.\nYour BECOMING journey is waiting.\nFinish your form.. let's move. \ud83d\udd25";
  
  const openWhatsApp = (phone) => {
    // Clean phone number - remove spaces, dashes, keep + prefix
    let cleaned = phone.replace(/[\s-()]/g, '');
    // Remove leading + for wa.me format
    if (cleaned.startsWith('+')) cleaned = cleaned.substring(1);
    // If no country code, assume India
    if (cleaned.length === 10) cleaned = '91' + cleaned;
    const url = `https://wa.me/${cleaned}?text=${encodeURIComponent(WA_MESSAGE)}`;
    window.open(url, '_blank');
  };

  const parseQuestionnaire = (data) => {
    try { return JSON.parse(data); } catch { return null; }
  };

  const flattenSignup = (s) => {
    const q = parseQuestionnaire(s.questionnaire_data) || {};
    return {
      Name: s.name || q.name || '',
      Email: s.email || '',
      Phone: s.phone || '',
      'Alt Phone': s.alt_phone || '',
      'Social Media': s.social_media || '',
      'What Brings You': q.whatBringsYou || '',
      'Current Phase': q.currentPhase || '',
      'Seeking Growth': Array.isArray(q.seekingGrowth) ? q.seekingGrowth.join(', ') : (q.seekingGrowth || ''),
      'Ready For': q.readyFor || '',
      'Show Up As': q.showUpAs || '',
      Timing: q.timing || '',
      Investment: q.investment || '',
      'Creative Interests': Array.isArray(q.creativeExpression) ? q.creativeExpression.join(', ') : (q.creativeExpression || ''),
      'Final Thought': q.finalThought || '',
      Status: s.status || '',
      'Submitted At': s.submitted_at ? new Date(s.submitted_at).toLocaleString() : ''
    };
  };

  const flattenContact = (c) => ({
    Name: c.name || '',
    Email: c.email || '',
    Phone: c.phone || '',
    Message: c.message || '',
    'Submitted At': c.submitted_at ? new Date(c.submitted_at).toLocaleString() : ''
  });

  const flattenPartial = (p) => {
    const q = parseQuestionnaire(p.answers) || {};
    return {
      Name: p.name || q.name || '',
      Phone: p.phone || '',
      'Last Step': p.last_step || '',
      'Updated At': p.updated_at ? new Date(p.updated_at).toLocaleString() : '',
      ...Object.fromEntries(Object.entries(q).filter(([k]) => !['name','phone','altPhone','socialMedia','socialHandle','email'].includes(k)).map(([k, v]) => [k, Array.isArray(v) ? v.join(', ') : v || '']))
    };
  };

  const downloadXLS = () => {
    const wb = XLSX.utils.book_new();
    if (signups.length) XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(signups.map(flattenSignup)), 'Sign-ups');
    if (partials.length) XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(partials.map(flattenPartial)), 'Incomplete');
    if (contacts.length) XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(contacts.map(flattenContact)), 'Contacts');
    XLSX.writeFile(wb, `TheBecoming_Leads_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const downloadPDF = () => {
    const doc = new jsPDF({ orientation: 'landscape' });
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text('The Becoming - Leads Report', 14, 20);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 28);

    if (signups.length) {
      doc.setFontSize(13);
      doc.setFont('helvetica', 'bold');
      doc.text(`Sign-ups (${signups.length})`, 14, 38);
      const rows = signups.map(flattenSignup);
      const cols = ['Name', 'Email', 'Phone', 'Timing', 'Investment', 'Status', 'Submitted At'];
      doc.autoTable({ head: [cols], body: rows.map(r => cols.map(c => r[c])), startY: 42, styles: { fontSize: 8 }, headStyles: { fillColor: [201, 169, 98] } });
    }

    if (partials.length) {
      const y = (doc.lastAutoTable?.finalY || 42) + 12;
      doc.setFontSize(13);
      doc.setFont('helvetica', 'bold');
      doc.text(`Incomplete Forms (${partials.length})`, 14, y);
      const rows = partials.map(flattenPartial);
      const cols = ['Name', 'Phone', 'Last Step', 'Updated At'];
      doc.autoTable({ head: [cols], body: rows.map(r => cols.map(c => r[c] || '')), startY: y + 4, styles: { fontSize: 8 }, headStyles: { fillColor: [251, 146, 60] } });
    }

    if (contacts.length) {
      doc.addPage();
      doc.setFontSize(13);
      doc.setFont('helvetica', 'bold');
      doc.text(`Contact Messages (${contacts.length})`, 14, 20);
      const rows = contacts.map(flattenContact);
      const cols = ['Name', 'Email', 'Phone', 'Message', 'Submitted At'];
      doc.autoTable({ head: [cols], body: rows.map(r => cols.map(c => r[c])), startY: 24, styles: { fontSize: 8 }, headStyles: { fillColor: [201, 169, 98] } });
    }

    doc.save(`TheBecoming_Leads_${new Date().toISOString().split('T')[0]}.pdf`);
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
          <button onClick={downloadXLS} className="flex items-center gap-1 font-sans text-sm text-green-600 hover:text-green-800 bg-green-50 px-3 py-1.5 border border-green-200" data-testid="download-xls">
            <Download className="w-4 h-4" /> XLS
          </button>
          <button onClick={downloadPDF} className="flex items-center gap-1 font-sans text-sm text-red-600 hover:text-red-800 bg-red-50 px-3 py-1.5 border border-red-200" data-testid="download-pdf">
            <Download className="w-4 h-4" /> PDF
          </button>
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
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white/50 border border-sand p-5" data-testid="signup-count">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-accent-gold" />
              <span className="font-sans text-sm text-charcoal/60">Completed Sign-ups</span>
            </div>
            <p className="font-serif text-3xl text-deep-charcoal mt-2">{signups.length}</p>
          </div>
          <div className="bg-white/50 border border-sand p-5" data-testid="partial-count">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-orange-400" />
              <span className="font-sans text-sm text-charcoal/60">Incomplete Forms</span>
            </div>
            <p className="font-serif text-3xl text-deep-charcoal mt-2">{partials.length}</p>
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
            onClick={() => setActiveTab('partials')}
            className={`px-6 py-3 font-sans text-sm transition-colors ${activeTab === 'partials' ? 'text-orange-500 border-b-2 border-orange-400' : 'text-charcoal/60 hover:text-deep-charcoal'}`}
            data-testid="tab-partials"
          >
            Incomplete ({partials.length})
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

        {/* Partials Table */}
        {!loading && activeTab === 'partials' && (
          <div className="space-y-2" data-testid="partials-table">
            <div className="bg-orange-50/50 border border-orange-200/50 p-4 mb-4 flex items-center justify-between">
              <p className="font-sans text-sm text-orange-700">
                <strong>Incomplete forms:</strong> Send a WhatsApp nudge to bring them back.
              </p>
              {partials.length > 0 && (
                <button
                  onClick={() => partials.forEach(p => openWhatsApp(p.phone))}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white font-sans text-sm rounded hover:bg-green-600 transition-colors shrink-0"
                  data-testid="send-all-wa"
                >
                  <Send className="w-4 h-4" /> Send All ({partials.length})
                </button>
              )}
            </div>
            {partials.length === 0 ? (
              <p className="text-center font-sans text-charcoal/50 py-12">No incomplete forms yet.</p>
            ) : (
              partials.map((p, idx) => {
                const parsedAnswers = parseQuestionnaire(p.answers);
                const isExpanded = expandedRow === `partial-${idx}`;
                return (
                  <div key={idx} className="bg-white/50 border border-orange-200/40" data-testid={`partial-row-${idx}`}>
                    <button
                      onClick={() => setExpandedRow(isExpanded ? null : `partial-${idx}`)}
                      className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-orange-50/30 transition-colors"
                    >
                      <div className="flex items-center gap-4 flex-wrap">
                        <span className="font-serif text-deep-charcoal">{p.name || 'Unknown'}</span>
                        <span className="font-sans text-sm text-accent-gold">{p.phone}</span>
                        <span className="font-sans text-xs px-2 py-0.5 bg-orange-100 text-orange-600 rounded">Stopped at: {p.last_step}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={(e) => { e.stopPropagation(); openWhatsApp(p.phone); }}
                          className="flex items-center gap-1 px-3 py-1 bg-green-500 text-white text-xs font-sans rounded hover:bg-green-600 transition-colors"
                          data-testid={`wa-btn-${idx}`}
                        >
                          <Send className="w-3 h-3" /> WhatsApp
                        </button>
                        <span className="font-sans text-xs text-charcoal/40">{p.updated_at ? new Date(p.updated_at).toLocaleDateString() : ''}</span>
                        {isExpanded ? <ChevronUp className="w-4 h-4 text-charcoal/40" /> : <ChevronDown className="w-4 h-4 text-charcoal/40" />}
                      </div>
                    </button>
                    {isExpanded && parsedAnswers && (
                      <div className="px-5 pb-5 border-t border-sand/50">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                          {Object.entries(parsedAnswers).filter(([k]) => !['socialMedia','socialHandle','altPhone'].includes(k)).map(([key, value]) => (
                            <div key={key} className="bg-soft-cream/50 p-3 border border-sand/30">
                              <p className="font-sans text-xs text-accent-gold capitalize mb-1">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                              <p className="font-sans text-sm text-deep-charcoal">{Array.isArray(value) ? value.join(', ') : value || 'N/A'}</p>
                            </div>
                          ))}
                        </div>
                        <div className="mt-4 p-4 bg-green-50/50 border border-green-200/50 flex items-center justify-between">
                          <div>
                            <p className="font-sans text-xs text-green-700 mb-1">WhatsApp message preview:</p>
                            <p className="font-sans text-sm text-green-800 italic">{WA_MESSAGE}</p>
                          </div>
                          <button
                            onClick={() => openWhatsApp(p.phone)}
                            className="flex items-center gap-2 px-5 py-2.5 bg-green-500 text-white font-sans text-sm rounded hover:bg-green-600 transition-colors shrink-0 ml-4"
                          >
                            <Send className="w-4 h-4" /> Send on WhatsApp
                          </button>
                        </div>
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
