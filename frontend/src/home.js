import React, { useState, useRef, useCallback, useEffect } from "react";

// ══════════════════════════════════════════════════
//  Figma Design System — inline CSS injected once
// ══════════════════════════════════════════════════
const GLOBAL_STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,600;0,9..144,700;1,9..144,300&family=Plus+Jakarta+Sans:wght@400;500;600&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --forest: #1B4332;
  --forest-light: #2D6A4F;
  --lime: #52B788;
  --lime-bright: #74C69D;
  --lime-pale: #D8F3DC;
  --cream: #F6F1E9;
  --cream-dark: #EDE8DC;
  --text-dark: #1A2E22;
  --text-mid: #3D5A47;
  --text-muted: #6B8C77;
  --white: #FFFFFF;
  --card-bg: #FFFFFF;
  --border: rgba(27,67,50,0.12);
  --shadow-sm: 0 2px 8px rgba(27,67,50,0.08);
  --shadow-md: 0 4px 20px rgba(27,67,50,0.12);
  --shadow-lg: 0 8px 40px rgba(27,67,50,0.16);
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 20px;
  --radius-xl: 28px;
}

html { scroll-behavior: smooth; }
body { font-family: 'Plus Jakarta Sans', sans-serif; background: var(--cream); color: var(--text-dark); line-height: 1.6; }

/* ══ NAV ══ */
nav {
  position: sticky; top: 0; z-index: 200;
  background: var(--forest); padding: 0 5%;
  display: flex; align-items: center; justify-content: space-between; height: 64px;
  box-shadow: 0 2px 20px rgba(0,0,0,0.2);
}
.nav-logo { display:flex; align-items:center; gap:10px; text-decoration:none; }
.nav-logo-icon { width:36px; height:36px; background:var(--lime); border-radius:10px; display:flex; align-items:center; justify-content:center; font-size:20px; }
.nav-logo-text { font-family:'Fraunces',serif; font-weight:600; font-size:20px; color:var(--white); }
.nav-logo-text span { color:var(--lime-bright); }
.nav-links { display:flex; align-items:center; gap:2px; list-style:none; }
.nav-links a { text-decoration:none; color:rgba(255,255,255,0.75); font-size:14px; font-weight:500; padding:6px 14px; border-radius:var(--radius-sm); transition:all 0.2s; }
.nav-links a:hover { background:rgba(255,255,255,0.1); color:var(--white); }
.nav-links a.active { background:var(--lime); color:var(--forest); font-weight:600; }
.nav-cta { background:var(--lime) !important; color:var(--forest) !important; font-weight:600 !important; padding:8px 18px !important; border-radius:50px !important; }

