import { Head } from '@inertiajs/react';
import { useRef, useState } from 'react';

/* ─── Types ─── */
interface Profile {
  name: string | null; headline: string | null; location: string | null;
  about: string | null; avatar_url: string | null; email: string | null;
  schedule_call_url: string | null; blog_url: string | null;
}
interface Skill { id: number; category: string; name: string }
interface Project { id: number; title: string; description: string | null; url: string | null; is_recent: boolean }
interface Experience { id: number; role: string; company: string; year_start: string | null; year_end: string | null; is_current: boolean }
interface Certification { id: number; name: string; issuer: string | null }
interface Recommendation { id: number; quote: string; author_name: string; author_role: string | null }
interface GalleryItem { id: number; image_url: string; caption: string | null }
interface Membership { id: number; name: string; url: string | null }
interface SocialLink { id: number; platform: string; url: string }

interface Props {
  profile: Profile | null;
  skills: Record<string, Skill[]>;
  recentProjects: Project[];
  experiences: Experience[];
  certifications: Certification[];
  recommendations: Recommendation[];
  gallery: GalleryItem[];
  memberships: Membership[];
  socialLinks: SocialLink[];
}

/* ─── Social Icons ─── */
function SocialIcon({ platform, size = 'sm' }: { platform: string; size?: 'sm' | 'md' }) {
  const cls = size === 'md' ? 'w-5 h-5' : 'w-4 h-4';
  const p = platform.toLowerCase();
  if (p === 'linkedin') return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={cls}>
      <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" /><circle cx="4" cy="4" r="2" />
    </svg>
  );
  if (p === 'github') return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={cls}>
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
  if (p === 'twitter' || p === 'x') return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={cls}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
  if (p === 'instagram') return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={cls}>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
  return <span className="text-xs font-bold">{platform[0].toUpperCase()}</span>;
}

