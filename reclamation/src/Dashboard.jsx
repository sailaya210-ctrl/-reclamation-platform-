import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'DM Sans', sans-serif; background: #F4F5FA; color: #0F1117; }

  .dash-layout { display: flex; min-height: 100vh; }

  /* SIDEBAR */
  .sidebar {
    width: 220px; background: #fff; border-right: 1px solid rgba(0,0,0,0.06);
    display: flex; flex-direction: column; position: fixed; top: 0; left: 0;
    height: 100vh; z-index: 50; padding: 0;
  }
  .sidebar-logo {
    display: flex; align-items: center; gap: 8px;
    padding: 20px 20px 16px;
    border-bottom: 1px solid rgba(0,0,0,0.06);
  }
  .sidebar-logo span { font-family: 'Sora', sans-serif; font-weight: 700; font-size: 15.5px; color: #0F1117; letter-spacing: -0.3px; }
  .sidebar-nav { flex: 1; padding: 16px 12px; display: flex; flex-direction: column; gap: 4px; }
  .nav-item {
    display: flex; align-items: center; gap: 10px;
    padding: 9px 12px; border-radius: 9px; cursor: pointer;
    font-size: 13.5px; color: #6B7280; font-weight: 400;
    transition: all 0.18s; border: none; background: none;
    width: 100%; text-align: left; font-family: 'DM Sans', sans-serif;
  }
  .nav-item:hover { background: #F4F5FA; color: #0F1117; }
  .nav-item.active { background: #EEF2FF; color: #4F46E5; font-weight: 500; }
  .nav-item svg { flex-shrink: 0; }
  .sidebar-user {
    padding: 14px 16px; border-top: 1px solid rgba(0,0,0,0.06);
    display: flex; align-items: center; gap: 10px;
  }
  .user-avatar {
    width: 34px; height: 34px; border-radius: 50%; background: #4F46E5;
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; font-weight: 700; color: #fff; flex-shrink: 0;
  }
  .user-name { font-size: 13px; font-weight: 500; color: #0F1117; }
  .user-role { font-size: 10.5px; color: #9CA3AF; }

  /* MAIN */
  .main-content { margin-left: 220px; flex: 1; display: flex; flex-direction: column; min-height: 100vh; }

  /* TOPBAR */
  .topbar {
    height: 60px; background: #fff; border-bottom: 1px solid rgba(0,0,0,0.06);
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 32px; position: sticky; top: 0; z-index: 40;
  }
  .topbar-title { font-family: 'Sora', sans-serif; font-size: 18px; font-weight: 700; color: #0F1117; letter-spacing: -0.4px; }
  .search-bar {
    display: flex; align-items: center; gap: 8px;
    background: #F4F5FA; border: 1px solid #E5E7EB; border-radius: 10px;
    padding: 8px 14px; width: 280px;
  }
  .search-bar input { background: none; border: none; outline: none; font-size: 13px; color: #6B7280; width: 100%; font-family: 'DM Sans', sans-serif; }
  .topbar-icons { display: flex; align-items: center; gap: 8px; }
  .icon-btn {
    width: 36px; height: 36px; border-radius: 9px; border: 1px solid #E5E7EB;
    background: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center;
    position: relative; transition: background 0.15s;
  }
  .icon-btn:hover { background: #F4F5FA; }
  .notif-dot {
    position: absolute; top: 6px; right: 6px;
    width: 7px; height: 7px; border-radius: 50%; background: #EF4444;
    border: 1.5px solid #fff;
  }

  /* PAGE BODY */
  .page-body { padding: 28px 32px; flex: 1; }

  /* STAT CARDS */
  .stat-cards { display: grid; grid-template-columns: repeat(5, 1fr); gap: 14px; margin-bottom: 24px; }
  .stat-card {
    background: #fff; border-radius: 14px; border: 1px solid rgba(0,0,0,0.06);
    padding: 18px 20px; transition: transform 0.18s, box-shadow 0.18s;
  }
  .stat-card:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(0,0,0,0.07); }
  .stat-card.urgent { border: 2px solid #4F46E5; background: #FAFBFF; }
  .stat-label { font-size: 9.5px; font-weight: 600; color: #9CA3AF; letter-spacing: 0.8px; text-transform: uppercase; margin-bottom: 8px; }
  .stat-value { font-family: 'Sora', sans-serif; font-size: 26px; font-weight: 700; color: #0F1117; letter-spacing: -0.6px; }
  .stat-card.urgent .stat-value { color: #4F46E5; }
  .stat-badge {
    display: inline-flex; align-items: center; gap: 3px;
    font-size: 10.5px; font-weight: 500; margin-top: 6px; border-radius: 5px; padding: 2px 6px;
  }
  .stat-badge.up { background: #D1FAE5; color: #059669; }
  .stat-badge.down { background: #FEE2E2; color: #DC2626; }
  .stat-badge.neutral { background: #F3F4F6; color: #6B7280; }

  /* CHARTS ROW */
  .charts-row { display: grid; grid-template-columns: 1fr 340px; gap: 18px; margin-bottom: 24px; }
  .chart-card {
    background: #fff; border-radius: 16px; border: 1px solid rgba(0,0,0,0.06);
    padding: 22px 24px;
  }
  .chart-title { font-family: 'Sora', sans-serif; font-size: 14px; font-weight: 600; color: #0F1117; margin-bottom: 16px; }
  .chart-legend { display: flex; gap: 16px; margin-bottom: 18px; }
  .legend-item { display: flex; align-items: center; gap: 5px; font-size: 11px; color: #6B7280; }
  .legend-dot { width: 7px; height: 7px; border-radius: 50%; }

  /* BAR CHART */
  .bar-chart { display: flex; align-items: flex-end; gap: 18px; height: 160px; padding-bottom: 24px; position: relative; }
  .bar-chart::after {
    content: ''; position: absolute; bottom: 24px; left: 0; right: 0;
    height: 1px; background: #F3F4F6;
  }
  .bar-group { display: flex; flex-direction: column; align-items: center; gap: 4px; flex: 1; }
  .bars { display: flex; gap: 3px; align-items: flex-end; height: 130px; }
  .bar {
    width: 10px; border-radius: 4px 4px 0 0;
    transition: opacity 0.2s;
  }
  .bar:hover { opacity: 0.75; }
  .bar.soumis { background: #C7D2FE; }
  .bar.resolus { background: #10B981; }
  .bar.urgents { background: #F87171; }
  .bar-label { font-size: 10px; color: #B0B7C3; font-weight: 500; }
  .bar-active .bar-label { color: #4F46E5; font-weight: 600; }
  .bar-value { font-size: 9px; color: #4F46E5; font-weight: 700; position: absolute; top: -16px; }

  /* DONUT */
  .donut-wrap { display: flex; flex-direction: column; gap: 10px; }
  .donut-svg-wrap { display: flex; justify-content: center; margin: 8px 0 12px; }
  .service-row { display: flex; align-items: center; justify-content: space-between; padding: 3px 0; }
  .service-left { display: flex; align-items: center; gap: 8px; font-size: 12.5px; color: #374151; }
  .service-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
  .service-pct { font-size: 12.5px; font-weight: 600; color: #0F1117; }

  /* BOTTOM ROW */
  .bottom-row { display: grid; grid-template-columns: 1fr 340px; gap: 18px; }

  /* TOP INTERVENANTS */
  .intervenant-row {
    display: flex; align-items: center; gap: 12px;
    padding: 12px 0; border-bottom: 1px solid #F3F4F6;
  }
  .intervenant-row:last-child { border-bottom: none; }
  .rank { font-size: 11px; font-weight: 600; color: #B0B7C3; width: 20px; text-align: center; }
  .rank.gold { color: #F59E0B; }
  .int-avatar {
    width: 36px; height: 36px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; font-weight: 700; color: #fff; flex-shrink: 0;
  }
  .int-name { font-size: 13px; font-weight: 500; color: #111827; }
  .int-role { font-size: 10.5px; color: #9CA3AF; }
  .int-right { margin-left: auto; text-align: right; }
  .int-pct { font-size: 11px; color: #059669; font-weight: 600; margin-bottom: 4px; }
  .prog-bar-bg { width: 90px; height: 4px; background: #F0F0FF; border-radius: 99px; overflow: hidden; }
  .prog-bar-fill { height: 4px; background: linear-gradient(90deg, #4F46E5, #818CF8); border-radius: 99px; }

  /* ACTIVITY */
  .activity-item { display: flex; align-items: flex-start; gap: 10px; padding: 10px 0; border-bottom: 1px solid #F3F4F6; }
  .activity-item:last-child { border-bottom: none; }
  .act-icon {
    width: 30px; height: 30px; border-radius: 8px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center; font-size: 13px;
  }
  .act-text { font-size: 12.5px; color: #374151; line-height: 1.5; }
  .act-text strong { font-weight: 600; color: #0F1117; }
  .act-time { font-size: 10.5px; color: #B0B7C3; margin-top: 2px; }
  .btn-voir-tout {
    width: 100%; margin-top: 14px; padding: 9px;
    background: #F4F5FA; border: 1px solid #E5E7EB; border-radius: 8px;
    font-size: 11.5px; font-weight: 600; color: #374151; cursor: pointer;
    font-family: 'DM Sans', sans-serif; letter-spacing: 0.3px; transition: background 0.15s;
  }
  .btn-voir-tout:hover { background: #EEF2FF; color: #4F46E5; border-color: #C7D2FE; }

  /* PAGES CONTENT */
  .page-section { display: none; }
  .page-section.active { display: block; }

  /* TICKETS TABLE */
  .tickets-table { width: 100%; border-collapse: collapse; }
  .tickets-table th {
    font-size: 10px; font-weight: 600; color: #9CA3AF; letter-spacing: 0.7px;
    text-transform: uppercase; padding: 10px 14px; text-align: left;
    border-bottom: 1px solid #F3F4F6;
  }
  .tickets-table td { padding: 12px 14px; font-size: 13px; color: #374151; border-bottom: 1px solid #F9FAFB; }
  .tickets-table tr:hover td { background: #FAFBFF; }
  .tick-badge {
    font-size: 9.5px; font-weight: 700; padding: 3px 8px; border-radius: 5px;
    text-transform: uppercase; letter-spacing: 0.4px;
  }
  .tick-badge.urgent { background: #FEE2E2; color: #DC2626; }
  .tick-badge.cours { background: #FEF3C7; color: #D97706; }
  .tick-badge.resolu { background: #D1FAE5; color: #059669; }
  .tick-badge.attente { background: #F3F4F6; color: #6B7280; }

  /* USERS TABLE */
  .user-row { display: flex; align-items: center; gap: 12px; padding: 12px 0; border-bottom: 1px solid #F3F4F6; }
  .user-row:last-child { border-bottom: none; }
  .ur-avatar { width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; color: #fff; flex-shrink: 0; }
  .ur-name { font-size: 13px; font-weight: 500; color: #111827; }
  .ur-email { font-size: 11px; color: #9CA3AF; }
  .ur-role-badge { font-size: 10px; font-weight: 600; padding: 3px 8px; border-radius: 5px; }
  .ur-role-badge.admin { background: #EEF2FF; color: #4F46E5; }
  .ur-role-badge.resp { background: #FEF3C7; color: #D97706; }
  .ur-role-badge.emp { background: #F3F4F6; color: #6B7280; }

  /* PARAMS */
  .param-section { margin-bottom: 28px; }
  .param-section-title { font-family: 'Sora', sans-serif; font-size: 14px; font-weight: 600; color: #0F1117; margin-bottom: 14px; }
  .param-row { display: flex; align-items: center; justify-content: space-between; padding: 13px 0; border-bottom: 1px solid #F3F4F6; }
  .param-label { font-size: 13px; color: #374151; }
  .param-sub { font-size: 11px; color: #9CA3AF; margin-top: 2px; }
  .toggle {
    width: 40px; height: 22px; border-radius: 99px; border: none; cursor: pointer;
    transition: background 0.2s; position: relative; flex-shrink: 0;
  }
  .toggle.on { background: #4F46E5; }
  .toggle.off { background: #D1D5DB; }
  .toggle::after {
    content: ''; position: absolute; top: 3px; width: 16px; height: 16px;
    border-radius: 50%; background: #fff; transition: left 0.2s;
  }
  .toggle.on::after { left: 21px; }
  .toggle.off::after { left: 3px; }
  .btn-save {
    background: #4F46E5; color: #fff; border: none; border-radius: 9px;
    padding: 10px 22px; font-size: 13px; font-weight: 600; cursor: pointer;
    font-family: 'Sora', sans-serif; margin-top: 16px;
    transition: background 0.2s;
  }
  .btn-save:hover { background: #4338CA; }

  /* STATS PAGE */
  .stats-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 18px; }
  .stats-big-card { background: #fff; border-radius: 16px; border: 1px solid rgba(0,0,0,0.06); padding: 22px 24px; }
`;

// ── Logo ─────────────────────────────────────────────────
const Logo = () => (
  <div className="sidebar-logo">
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <rect width="28" height="28" rx="8" fill="#4F46E5" />
      <path d="M8 14C8 10.686 10.686 8 14 8C17.314 8 20 10.686 20 14C20 17.314 17.314 20 14 20"
        stroke="white" strokeWidth="1.9" strokeLinecap="round" />
      <circle cx="14" cy="20" r="1.6" fill="white" />
    </svg>
    <span>Bayan</span>
  </div>
);

// ── Bar Chart ─────────────────────────────────────────────
const barData = [
  { label: "NOV", soumis: 80, resolus: 60, urgents: 15 },
  { label: "DEC", soumis: 95, resolus: 75, urgents: 18 },
  { label: "JAN", soumis: 70, resolus: 55, urgents: 12 },
  { label: "FEV", soumis: 110, resolus: 88, urgents: 22 },
  { label: "MAR", soumis: 167, resolus: 130, urgents: 30, active: true },
  { label: "AVR", soumis: 40, resolus: 30, urgents: 8 },
];

const BarChart = () => (
  <div>
    <div className="chart-legend">
      <div className="legend-item"><div className="legend-dot" style={{ background: "#C7D2FE" }} />Soumises</div>
      <div className="legend-item"><div className="legend-dot" style={{ background: "#10B981" }} />Résolues</div>
      <div className="legend-item"><div className="legend-dot" style={{ background: "#F87171" }} />Urgentes</div>
    </div>
    <div className="bar-chart">
      {barData.map((d) => (
        <div key={d.label} className={`bar-group${d.active ? " bar-active" : ""}`}>
          <div className="bars" style={{ position: "relative" }}>
            {d.active && <span className="bar-value" style={{ position: "absolute", top: -18, left: "50%", transform: "translateX(-50%)", fontSize: 10 }}>{d.soumis}</span>}
            <div className="bar soumis" style={{ height: `${(d.soumis / 167) * 120}px` }} />
            <div className="bar resolus" style={{ height: `${(d.resolus / 167) * 120}px` }} />
            <div className="bar urgents" style={{ height: `${(d.urgents / 167) * 120}px` }} />
          </div>
          <span className="bar-label">{d.label}</span>
        </div>
      ))}
    </div>
  </div>
);

// ── Donut ─────────────────────────────────────────────────
const services = [
  { name: "Informatique", pct: 38, color: "#4F46E5" },
  { name: "Logistique",   pct: 24, color: "#10B981" },
  { name: "RH",           pct: 19, color: "#F59E0B" },
  { name: "Finance",      pct: 12, color: "#8B5CF6" },
  { name: "Maintenance",  pct: 7,  color: "#9CA3AF" },
];

const Donut = () => {
  let cumulative = 0;
  const r = 54; const cx = 70; const cy = 70;
  const circumference = 2 * Math.PI * r;
  const segments = services.map((s) => {
    const offset = cumulative;
    cumulative += s.pct;
    return { ...s, offset };
  });
  return (
    <div className="donut-wrap">
      <div className="donut-svg-wrap">
        <svg width="140" height="140" viewBox="0 0 140 140">
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="#F3F4F6" strokeWidth="18" />
          {segments.map((s) => (
            <circle key={s.name} cx={cx} cy={cy} r={r} fill="none"
              stroke={s.color} strokeWidth="18"
              strokeDasharray={`${(s.pct / 100) * circumference} ${circumference}`}
              strokeDashoffset={-((s.offset / 100) * circumference)}
              style={{ transform: "rotate(-90deg)", transformOrigin: "70px 70px" }}
            />
          ))}
          <text x={cx} y={cy - 5} textAnchor="middle" fontSize="18" fontWeight="700" fill="#0F1117" fontFamily="Sora">1,284</text>
          <text x={cx} y={cy + 13} textAnchor="middle" fontSize="9" fill="#9CA3AF" fontFamily="DM Sans">TOTAL</text>
        </svg>
      </div>
      {services.map((s) => (
        <div className="service-row" key={s.name}>
          <div className="service-left">
            <div className="service-dot" style={{ background: s.color }} />
            {s.name}
          </div>
          <span className="service-pct">{s.pct}%</span>
        </div>
      ))}
    </div>
  );
};

// ── Intervenants ──────────────────────────────────────────
const intervenants = [
  { rank: "🏆", initials: "KA", name: "Karim Alami",     role: "Superviseur Logistique", pct: 98, color: "#4F46E5" },
  { rank: "#2", initials: "SL", name: "Sarah Lemarié",   role: "Support Client Senior",  pct: 92, color: "#10B981" },
  { rank: "#3", initials: "ZA", name: "Zakaria Achraf",  role: "Technicien IT",          pct: 89, color: "#F59E0B" },
  { rank: "#4", initials: "AS", name: "Aya Saïl",        role: "Responsable Facturation",pct: 85, color: "#8B5CF6" },
  { rank: "#5", initials: "OM", name: "Omar Almsaddek",  role: "Agent de maintenance",   pct: 81, color: "#EC4899" },
];

// ── Activity ──────────────────────────────────────────────
const activities = [
  { icon: "🔵", bg: "#EEF2FF", text: <><strong>Nouvelle réclamation ID-98250</strong> créée</>, time: "À l'instant" },
  { icon: "✅", bg: "#D1FAE5", text: <><strong>ID-97904</strong> marquée comme résolue</>, time: "Il y a 12 min" },
  { icon: "✏️", bg: "#FEF3C7", text: <>Statut mis à jour pour <strong>ID-98110</strong></>, time: "Il y a 45 min" },
  { icon: "🔴", bg: "#FEE2E2", text: <>Alerte critique : <strong>5 réclamations</strong> en retard</>, time: "Il y a 1h" },
  { icon: "👤", bg: "#F3F4F6", text: <>Nouvel utilisateur <strong>Jules Verne</strong> ajouté</>, time: "Il y a 2h" },
];

// ── Tickets data ──────────────────────────────────────────
const tickets = [
  { id: "ID-98250", titre: "Panne serveur principal", service: "Informatique", priorite: "urgent", statut: "cours",   date: "20/04/2026", assign: "Karim A." },
  { id: "ID-98110", titre: "Remboursement médical",   service: "RH",           priorite: "normal", statut: "attente", date: "19/04/2026", assign: "Sarah L." },
  { id: "ID-97904", titre: "Livraison manquante",     service: "Logistique",   priorite: "normal", statut: "resolu",  date: "18/04/2026", assign: "Zakaria A." },
  { id: "ID-97800", titre: "Accès refusé CRM",        service: "Informatique", priorite: "urgent", statut: "cours",   date: "17/04/2026", assign: "Karim A." },
  { id: "ID-97650", titre: "Facture incorrecte",      service: "Finance",      priorite: "normal", statut: "attente", date: "16/04/2026", assign: "Aya S." },
  { id: "ID-97500", titre: "Climatisation en panne",  service: "Maintenance",  priorite: "normal", statut: "resolu",  date: "15/04/2026", assign: "Omar A." },
  { id: "ID-97300", titre: "Problème imprimante",     service: "Informatique", priorite: "normal", statut: "resolu",  date: "14/04/2026", assign: "Sarah L." },
];

const statutLabel = { urgent: "Urgent", cours: "En cours", resolu: "Résolu", attente: "En attente" };

// ── Users data ────────────────────────────────────────────
const users = [
  { initials: "AA", name: "Ahmed Ataki",    email: "ahmed@bayan.fr",   role: "admin", color: "#4F46E5" },
  { initials: "KA", name: "Karim Alami",    email: "karim@bayan.fr",   role: "resp",  color: "#10B981" },
  { initials: "SL", name: "Sarah Lemarié",  email: "sarah@bayan.fr",   role: "emp",   color: "#F59E0B" },
  { initials: "ZA", name: "Zakaria Achraf", email: "zakaria@bayan.fr", role: "emp",   color: "#8B5CF6" },
  { initials: "AS", name: "Aya Saïl",       email: "aya@bayan.fr",     role: "resp",  color: "#EC4899" },
  { initials: "OM", name: "Omar Almsaddek", email: "omar@bayan.fr",    role: "emp",   color: "#0EA5E9" },
];

const roleLabel = { admin: "Admin", resp: "Responsable", emp: "Employé" };

// ── Toggle component ──────────────────────────────────────
const Toggle = ({ init = true }) => {
  const [on, setOn] = useState(init);
  return <button className={`toggle ${on ? "on" : "off"}`} onClick={() => setOn(!on)} />;
};

// ── DASHBOARD PAGE ────────────────────────────────────────
const DashboardPage = () => (
  <div>
    <div className="stat-cards">
      {[
        { label: "TOTAL DES RÉCLAMATIONS", value: "1,284", badge: "+12%", type: "up" },
        { label: "EN ATTENTE",             value: "420",   badge: "+5%",  type: "up" },
        { label: "EN COURS",               value: "156",   badge: "-2%",  type: "down" },
        { label: "RÉSOLUES",               value: "688",   badge: "+18%", type: "up" },
        { label: "URGENTES",               value: "20",    badge: "— 0%", type: "neutral", urgent: true },
      ].map((s) => (
        <div key={s.label} className={`stat-card${s.urgent ? " urgent" : ""}`}>
          <div className="stat-label">{s.label}</div>
          <div className="stat-value">{s.value}</div>
          <div className={`stat-badge ${s.type}`}>{s.badge}</div>
        </div>
      ))}
    </div>

    <div className="charts-row">
      <div className="chart-card">
        <div className="chart-title">Réclamations par mois</div>
        <BarChart />
      </div>
      <div className="chart-card">
        <div className="chart-title">Répartition par service</div>
        <Donut />
      </div>
    </div>

    <div className="bottom-row">
      <div className="chart-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
          <div className="chart-title" style={{ marginBottom: 0 }}>Top Intervenants</div>
          <span style={{ fontSize: 10.5, color: "#4F46E5", fontWeight: 600, letterSpacing: 0.4, cursor: "pointer" }}>DÉTAILS DE PERFORMANCE</span>
        </div>
        {intervenants.map((i) => (
          <div className="intervenant-row" key={i.name}>
            <span className={`rank${i.rank === "🏆" ? " gold" : ""}`}>{i.rank}</span>
            <div className="int-avatar" style={{ background: i.color }}>{i.initials}</div>
            <div>
              <div className="int-name">{i.name}</div>
              <div className="int-role">{i.role}</div>
            </div>
            <div className="int-right">
              <div className="int-pct">Résolution {i.pct}%</div>
              <div className="prog-bar-bg">
                <div className="prog-bar-fill" style={{ width: `${i.pct}%` }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="chart-card">
        <div className="chart-title">Activité récente</div>
        {activities.map((a, idx) => (
          <div className="activity-item" key={idx}>
            <div className="act-icon" style={{ background: a.bg }}>{a.icon}</div>
            <div>
              <div className="act-text">{a.text}</div>
              <div className="act-time">{a.time}</div>
            </div>
          </div>
        ))}
        <button className="btn-voir-tout">VOIR TOUTES LES NOTIFICATIONS</button>
      </div>
    </div>
  </div>
);

// ── STATISTIQUES PAGE ─────────────────────────────────────
const StatistiquesPage = () => (
  <div className="stats-grid">
    {[
      { title: "Taux de résolution", value: "53.6%", sub: "688 résolues sur 1,284" },
      { title: "Délai moyen de résolution", value: "24h", sub: "En amélioration de 8% ce mois" },
      { title: "Satisfaction globale", value: "98%", sub: "Basé sur 890 évaluations" },
      { title: "Tickets traités aujourd'hui", value: "47", sub: "+12 par rapport à hier" },
    ].map((s) => (
      <div className="stats-big-card" key={s.title}>
        <div className="stat-label">{s.title}</div>
        <div className="stat-value" style={{ fontSize: 36, margin: "10px 0 6px" }}>{s.value}</div>
        <div style={{ fontSize: 12, color: "#9CA3AF" }}>{s.sub}</div>
      </div>
    ))}
    <div className="stats-big-card" style={{ gridColumn: "1 / -1" }}>
      <div className="chart-title">Réclamations par mois — Détail complet</div>
      <BarChart />
    </div>
    <div className="stats-big-card" style={{ gridColumn: "1 / -1" }}>
      <div className="chart-title">Répartition par service</div>
      <Donut />
    </div>
  </div>
);

// ── UTILISATEURS PAGE ─────────────────────────────────────
const UtilisateursPage = () => (
  <div className="chart-card">
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
      <div className="chart-title" style={{ marginBottom: 0 }}>Tous les utilisateurs</div>
      <button className="btn-save" style={{ marginTop: 0, padding: "8px 16px", fontSize: 12 }}>+ Ajouter</button>
    </div>
    {users.map((u) => (
      <div className="user-row" key={u.email}>
        <div className="ur-avatar" style={{ background: u.color }}>{u.initials}</div>
        <div>
          <div className="ur-name">{u.name}</div>
          <div className="ur-email">{u.email}</div>
        </div>
        <span className={`ur-role-badge ${u.role}`} style={{ marginLeft: "auto" }}>{roleLabel[u.role]}</span>
      </div>
    ))}
  </div>
);

// ── PARAMÈTRES PAGE ───────────────────────────────────────
const ParametresPage = () => (
  <div>
    {[
      {
        title: "Notifications",
        items: [
          { label: "Alertes email", sub: "Recevoir les alertes par email", init: true },
          { label: "Notifications push", sub: "Activer les notifications navigateur", init: false },
          { label: "Rapport hebdomadaire", sub: "Résumé chaque lundi matin", init: true },
        ]
      },
      {
        title: "Sécurité",
        items: [
          { label: "Authentification 2FA", sub: "Sécuriser l'accès par double authentification", init: true },
          { label: "Session auto-déconnexion", sub: "Après 30 minutes d'inactivité", init: false },
        ]
      },
      {
        title: "Système",
        items: [
          { label: "Mode sombre", sub: "Interface en thème sombre", init: false },
          { label: "Logs d'audit", sub: "Enregistrer toutes les actions admin", init: true },
        ]
      }
    ].map((section) => (
      <div className="chart-card" key={section.title} style={{ marginBottom: 18 }}>
        <div className="param-section-title">{section.title}</div>
        {section.items.map((item) => (
          <div className="param-row" key={item.label}>
            <div>
              <div className="param-label">{item.label}</div>
              <div className="param-sub">{item.sub}</div>
            </div>
            <Toggle init={item.init} />
          </div>
        ))}
      </div>
    ))}
    <button className="btn-save">Enregistrer les modifications</button>
  </div>
);

// ── TICKETS PAGE ──────────────────────────────────────────
const TicketsPage = () => (
  <div className="chart-card" style={{ overflowX: "auto" }}>
    <div className="chart-title">Toutes les réclamations</div>
    <table className="tickets-table">
      <thead>
        <tr>
          <th>ID</th><th>Titre</th><th>Service</th><th>Priorité</th><th>Statut</th><th>Date</th><th>Assigné</th>
        </tr>
      </thead>
      <tbody>
        {tickets.map((t) => (
          <tr key={t.id}>
            <td style={{ fontFamily: "monospace", fontSize: 11.5, color: "#9CA3AF" }}>{t.id}</td>
            <td style={{ fontWeight: 500, color: "#111827" }}>{t.titre}</td>
            <td>{t.service}</td>
            <td><span className={`tick-badge ${t.priorite === "urgent" ? "urgent" : "cours"}`}>{t.priorite}</span></td>
            <td><span className={`tick-badge ${t.statut}`}>{statutLabel[t.statut]}</span></td>
            <td>{t.date}</td>
            <td>{t.assign}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// ── NAV ITEMS ─────────────────────────────────────────────
const navItems = [
  {
    key: "dashboard", label: "Tableau de bord",
    icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.7"/><rect x="9" y="1" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.4"/><rect x="1" y="9" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.4"/><rect x="9" y="9" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.7"/></svg>
  },
  {
    key: "tickets", label: "Réclamations",
    icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 4h12M2 8h8M2 12h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
  },
  {
    key: "stats", label: "Statistiques",
    icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="8" width="3" height="7" rx="1" fill="currentColor" opacity="0.5"/><rect x="6" y="4" width="3" height="11" rx="1" fill="currentColor" opacity="0.7"/><rect x="11" y="1" width="3" height="14" rx="1" fill="currentColor"/></svg>
  },
  {
    key: "users", label: "Utilisateurs",
    icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="6" cy="5" r="3" stroke="currentColor" strokeWidth="1.5"/><path d="M1 13c0-2.761 2.239-5 5-5s5 2.239 5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M11 7c1.657 0 3 1.343 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
  },
  {
    key: "params", label: "Paramètres",
    icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.5"/><path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.05 3.05l1.414 1.414M11.536 11.536l1.414 1.414M3.05 12.95l1.414-1.414M11.536 4.464l1.414-1.414" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
  },
];

const pageTitles = {
  dashboard: "Gestion des Réclamations",
  tickets:   "Toutes les Réclamations",
  stats:     "Statistiques",
  users:     "Utilisateurs",
  params:    "Paramètres",
};

// ── MAIN EXPORT ───────────────────────────────────────────
export default function Dashboard() {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState("dashboard");

  const renderPage = () => {
    switch (activePage) {
      case "dashboard": return <DashboardPage />;
      case "tickets":   return <TicketsPage />;
      case "stats":     return <StatistiquesPage />;
      case "users":     return <UtilisateursPage />;
      case "params":    return <ParametresPage />;
      default:          return <DashboardPage />;
    }
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="dash-layout">

        {/* SIDEBAR */}
        <aside className="sidebar">
          <Logo />
          <nav className="sidebar-nav">
            {navItems.map((item) => (
              <button
                key={item.key}
                className={`nav-item${activePage === item.key ? " active" : ""}`}
                onClick={() => setActivePage(item.key)}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>
          <div className="sidebar-user">
            <div className="user-avatar">AA</div>
            <div>
              <div className="user-name">Ahmed Ataki</div>
              <div className="user-role">Enterprise Admin</div>
            </div>
          </div>
        </aside>

        {/* MAIN */}
        <div className="main-content">
          <header className="topbar">
            <div className="topbar-title">{pageTitles[activePage]}</div>
            <div className="search-bar">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="6" cy="6" r="4.5" stroke="#9CA3AF" strokeWidth="1.4"/>
                <path d="M9.5 9.5L12 12" stroke="#9CA3AF" strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
              <input placeholder="Rechercher une réclamation..." />
            </div>
            <div className="topbar-icons">
              <button className="icon-btn">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1.5a5 5 0 015 5v2.5l1 2H1l1-2V6.5a5 5 0 015-5z" stroke="#6B7280" strokeWidth="1.4"/><path d="M6.5 13.5a1.5 1.5 0 003 0" stroke="#6B7280" strokeWidth="1.4"/></svg>
                <span className="notif-dot" />
              </button>
              <button className="icon-btn">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke="#6B7280" strokeWidth="1.4"/><path d="M8 5v3.5l2 1" stroke="#6B7280" strokeWidth="1.4" strokeLinecap="round"/></svg>
              </button>
              <button
                className="icon-btn"
                onClick={() => navigate("/")}
                title="Déconnexion"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 14H3a1 1 0 01-1-1V3a1 1 0 011-1h3M10 11l3-3-3-3M13 8H6" stroke="#6B7280" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </div>
          </header>

          <div className="page-body">
            {renderPage()}
          </div>
        </div>
      </div>
    </>
  );
}