/* ══ HERO ══ */
.hero { background:linear-gradient(135deg,var(--forest) 0%,var(--forest-light) 60%,#2D8653 100%); padding:80px 5% 0; overflow:hidden; position:relative; min-height:420px; display:flex; align-items:center; gap:60px; }
.hero::before { content:''; position:absolute; top:-100px; right:-100px; width:500px; height:500px; border-radius:50%; background:rgba(82,183,136,0.1); pointer-events:none; }
.hero-text { flex:1; max-width:520px; padding-bottom:60px; }
.hero-badge { display:inline-flex; align-items:center; gap:6px; background:rgba(82,183,136,0.2); border:1px solid rgba(82,183,136,0.4); color:var(--lime-bright); font-size:12px; font-weight:600; letter-spacing:0.8px; text-transform:uppercase; padding:5px 12px; border-radius:50px; margin-bottom:20px; }
.hero h1 { font-family:'Fraunces',serif; font-weight:700; font-size:clamp(36px,4vw,54px); color:var(--white); line-height:1.15; margin-bottom:16px; letter-spacing:-0.5px; }
.hero h1 em { font-style:italic; color:var(--lime-bright); }
.hero p { font-size:16px; color:rgba(255,255,255,0.7); margin-bottom:32px; max-width:420px; line-height:1.7; }
.hero-btns { display:flex; gap:12px; flex-wrap:wrap; }
.btn-primary { background:var(--lime); color:var(--forest); font-weight:600; font-size:14px; padding:12px 24px; border-radius:50px; border:none; cursor:pointer; text-decoration:none; display:inline-flex; align-items:center; gap:6px; transition:all 0.2s; }
.btn-primary:hover { background:var(--lime-bright); transform:translateY(-1px); box-shadow:0 6px 20px rgba(82,183,136,0.4); }
.btn-ghost { background:transparent; color:rgba(255,255,255,0.85); font-weight:500; font-size:14px; padding:12px 24px; border-radius:50px; border:1px solid rgba(255,255,255,0.25); cursor:pointer; text-decoration:none; display:inline-flex; align-items:center; gap:6px; transition:all 0.2s; }
.btn-ghost:hover { background:rgba(255,255,255,0.1); }
.hero-visual { flex-shrink:0; display:flex; gap:16px; align-items:flex-end; }
.hero-stat-card { background:rgba(255,255,255,0.08); backdrop-filter:blur(10px); border:1px solid rgba(255,255,255,0.15); border-radius:var(--radius-lg); padding:20px; text-align:center; min-width:120px; transition:transform 0.3s; }
.hero-stat-card:hover { transform:translateY(-4px); }
.hero-stat-card .num { font-family:'Fraunces',serif; font-size:32px; font-weight:600; color:var(--lime-bright); display:block; }
.hero-stat-card .lbl { font-size:12px; color:rgba(255,255,255,0.6); font-weight:500; }
.hero-main-card { background:rgba(255,255,255,0.1); backdrop-filter:blur(10px); border:1px solid rgba(255,255,255,0.2); border-radius:var(--radius-xl); padding:28px; display:flex; flex-direction:column; align-items:center; gap:12px; min-width:160px; margin-bottom:20px; transition:transform 0.3s; }
.hero-main-card:hover { transform:translateY(-4px); }
.hero-main-card .plant-icon { font-size:56px; }
.hero-main-card .card-title { font-size:13px; font-weight:600; color:var(--white); text-align:center; }
.hero-main-card .status-badge { background:rgba(82,183,136,0.25); color:var(--lime-bright); font-size:11px; font-weight:600; padding:3px 10px; border-radius:50px; border:1px solid rgba(82,183,136,0.4); }

/* ══ STATS BANNER ══ */
.stats-banner { background:var(--forest); padding:48px 5%; }
.stats-inner { display:grid; grid-template-columns:repeat(4,1fr); gap:32px; text-align:center; max-width:900px; margin:0 auto; }
.stat-item .stat-num { font-family:'Fraunces',serif; font-size:42px; font-weight:700; color:var(--lime-bright); display:block; line-height:1; margin-bottom:6px; }
.stat-item .stat-label { font-size:13px; color:rgba(255,255,255,0.6); font-weight:500; }

/* ══ SECTIONS ══ */
.section { padding:64px 5%; }
.section-alt { background:var(--cream-dark); }
.section-header { display:flex; align-items:flex-end; justify-content:space-between; margin-bottom:36px; gap:20px; flex-wrap:wrap; }
.section-tag { display:inline-block; font-size:11px; font-weight:700; letter-spacing:1.2px; text-transform:uppercase; color:var(--lime-bright); background:var(--forest); padding:4px 10px; border-radius:4px; margin-bottom:8px; }
.section-title { font-family:'Fraunces',serif; font-size:clamp(26px,3vw,36px); font-weight:600; color:var(--text-dark); letter-spacing:-0.3px; line-height:1.2; }
.section-sub { font-size:14px; color:var(--text-muted); margin-top:6px; max-width:400px; }
.see-all-link { text-decoration:none; color:var(--forest-light); font-size:13px; font-weight:600; display:flex; align-items:center; gap:4px; white-space:nowrap; transition:gap 0.2s; }
.see-all-link:hover { gap:8px; color:var(--forest); }

/* ══ AI TOOLS CARDS ══ */
.ai-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:20px; }
.ai-card { background:var(--card-bg); border-radius:var(--radius-lg); border:1px solid var(--border); padding:28px; display:flex; flex-direction:column; gap:14px; box-shadow:var(--shadow-sm); transition:all 0.3s; cursor:pointer; text-decoration:none; color:inherit; position:relative; overflow:hidden; }
.ai-card::after { content:''; position:absolute; bottom:0; left:0; right:0; height:3px; background:var(--lime); transform:scaleX(0); transition:transform 0.3s; transform-origin:left; }
.ai-card:hover { transform:translateY(-4px); box-shadow:var(--shadow-lg); border-color:rgba(82,183,136,0.3); }
.ai-card:hover::after { transform:scaleX(1); }
.ai-card-icon { width:52px; height:52px; border-radius:var(--radius-md); display:flex; align-items:center; justify-content:center; font-size:26px; }
.ai-card-icon.green { background:var(--lime-pale); }
.ai-card-icon.amber { background:#FEF3C7; }
.ai-card-icon.blue  { background:#DBEAFE; }
.ai-card h3 { font-family:'Fraunces',serif; font-size:17px; font-weight:600; color:var(--text-dark); letter-spacing:-0.2px; }
.ai-card p  { font-size:13px; color:var(--text-muted); line-height:1.6; flex:1; }
.ai-card-footer { display:flex; align-items:center; justify-content:space-between; padding-top:12px; border-top:1px solid var(--border); }
.ai-card-status { font-size:11px; font-weight:600; padding:3px 10px; border-radius:50px; }
.status-live  { background:#D1FAE5; color:#065F46; }
.status-ready { background:#DBEAFE; color:#1E40AF; }
.status-beta  { background:#FEF3C7; color:#92400E; }
.ai-card-arrow { width:28px; height:28px; border-radius:50%; background:var(--lime-pale); display:flex; align-items:center; justify-content:center; font-size:13px; color:var(--forest); transition:background 0.2s; }
.ai-card:hover .ai-card-arrow { background:var(--lime); }

/* ══ DISEASE SCANNER ══ */
.scanner-wrap { display:grid; grid-template-columns:1fr 1fr; gap:24px; align-items:start; }
.scan-card { background:var(--card-bg); border-radius:var(--radius-lg); border:1px solid var(--border); padding:28px; box-shadow:var(--shadow-sm); display:flex; flex-direction:column; gap:18px; }
.scan-card-label { font-size:11px; font-weight:700; letter-spacing:1px; text-transform:uppercase; color:var(--text-muted); }
.drop-zone { border:2px dashed rgba(27,67,50,0.2); border-radius:16px; min-height:220px; display:flex; align-items:center; justify-content:center; cursor:pointer; transition:all 0.25s; background:var(--cream); position:relative; overflow:hidden; }
.drop-zone.drag-over { border-color:var(--lime); background:var(--lime-pale); transform:scale(1.01); }
.drop-zone.has-image { border:2px solid rgba(27,67,50,0.15); cursor:default; }
.drop-placeholder { text-align:center; padding:24px; pointer-events:none; }
.drop-icon  { font-size:48px; margin-bottom:10px; }
.drop-title { font-size:16px; font-weight:600; color:var(--text-dark); margin-bottom:4px; }
.drop-sub   { font-size:13px; color:var(--text-muted); margin-bottom:12px; }
.drop-formats { display:inline-block; font-size:11px; font-weight:600; color:var(--forest-light); background:var(--lime-pale); padding:3px 10px; border-radius:4px; }
.preview-img-el { width:100%; height:100%; object-fit:contain; max-height:280px; border-radius:12px; padding:8px; }
.remove-btn-el { position:absolute; top:10px; right:10px; background:rgba(0,0,0,0.55); color:#fff; border:none; border-radius:20px; padding:4px 12px; font-size:12px; font-weight:600; cursor:pointer; z-index:2; }
.analyse-btn { width:100%; background:var(--forest); color:var(--lime-bright); border:none; border-radius:50px; padding:14px 24px; font-family:'Plus Jakarta Sans',sans-serif; font-size:15px; font-weight:700; cursor:pointer; transition:all 0.2s; letter-spacing:0.3px; }
.analyse-btn:hover:not(:disabled) { background:var(--forest-light); transform:translateY(-1px); box-shadow:0 6px 20px rgba(27,67,50,0.3); }
.analyse-btn:disabled { background:#D1D5DB; color:#9CA3AF; cursor:not-allowed; transform:none; box-shadow:none; }
.loading-bar { height:4px; background:#E5E7EB; border-radius:99px; overflow:hidden; }
.loading-fill { height:100%; width:45%; background:linear-gradient(90deg,var(--lime),var(--lime-bright)); border-radius:99px; animation:shimmer 1.4s ease infinite; }
.tips-box { background:#F0FDF4; border:1px solid rgba(82,183,136,0.25); border-radius:12px; padding:14px 16px; }
.tips-title { font-size:12px; font-weight:700; color:#2D6A4F; margin-bottom:8px; }
.tips-list  { padding-left:18px; margin:0; font-size:12px; color:var(--text-mid); line-height:1.9; }
.empty-state { display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; padding:60px 20px; gap:10px; min-height:320px; }
.empty-icon  { font-size:52px; }
.empty-title { font-size:18px; font-weight:700; color:var(--text-dark); }
.empty-sub   { font-size:13px; color:var(--text-muted); line-height:1.6; max-width:260px; }
.result-panel-inner { display:flex; flex-direction:column; gap:16px; }
.result-pill { display:flex; align-items:center; gap:16px; padding:18px 20px; border-radius:16px; border:1px solid transparent; }
.conf-box { background:#F9FAFB; border-radius:12px; padding:16px 18px; border:1px solid #E5E7EB; }
.conf-header { display:flex; justify-content:space-between; align-items:baseline; margin-bottom:10px; }
.conf-label { font-size:14px; font-weight:600; color:#374151; }
.conf-value { font-family:'Fraunces',serif; font-size:30px; font-weight:700; }
.conf-bar-track { height:8px; border-radius:99px; background:#E5E7EB; overflow:hidden; }
.conf-bar-fill  { height:100%; border-radius:99px; transition:width 0.8s cubic-bezier(.22,1,.36,1); }
.conf-hint { font-size:12px; color:#9CA3AF; margin-top:6px; }
.all-preds { background:#F9FAFB; border-radius:12px; padding:14px 16px; border:1px solid #E5E7EB; }
.all-preds-title { font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:1px; color:#6B7280; margin-bottom:10px; }
.pred-row { display:flex; align-items:center; gap:10px; margin-bottom:8px; }
.pred-label { font-size:13px; color:#374151; flex:1; }
.pred-score { font-size:12px; font-weight:700; min-width:42px; text-align:right; }
.pred-bar-wrap { width:80px; }

/* ══ AI TREATMENT PANEL ══ */
.treatment-section { background:var(--forest); padding:64px 5%; }
.treatment-wrap { display:grid; grid-template-columns:1fr 1.4fr; gap:32px; align-items:start; max-width:1100px; margin:0 auto; }
.treatment-info { color:var(--white); }
.treatment-tag { display:inline-block; font-size:11px; font-weight:700; letter-spacing:1.2px; text-transform:uppercase; color:var(--forest); background:var(--lime); padding:4px 10px; border-radius:4px; margin-bottom:14px; }
.treatment-info h2 { font-family:'Fraunces',serif; font-size:clamp(26px,3vw,38px); font-weight:700; line-height:1.2; margin-bottom:12px; letter-spacing:-0.3px; }
.treatment-info h2 em { color:var(--lime-bright); font-style:italic; }
.treatment-info p { font-size:14px; color:rgba(255,255,255,0.65); line-height:1.75; margin-bottom:20px; }
.treatment-features { list-style:none; display:flex; flex-direction:column; gap:10px; }
.treatment-features li { display:flex; align-items:flex-start; gap:10px; font-size:13px; color:rgba(255,255,255,0.75); }
.treatment-features li .feat-icon { width:24px; height:24px; border-radius:6px; background:rgba(82,183,136,0.2); display:flex; align-items:center; justify-content:center; font-size:13px; flex-shrink:0; margin-top:1px; }
.treatment-card { background:rgba(255,255,255,0.06); backdrop-filter:blur(12px); border:1px solid rgba(255,255,255,0.15); border-radius:var(--radius-xl); padding:28px; display:flex; flex-direction:column; gap:16px; }
.treatment-input-row { display:flex; gap:10px; }
.disease-input { flex:1; background:rgba(255,255,255,0.1); border:1px solid rgba(255,255,255,0.2); border-radius:50px; padding:11px 18px; font-family:'Plus Jakarta Sans',sans-serif; font-size:14px; color:var(--white); outline:none; transition:border-color 0.2s; }
.disease-input::placeholder { color:rgba(255,255,255,0.4); }
.disease-input:focus { border-color:var(--lime); background:rgba(255,255,255,0.14); }
.treat-btn { background:var(--lime); color:var(--forest); border:none; border-radius:50px; padding:11px 20px; font-family:'Plus Jakarta Sans',sans-serif; font-size:14px; font-weight:700; cursor:pointer; white-space:nowrap; transition:all 0.2s; flex-shrink:0; }
.treat-btn:hover:not(:disabled) { background:var(--lime-bright); transform:translateY(-1px); }
.treat-btn:disabled { opacity:0.5; cursor:not-allowed; transform:none; }
.treatment-output { background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); border-radius:var(--radius-md); padding:20px; min-height:180px; font-size:13.5px; color:rgba(255,255,255,0.85); line-height:1.8; }
.treatment-placeholder { display:flex; flex-direction:column; align-items:center; justify-content:center; height:180px; text-align:center; gap:8px; color:rgba(255,255,255,0.3); }
.treatment-placeholder .ph-icon { font-size:36px; opacity:0.4; }
.treat-loading { display:flex; align-items:center; gap:10px; color:var(--lime-bright); font-size:13px; font-weight:600; height:180px; justify-content:center; }
.treat-dots span { display:inline-block; width:6px; height:6px; border-radius:50%; background:var(--lime-bright); animation:bounce 1.2s ease infinite; }
.treat-dots span:nth-child(2) { animation-delay:.15s; }
.treat-dots span:nth-child(3) { animation-delay:.3s; }
.treat-section { margin-bottom:14px; }
.treat-section:last-child { margin-bottom:0; }
.treat-section-title { font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:0.8px; color:var(--lime-bright); margin-bottom:6px; }
.treat-section-body { font-size:13.5px; color:rgba(255,255,255,0.85); line-height:1.8; }
.treat-section-body ul { padding-left:18px; }
.treat-section-body li { margin-bottom:4px; }
.treat-fungicide-chips { display:flex; flex-wrap:wrap; gap:8px; margin-top:8px; }
.fungicide-chip { background:rgba(82,183,136,0.15); border:1px solid rgba(82,183,136,0.3); color:var(--lime-bright); font-size:12px; font-weight:600; padding:4px 12px; border-radius:50px; }
.autofill-badge { display:none; align-items:center; gap:6px; font-size:12px; color:var(--lime-bright); background:rgba(82,183,136,0.1); border:1px solid rgba(82,183,136,0.25); border-radius:8px; padding:6px 12px; }
.autofill-badge.visible { display:flex; }

/* ══ FUNGICIDE SECTION ══ */
.fungicide-tabs { display:flex; gap:8px; margin-bottom:28px; border-bottom:1px solid var(--border); }
.ftab { padding:10px 20px; border-radius:var(--radius-sm) var(--radius-sm) 0 0; border:none; background:transparent; font-family:'Plus Jakarta Sans',sans-serif; font-size:14px; font-weight:500; color:var(--text-muted); cursor:pointer; transition:all 0.2s; border-bottom:2px solid transparent; margin-bottom:-1px; }
.ftab.active { color:var(--forest); border-bottom-color:var(--lime); font-weight:600; }
.ftab:hover:not(.active) { color:var(--forest-light); background:var(--lime-pale); }
.product-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(200px,1fr)); gap:20px; }
.product-card { background:var(--card-bg); border-radius:var(--radius-lg); border:1px solid var(--border); overflow:hidden; box-shadow:var(--shadow-sm); transition:all 0.3s; cursor:pointer; }
.product-card:hover { transform:translateY(-4px); box-shadow:var(--shadow-md); border-color:rgba(82,183,136,0.4); }
.product-img-wrap { height:140px; background:var(--cream); display:flex; align-items:center; justify-content:center; overflow:hidden; position:relative; }
.product-img-placeholder { width:70px; height:70px; border-radius:var(--radius-md); background:var(--cream-dark); display:flex; align-items:center; justify-content:center; font-size:32px; }
.product-badge { position:absolute; top:10px; left:10px; font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; padding:3px 8px; border-radius:4px; }
.badge-systemic { background:#DBEAFE; color:#1E40AF; }
.badge-contact  { background:#FEF3C7; color:#92400E; }
.badge-both     { background:#D1FAE5; color:#065F46; }
.product-info { padding:14px 16px; }
.product-name { font-family:'Fraunces',serif; font-size:15px; font-weight:600; color:var(--text-dark); margin-bottom:4px; }
.product-meta { font-size:11.5px; color:var(--text-muted); line-height:1.5; margin-bottom:10px; }
.product-meta strong { color:var(--text-mid); font-weight:600; }
.product-mfr { display:inline-flex; align-items:center; gap:4px; font-size:11px; font-weight:600; color:var(--forest-light); background:var(--lime-pale); padding:3px 8px; border-radius:4px; }

/* ══ EVENTS ══ */
.events-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(300px,1fr)); gap:24px; }
.event-card { background:var(--card-bg); border-radius:var(--radius-lg); border:1px solid var(--border); overflow:hidden; box-shadow:var(--shadow-sm); transition:all 0.3s; display:flex; flex-direction:column; }
.event-card:hover { transform:translateY(-4px); box-shadow:var(--shadow-md); }
.event-img { height:160px; background:var(--forest); display:flex; align-items:center; justify-content:center; position:relative; overflow:hidden; }
.event-category-pill { position:absolute; top:14px; left:14px; font-size:10px; font-weight:700; letter-spacing:0.8px; text-transform:uppercase; background:var(--lime); color:var(--forest); padding:4px 10px; border-radius:50px; z-index:2; }
.event-date-chip { position:absolute; bottom:14px; right:14px; background:rgba(255,255,255,0.15); backdrop-filter:blur(8px); border:1px solid rgba(255,255,255,0.25); border-radius:var(--radius-sm); padding:6px 10px; text-align:center; z-index:2; }
.event-date-chip .day   { display:block; font-family:'Fraunces',serif; font-size:20px; font-weight:700; color:var(--white); line-height:1; }
.event-date-chip .month { display:block; font-size:10px; font-weight:600; color:rgba(255,255,255,0.8); text-transform:uppercase; letter-spacing:0.5px; }
.event-body { padding:18px 20px; flex:1; display:flex; flex-direction:column; }
.event-title { font-family:'Fraunces',serif; font-size:18px; font-weight:600; color:var(--text-dark); margin-bottom:8px; letter-spacing:-0.2px; line-height:1.3; }
.event-desc  { font-size:13px; color:var(--text-muted); line-height:1.6; flex:1; margin-bottom:14px; }
.event-footer { display:flex; align-items:center; justify-content:space-between; padding-top:12px; border-top:1px solid var(--border); }
.event-location { display:flex; align-items:center; gap:5px; font-size:12px; font-weight:500; color:var(--forest-light); }
.event-register-btn { font-size:12px; font-weight:600; color:var(--forest); background:var(--lime-pale); border:1px solid rgba(82,183,136,0.3); padding:6px 14px; border-radius:50px; cursor:pointer; text-decoration:none; transition:all 0.2s; }
.event-register-btn:hover { background:var(--lime); }

/* ══ FOOTER ══ */
footer { background:var(--text-dark); padding:40px 5% 24px; }
.footer-inner { display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:20px; padding-bottom:24px; border-bottom:1px solid rgba(255,255,255,0.08); margin-bottom:20px; }
.footer-logo-text { font-family:'Fraunces',serif; font-size:20px; font-weight:600; color:var(--white); }
.footer-logo-text span { color:var(--lime-bright); }
.footer-links { display:flex; gap:20px; list-style:none; flex-wrap:wrap; }
.footer-links a { text-decoration:none; color:rgba(255,255,255,0.5); font-size:13px; transition:color 0.2s; }
.footer-links a:hover { color:var(--lime-bright); }
.footer-copy { font-size:12px; color:rgba(255,255,255,0.3); text-align:center; }

/* ══ ANIMATIONS ══ */
@keyframes fadeUp   { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
@keyframes shimmer  { 0%{transform:translateX(-100%)} 100%{transform:translateX(250%)} }
@keyframes bounce   { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-6px)} }
@keyframes spin     { to{transform:rotate(360deg)} }

.fade-up { animation:fadeUp 0.5s ease both; }
.fade-up:nth-child(2){animation-delay:.1s}
.fade-up:nth-child(3){animation-delay:.2s}

/* ══ RESPONSIVE ══ */
@media(max-width:1000px){
  .scanner-wrap,.treatment-wrap{grid-template-columns:1fr}
  .ai-grid{grid-template-columns:1fr 1fr}
}
@media(max-width:700px){
  .nav-links{display:none}
  .ai-grid{grid-template-columns:1fr}
  .stats-inner{grid-template-columns:repeat(2,1fr)}
  .hero-visual{display:none}
  .hero{padding-bottom:40px}
  .product-grid{grid-template-columns:repeat(2,1fr)}
}
`;

// ══ Severity map ══
const SEVERITY = {
  "early blight":       { level:"Moderate",color:"#D97706",bg:"#FEF3C7",icon:"⚠️" },
  "late blight":        { level:"Severe",  color:"#DC2626",bg:"#FEE2E2",icon:"🚨" },
  "healthy":            { level:"Healthy", color:"#059669",bg:"#D1FAE5",icon:"✅" },
  "leaf mold":          { level:"Moderate",color:"#D97706",bg:"#FEF3C7",icon:"⚠️" },
  "septoria leaf spot": { level:"Moderate",color:"#D97706",bg:"#FEF3C7",icon:"⚠️" },
  "target spot":        { level:"Severe",  color:"#DC2626",bg:"#FEE2E2",icon:"🚨" },
  "mosaic virus":       { level:"Severe",  color:"#DC2626",bg:"#FEE2E2",icon:"🚨" },
  "yellow leaf curl":   { level:"Severe",  color:"#DC2626",bg:"#FEE2E2",icon:"🚨" },
};
function getSev(label=""){
  return SEVERITY[label.toLowerCase()] || {level:"Unknown",color:"#6B7280",bg:"#F3F4F6",icon:"🔬"};
}

// ══ ResultPanel ══
function ResultPanel({ data, error, loading }) {
  if (loading) {
    return (
      <div className="empty-state">
        <div style={{fontSize:48,animation:"spin 1.2s linear infinite"}}>⚙️</div>
        <p className="empty-title">Scanning your crop…</p>
        <p className="empty-sub">Running image through the disease model</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="empty-state" style={{background:"#FEF2F2",borderRadius:12,padding:24}}>
        <div style={{fontSize:40}}>❌</div>
        <p className="empty-title" style={{color:"#DC2626"}}>Detection failed</p>
        <p className="empty-sub" style={{color:"#B91C1C"}}>{error}</p>
      </div>
    );
  }
  if (!data) {
    return (
      <div className="empty-state">
        <div className="empty-icon">🔬</div>
        <p className="empty-title">No scan yet</p>
        <p className="empty-sub">Upload a photo and click <strong>Analyse Disease</strong> to see your results here.</p>
      </div>
    );
  }

  const disease    = data.class ?? data.disease ?? data.label ?? data.prediction ?? "Unknown";
  const confidence = parseFloat(data.confidence ?? data.score ?? 0) * (data.confidence <= 1 ? 100 : 1);
  const confStr    = confidence.toFixed(1);
  const allPreds   = data.all_predictions ?? data.predictions ?? null;
  const sev        = getSev(disease);

  const confHint = confidence >= 85
    ? "High confidence — result is reliable."
    : confidence >= 60
    ? "Moderate confidence — consider a second scan."
    : "Low confidence — try a clearer, well-lit photo.";

  return (
    <div className="result-panel-inner">
      <div className="result-pill" style={{background:sev.bg,borderColor:sev.color+"44"}}>
        <span style={{fontSize:32}}>{sev.icon}</span>
        <div>
          <div style={{fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:1,color:sev.color,marginBottom:3}}>{sev.level}</div>
          <div style={{fontSize:20,fontWeight:700,color:"#1A2E22",fontFamily:"'Fraunces',serif"}}>{disease}</div>
        </div>
      </div>

      <div className="conf-box">
        <div className="conf-header">
          <span className="conf-label">Confidence score</span>
          <span className="conf-value" style={{color:sev.color}}>{confStr}%</span>
        </div>
        <div className="conf-bar-track">
          <div className="conf-bar-fill" style={{width:`${Math.min(100,confidence)}%`,background:sev.color}}></div>
        </div>
        <p className="conf-hint">{confHint}</p>
      </div>

      {allPreds && allPreds.length > 0 && (
        <div className="all-preds">
          <p className="all-preds-title">All predictions</p>
          {allPreds.sort((a,b)=>b.score-a.score).slice(0,5).map((p,i) => {
            const ps = getSev(p.label);
            return (
              <div className="pred-row" key={i}>
                <span className="pred-label">{p.label}</span>
                <span className="pred-score" style={{color:ps.color}}>{parseFloat(p.score).toFixed(1)}%</span>
                <div className="pred-bar-wrap">
                  <div className="conf-bar-track">
                    <div className="conf-bar-fill" style={{width:`${Math.min(100,p.score)}%`,background:ps.color}}></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div style={{background:"#F0FDF4",border:"1px solid rgba(82,183,136,0.3)",borderRadius:12,padding:"14px 16px"}}>
        <p style={{fontSize:13,fontWeight:700,color:"#065F46",marginBottom:8}}>Next step</p>
        <p style={{fontSize:13,color:"#047857",lineHeight:1.6}}>Scroll down to the <strong>AI Treatment Plan</strong> section — your diagnosis has been auto-filled for you.</p>
        <a href="#treatment" style={{display:"inline-block",marginTop:10,fontSize:13,fontWeight:700,color:"#1B4332",textDecoration:"none",background:"var(--lime-pale)",padding:"7px 16px",borderRadius:50,border:"1px solid rgba(82,183,136,0.3)"}}>Get AI Treatment Plan →</a>
      </div>
    </div>
  );
}

// ══ TreatmentOutput ══
function TreatmentOutput({ plan, loading, error }) {
  if (loading) {
    return (
      <div className="treat-loading">
        <div className="treat-dots"><span></span><span></span><span></span></div>
        <span>Generating treatment plan…</span>
      </div>
    );
  }
  if (error) {
    return (
      <div style={{color:"#FCA5A5",fontSize:13,textAlign:"center",padding:"40px 20px"}}>
        ❌ {error}
      </div>
    );
  }
  if (!plan) {
    return (
      <div className="treatment-placeholder">
        <div className="ph-icon">🌿</div>
        <p>Enter a disease name above and click <strong>Get Plan</strong> to generate a full treatment protocol.</p>
      </div>
    );
  }

  const sevColor = plan.severity==="severe"?"#DC2626":plan.severity==="moderate"?"#D97706":"#059669";
  const sevBg    = plan.severity==="severe"?"#FEE2E2":plan.severity==="moderate"?"#FEF3C7":"#D1FAE5";

  return (
    <div>
      <div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",borderRadius:10,background:sevBg,border:`1px solid ${sevColor}33`,marginBottom:14}}>
        <span style={{fontSize:20}}>{plan.severity==="severe"?"🚨":plan.severity==="moderate"?"⚠️":"✅"}</span>
        <div>
          <div style={{fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.8px",color:sevColor}}>{plan.severity||"unknown"} severity</div>
          <div style={{fontSize:13,color:"#1A2E22",fontWeight:500,marginTop:2}}>{plan.overview||""}</div>
        </div>
      </div>

      {plan.immediate_actions?.length > 0 && (
        <div className="treat-section">
          <div className="treat-section-title">⚡ Immediate actions</div>
          <div className="treat-section-body"><ul>{plan.immediate_actions.map((a,i)=><li key={i}>{a}</li>)}</ul></div>
        </div>
      )}

      {plan.fungicides?.length > 0 && (
        <div className="treat-section">
          <div className="treat-section-title">💊 Recommended fungicides</div>
          <div className="treat-fungicide-chips">
            {plan.fungicides.map((f,i)=><span className="fungicide-chip" key={i}>{f}</span>)}
          </div>
        </div>
      )}

      {plan.application && (
        <div className="treat-section">
          <div className="treat-section-title">🗓️ Application guide</div>
          <div className="treat-section-body">{plan.application}</div>
        </div>
      )}

      {plan.prevention?.length > 0 && (
        <div className="treat-section">
          <div className="treat-section-title">🛡️ Prevention</div>
          <div className="treat-section-body"><ul>{plan.prevention.map((p,i)=><li key={i}>{p}</li>)}</ul></div>
        </div>
      )}

      {plan.consult_expert && (
        <div style={{background:"rgba(220,38,38,0.1)",border:"1px solid rgba(220,38,38,0.3)",borderRadius:8,padding:"10px 14px",fontSize:12,color:"#FCA5A5",marginTop:4}}>
          ⚠️ This case warrants consultation with a local agronomist or extension officer.
        </div>
      )}
    </div>
  );
}

// ══ Main Component ══
export const ImageUpload = () => {
  // Scanner state
  const [currentFile, setCurrentFile] = useState(null);
  const [preview, setPreview]         = useState(null);
  const [isDragging, setIsDragging]   = useState(false);
  const [scanData, setScanData]       = useState(null);
  const [scanError, setScanError]     = useState(null);
  const [scanLoading, setScanLoading] = useState(false);

  // Treatment state
  const [diseaseInput, setDiseaseInput]     = useState("");
  const [treatPlan, setTreatPlan]           = useState(null);
  const [treatError, setTreatError]         = useState(null);
  const [treatLoading, setTreatLoading]     = useState(false);
  const [autofilled, setAutofilled]         = useState(false);

  // Fungicide tab
  const [activeTab, setActiveTab] = useState("early");

  const fileInputRef = useRef(null);

  // Inject global CSS once
  useEffect(() => {
    if (!document.getElementById("figma-global-style")) {
      const style = document.createElement("style");
      style.id = "figma-global-style";
      style.textContent = GLOBAL_STYLE;
      document.head.appendChild(style);
    }
  }, []);

  // Handle file
  const handleFile = useCallback((f) => {
    if (!f || !f.type.startsWith("image/")) {
      alert("Please upload a valid image (JPG, PNG, WEBP).");
      return;
    }
    setCurrentFile(f);
    setScanData(null);
    setScanError(null);
    const reader = new FileReader();
    reader.onload = e => setPreview(e.target.result);
    reader.readAsDataURL(f);
  }, []);

  const resetScan = useCallback((e) => {
    if (e) e.stopPropagation();
    setCurrentFile(null);
    setPreview(null);
    setScanData(null);
    setScanError(null);
    setScanLoading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  const analyseCrop = async () => {
    if (!currentFile) return;
    setScanLoading(true);
    setScanData(null);
    setScanError(null);
    const formData = new FormData();
    formData.append("file", currentFile);
    try {
      const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:8000/predict";
      const res = await fetch(apiUrl, { method: "POST", body: formData });
      if (!res.ok) throw new Error(`Server error ${res.status}`);
      const data = await res.json();
      setScanData(data);
      // Auto-fill treatment input
      const disease = data.class ?? data.disease ?? data.label ?? data.prediction ?? "";
      if (disease) {
        setDiseaseInput(disease);
        setAutofilled(true);
      }
    } catch (err) {
      setScanError(err.message || "Failed to analyse. Ensure backend is running.");
    } finally {
      setScanLoading(false);
    }
  };

  const getTreatment = async () => {
    const disease = diseaseInput.trim();
    if (!disease) return;
    setTreatLoading(true);
    setTreatPlan(null);
    setTreatError(null);
    try {
      const res = await fetch("http://localhost:8000/treatment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ disease }),
      });
      if (!res.ok) throw new Error(`Server error ${res.status}`);
      const data = await res.json();
      setTreatPlan(data);
    } catch (err) {
      setTreatError(err.message || "Failed to get treatment plan.");
    } finally {
      setTreatLoading(false);
    }
  };

  return (
    <div>
      {/* ═══ NAV ═══ */}
      <nav>
        <a href="#" className="nav-logo">
          <div className="nav-logo-icon">🌿</div>
          <span className="nav-logo-text">Lime<span>Farms</span></span>
        </a>
        <ul className="nav-links">
          <li><a href="#">Home</a></li>
          <li><a href="#ai-tools">AI Tools</a></li>
          <li><a href="#scanner" className="active">Scan Crop</a></li>
          <li><a href="#fungicides">Fungicides</a></li>
          <li><a href="#events">Events</a></li>
          <li><a href="#scanner" className="nav-cta">Get Started</a></li>
        </ul>
      </nav>

      {/* ═══ HERO ═══ */}
      <section className="hero">
        <div className="hero-text">
          <div className="hero-badge">🌱 Agri-Tech Platform</div>
          <h1>Smart farming for <em>healthier</em> harvests</h1>
          <p>AI-powered disease detection, fungicide recommendations, and the latest agri-tech events — all in one platform built for Kenyan farmers.</p>
          <div className="hero-btns">
            <a href="#scanner" className="btn-primary">Scan Your Crop →</a>
            <a href="#fungicides" className="btn-ghost">Browse Fungicides</a>
          </div>
        </div>
        <div className="hero-visual">
          <div style={{display:"flex",flexDirection:"column",gap:16}}>
            <div className="hero-stat-card"><span className="num">97%</span><span className="lbl">Detection Accuracy</span></div>
            <div className="hero-stat-card"><span className="num">40+</span><span className="lbl">Fungicide Products</span></div>
          </div>
          <div className="hero-main-card">
            <div className="plant-icon">🌿</div>
            <div className="card-title">AI Disease Scanner</div>
            <div className="status-badge">● Live</div>
          </div>
        </div>
      </section>

      {/* ═══ STATS ═══ */}
      <div className="stats-banner">
        <div className="stats-inner">
          <div className="stat-item"><span className="stat-num">12K+</span><span className="stat-label">Farmers helped</span></div>
          <div className="stat-item"><span className="stat-num">40+</span><span className="stat-label">Fungicide products</span></div>
          <div className="stat-item"><span className="stat-num">97%</span><span className="stat-label">AI accuracy</span></div>
          <div className="stat-item"><span className="stat-num">5</span><span className="stat-label">Upcoming events</span></div>
        </div>
      </div>

      {/* ═══ AI TOOLS ═══ */}
      <section className="section" id="ai-tools">
        <div className="section-header">
          <div>
            <div className="section-tag">AI Features</div>
            <h2 className="section-title">Powered by machine learning</h2>
            <p className="section-sub">Three intelligent tools to protect your crops from disease.</p>
          </div>
          <a href="#scanner" className="see-all-link">Try the scanner →</a>
        </div>
        <div className="ai-grid">
          <a href="#scanner" className="ai-card fade-up">
            <div className="ai-card-icon green">🌱</div>
            <h3>Disease Detection</h3>
            <p>Upload a leaf photo and get instant identification of blights, molds, and infections with confidence scores.</p>
            <div className="ai-card-footer"><span className="ai-card-status status-live">● Live</span><div className="ai-card-arrow">→</div></div>
          </a>
          <a href="#scanner" className="ai-card fade-up">
            <div className="ai-card-icon amber">📊</div>
            <h3>Confidence Prediction</h3>
            <p>See detailed probability scores across multiple disease categories to help inform your treatment decision.</p>
            <div className="ai-card-footer"><span className="ai-card-status status-ready">● Ready</span><div className="ai-card-arrow">→</div></div>
          </a>
          <a href="#treatment" className="ai-card fade-up">
            <div className="ai-card-icon blue">🤖</div>
            <h3>AI Treatment Plan</h3>
            <p>Get a personalised treatment plan, fungicide recommendations, and prevention tips generated by AI for your specific diagnosis.</p>
            <div className="ai-card-footer"><span className="ai-card-status status-live">● Live</span><div className="ai-card-arrow">→</div></div>
          </a>
        </div>
      </section>

      {/* ═══ DISEASE SCANNER ═══ */}
      <section className="section section-alt" id="scanner">
        <div className="section-header">
          <div>
            <div className="section-tag">Step 1 — Diagnose</div>
            <h2 className="section-title">Scan your crop</h2>
            <p className="section-sub">Upload a photo of an affected leaf. Our ML model detects the disease instantly.</p>
          </div>
        </div>
        <div className="scanner-wrap">
          {/* LEFT: Upload */}
          <div className="scan-card">
            <p className="scan-card-label">📸 Upload crop photo</p>

            <div
              className={`drop-zone${isDragging?" drag-over":""}${currentFile?" has-image":""}`}
              onClick={() => { if (!currentFile) fileInputRef.current?.click(); }}
              onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={e => { e.preventDefault(); setIsDragging(false); handleFile(e.dataTransfer.files[0]); }}
            >
              {!currentFile ? (
                <div className="drop-placeholder">
                  <div className="drop-icon">🌱</div>
                  <p className="drop-title">Drag &amp; drop a photo here</p>
                  <p className="drop-sub">or click to browse your files</p>
                  <div className="drop-formats">JPG · PNG · WEBP · up to 10 MB</div>
                </div>
              ) : (
                <>
                  <img src={preview} alt="Preview" className="preview-img-el" />
                  <button className="remove-btn-el" onClick={resetScan}>✕ Remove</button>
                </>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{display:"none"}}
              onChange={e => handleFile(e.target.files[0])}
            />

            <button
              className="analyse-btn"
              disabled={!currentFile || scanLoading}
              onClick={analyseCrop}
            >
              {scanLoading ? "⟳ Analysing…" : "🔍 Analyse Disease"}
            </button>

            {scanLoading && <div className="loading-bar"><div className="loading-fill"></div></div>}

            <div className="tips-box">
              <p className="tips-title">📋 Tips for best results</p>
              <ul className="tips-list">
                <li>Use natural daylight — avoid harsh shadows</li>
                <li>Focus on the affected leaf or stem area</li>
                <li>Capture the whole leaf if possible</li>
                <li>Avoid blurry or very dark images</li>
              </ul>
            </div>
          </div>

          {/* RIGHT: Results */}
          <div className="scan-card" id="result-panel">
            <p className="scan-card-label">🧬 Detection results</p>
            <ResultPanel data={scanData} error={scanError} loading={scanLoading} />
          </div>
        </div>
      </section>

      {/* ═══ AI TREATMENT ═══ */}
      <section className="treatment-section" id="treatment">
        <div className="treatment-wrap">
          <div className="treatment-info">
            <div className="treatment-tag">Step 2 — Treat</div>
            <h2>Get your <em>AI treatment</em> plan</h2>
            <p>Once you have a diagnosis, our AI generates a detailed, crop-specific treatment protocol — including fungicide options, application schedule, and prevention strategies.</p>
            <ul className="treatment-features">
              <li><div className="feat-icon">💊</div>Recommended fungicide products with dosage</li>
              <li><div className="feat-icon">📅</div>Application timing and schedule</li>
              <li><div className="feat-icon">🛡️</div>Preventive measures to stop re-infection</li>
              <li><div className="feat-icon">⚠️</div>Severity assessment and urgency level</li>
              <li><div className="feat-icon">🌦️</div>Environmental factors to consider</li>
            </ul>
          </div>

          <div className="treatment-card">
            <p style={{fontSize:11,fontWeight:700,letterSpacing:1,textTransform:"uppercase",color:"rgba(255,255,255,0.4)"}}>🤖 AI Treatment Generator</p>

            {autofilled && (
              <div className="autofill-badge visible">
                <span>✓</span> Disease auto-filled from your scan
              </div>
            )}

            <div className="treatment-input-row">
              <input
                className="disease-input"
                type="text"
                placeholder="Enter disease name, e.g. Early Blight…"
                value={diseaseInput}
                onChange={e => setDiseaseInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") getTreatment(); }}
              />
              <button
                className="treat-btn"
                disabled={!diseaseInput.trim() || treatLoading}
                onClick={getTreatment}
              >
                {treatLoading ? "Generating…" : "Get Plan"}
              </button>
            </div>

            <div className="treatment-output">
              <TreatmentOutput plan={treatPlan} loading={treatLoading} error={treatError} />
            </div>

            <p style={{fontSize:11,color:"rgba(255,255,255,0.3)",textAlign:"center"}}>
              Powered by backend AI · Always consult a local agronomist for critical decisions
            </p>
          </div>
        </div>
      </section>

      {/* ═══ FUNGICIDES ═══ */}
      <section className="section" id="fungicides">
        <div className="section-header">
          <div>
            <div className="section-tag">Product Catalogue</div>
            <h2 className="section-title">Recommended fungicides</h2>
            <p className="section-sub">Trusted treatments from leading agri manufacturers.</p>
          </div>
          <a href="#" className="see-all-link">View all →</a>
        </div>

        <div className="fungicide-tabs">
          <button className={`ftab${activeTab==="early"?" active":""}`} onClick={() => setActiveTab("early")}>Early Blight</button>
          <button className={`ftab${activeTab==="late"?" active":""}`}  onClick={() => setActiveTab("late")}>Late Blight</button>
        </div>

        {activeTab === "early" && (
          <div className="product-grid">
            {[
              { name:"Azoxystrobin",     icon:"🧪", mode:"Systemic",          mfr:"Syngenta", badge:"badge-systemic" },
              { name:"Difenoconazole",   icon:"🟢", mode:"Systemic",          mfr:"Corteva",  badge:"badge-systemic" },
              { name:"Mancozeb",         icon:"🔵", mode:"Contact",           mfr:"BASF",     badge:"badge-contact"  },
              { name:"Copper Hydroxide", icon:"🟤", mode:"Contact",           mfr:"Syngenta", badge:"badge-contact"  },
              { name:"Chlorothalonil",   icon:"⚗️", mode:"Contact",           mfr:"Syngenta", badge:"badge-contact"  },
            ].map((p,i) => (
              <div className="product-card fade-up" key={i}>
                <div className="product-img-wrap">
                  <div className="product-img-placeholder">{p.icon}</div>
                  <span className={`product-badge ${p.badge}`}>{p.mode}</span>
                </div>
                <div className="product-info">
                  <div className="product-name">{p.name}</div>
                  <div className="product-meta"><strong>Active:</strong> {p.name}<br/><strong>Mode:</strong> {p.mode}</div>
                  <span className="product-mfr">🏭 {p.mfr}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "late" && (
          <div className="product-grid">
            {[
              { name:"Metalaxyl + Mancozeb",        icon:"🧫", active:"Metalaxyl 9%, Mancozeb 64%", mode:"Systemic & Contact", mfr:"FMC",      badge:"badge-both"     },
              { name:"Fluopicolide + Propamocarb",  icon:"🌀", active:"Fluopicolide, Propamocarb",  mode:"Systemic & Contact", mfr:"Bayer",    badge:"badge-both"     },
              { name:"Cymoxanil + Mancozeb",        icon:"🧬", active:"Cymoxanil, Mancozeb",        mode:"Systemic & Contact", mfr:"Adama",    badge:"badge-both"     },
              { name:"Mandipropamid",               icon:"💊", active:"Mandipropamid",              mode:"Systemic",           mfr:"Syngenta", badge:"badge-systemic" },
              { name:"Dimethomorph",                icon:"🔬", active:"Dimethomorph",               mode:"Systemic",           mfr:"BASF",     badge:"badge-systemic" },
            ].map((p,i) => (
              <div className="product-card fade-up" key={i}>
                <div className="product-img-wrap">
                  <div className="product-img-placeholder">{p.icon}</div>
                  <span className={`product-badge ${p.badge}`}>{p.mode}</span>
                </div>
                <div className="product-info">
                  <div className="product-name">{p.name}</div>
                  <div className="product-meta"><strong>Active:</strong> {p.active}<br/><strong>Mode:</strong> {p.mode}</div>
                  <span className="product-mfr">🏭 {p.mfr}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ═══ EVENTS ═══ */}
      <section className="section section-alt" id="events">
        <div className="section-header">
          <div>
            <div className="section-tag">Events</div>
            <h2 className="section-title">Upcoming events</h2>
            <p className="section-sub">Stay connected with the agri-tech community across Kenya.</p>
          </div>
          <a href="#" className="see-all-link">View all →</a>
        </div>
        <div className="events-grid">
          {[
            {
              label:"Investment",date:"25",month:"May 2025",
              bg:"linear-gradient(135deg,#1B4332 0%,#2D6A4F 100%)",
              title:"RIZON 2025 — Agriculture Investment Summit",
              desc:"Resilience, Sustainability & Unlocking Investments for Agri-Tech businesses across East Africa.",
              loc:"Nairobi, Kenya"
            },
            {
              label:"Climate",date:"23",month:"May 2025",
              bg:"linear-gradient(135deg,#185A9D 0%,#43CEA2 100%)",
              title:"Climate Change Management in Agriculture",
              desc:"A forum addressing how Kenyan farmers can adapt farming practices in the face of climate disruption.",
              loc:"Nairobi, Kenya"
            },
            {
              label:"Disaster",date:"12",month:"Jun 2025",
              bg:"linear-gradient(135deg,#7B3F00 0%,#C68642 100%)",
              title:"Disaster Management for Agri-Tech Businesses",
              desc:"Practical strategies for crop loss mitigation, insurance, and crisis response for agri enterprises.",
              loc:"Nairobi, Kenya",
              pillStyle:{background:"#FEF3C7",color:"#92400E"}
            },
          ].map((ev,i) => (
            <div className="event-card" key={i}>
              <div className="event-img">
                <span className="event-category-pill" style={ev.pillStyle||{}}>{ev.label}</span>
                <div className="event-date-chip"><span className="day">{ev.date}</span><span className="month">{ev.month}</span></div>
                <div style={{position:"absolute",inset:0,background:ev.bg,opacity:0.9}}></div>
              </div>
              <div className="event-body">
                <h3 className="event-title">{ev.title}</h3>
                <p className="event-desc">{ev.desc}</p>
                <div className="event-footer">
                  <span className="event-location">📍 {ev.loc}</span>
                  <a href="#" className="event-register-btn">Register →</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer>
        <div className="footer-inner">
          <span className="footer-logo-text">Lime<span>Farms</span></span>
          <ul className="footer-links">
            <li><a href="#">Home</a></li>
            <li><a href="#ai-tools">AI Tools</a></li>
            <li><a href="#scanner">Scan Crop</a></li>
            <li><a href="#fungicides">Fungicides</a></li>
            <li><a href="#events">Events</a></li>
          </ul>
        </div>
        <p className="footer-copy">© {new Date().getFullYear()} Lime Farms. All rights reserved. Built for Kenyan farmers 🌿</p>
      </footer>
    </div>
  );
};