/* ─── Recommendations Carousel ─── */
function RecommendationsCarousel({ items, dark }: { items: Recommendation[]; dark: boolean }) {
  const [idx, setIdx] = useState(0);
  if (!items.length) return null;
  const prev = () => setIdx(i => (i - 1 + items.length) % items.length);
  const next = () => setIdx(i => (i + 1) % items.length);
  const r = items[idx];
  return (
    <div className="mt-5">
      <div className={`relative rounded-xl p-6 min-h-[140px] border ${dark ? 'bg-gray-800 border-gray-700' : 'bg-slate-50 border-slate-100'}`}>
        <svg className={`absolute top-4 left-5 w-7 h-7 ${dark ? 'text-gray-600' : 'text-slate-200'}`} fill="currentColor" viewBox="0 0 24 24">
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
        </svg>
        <p className={`text-sm leading-relaxed pl-9 italic ${dark ? 'text-gray-300' : 'text-slate-600'}`}>"{r.quote}"</p>
        <div className={`mt-4 pl-9 flex items-center gap-2`}>
          <div className={`w-6 h-0.5 rounded-full ${dark ? 'bg-gray-600' : 'bg-slate-300'}`} />
          <div>
            <p className={`font-semibold text-sm ${dark ? 'text-gray-100' : 'text-slate-800'}`}>{r.author_name}</p>
            {r.author_role && <p className={`text-xs ${dark ? 'text-gray-500' : 'text-slate-400'}`}>{r.author_role}</p>}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between mt-4">
        <button onClick={prev} className={`p-2 rounded-lg border transition-all ${dark ? 'border-gray-700 hover:border-gray-500 hover:bg-gray-800' : 'border-slate-200 hover:border-slate-400 hover:bg-slate-50'}`}>
          <svg className={`w-3.5 h-3.5 ${dark ? 'text-gray-400' : 'text-slate-500'}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <div className="flex gap-1.5 items-center">
          {items.map((_, i) => (
            <button key={i} onClick={() => setIdx(i)}
              className={`rounded-full transition-all ${i === idx ? (dark ? 'w-4 h-1.5 bg-gray-300' : 'w-4 h-1.5 bg-slate-700') : (dark ? 'w-1.5 h-1.5 bg-gray-600 hover:bg-gray-400' : 'w-1.5 h-1.5 bg-slate-300 hover:bg-slate-400')}`} />
          ))}
        </div>
        <button onClick={next} className={`p-2 rounded-lg border transition-all ${dark ? 'border-gray-700 hover:border-gray-500 hover:bg-gray-800' : 'border-slate-200 hover:border-slate-400 hover:bg-slate-50'}`}>
          <svg className={`w-3.5 h-3.5 ${dark ? 'text-gray-400' : 'text-slate-500'}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>
    </div>
  );
}

/* ─── Gallery Strip ─── */
function GalleryStrip({ items }: { items: GalleryItem[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (dir: number) => ref.current?.scrollBy({ left: dir * 280, behavior: 'smooth' });
  if (!items.length) return null;
  return (
    <div className="relative group/gallery">
      <button onClick={() => scroll(-1)}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm border border-slate-200 rounded-full p-2 shadow-md hover:shadow-lg opacity-0 group-hover/gallery:opacity-100 transition-all -translate-x-3 group-hover/gallery:translate-x-0">
        <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
      </button>
      <div ref={ref} className="flex gap-3 overflow-x-auto scroll-smooth pb-2" style={{ scrollbarWidth: 'none' }}>
        {items.map(img => (
          <div key={img.id} className="flex-shrink-0 w-60 h-44 rounded-xl overflow-hidden bg-slate-100 ring-1 ring-slate-200">
            <img src={img.image_url} alt={img.caption ?? ''} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
          </div>
        ))}
      </div>
      <button onClick={() => scroll(1)}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm border border-slate-200 rounded-full p-2 shadow-md hover:shadow-lg opacity-0 group-hover/gallery:opacity-100 transition-all translate-x-3 group-hover/gallery:translate-x-0">
        <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
      </button>
    </div>
  );
}

/* ─── Section Wrapper ─── */
function Section({ title, children, dark }: { title: string; children: React.ReactNode; dark: boolean }) {
  return (
    <div className={`rounded-2xl border shadow-sm overflow-hidden ${dark ? 'bg-gray-900 border-gray-700' : 'bg-white border-slate-200'}`}>
      <div className={`px-7 pt-6 pb-1 border-b ${dark ? 'border-gray-700' : 'border-slate-100'}`}>
        <h2 className={`text-sm font-semibold uppercase tracking-widest ${dark ? 'text-gray-100' : 'text-slate-900'}`}>{title}</h2>
      </div>
      <div className="p-7">{children}</div>
    </div>
  );
}

/* ─── Dark Mode Toggle ─── */
function DarkToggle({ dark, onToggle }: { dark: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${dark ? 'bg-slate-600' : 'bg-slate-200'}`}
    >
      <span className={`inline-block h-4 w-4 transform rounded-full transition-transform ${dark ? 'translate-x-6 bg-white' : 'translate-x-1 bg-white'}`} />
      {/* Sun/Moon icons */}
      <span className={`absolute left-1 text-[10px] transition-opacity ${dark ? 'opacity-0' : 'opacity-100'}`}>☀️</span>
      <span className={`absolute right-1 text-[10px] transition-opacity ${dark ? 'opacity-100' : 'opacity-0'}`}>🌙</span>
    </button>
  );
}

/* ─── Main Portfolio Page ─── */
export default function Welcome({
  profile, skills, recentProjects, experiences,
  certifications, recommendations, gallery, memberships, socialLinks,
}: Props) {
  const skillCategories = Object.keys(skills);
  const [dark, setDark] = useState(false);

  // Use first certification as achievement badge (optional)
  const badge = certifications[0] ?? null;

  return (
    <>
      <Head title={profile?.name ?? 'Portfolio'} />
      <div className={`min-h-screen font-sans transition-colors duration-300 ${dark ? 'bg-gray-950 text-gray-100' : 'bg-[#f1f5f9] text-slate-900'}`}>



        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-6">

          {/* ── HERO CARD ── */}
          <div className={`rounded-2xl border shadow-sm p-6 sm:p-8 relative ${dark ? 'bg-gray-900 border-gray-700' : 'bg-white border-slate-200'}`}>
            {/* Dark mode toggle — top right of card */}
            <div className="absolute top-5 right-5">
              <DarkToggle dark={dark} onToggle={() => setDark(d => !d)} />
            </div>
            <div className="flex flex-col sm:flex-row items-start gap-6">

              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-slate-200 ring-4 ring-slate-100">
                  {profile?.avatar_url
                    ? <img src={`/storage/${profile.avatar_url}`} alt={profile.name ?? ''} className="w-full h-full object-cover" />
                    : <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300" />
                  }
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                {/* Name + verified badge */}
                <div className="flex items-center gap-2">
                  <h1 className={`text-2xl font-bold leading-tight ${dark ? 'text-gray-50' : 'text-slate-900'}`}>
                    {profile?.name ?? '—'}
                  </h1>
                  <div className="bg-blue-500 rounded-full p-0.5 flex-shrink-0">
                    <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>

                {/* Location */}
                {profile?.location && (
                  <p className={`text-xs mt-1.5 flex items-center gap-1 ${dark ? 'text-gray-400' : 'text-slate-400'}`}>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {profile.location}
                  </p>
                )}

                {/* Bold headline */}
                {profile?.headline && (
                  <p className={`text-base font-semibold mt-3 ${dark ? 'text-gray-200' : 'text-slate-700'}`}>
                    {profile.headline}
                  </p>
                )}

                {/* Achievement pill (first certification) */}
                {badge && (
                  <div className="mt-3">
                    <span className="inline-flex items-center gap-1.5 bg-blue-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">
                      🏆 {badge.name}
                    </span>
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex flex-wrap items-center gap-3 mt-5">
                  {profile?.schedule_call_url && (
                    <a href={profile.schedule_call_url} target="_blank" rel="noreferrer"
                      className="inline-flex items-center gap-2 text-xs font-semibold bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors shadow-sm">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Schedule a Call
                      <svg className="w-3 h-3 opacity-60" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                    </a>
                  )}
                  {profile?.email && (
                    <a href={`mailto:${profile.email}`}
                      className={`inline-flex items-center gap-2 text-xs font-medium transition-colors ${dark ? 'text-gray-300 hover:text-gray-100' : 'text-slate-600 hover:text-slate-900'}`}>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Send Email
                    </a>
                  )}
                  {profile?.blog_url && (
                    <a href={profile.blog_url} target="_blank" rel="noreferrer"
                      className={`inline-flex items-center gap-2 text-xs font-medium transition-colors ${dark ? 'text-gray-300 hover:text-gray-100' : 'text-slate-600 hover:text-slate-900'}`}>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      Read my blog
                      <svg className="w-3 h-3 opacity-50" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                    </a>
                  )}
                </div>
              </div>

              {/* Social icons - top right */}
              {socialLinks.length > 0 && (
                <div className="flex-shrink-0 flex flex-col gap-2 sm:items-end">
                  {socialLinks.map(s => (
                    <a key={s.id} href={s.url} target="_blank" rel="noreferrer" title={s.platform}
                      className={`transition-colors ${dark ? 'text-gray-500 hover:text-gray-200' : 'text-slate-400 hover:text-slate-700'}`}>
                      <SocialIcon platform={s.platform} size="md" />
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── TWO-COLUMN LAYOUT ── */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

            {/* LEFT COLUMN */}
            <div className="lg:col-span-3 space-y-6">

              {/* About */}
              {profile?.about && (
                <div id="about">
                  <Section title="About" dark={dark}>
                    <div className={`text-sm leading-relaxed space-y-3 ${dark ? 'text-gray-300' : 'text-slate-600'}`}>
                      {profile.about.split('\n').map((para, i) => para.trim() && <p key={i}>{para}</p>)}
                    </div>
                  </Section>
                </div>
              )}

              {/* Tech Stack */}
              {skillCategories.length > 0 && (
                <div id="skills">
                  <Section title="Tech Stack" dark={dark}>
                    <div className="space-y-5">
                      {skillCategories.map(cat => (
                        <div key={cat}>
                          <p className={`text-[11px] font-semibold uppercase tracking-widest mb-2.5 ${dark ? 'text-gray-500' : 'text-slate-400'}`}>{cat}</p>
                          <div className="flex flex-wrap gap-2">
                            {skills[cat].map(s => (
                              <span key={s.id}
                                className={`px-3 py-1 border text-xs rounded-md font-medium transition-colors ${dark ? 'bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-500' : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-400 hover:bg-slate-100'}`}>
                                {s.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </Section>
                </div>
              )}

              {/* Recent Projects */}
              {recentProjects.length > 0 && (
                <div id="projects">
                  <Section title="Recent Projects" dark={dark}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {recentProjects.map(p => (
                        <div key={p.id}
                          className={`group border rounded-xl p-4 transition-all ${dark ? 'border-gray-700 bg-gray-800 hover:border-gray-500' : 'border-slate-200 bg-white hover:border-slate-400 hover:shadow-sm'}`}>
                          <div className="flex items-start justify-between gap-2">
                            <p className={`font-semibold text-sm ${dark ? 'text-gray-100' : 'text-slate-900'}`}>{p.title}</p>
                            {p.url && (
                              <a href={p.url} target="_blank" rel="noreferrer"
                                className={`flex-shrink-0 transition-colors mt-0.5 ${dark ? 'text-gray-600 hover:text-gray-300' : 'text-slate-400 hover:text-slate-700'}`}>
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                              </a>
                            )}
                          </div>
                          {p.description && (
                            <p className={`text-xs mt-1.5 leading-relaxed ${dark ? 'text-gray-400' : 'text-slate-500'}`}>{p.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </Section>
                </div>
              )}

              {/* Certifications */}
              {certifications.length > 0 && (
                <Section title="Certifications" dark={dark}>
                  <div className="space-y-3">
                    {certifications.map((c, i) => (
                      <div key={c.id} className="flex items-start gap-3">
                        <div className={`flex-shrink-0 w-6 h-6 rounded-md border flex items-center justify-center text-xs font-semibold mt-0.5 ${dark ? 'bg-gray-800 border-gray-600 text-gray-400' : 'bg-slate-100 border-slate-200 text-slate-400'}`}>
                          {i + 1}
                        </div>
                        <div>
                          <p className={`font-semibold text-sm leading-snug ${dark ? 'text-gray-100' : 'text-slate-900'}`}>{c.name}</p>
                          {c.issuer && <p className={`text-xs mt-0.5 ${dark ? 'text-gray-500' : 'text-slate-400'}`}>{c.issuer}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </Section>
              )}

              {/* Recommendations */}
              {recommendations.length > 0 && (
                <Section title="Recommendations" dark={dark}>
                  <RecommendationsCarousel items={recommendations} dark={dark} />
                </Section>
              )}

              {/* Memberships + Social */}
              {(memberships.length > 0 || socialLinks.length > 0) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {memberships.length > 0 && (
                    <Section title="Memberships" dark={dark}>
                      <div className="space-y-2.5">
                        {memberships.map(m => (
                          <div key={m.id} className="flex items-center gap-2">
                            <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dark ? 'bg-gray-500' : 'bg-slate-400'}`} />
                            {m.url
                              ? <a href={m.url} target="_blank" rel="noreferrer" className={`text-sm hover:underline underline-offset-2 transition-colors ${dark ? 'text-gray-300 hover:text-gray-100' : 'text-slate-700 hover:text-slate-900'}`}>{m.name}</a>
                              : <p className={`text-sm ${dark ? 'text-gray-300' : 'text-slate-700'}`}>{m.name}</p>
                            }
                          </div>
                        ))}
                      </div>
                    </Section>
                  )}
                  {socialLinks.length > 0 && (
                    <Section title="Connect" dark={dark}>
                      <div className="space-y-3">
                        {socialLinks.map(s => (
                          <a key={s.id} href={s.url} target="_blank" rel="noreferrer"
                            className={`flex items-center gap-3 text-sm transition-colors group ${dark ? 'text-gray-400 hover:text-gray-100' : 'text-slate-600 hover:text-slate-900'}`}>
                            <span className={`w-7 h-7 rounded-md border flex items-center justify-center transition-colors ${dark ? 'bg-gray-800 border-gray-700 group-hover:border-gray-500' : 'bg-slate-100 border-slate-200 group-hover:border-slate-400'}`}>
                              <SocialIcon platform={s.platform} />
                            </span>
                            {s.platform}
                          </a>
                        ))}
                      </div>
                    </Section>
                  )}
                </div>
              )}
            </div>

            {/* RIGHT COLUMN */}
            <div id="experience" className="lg:col-span-2 space-y-6">

              {/* Experience */}
              {experiences.length > 0 && (
                <Section title="Experience" dark={dark}>
                  <div className="relative">
                    <div className={`absolute left-[7px] top-2 bottom-2 w-px ${dark ? 'bg-gray-700' : 'bg-slate-100'}`} />
                    <div className="space-y-5">
                      {experiences.map(exp => (
                        <div key={exp.id} className="flex items-start gap-4 relative">
                          <div className={`relative z-10 w-3.5 h-3.5 rounded-full mt-1 flex-shrink-0 border-2 ${exp.is_current ? (dark ? 'border-gray-200 bg-gray-200' : 'border-slate-900 bg-slate-900') : (dark ? 'border-gray-600 bg-gray-900' : 'border-slate-300 bg-white')}`} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <p className={`font-semibold text-sm leading-tight ${dark ? 'text-gray-100' : 'text-slate-900'}`}>{exp.role}</p>
                                <p className={`text-xs mt-0.5 ${dark ? 'text-gray-400' : 'text-slate-500'}`}>{exp.company}</p>
                              </div>
                              <span className={`text-[11px] whitespace-nowrap flex-shrink-0 mt-0.5 font-medium ${dark ? 'text-gray-500' : 'text-slate-400'}`}>
                                {exp.year_start}{exp.is_current ? ' – Present' : exp.year_end ? ` – ${exp.year_end}` : ''}
                              </span>
                            </div>
                            {exp.is_current && (
                              <span className={`mt-1.5 inline-block text-[10px] font-semibold px-2 py-0.5 rounded-md ${dark ? 'bg-gray-200 text-gray-900' : 'bg-slate-900 text-white'}`}>Current</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Section>
              )}

              {/* Contact */}
              {(profile?.email || profile?.blog_url || profile?.schedule_call_url) && (
                <Section title="Contact" dark={dark}>
                  <div className="space-y-4">
                    {profile?.email && (
                      <div>
                        <p className={`text-[11px] font-semibold uppercase tracking-widest mb-1 ${dark ? 'text-gray-500' : 'text-slate-400'}`}>Email</p>
                        <a href={`mailto:${profile.email}`} className={`text-sm transition-colors break-all ${dark ? 'text-gray-200 hover:text-blue-400' : 'text-slate-800 hover:text-blue-600'}`}>{profile.email}</a>
                      </div>
                    )}
                    {profile?.schedule_call_url && (
                      <div>
                        <p className={`text-[11px] font-semibold uppercase tracking-widest mb-1 ${dark ? 'text-gray-500' : 'text-slate-400'}`}>Let's Talk</p>
                        <a href={profile.schedule_call_url} target="_blank" rel="noreferrer"
                          className={`text-sm transition-colors flex items-center justify-between group ${dark ? 'text-gray-200 hover:text-blue-400' : 'text-slate-800 hover:text-blue-600'}`}>
                          Schedule a Call
                          <svg className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                        </a>
                      </div>
                    )}
                    {profile?.blog_url && (
                      <div>
                        <p className={`text-[11px] font-semibold uppercase tracking-widest mb-1 ${dark ? 'text-gray-500' : 'text-slate-400'}`}>Blog</p>
                        <a href={profile.blog_url} target="_blank" rel="noreferrer"
                          className={`text-sm transition-colors flex items-center justify-between group ${dark ? 'text-gray-200 hover:text-blue-400' : 'text-slate-800 hover:text-blue-600'}`}>
                          Read My Blog
                          <svg className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                        </a>
                      </div>
                    )}
                  </div>
                </Section>
              )}
            </div>
          </div>

          {/* ── GALLERY ── */}
          {gallery.length > 0 && (
            <Section title="Gallery" dark={dark}>
              <GalleryStrip items={gallery} />
            </Section>
          )}
        </div>

        {/* ── FOOTER ── */}
        <footer className="text-center py-10 mt-4">
          <p className={`text-xs font-medium tracking-widest uppercase ${dark ? 'text-gray-600' : 'text-slate-400'}`}>
            © {new Date().getFullYear()} {profile?.name ?? 'Portfolio'}
          </p>
          <p className={`text-[11px] mt-1 ${dark ? 'text-gray-700' : 'text-slate-300'}`}>All rights reserved</p>
        </footer>
      </div>
    </>
  );
}
