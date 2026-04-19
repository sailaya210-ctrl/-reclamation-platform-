import { useState } from "react";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'DM Sans', sans-serif; background: #F4F5FA; color: #0F1117; }

  .navbar {
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 48px; height: 60px;
    background: rgba(255,255,255,0.88);
    backdrop-filter: blur(14px);
    border-bottom: 1px solid rgba(0,0,0,0.06);
    position: sticky; top: 0; z-index: 100;
  }
  .nav-link {
    font-size: 13.5px; font-weight: 400; color: #6B7280;
    text-decoration: none; transition: color 0.2s; letter-spacing: 0.01em;
  }
  .nav-link.active { color: #0F1117; font-weight: 500; }
  .nav-link:hover { color: #0F1117; }
  .btn-connect {
    background: none; border: 1px solid #D1D5DB; border-radius: 8px;
    padding: 7px 16px; font-size: 13px; color: #374151; cursor: pointer;
    font-family: 'DM Sans', sans-serif; transition: border-color 0.2s;
  }
  .btn-connect:hover { border-color: #9CA3AF; background: #F9FAFB; }
  .btn-primary-nav {
    background: #1C1C2E; color: #fff; border: none; border-radius: 8px;
    padding: 8px 16px; font-size: 13px; cursor: pointer;
    font-family: 'DM Sans', sans-serif; font-weight: 500;
    transition: background 0.2s;
  }
  .btn-primary-nav:hover { background: #2D2D44; }

  /* Hero */
  .hero {
    margin: 28px 48px;
    background: #fff;
    border-radius: 22px;
    border: 1px solid rgba(0,0,0,0.06);
    padding: 54px 56px 50px;
    display: flex; align-items: center; justify-content: space-between; gap: 40px;
    position: relative; overflow: hidden;
  }
  .hero::after {
    content: '';
    position: absolute; top: -100px; right: -60px;
    width: 340px; height: 340px;
    background: radial-gradient(circle, rgba(79,70,229,0.05) 0%, transparent 65%);
    border-radius: 50%; pointer-events: none;
  }
  .hero-badge {
    display: inline-flex; align-items: center; gap: 6px;
    background: #F0F0FF; border: 1px solid #C7C5FF;
    border-radius: 6px; padding: 5px 11px;
    font-size: 10.5px; font-weight: 600; color: #4F46E5;
    letter-spacing: 0.7px; text-transform: uppercase; margin-bottom: 22px;
  }
  .badge-dot { width: 6px; height: 6px; border-radius: 50%; background: #4F46E5; }
  h1.hero-title {
    font-family: 'Sora', sans-serif;
    font-size: 50px; font-weight: 800;
    line-height: 1.07; letter-spacing: -1.8px; color: #0F1117;
  }
  h1.hero-title .blue { color: #4F46E5; }
  .hero-desc { font-size: 14px; color: #6B7280; line-height: 1.78; max-width: 365px; margin-top: 18px; }
  .hero-ctas { display: flex; gap: 10px; margin-top: 28px; }
  .btn-cta-main {
    background: #4F46E5; color: #fff; border: none; border-radius: 9px;
    padding: 12px 22px; font-size: 13.5px; font-weight: 600; cursor: pointer;
    font-family: 'Sora', sans-serif; transition: background 0.2s, transform 0.1s;
  }
  .btn-cta-main:hover { background: #4338CA; }
  .btn-cta-main:active { transform: scale(0.98); }
  .btn-cta-sec {
    background: #F9FAFB; color: #374151; border: 1px solid #E5E7EB;
    border-radius: 9px; padding: 12px 22px; font-size: 13.5px;
    font-weight: 400; cursor: pointer; font-family: 'DM Sans', sans-serif;
    transition: border-color 0.2s;
  }
  .btn-cta-sec:hover { border-color: #9CA3AF; }
  .hero-stats { display: flex; gap: 36px; margin-top: 36px; }
  .stat-num { font-family: 'Sora', sans-serif; font-size: 22px; font-weight: 700; color: #0F1117; letter-spacing: -0.5px; }
  .stat-lbl { font-size: 10px; color: #B0B7C3; font-weight: 500; letter-spacing: 0.9px; margin-top: 2px; text-transform: uppercase; }

  /* 3D TICKET SCENE */
  .tickets-scene {
    perspective: 900px;
    min-width: 290px;
    position: relative;
    height: 290px;
    flex-shrink: 0;
  }
  .tcard {
    position: absolute;
    width: 268px;
    background: #fff;
    border-radius: 15px;
    border: 1px solid rgba(0,0,0,0.08);
    padding: 17px 19px;
    transform-style: preserve-3d;
    transition: transform 0.4s ease;
  }
  .tcard.card1 {
    top: 0; left: 12px; z-index: 2;
    box-shadow: 0 2px 4px rgba(0,0,0,0.04), 0 8px 28px rgba(0,0,0,0.09), 0 22px 55px rgba(0,0,0,0.06);
    transform: rotateX(5deg) rotateY(-7deg) rotateZ(-1deg);
  }
  .tcard.card1:hover { transform: rotateX(2deg) rotateY(-3deg) rotateZ(0deg) translateY(-5px); }
  .tcard.card2 {
    top: 138px; left: 0; z-index: 1;
    box-shadow: 0 2px 4px rgba(0,0,0,0.03), 0 6px 20px rgba(0,0,0,0.06);
    transform: rotateX(3deg) rotateY(-4deg) rotateZ(1deg);
    background: #FAFAFA;
  }
  .tid { font-size: 10px; color: #B0B7C3; font-family: monospace; font-weight: 500; letter-spacing: 0.3px; }
  .tbadge {
    font-size: 8.5px; font-weight: 700; letter-spacing: 0.5px;
    padding: 3px 7px; border-radius: 4px; text-transform: uppercase;
  }
  .tbadge.red { background: #FEE2E2; color: #DC2626; }
  .tbadge.green { background: #D1FAE5; color: #059669; }
  .ttitle { font-family: 'Sora', sans-serif; font-size: 13px; font-weight: 600; color: #111827; margin: 8px 0 3px; }
  .tsub { font-size: 10.5px; color: #B0B7C3; }
  .tdivider { height: 1px; background: #F3F4F6; margin: 10px 0; }
  .tstatus { display: flex; align-items: center; gap: 5px; }
  .sdot { width: 7px; height: 7px; border-radius: 50%; }
  .sdot.yellow { background: #F59E0B; }
  .sdot.green { background: #10B981; }
  .progress-wrap { margin-top: 10px; }
  .progress-header { display: flex; justify-content: space-between; margin-bottom: 5px; }
  .progress-lbl { font-size: 10px; color: #B0B7C3; }
  .progress-pct { font-size: 10px; color: #4F46E5; font-weight: 600; }
  .pbar-bg { height: 4px; background: #F0F0FF; border-radius: 99px; overflow: hidden; }
  .pbar-fill { height: 4px; background: linear-gradient(90deg, #4F46E5, #818CF8); border-radius: 99px; }
  .tavatars { display: flex; align-items: center; margin-top: 12px; }
  .tav {
    width: 24px; height: 24px; border-radius: 50%; border: 2.5px solid #fff;
    margin-left: -7px; display: flex; align-items: center; justify-content: center;
    font-size: 8.5px; font-weight: 700; color: #fff;
  }
  .tav:first-child { margin-left: 0; }
  .tav-label { font-size: 10px; color: #B0B7C3; margin-left: 8px; }
  .resolved-row { display: flex; align-items: center; gap: 7px; }
  .resolved-icon {
    width: 19px; height: 19px; border-radius: 50%; background: #D1FAE5;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .resolved-text { font-size: 12px; color: #059669; font-weight: 500; }

  /* Stats bar */
  .stats-bar {
    background: #1C1C2E; margin: 0 48px; border-radius: 18px;
    padding: 30px 0; display: grid; grid-template-columns: repeat(4,1fr);
  }
  .sbar-item { text-align: center; border-right: 1px solid rgba(255,255,255,0.07); padding: 0 20px; }
  .sbar-item:last-child { border-right: none; }
  .sbar-num { font-family: 'Sora', sans-serif; font-size: 30px; font-weight: 700; color: #fff; letter-spacing: -0.8px; }
  .sbar-lbl { font-size: 10px; color: rgba(255,255,255,0.35); font-weight: 500; letter-spacing: 1px; margin-top: 5px; text-transform: uppercase; }

  /* Features */
  .feat-section { padding: 64px 48px 56px; }
  .feat-heading { text-align: center; margin-bottom: 44px; }
  .feat-heading h2 { font-family: 'Sora', sans-serif; font-size: 30px; font-weight: 700; color: #0F1117; letter-spacing: -0.6px; }
  .feat-accent { width: 32px; height: 3px; background: #4F46E5; border-radius: 2px; margin: 12px auto 0; }
  .feat-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 20px; }
  .fcard {
    background: #fff; border-radius: 17px; padding: 28px 26px;
    border: 1px solid rgba(0,0,0,0.06); position: relative;
    transition: transform 0.22s, box-shadow 0.22s;
  }
  .fcard:hover { transform: translateY(-3px); box-shadow: 0 14px 44px rgba(0,0,0,0.08); }
  .fcard.featured { border: 2px solid #4F46E5; }
  .ftag {
    position: absolute; top: -12px; left: 50%; transform: translateX(-50%);
    background: #4F46E5; color: #fff; font-size: 9px; font-weight: 700;
    letter-spacing: 0.8px; padding: 4px 13px; border-radius: 20px;
    white-space: nowrap; text-transform: uppercase;
  }
  .ficon {
    width: 42px; height: 42px; border-radius: 11px;
    display: flex; align-items: center; justify-content: center;
    font-size: 19px; margin-bottom: 16px;
  }
  .ficon.blue { background: #EEF2FF; }
  .ficon.orange { background: #FFF7ED; }
  .fname { font-family: 'Sora', sans-serif; font-size: 15px; font-weight: 600; color: #111827; margin-bottom: 10px; }
  .fdesc { font-size: 13px; color: #6B7280; line-height: 1.65; margin-bottom: 16px; }
  .fcheck { display: flex; align-items: center; gap: 7px; margin-bottom: 7px; }
  .fcheck-icon {
    width: 15px; height: 15px; border-radius: 50%; background: #EEF2FF;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .fcheck-text { font-size: 12.5px; color: #374151; }

  /* Footer */
  .footer {
    border-top: 1px solid #E5E7EB; padding: 20px 48px;
    display: flex; justify-content: space-between; align-items: center;
    background: #fff;
  }
  .footer a { font-size: 11.5px; color: #9CA3AF; text-decoration: none; }
  .footer a:hover { color: #6B7280; }
  .footer-copy { font-size: 11.5px; color: #9CA3AF; }
`;

// ── Logo ───────────────────────────────────────────────────────────────────
const Logo = () => (
  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <rect width="28" height="28" rx="8" fill="#4F46E5" />
      <path d="M8 14C8 10.686 10.686 8 14 8C17.314 8 20 10.686 20 14C20 17.314 17.314 20 14 20"
        stroke="white" strokeWidth="1.9" strokeLinecap="round" />
      <circle cx="14" cy="20" r="1.6" fill="white" />
    </svg>
    <span style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 15.5, color: "#0F1117", letterSpacing: "-0.3px" }}>
      Bayan
    </span>
  </div>
);

// ── Ticket Scene ───────────────────────────────────────────────────────────
const TicketScene = () => (
  <div className="tickets-scene">
    {/* Card 1 — IT incident */}
    <div className="tcard card1">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span className="tid">VCL-6892</span>
        <span className="tbadge red">Priorité urgente</span>
      </div>
      <div className="ttitle">Panne serveur – Service IT</div>
      <div className="tsub">Signalé il y a 14 min · José M.</div>
      <div className="tdivider" />
      <div className="tstatus">
        <div className="sdot yellow" />
        <span style={{ fontSize: 11, color: "#9CA3AF" }}>En cours de traitement</span>
      </div>
      <div className="progress-wrap">
        <div className="progress-header">
          <span className="progress-lbl">Progression</span>
          <span className="progress-pct">48%</span>
        </div>
        <div className="pbar-bg"><div className="pbar-fill" style={{ width: "48%" }} /></div>
      </div>
      <div className="tavatars">
        {[["#4F46E5","JM"],["#10B981","AR"],["#F59E0B","KL"]].map(([bg,txt],i) => (
          <div key={i} className="tav" style={{ background: bg }}>{txt}</div>
        ))}
        <span className="tav-label">3 assignés</span>
      </div>
    </div>

    {/* Card 2 — Medical */}
    <div className="tcard card2">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span className="tid">RC-3921</span>
        <span className="tbadge green">Résolu</span>
      </div>
      <div className="ttitle">Remboursement Médical</div>
      <div className="tsub">Clôturé aujourd'hui · Admin RH</div>
      <div className="tdivider" />
      <div className="resolved-row">
        <div className="resolved-icon">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M2 5L4 7L8 3" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <span className="resolved-text">Remboursement validé</span>
      </div>
    </div>
  </div>
);

const Check = () => (
  <div className="fcheck-icon">
    <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
      <path d="M1.5 4L3.2 5.7L6.5 2.3" stroke="#4F46E5" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </div>
);

const features = [
  {
    icon: "⚡", cls: "blue", name: "Saisie ultra-rapide",
    desc: "Déposez une réclamation en moins de 30 secondes grâce à nos formulaires intelligents pré-remplis.",
    checks: ["Champs dynamiques","Pièces jointes illimitées"],
    featured: false, tag: null,
  },
  {
    icon: "📊", cls: "blue", name: "Analytics Prédictifs",
    desc: "Identifiez les goulots d'étranglement avant qu'ils ne surviennent grâce à notre IA d'analyse.",
    checks: ["Rapports automatiques","Exportation CSV/PDF"],
    featured: true, tag: "LE + UTILISÉ",
  },
  {
    icon: "👥", cls: "orange", name: "Collaboration d'Équipe",
    desc: "Assignez, commentez et résolvez des tickets en équipe sans jamais quitter la plateforme.",
    checks: ["Mentions @équipe","Historique complet"],
    featured: false, tag: null,
  },
];

export default function Accueil() {
  return (
    <>
      <style>{CSS}</style>

      {/* Navbar */}
      <nav className="navbar">
        <Logo />
        <div style={{ display: "flex", gap: 30, alignItems: "center" }}>
          {["Accueil","Fonctionnalités","À propos"].map((item, i) => (
            <a key={item} href="#" className={`nav-link${i === 0 ? " active" : ""}`}>{item}</a>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn-connect">Se connecter</button>
          <button className="btn-primary-nav">Déposer une réclamation</button>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="hero-badge">
            <div className="badge-dot" />
            Plateforme Interne d'Entreprise
          </div>
          <h1 className="hero-title">
            Signalez. Suivez.<br />
            <span className="blue">Résolvez.</span>
          </h1>
          <p className="hero-desc">
            Optimisez la gestion de vos incidents internes avec une interface intuitive.
            Transformez chaque réclamation en une opportunité d'amélioration opérationnelle.
          </p>
          <div className="hero-ctas">
            <button className="btn-cta-main">Déposer une réclamation</button>
            <button className="btn-cta-sec">Voir la démo</button>
          </div>
          <div className="hero-stats">
            {[["99.9%","UPTIME"],["24h","DÉLAI MOYEN"],["15k+","TICKETS/MOIS"]].map(([v,l]) => (
              <div key={l}>
                <div className="stat-num">{v}</div>
                <div className="stat-lbl">{l}</div>
              </div>
            ))}
          </div>
        </div>
        <TicketScene />
      </section>

      <div style={{ height: 24 }} />

      {/* Stats bar */}
      <div className="stats-bar">
        {[["2.4k","UTILISATEURS ACTIFS"],["12min","TEMPS DE RÉPONSE"],["98%","SATISFACTION"],["400+","ÉQUIPES IT"]].map(([v,l]) => (
          <div className="sbar-item" key={l}>
            <div className="sbar-num">{v}</div>
            <div className="sbar-lbl">{l}</div>
          </div>
        ))}
      </div>

      {/* Features */}
      <section className="feat-section">
        <div className="feat-heading">
          <h2>Conçu pour l'efficacité opérationnelle</h2>
          <div className="feat-accent" />
        </div>
        <div className="feat-grid">
          {features.map((f) => (
            <div key={f.name} className={`fcard${f.featured ? " featured" : ""}`}>
              {f.tag && <div className="ftag">{f.tag}</div>}
              <div className={`ficon ${f.cls}`}>{f.icon}</div>
              <div className="fname">{f.name}</div>
              <p className="fdesc">{f.desc}</p>
              {f.checks.map((c) => (
                <div className="fcheck" key={c}>
                  <Check />
                  <span className="fcheck-text">{c}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <Logo />
        <p className="footer-copy">© 2026 Bayan. All rights reserved.</p>
        <div style={{ display: "flex", gap: 22 }}>
          {["Privacy Policy","Terms of Service","Cookie Policy","Security"].map((l) => (
            <a key={l} href="#">{l}</a>
          ))}
        </div>
      </footer>
    </>
  );
}
