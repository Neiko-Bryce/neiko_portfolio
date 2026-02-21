import { useState, useEffect, useRef } from "react";

/* ─── STYLES ─── */
const FONT_URL =
  "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300&family=DM+Mono:wght@400;500&display=swap";

const styles = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .nl-root {
    --bg:     #090909;
    --bg2:    #101010;
    --bg3:    #151515;
    --border: #202020;
    --muted:  #333;
    --dim:    #555;
    --mid:    #888;
    --light:  #bbb;
    --white:  #ededed;
    background: var(--bg);
    color: var(--white);
    font-family: 'DM Sans', sans-serif;
    font-weight: 300;
    -webkit-font-smoothing: antialiased;
    overflow-x: hidden;
    min-height: 100vh;
  }

  /* ── NAV ── */
  .nl-nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 200;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 4rem; height: 60px;
    background: rgba(9,9,9,0.92);
    backdrop-filter: blur(18px);
    border-bottom: 1px solid var(--border);
  }
  .nl-logo {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.5rem; letter-spacing: .12em;
    color: var(--white); text-decoration: none;
    cursor: pointer;
  }
  .nl-logo span { color: var(--dim); }
  .nl-nav-links { display: flex; align-items: center; gap: 2.25rem; }
  .nl-nav-a {
    font-size: .74rem; font-weight: 400; color: var(--dim);
    background: none; border: none; cursor: pointer;
    letter-spacing: .08em; text-transform: uppercase;
    transition: color .2s; font-family: 'DM Sans', sans-serif;
    padding: 0;
  }
  .nl-nav-a:hover { color: var(--white); }
  .nl-nav-cta {
    font-size: .74rem; font-weight: 500; letter-spacing: .06em;
    color: var(--bg); background: var(--white);
    padding: .5rem 1.3rem; border-radius: 3px; border: none;
    cursor: pointer; transition: opacity .2s;
    font-family: 'DM Sans', sans-serif;
  }
  .nl-nav-cta:hover { opacity: .78; }

  /* ── HERO ── */
  .nl-hero {
    min-height: 100vh;
    display: grid; grid-template-columns: 1fr 1fr;
    align-items: center; gap: 4rem;
    padding: 60px 4rem 0;
    border-bottom: 1px solid var(--border);
  }
  .nl-hero-left { display: flex; flex-direction: column; gap: 1.6rem; }
  .nl-badge {
    display: inline-flex; align-items: center; gap: .6rem;
    font-family: 'DM Mono', monospace; font-size: .68rem; color: var(--mid);
    border: 1px solid var(--border); background: var(--bg2);
    padding: .38rem 1rem; border-radius: 999px; width: fit-content;
  }
  .nl-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: #4ade80; box-shadow: 0 0 6px #4ade80;
    flex-shrink: 0;
    animation: nlBlink 2.5s ease infinite;
  }
  @keyframes nlBlink { 0%,100%{opacity:1} 50%{opacity:.3} }

  .nl-h1 {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(4rem, 7.5vw, 8rem);
    line-height: .91; letter-spacing: .03em; color: var(--white);
  }
  .nl-h1 em { color: var(--dim); font-style: normal; }
  .nl-hero-sub {
    font-size: .96rem; color: var(--mid);
    line-height: 1.78; max-width: 400px;
  }
  .nl-hero-btns { display: flex; gap: .75rem; flex-wrap: wrap; margin-top: .4rem; }

  .nl-btn-w {
    font-size: .83rem; font-weight: 500; letter-spacing: .03em;
    color: var(--bg); background: var(--white);
    padding: .88rem 2.1rem; border-radius: 4px; border: none;
    cursor: pointer; transition: opacity .2s;
    font-family: 'DM Sans', sans-serif;
  }
  .nl-btn-w:hover { opacity: .78; }
  .nl-btn-o {
    font-size: .83rem; font-weight: 400; letter-spacing: .03em;
    color: var(--light); background: transparent;
    border: 1px solid var(--border);
    padding: .88rem 2.1rem; border-radius: 4px;
    cursor: pointer; transition: border-color .2s, color .2s;
    font-family: 'DM Sans', sans-serif;
  }
  .nl-btn-o:hover { border-color: var(--mid); color: var(--white); }

  /* Hero visual */
  .nl-hero-right { display: flex; align-items: center; justify-content: center; }
  .nl-hero-card {
    width: 100%; max-width: 400px; aspect-ratio: 3/4;
    background: var(--bg2); border: 1px solid var(--border);
    border-radius: 16px; display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    position: relative; overflow: hidden;
    gap: 1rem;
  }
  .nl-hero-card::before {
    content: '';
    position: absolute; inset: 0;
    background: radial-gradient(ellipse at 50% 10%, rgba(255,255,255,.045) 0%, transparent 65%);
  }
  .nl-hero-card::after {
    content: '';
    position: absolute; top: 0; left: 50%; transform: translateX(-50%);
    width: 50%; height: 1px;
    background: linear-gradient(90deg, transparent, var(--muted), transparent);
  }
  .nl-hero-chip {
    position: absolute; top: 1.1rem; right: 1.1rem;
    font-family: 'DM Mono', monospace; font-size: .58rem; color: var(--dim);
    border: 1px solid var(--border); background: var(--bg);
    padding: .26rem .6rem; border-radius: 3px; letter-spacing: .08em;
  }
  .nl-hero-glyph {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 9rem; color: var(--muted); letter-spacing: .06em;
    line-height: 1; position: relative; z-index: 1;
  }
  .nl-hero-device-label {
    font-family: 'DM Mono', monospace; font-size: .6rem;
    color: var(--dim); letter-spacing: .16em; text-transform: uppercase;
    position: relative; z-index: 1;
  }
  .nl-hero-bar {
    position: absolute; bottom: 1.5rem; left: 1.5rem; right: 1.5rem;
    display: flex; justify-content: space-between; align-items: center;
  }
  .nl-hero-bar-tag {
    font-family: 'DM Mono', monospace; font-size: .58rem; color: var(--muted);
    letter-spacing: .08em;
  }

  /* ── TRUST MARQUEE ── */
  .nl-trust {
    display: flex; align-items: center; gap: 2rem;
    padding: 2rem 4rem; border-bottom: 1px solid var(--border);
    overflow: hidden;
  }
  .nl-trust-label {
    font-family: 'DM Mono', monospace; font-size: .63rem;
    color: var(--dim); letter-spacing: .1em; text-transform: uppercase;
    white-space: nowrap; flex-shrink: 0;
  }
  .nl-trust-rule { width: 1px; height: 20px; background: var(--border); flex-shrink: 0; }
  .nl-marquee-clip { overflow: hidden; flex: 1; }
  .nl-marquee {
    display: flex; gap: 3rem; width: max-content;
    animation: nlMarquee 28s linear infinite;
  }
  @keyframes nlMarquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }
  .nl-brand {
    font-family: 'Bebas Neue', sans-serif; font-size: 1rem;
    color: var(--muted); letter-spacing: .12em; flex-shrink: 0;
  }

  /* ── SECTION ── */
  .nl-section { padding: 6rem 4rem; border-bottom: 1px solid var(--border); }
  .nl-eyebrow {
    font-family: 'DM Mono', monospace; font-size: .63rem;
    color: var(--dim); letter-spacing: .15em; text-transform: uppercase;
    margin-bottom: .65rem;
  }
  .nl-sh {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(2.4rem, 5vw, 4.5rem);
    line-height: .93; letter-spacing: .02em;
    color: var(--white); margin-bottom: 1.1rem;
  }
  .nl-sp {
    font-size: .93rem; color: var(--mid);
    line-height: 1.78; max-width: 500px;
  }
  .nl-shead { margin-bottom: 3.5rem; }

  /* ── BENTO ── */
  .nl-bento {
    display: grid; grid-template-columns: repeat(3,1fr);
    gap: 1px; background: var(--border);
    border: 1px solid var(--border); border-radius: 14px; overflow: hidden;
  }
  .nl-bc {
    background: var(--bg2); padding: 2.25rem 2rem;
    display: flex; flex-direction: column; gap: .7rem;
    transition: background .25s;
  }
  .nl-bc:hover { background: var(--bg3); }
  .nl-bc.w2 { grid-column: span 2; }
  .nl-bc-icon {
    width: 42px; height: 42px; border: 1px solid var(--border);
    border-radius: 8px; background: var(--bg);
    display: flex; align-items: center; justify-content: center;
    font-size: 1.3rem; margin-bottom: .2rem;
  }
  .nl-bc-title { font-size: .97rem; font-weight: 500; color: var(--white); }
  .nl-bc-text { font-size: .81rem; color: var(--dim); line-height: 1.72; }
  .nl-bc-stat {
    font-family: 'Bebas Neue', sans-serif; font-size: 2.8rem;
    color: var(--white); letter-spacing: .02em; margin-top: auto; padding-top: 1rem;
  }
  .nl-bc-stat small {
    font-family: 'DM Mono', monospace; font-size: .78rem; color: var(--dim);
  }

  /* ── HOW ── */
  .nl-how {
    display: grid; grid-template-columns: repeat(3,1fr);
    gap: 1px; background: var(--border);
    border: 1px solid var(--border); border-radius: 14px; overflow: hidden;
  }
  .nl-step {
    background: var(--bg2); padding: 2.25rem 2rem;
    display: flex; flex-direction: column; gap: .9rem;
    transition: background .25s;
  }
  .nl-step:hover { background: var(--bg3); }
  .nl-step-num {
    width: 28px; height: 28px; border-radius: 50%;
    border: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    font-family: 'DM Mono', monospace; font-size: .62rem; color: var(--dim);
  }
  .nl-step-title { font-size: 1rem; font-weight: 500; color: var(--white); }
  .nl-step-text { font-size: .81rem; color: var(--dim); line-height: 1.72; }

  /* ── PRICING ── */
  .nl-plans { display: grid; grid-template-columns: repeat(3,1fr); gap: 1rem; }
  .nl-plan {
    background: var(--bg2); border: 1px solid var(--border);
    border-radius: 12px; padding: 2rem 1.75rem;
    display: flex; flex-direction: column; gap: 1rem;
    position: relative; transition: border-color .25s;
  }
  .nl-plan:hover { border-color: var(--muted); }
  .nl-plan.hot { border-color: #444; background: var(--bg3); }
  .nl-hot-pill {
    position: absolute; top: -11px; left: 50%; transform: translateX(-50%);
    background: var(--white); color: var(--bg);
    font-family: 'DM Mono', monospace; font-size: .59rem; font-weight: 500;
    padding: .22rem .8rem; border-radius: 99px;
    letter-spacing: .07em; text-transform: uppercase; white-space: nowrap;
  }
  .nl-tier {
    font-family: 'DM Mono', monospace; font-size: .63rem;
    color: var(--dim); letter-spacing: .1em; text-transform: uppercase;
  }
  .nl-price {
    font-family: 'Bebas Neue', sans-serif; font-size: 2.9rem;
    color: var(--white); letter-spacing: .02em; line-height: 1;
  }
  .nl-price sub {
    font-family: 'DM Sans', sans-serif; font-size: .8rem;
    color: var(--dim); font-weight: 300;
  }
  .nl-plan-desc { font-size: .8rem; color: var(--dim); line-height: 1.62; }
  .nl-plan-hr { border: none; border-top: 1px solid var(--border); }
  .nl-plan-btn-w {
    display: block; text-align: center; padding: .72rem;
    border-radius: 4px; border: none; cursor: pointer;
    font-size: .8rem; font-weight: 500; letter-spacing: .04em;
    color: var(--bg); background: var(--white);
    font-family: 'DM Sans', sans-serif; transition: opacity .2s;
  }
  .nl-plan-btn-w:hover { opacity: .8; }
  .nl-plan-btn-o {
    display: block; text-align: center; padding: .72rem;
    border-radius: 4px; border: 1px solid var(--border); cursor: pointer;
    font-size: .8rem; font-weight: 400;
    color: var(--light); background: transparent;
    font-family: 'DM Sans', sans-serif; transition: border-color .2s, color .2s;
  }
  .nl-plan-btn-o:hover { border-color: var(--mid); color: var(--white); }
  .nl-feats { display: flex; flex-direction: column; gap: .5rem; margin-top: .4rem; }
  .nl-feat {
    display: flex; align-items: flex-start; gap: .55rem;
    font-size: .78rem; color: var(--mid); line-height: 1.45;
  }
  .nl-feat::before { content: '—'; color: var(--muted); flex-shrink: 0; }

  /* ── TESTIMONIALS ── */
  .nl-testis { display: grid; grid-template-columns: repeat(3,1fr); gap: 1rem; }
  .nl-testi {
    background: var(--bg2); border: 1px solid var(--border);
    border-radius: 12px; padding: 1.75rem;
    display: flex; flex-direction: column; gap: 1rem;
    transition: border-color .25s;
  }
  .nl-testi:hover { border-color: var(--muted); }
  .nl-stars { font-size: .7rem; letter-spacing: .08em; }
  .nl-testi-q { font-size: .86rem; color: var(--mid); line-height: 1.74; flex: 1; }
  .nl-author { display: flex; align-items: center; gap: .8rem; margin-top: auto; }
  .nl-ava {
    width: 34px; height: 34px; border-radius: 50%;
    background: var(--muted); border: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    font-family: 'DM Mono', monospace; font-size: .64rem; color: var(--dim);
    flex-shrink: 0;
  }
  .nl-aname { font-size: .8rem; font-weight: 500; color: var(--white); }
  .nl-arole { font-size: .7rem; color: var(--dim); margin-top: .07rem; }

  /* ── FAQ ── */
  .nl-faq-list { max-width: 720px; }
  .nl-faq-item { border-top: 1px solid var(--border); }
  .nl-faq-item:last-child { border-bottom: 1px solid var(--border); }
  .nl-faq-q {
    width: 100%; display: flex; justify-content: space-between; align-items: center;
    padding: 1.3rem 0; background: none; border: none; cursor: pointer;
    font-family: 'DM Sans', sans-serif; font-size: .9rem; font-weight: 400;
    color: var(--white); text-align: left; gap: 1.5rem; transition: color .2s;
  }
  .nl-faq-q:hover { color: var(--light); }
  .nl-faq-ico {
    width: 22px; height: 22px; flex-shrink: 0;
    border: 1px solid var(--border); border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: .85rem; color: var(--dim);
    transition: transform .3s ease, border-color .2s;
  }
  .nl-faq-item.open .nl-faq-ico { transform: rotate(45deg); border-color: var(--mid); }
  .nl-faq-a {
    font-size: .86rem; color: var(--dim); line-height: 1.76;
    max-height: 0; overflow: hidden;
    transition: max-height .36s ease, padding-bottom .3s ease;
  }
  .nl-faq-item.open .nl-faq-a { max-height: 220px; padding-bottom: 1.3rem; }

  /* ── CTA ── */
  .nl-cta-wrap {
    padding: 6rem 4rem; border-bottom: 1px solid var(--border);
    display: flex; justify-content: center;
  }
  .nl-cta-box {
    background: var(--bg2); border: 1px solid var(--border);
    border-radius: 18px; padding: 5rem 3rem;
    text-align: center; max-width: 700px; width: 100%;
    position: relative; overflow: hidden;
  }
  .nl-cta-box::before {
    content: '';
    position: absolute; top: 0; left: 50%; transform: translateX(-50%);
    width: 50%; height: 1px;
    background: linear-gradient(90deg, transparent, var(--muted), transparent);
  }
  .nl-cta-h {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(2.5rem, 5vw, 4.8rem);
    letter-spacing: .02em; line-height: .93;
    color: var(--white); margin-bottom: 1.2rem;
  }
  .nl-cta-p {
    font-size: .93rem; color: var(--mid); line-height: 1.76;
    margin-bottom: 2.25rem; max-width: 420px;
    margin-left: auto; margin-right: auto;
  }
  .nl-cta-row { display: flex; gap: .75rem; justify-content: center; flex-wrap: wrap; }

  /* ── FOOTER ── */
  .nl-footer { padding: 4rem 4rem 2.5rem; }
  .nl-footer-top {
    display: grid; grid-template-columns: 1.5fr 1fr 1fr 1.3fr;
    gap: 3rem; padding-bottom: 3rem; border-bottom: 1px solid var(--border);
  }
  .nl-flogo {
    font-family: 'Bebas Neue', sans-serif; font-size: 1.7rem;
    letter-spacing: .1em; color: var(--white); display: block; margin-bottom: .65rem;
  }
  .nl-ftagline { font-size: .79rem; color: var(--dim); line-height: 1.65; max-width: 200px; }
  .nl-fcol-label {
    font-family: 'DM Mono', monospace; font-size: .6rem; color: var(--muted);
    letter-spacing: .13em; text-transform: uppercase; margin-bottom: 1.15rem;
  }
  .nl-flinks { display: flex; flex-direction: column; gap: .62rem; }
  .nl-flink {
    font-size: .79rem; color: var(--dim); background: none;
    border: none; cursor: pointer; text-align: left;
    font-family: 'DM Sans', sans-serif; padding: 0;
    transition: color .2s;
  }
  .nl-flink:hover { color: var(--white); }
  .nl-nl { display: flex; flex-direction: column; gap: .5rem; }
  .nl-nl-input {
    background: var(--bg); border: 1px solid var(--border);
    border-radius: 4px; padding: .68rem 1rem;
    font-family: 'DM Sans', sans-serif; font-size: .79rem;
    color: var(--white); outline: none; transition: border-color .2s;
  }
  .nl-nl-input::placeholder { color: var(--muted); }
  .nl-nl-input:focus { border-color: var(--mid); }
  .nl-nl-btn {
    background: var(--white); color: var(--bg);
    border: none; border-radius: 4px; padding: .68rem 1rem;
    font-family: 'DM Sans', sans-serif; font-size: .79rem; font-weight: 500;
    cursor: pointer; transition: opacity .2s;
  }
  .nl-nl-btn:hover { opacity: .8; }
  .nl-footer-bot {
    display: flex; align-items: center; justify-content: space-between;
    padding-top: 2rem;
  }
  .nl-copy {
    font-family: 'DM Mono', monospace; font-size: .63rem; color: var(--muted);
  }
  .nl-legal { display: flex; gap: 1.5rem; }
  .nl-legal-a {
    font-family: 'DM Mono', monospace; font-size: .63rem; color: var(--muted);
    background: none; border: none; cursor: pointer; padding: 0;
    transition: color .2s; font-family: 'DM Mono', monospace;
  }
  .nl-legal-a:hover { color: var(--mid); }

  /* ── REVEAL ── */
  .nl-r {
    opacity: 0; transform: translateY(22px);
    transition: opacity .7s ease, transform .7s ease;
  }
  .nl-r.in { opacity: 1; transform: translateY(0); }

  /* ── RESPONSIVE ── */
  @media (max-width: 960px) {
    .nl-nav { padding: 0 1.5rem; }
    .nl-hero { grid-template-columns: 1fr; padding: 80px 1.5rem 4rem; min-height: unset; }
    .nl-hero-right { display: none; }
    .nl-trust { padding: 1.75rem 1.5rem; }
    .nl-section { padding: 4rem 1.5rem; }
    .nl-bento { grid-template-columns: 1fr 1fr; }
    .nl-bc.w2 { grid-column: span 2; }
    .nl-how { grid-template-columns: 1fr; }
    .nl-plans { grid-template-columns: 1fr; }
    .nl-testis { grid-template-columns: 1fr; }
    .nl-cta-wrap { padding: 4rem 1.5rem; }
    .nl-footer { padding: 3rem 1.5rem 2rem; }
    .nl-footer-top { grid-template-columns: 1fr 1fr; gap: 2rem; }
    .nl-footer-bot { flex-direction: column; gap: 1rem; text-align: center; }
  }
  @media (max-width: 540px) {
    .nl-bento { grid-template-columns: 1fr; }
    .nl-bc.w2 { grid-column: span 1; }
    .nl-footer-top { grid-template-columns: 1fr; }
    .nl-nav-links { gap: 1rem; }
  }
`;

/* ─── DATA ─── */
const BRANDS = ["VAPEFEST", "CLOUDCON", "SMOKEHAUS", "PUFFJAM", "MISTHOUSE", "VAPORIX", "DRIFTVAPE", "AEROHAUS"];
const BENEFITS = [
  { icon: "🌬️", title: "Smooth, Consistent Draw", text: "Tuned for even airflow and vapor density — every pull feels intentional, never harsh.", wide: true, stat: "98%", statLabel: "satisfaction rate" },
  { icon: "⚡", title: "Fast Charging",        text: "From zero to full in under 45 minutes. Never miss a session.",                         wide: false },
  { icon: "🎨", title: "Bold Flavor Library",  text: "30+ curated e-liquid blends — from iced fruit to rich tobacco.",                       wide: false },
  { icon: "🔒", title: "Safety First",         text: "Lab-tested, certified, and compliant with current safety standards.",                   wide: false },
  { icon: "📦", title: "Free Same-Day Delivery", text: "Order before 3PM and receive your package the same day. Discreet, secure packaging.", wide: true, stat: "3H", statLabel: "avg. delivery" },
];
const STEPS = [
  { n: "01", title: "Browse & Choose",  text: "Explore our catalog of devices, pods, and e-liquids. Filter by flavor, nicotine level, or device type to find your match." },
  { n: "02", title: "Order & Pay",      text: "Checkout securely in under 2 minutes. Cards, GCash, Maya, and cash on delivery — no friction, just fast." },
  { n: "03", title: "Receive & Enjoy",  text: "Arrives same-day in discreet packaging. Unbox, load up, and enjoy a session you'll keep coming back for." },
];
const PLANS = [
  { tier: "Starter", price: "₱599", per: "/order", desc: "Perfect for first-timers who want to explore Niekobai risk-free.", feats: ["1 device of choice", "2 e-liquid flavors", "Free delivery", "7-day return"], hot: false, btnLabel: "Get Started" },
  { tier: "Pro",     price: "₱1,299", per: "/month", desc: "Monthly supply drop with priority access to new flavors and devices.",  feats: ["Everything in Starter", "4 e-liquids per drop", "Early product access", "5% loyalty discount", "Priority support"], hot: true, btnLabel: "Subscribe Now" },
  { tier: "Premium", price: "₱2,199", per: "/month", desc: "For the serious enthusiast. Maximum variety, maximum value.",           feats: ["Everything in Pro", "8 e-liquids per drop", "Device upgrade credits", "10% loyalty discount", "Dedicated account rep"], hot: false, btnLabel: "Go Premium" },
];
const TESTIS = [
  { ini: "JR", name: "James R.",  role: "Pro Subscriber · Manila", text: "I've tried a lot of shops and nothing comes close. The flavors are spot on and delivery was crazy fast. Niekobai is my permanent go-to." },
  { ini: "SL", name: "Sofia L.",  role: "Premium · Quezon City",  text: "The packaging is discreet and quality is unreal. I switched from a competitor after my first order and haven't looked back since." },
  { ini: "KM", name: "Karl M.",   role: "Starter Pack · Makati",  text: "Same-day delivery is not a gimmick — it actually works. I ordered at 2PM and had my pack by 4:30. Elite service." },
];
const FAQS = [
  { q: "What areas do you deliver to?",              a: "We deliver across Metro Manila including Manila, Quezon City, Makati, BGC, Pasig, and nearby areas. Same-day delivery is available for orders placed before 3PM." },
  { q: "How does the monthly subscription work?",    a: "Your curated drop ships automatically each month. You can pause, change your plan, or cancel anytime from your account — no lock-in contracts." },
  { q: "Are your products lab-tested and safe?",     a: "Yes. Every product passes third-party lab testing for heavy metals and contaminants. We only stock from certified suppliers with full documentation." },
  { q: "What's your return and refund policy?",      a: "All orders come with a 7-day return window for defective or incorrect items. Contact support and we resolve it within 24 hours — full refund or replacement." },
  { q: "What payment methods do you accept?",        a: "We accept credit/debit cards, GCash, Maya, bank transfer, and cash on delivery. All transactions are secured with SSL encryption." },
];

/* ─── REVEAL HOOK ─── */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".nl-r");
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); obs.unobserve(e.target); } }),
      { threshold: 0.1 }
    );
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  });
}

/* ─── MAIN COMPONENT ─── */
export default function NeikoLai() {
  const [openFaq, setOpenFaq] = useState(null);
  const [mounted, setMounted] = useState(false);
  useReveal();

  // Inject font + styles
  useEffect(() => {
    // Font
    if (!document.querySelector("#nl-font")) {
      const link = document.createElement("link");
      link.id = "nl-font"; link.rel = "stylesheet"; link.href = FONT_URL;
      document.head.appendChild(link);
    }
    // Styles
    if (!document.querySelector("#nl-styles")) {
      const s = document.createElement("style");
      s.id = "nl-styles"; s.textContent = styles;
      document.head.appendChild(s);
    }
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.background = "#090909";
    setTimeout(() => setMounted(true), 80);
  }, []);

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="nl-root">

      {/* NAV */}
      <nav className="nl-nav">
        <span className="nl-logo">NEIKO<span>LAI</span></span>
        <div className="nl-nav-links">
          <button className="nl-nav-a" onClick={() => scrollTo("benefits")}>Benefits</button>
          <button className="nl-nav-a" onClick={() => scrollTo("how")}>How it works</button>
          <button className="nl-nav-a" onClick={() => scrollTo("pricing")}>Pricing</button>
          <button className="nl-nav-a" onClick={() => scrollTo("faq")}>FAQ</button>
          <button className="nl-nav-cta" onClick={() => scrollTo("pricing")}>Shop Now</button>
        </div>
      </nav>

      {/* HERO */}
      <section className="nl-hero">
        <div className={`nl-hero-left nl-r${mounted ? " in" : ""}`}>
          <div className="nl-badge">
            <span className="nl-dot" />
            10,000+ vapers trust Neiko Lai
          </div>
          <h1 className="nl-h1">
            PREMIUM<br />
            <em>VAPE</em><br />
            CRAFTED.
          </h1>
          <p className="nl-hero-sub">
            Curated devices, pods, and e-liquids by Neiko Lai.
            Smooth draws, bold flavors — built for those who know the difference.
          </p>
          <div className="nl-hero-btns">
            <button className="nl-btn-w" onClick={() => scrollTo("pricing")}>Shop Collection</button>
            <button className="nl-btn-o" onClick={() => scrollTo("how")}>How it works</button>
          </div>
        </div>

        <div className={`nl-hero-right nl-r${mounted ? " in" : ""}`} style={{ transitionDelay: "0.15s" }}>
          <div className="nl-hero-card">
            <div className="nl-hero-chip">NEW DROP 2025</div>
            <div className="nl-hero-glyph">N</div>
            <div className="nl-hero-device-label">Flagship Device</div>
            <div className="nl-hero-bar">
              <span className="nl-hero-bar-tag">NEIKO LAI</span>
              <span className="nl-hero-bar-tag">EST. 2025</span>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST MARQUEE */}
      <div className="nl-trust">
        <span className="nl-trust-label">Trusted by vapers at</span>
        <div className="nl-trust-rule" />
        <div className="nl-marquee-clip">
          <div className="nl-marquee">
            {[...BRANDS, ...BRANDS].map((b, i) => (
              <span key={i} className="nl-brand">{b}</span>
            ))}
          </div>
        </div>
      </div>

      {/* BENEFITS */}
      <section className="nl-section" id="benefits">
        <div className="nl-shead nl-r">
          <p className="nl-eyebrow">Why Neiko Lai</p>
          <h2 className="nl-sh">BUILT FOR<br />THE EXPERIENCE</h2>
          <p className="nl-sp">We focus on how it elevates your session — not just what's in the box.</p>
        </div>
        <div className="nl-bento nl-r" style={{ transitionDelay: "0.1s" }}>
          {BENEFITS.map((b, i) => (
            <div key={i} className={`nl-bc${b.wide ? " w2" : ""}`}>
              <div className="nl-bc-icon">{b.icon}</div>
              <div className="nl-bc-title">{b.title}</div>
              <div className="nl-bc-text">{b.text}</div>
              {b.stat && (
                <div className="nl-bc-stat">{b.stat} <small>{b.statLabel}</small></div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="nl-section" id="how">
        <div className="nl-shead nl-r">
          <p className="nl-eyebrow">Process</p>
          <h2 className="nl-sh">HOW IT<br />WORKS</h2>
          <p className="nl-sp">Get started with Neiko Lai in three simple steps.</p>
        </div>
        <div className="nl-how nl-r" style={{ transitionDelay: "0.1s" }}>
          {STEPS.map(s => (
            <div key={s.n} className="nl-step">
              <div className="nl-step-num">{s.n}</div>
              <div className="nl-step-title">{s.title}</div>
              <div className="nl-step-text">{s.text}</div>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section className="nl-section" id="pricing">
        <div className="nl-shead nl-r">
          <p className="nl-eyebrow">Pricing</p>
          <h2 className="nl-sh">PICK YOUR<br />BUNDLE</h2>
          <p className="nl-sp">Save more when you commit. Every plan includes free delivery and a 7-day return.</p>
        </div>
        <div className="nl-plans nl-r" style={{ transitionDelay: "0.1s" }}>
          {PLANS.map(p => (
            <div key={p.tier} className={`nl-plan${p.hot ? " hot" : ""}`}>
              {p.hot && <div className="nl-hot-pill">Most Popular</div>}
              <div className="nl-tier">{p.tier}</div>
              <div className="nl-price">{p.price} <sub>{p.per}</sub></div>
              <p className="nl-plan-desc">{p.desc}</p>
              <hr className="nl-plan-hr" />
              <button className={p.hot ? "nl-plan-btn-w" : "nl-plan-btn-o"}>{p.btnLabel}</button>
              <div className="nl-feats">
                {p.feats.map(f => <div key={f} className="nl-feat">{f}</div>)}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="nl-section" id="testimonials">
        <div className="nl-shead nl-r">
          <p className="nl-eyebrow">Reviews</p>
          <h2 className="nl-sh">LOVED BY<br />VAPERS</h2>
          <p className="nl-sp">Real people. Real sessions. Real feedback.</p>
        </div>
        <div className="nl-testis nl-r" style={{ transitionDelay: "0.1s" }}>
          {TESTIS.map(t => (
            <div key={t.ini} className="nl-testi">
              <div className="nl-stars">★★★★★</div>
              <p className="nl-testi-q">"{t.text}"</p>
              <div className="nl-author">
                <div className="nl-ava">{t.ini}</div>
                <div>
                  <div className="nl-aname">{t.name}</div>
                  <div className="nl-arole">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="nl-section" id="faq">
        <div className="nl-shead nl-r">
          <p className="nl-eyebrow">FAQ</p>
          <h2 className="nl-sh">FREQUENTLY<br />ASKED</h2>
        </div>
        <div className="nl-faq-list nl-r" style={{ transitionDelay: "0.1s" }}>
          {FAQS.map((f, i) => (
            <div key={i} className={`nl-faq-item${openFaq === i ? " open" : ""}`}>
              <button className="nl-faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                {f.q}
                <span className="nl-faq-ico">+</span>
              </button>
              <div className="nl-faq-a">{f.a}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="nl-cta-wrap">
        <div className="nl-cta-box nl-r">
          <h2 className="nl-cta-h">READY TO<br />ELEVATE YOUR<br />SESSIONS?</h2>
          <p className="nl-cta-p">Join 10,000+ vapers who chose quality, speed, and flavor. Your first order ships today.</p>
          <div className="nl-cta-row">
            <button className="nl-btn-w" onClick={() => scrollTo("pricing")}>Shop Now</button>
            <button className="nl-btn-o" onClick={() => scrollTo("pricing")}>See Bundles</button>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="nl-footer">
        <div className="nl-footer-top">
          <div>
            <span className="nl-flogo">NEIKO LAI</span>
            <p className="nl-ftagline">Premium vape products. Fast delivery, curated quality, across Metro Manila.</p>
          </div>
          <div>
            <p className="nl-fcol-label">Menu</p>
            <div className="nl-flinks">
              {["Shop", "Devices", "E-Liquids", "Bundles", "Blog"].map(l => (
                <button key={l} className="nl-flink">{l}</button>
              ))}
            </div>
          </div>
          <div>
            <p className="nl-fcol-label">Legal</p>
            <div className="nl-flinks">
              {["Terms of Service", "Privacy Policy", "Refund Policy", "Age Verification"].map(l => (
                <button key={l} className="nl-flink">{l}</button>
              ))}
            </div>
          </div>
          <div>
            <p className="nl-fcol-label">Newsletter</p>
            <div className="nl-nl">
              <input className="nl-nl-input" type="email" placeholder="your@email.com" />
              <button className="nl-nl-btn">Subscribe</button>
            </div>
          </div>
        </div>
        <div className="nl-footer-bot">
          <p className="nl-copy">© {new Date().getFullYear()} Neiko Lai. All rights reserved. 18+ only.</p>
          <div className="nl-legal">
            {["Privacy", "Terms", "Instagram", "Facebook"].map(l => (
              <button key={l} className="nl-legal-a">{l}</button>
            ))}
          </div>
        </div>
      </footer>

    </div>
  );
}
