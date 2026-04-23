import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// ── CSS ────────────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'DM Sans', sans-serif; background: #FAFAFA; color: #0F1117; }

  /* ── ACCENT COLOR (orange/amber — distingue l'intervenant de l'employé) ── */
  :root {
    --iv-accent:      #F97316;
    --iv-accent-dark: #EA580C;
    --iv-accent-bg:   #FFF7ED;
    --iv-accent-soft: #FFEDD5;
    --iv-accent-ring: rgba(249,115,22,0.15);
  }

  /* ── LAYOUT ── */
  .iv-layout { display: flex; min-height: 100vh; }

  /* ── SIDEBAR ── */
  .iv-sidebar { width: 220px; background: #fff; border-right: 1px solid rgba(0,0,0,0.06); display: flex; flex-direction: column; position: fixed; top: 0; left: 0; height: 100vh; z-index: 50; }
  .iv-sidebar-logo { display: flex; align-items: center; gap: 9px; padding: 20px 20px 16px; border-bottom: 1px solid rgba(0,0,0,0.06); }
  .iv-sidebar-logo span { font-family: 'Sora', sans-serif; font-weight: 700; font-size: 15.5px; color: #0F1117; letter-spacing: -0.3px; }
  .iv-sidebar-nav { flex: 1; padding: 14px 12px; display: flex; flex-direction: column; gap: 2px; overflow-y: auto; }
  .iv-nav-section { font-size: 9.5px; font-weight: 600; color: #B0B7C3; letter-spacing: 0.9px; text-transform: uppercase; padding: 10px 10px 4px; }
  .iv-nav-item { display: flex; align-items: center; gap: 10px; padding: 9px 12px; border-radius: 9px; cursor: pointer; font-size: 13.5px; color: #6B7280; font-weight: 400; transition: all 0.18s; border: none; background: none; width: 100%; text-align: left; font-family: 'DM Sans', sans-serif; }
  .iv-nav-item:hover { background: #F9FAFB; color: #0F1117; }
  .iv-nav-item.active { background: var(--iv-accent-bg); color: var(--iv-accent); font-weight: 500; }
  .iv-nav-badge { margin-left: auto; background: var(--iv-accent); color: #fff; font-size: 10px; font-weight: 700; border-radius: 99px; padding: 1px 7px; }

  /* ── RESTRICTED BANNER in sidebar ── */
  .iv-restricted-note { margin: 12px 12px 4px; background: #FFF7ED; border: 1px solid #FED7AA; border-radius: 9px; padding: 10px 11px; }
  .iv-restricted-title { font-size: 11px; font-weight: 600; color: #C2410C; margin-bottom: 3px; display: flex; align-items: center; gap: 5px; }
  .iv-restricted-text { font-size: 10.5px; color: #9A3412; line-height: 1.5; }

  .iv-sidebar-user { padding: 14px 16px; border-top: 1px solid rgba(0,0,0,0.06); display: flex; align-items: center; gap: 10px; }
  .iv-user-avatar { width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; color: #fff; flex-shrink: 0; }
  .iv-user-name { font-size: 13px; font-weight: 500; color: #0F1117; }
  .iv-user-role { font-size: 10px; color: var(--iv-accent); font-weight: 600; letter-spacing: 0.2px; }
  .iv-user-ext-badge { display: inline-flex; align-items: center; gap: 3px; font-size: 9px; font-weight: 700; color: #C2410C; background: #FFEDD5; border-radius: 4px; padding: 1px 5px; margin-top: 2px; letter-spacing: 0.3px; }

  /* ── MAIN ── */
  .iv-main { margin-left: 220px; flex: 1; display: flex; flex-direction: column; min-height: 100vh; }

  /* ── TOPBAR ── */
  .iv-topbar { height: 60px; background: #fff; border-bottom: 1px solid rgba(0,0,0,0.06); display: flex; align-items: center; justify-content: space-between; padding: 0 32px; position: sticky; top: 0; z-index: 40; }
  .iv-topbar-title { font-family: 'Sora', sans-serif; font-size: 18px; font-weight: 700; color: #0F1117; letter-spacing: -0.4px; }
  .iv-search-bar { display: flex; align-items: center; gap: 8px; background: #F4F5FA; border: 1.5px solid #E5E7EB; border-radius: 10px; padding: 8px 14px; width: 240px; transition: border-color 0.2s; }
  .iv-search-bar.focused { border-color: var(--iv-accent); box-shadow: 0 0 0 3px var(--iv-accent-ring); }
  .iv-search-bar input { background: none; border: none; outline: none; font-size: 13px; color: #0F1117; width: 100%; font-family: 'DM Sans', sans-serif; }
  .iv-search-bar input::placeholder { color: #9CA3AF; }
  .iv-topbar-right { display: flex; align-items: center; gap: 10px; }
  .iv-icon-btn { width: 36px; height: 36px; border-radius: 9px; border: 1px solid #E5E7EB; background: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center; position: relative; transition: background 0.15s; }
  .iv-icon-btn:hover { background: #F9FAFB; }
  .iv-notif-dot { position: absolute; top: -4px; right: -4px; width: 14px; height: 14px; border-radius: 50%; background: #EF4444; border: 2px solid #fff; font-size: 8px; font-weight: 700; color: #fff; display: flex; align-items: center; justify-content: center; }

  /* ── PAGE BODY ── */
  .iv-page-body { padding: 28px 32px; flex: 1; }

  /* ── STATS BAND ── */
  .iv-stats-band { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-bottom: 26px; }
  .iv-stat-card { background: #fff; border-radius: 12px; border: 1px solid rgba(0,0,0,0.06); padding: 16px 18px; display: flex; align-items: center; gap: 14px; }
  .iv-stat-icon { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; }
  .iv-stat-val { font-family: 'Sora', sans-serif; font-size: 22px; font-weight: 700; color: #0F1117; line-height: 1; }
  .iv-stat-label { font-size: 11.5px; color: #9CA3AF; margin-top: 3px; }

  /* ── FILTERS ── */
  .iv-filters { display: flex; align-items: center; gap: 8px; margin-bottom: 18px; flex-wrap: wrap; }
  .iv-filter-label { font-size: 12px; color: #6B7280; font-weight: 500; }
  .iv-filter-btn { padding: 6px 14px; border-radius: 99px; border: 1.5px solid #E5E7EB; background: #fff; font-size: 12px; cursor: pointer; font-family: 'DM Sans', sans-serif; color: #6B7280; transition: all 0.15s; }
  .iv-filter-btn:hover { border-color: var(--iv-accent); color: var(--iv-accent); }
  .iv-filter-btn.active { background: var(--iv-accent); color: #fff; border-color: var(--iv-accent); font-weight: 500; }

  /* ── RECLAMATION LIST (table style) ── */
  .iv-table-wrap { background: #fff; border-radius: 14px; border: 1px solid rgba(0,0,0,0.06); overflow: hidden; }
  .iv-table-head { display: grid; grid-template-columns: 100px 1fr 130px 100px 110px 130px; gap: 0; padding: 10px 20px; background: #F9FAFB; border-bottom: 1px solid #F3F4F6; }
  .iv-th { font-size: 10.5px; font-weight: 600; color: #9CA3AF; text-transform: uppercase; letter-spacing: 0.6px; }
  .iv-row { display: grid; grid-template-columns: 100px 1fr 130px 100px 110px 130px; gap: 0; padding: 14px 20px; border-bottom: 1px solid #F9FAFB; align-items: center; cursor: pointer; transition: background 0.12s; }
  .iv-row:last-child { border-bottom: none; }
  .iv-row:hover { background: #FFFBF7; }
  .iv-cell-id { font-family: monospace; font-size: 11px; color: #B0B7C3; }
  .iv-cell-title { font-size: 13px; font-weight: 500; color: #111827; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; padding-right: 16px; }
  .iv-cell-service { font-size: 12px; color: #6B7280; }
  .iv-cell-date { font-size: 11.5px; color: #B0B7C3; }
  .iv-pri-badge { display: inline-block; font-size: 9.5px; font-weight: 700; padding: 3px 7px; border-radius: 5px; text-transform: uppercase; }
  .iv-pri-badge.urgent  { background: #FEE2E2; color: #B91C1C; }
  .iv-pri-badge.haute   { background: #FEF3C7; color: #92400E; }
  .iv-pri-badge.normale { background: #EEF2FF; color: #4338CA; }
  .iv-pri-badge.faible  { background: #F3F4F6; color: #6B7280; }
  .iv-status-chip { display: inline-flex; align-items: center; gap: 5px; font-size: 11px; font-weight: 600; padding: 4px 9px; border-radius: 99px; }
  .iv-status-chip.attente { background: #F3F4F6; color: #4B5563; }
  .iv-status-chip.cours   { background: #FEF3C7; color: #92400E; }
  .iv-status-chip.resolu  { background: #D1FAE5; color: #065F46; }
  .iv-empty-table { padding: 48px 0; text-align: center; }
  .iv-empty-icon { font-size: 32px; margin-bottom: 10px; }
  .iv-empty-text { font-size: 13px; color: #9CA3AF; }

  /* ── DETAIL PANEL ── */
  .iv-detail-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.3); z-index: 400; display: flex; justify-content: flex-end; }
  .iv-detail-panel { width: 420px; background: #fff; height: 100%; overflow-y: auto; padding: 26px 22px; box-shadow: -8px 0 40px rgba(0,0,0,0.12); }
  .iv-detail-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px; }
  .iv-detail-id { font-family: monospace; font-size: 11px; color: #9CA3AF; }
  .iv-close-btn { width: 30px; height: 30px; border-radius: 8px; border: 1px solid #E5E7EB; background: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 16px; color: #6B7280; }
  .iv-close-btn:hover { background: #F4F5FA; }
  .iv-detail-title { font-family: 'Sora', sans-serif; font-size: 17px; font-weight: 700; color: #0F1117; margin: 10px 0 8px; }
  .iv-detail-badges { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 18px; }
  .iv-divider { height: 1px; background: #F3F4F6; margin: 14px 0; }
  .iv-detail-row { display: flex; justify-content: space-between; align-items: center; padding: 7px 0; }
  .iv-detail-key { font-size: 12px; color: #9CA3AF; }
  .iv-detail-val { font-size: 13px; color: #111827; font-weight: 500; }
  .iv-section-title { font-size: 13px; font-weight: 600; color: #0F1117; margin-bottom: 10px; }
  .iv-prog-bar { height: 6px; background: #F0F0F0; border-radius: 99px; overflow: hidden; margin-top: 6px; }
  .iv-prog-fill { height: 6px; border-radius: 99px; background: var(--iv-accent); transition: width 0.5s ease; }

  /* ── RÉSOUDRE BUTTON ── */
  .iv-resolve-btn { width: 100%; padding: 13px; background: var(--iv-accent); border: none; border-radius: 11px; font-size: 14px; font-weight: 700; cursor: pointer; font-family: 'Sora', sans-serif; color: #fff; display: flex; align-items: center; justify-content: center; gap: 8px; transition: background 0.2s, transform 0.1s; margin-bottom: 10px; }
  .iv-resolve-btn:hover { background: var(--iv-accent-dark); }
  .iv-resolve-btn:active { transform: scale(0.98); }
  .iv-resolve-btn:disabled { background: #D1D5DB; cursor: not-allowed; }
  .iv-inprogress-btn { width: 100%; padding: 11px; background: #FFF7ED; border: 1.5px solid #FED7AA; border-radius: 11px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: 'DM Sans', sans-serif; color: #C2410C; display: flex; align-items: center; justify-content: center; gap: 6px; transition: all 0.2s; }
  .iv-inprogress-btn:hover { background: #FFEDD5; }
  .iv-inprogress-btn:disabled { opacity: 0.35; cursor: not-allowed; }

  /* ── COMMENT BOX ── */
  .iv-comment-box { margin-top: 6px; background: #F9FAFB; border: 1.5px solid #E5E7EB; border-radius: 10px; padding: 10px 12px; }
  .iv-comment-box textarea { width: 100%; background: none; border: none; outline: none; font-size: 13px; font-family: 'DM Sans', sans-serif; color: #0F1117; resize: none; min-height: 72px; line-height: 1.55; }
  .iv-comment-box textarea::placeholder { color: #B0B7C3; }
  .iv-comment-submit { margin-top: 6px; padding: 7px 14px; background: var(--iv-accent); border: none; border-radius: 7px; font-size: 12px; font-weight: 600; cursor: pointer; font-family: 'Sora', sans-serif; color: #fff; float: right; transition: background 0.15s; }
  .iv-comment-submit:hover { background: var(--iv-accent-dark); }

  /* ── TIMELINE ── */
  .iv-tl-item { display: flex; gap: 10px; padding: 9px 0; border-bottom: 1px solid #F9FAFB; }
  .iv-tl-item:last-child { border-bottom: none; }
  .iv-tl-icon { width: 28px; height: 28px; border-radius: 8px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 13px; }
  .iv-tl-text { font-size: 12.5px; color: #374151; line-height: 1.5; }
  .iv-tl-text strong { color: #0F1117; }
  .iv-tl-time { font-size: 10.5px; color: #B0B7C3; margin-top: 2px; }

  /* ── PROFIL PAGE ── */
  .iv-profil-card { background: #fff; border-radius: 16px; border: 1px solid rgba(0,0,0,0.06); padding: 28px; max-width: 520px; }
  .iv-profil-header { display: flex; align-items: center; gap: 16px; margin-bottom: 22px; padding-bottom: 18px; border-bottom: 1px solid #F3F4F6; }
  .iv-profil-av { width: 56px; height: 56px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 17px; font-weight: 700; color: #fff; }
  .iv-profil-name { font-family: 'Sora', sans-serif; font-size: 17px; font-weight: 700; color: #0F1117; }
  .iv-profil-email { font-size: 12.5px; color: #9CA3AF; margin-top: 2px; }
  .iv-profil-badge { display: inline-block; font-size: 10px; font-weight: 600; padding: 3px 9px; border-radius: 5px; background: var(--iv-accent-soft); color: var(--iv-accent); margin-top: 5px; }
  .iv-profil-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #F9FAFB; }
  .iv-profil-row:last-child { border-bottom: none; }
  .iv-profil-key { font-size: 12.5px; color: #9CA3AF; }
  .iv-profil-val { font-size: 13px; font-weight: 500; color: #111827; }

  /* ── NOTIFICATION PANEL ── */
  .iv-notif-overlay { position: fixed; inset: 0; z-index: 300; }
  .iv-notif-panel { position: absolute; top: 52px; right: 16px; width: 330px; background: #fff; border-radius: 14px; border: 1px solid rgba(0,0,0,0.08); box-shadow: 0 12px 40px rgba(0,0,0,0.14); overflow: hidden; animation: ivNotifSlide 0.18s ease; }
  @keyframes ivNotifSlide { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }
  .iv-notif-head { display: flex; align-items: center; justify-content: space-between; padding: 14px 16px 10px; border-bottom: 1px solid #F3F4F6; }
  .iv-notif-title { font-family: 'Sora', sans-serif; font-size: 13.5px; font-weight: 700; color: #0F1117; }
  .iv-notif-mark-all { font-size: 11.5px; color: var(--iv-accent); font-weight: 500; background: none; border: none; cursor: pointer; font-family: 'DM Sans', sans-serif; }
  .iv-notif-mark-all:hover { text-decoration: underline; }
  .iv-notif-list { max-height: 320px; overflow-y: auto; }
  .iv-notif-item { display: flex; align-items: flex-start; gap: 10px; padding: 11px 15px; border-bottom: 1px solid #F9FAFB; cursor: pointer; transition: background 0.12s; position: relative; }
  .iv-notif-item:last-child { border-bottom: none; }
  .iv-notif-item:hover { background: #FFFBF7; }
  .iv-notif-item.unread { background: #FFFCF9; }
  .iv-notif-item.unread::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 3px; background: var(--iv-accent); border-radius: 0 2px 2px 0; }
  .iv-notif-icon { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 14px; flex-shrink: 0; }
  .iv-notif-text { font-size: 12.5px; color: #374151; line-height: 1.45; }
  .iv-notif-text strong { color: #0F1117; }
  .iv-notif-time { font-size: 10.5px; color: #B0B7C3; margin-top: 3px; }
  .iv-notif-dot-badge { width: 7px; height: 7px; border-radius: 50%; background: var(--iv-accent); flex-shrink: 0; margin-top: 5px; }
  .iv-notif-footer { padding: 10px 16px; border-top: 1px solid #F3F4F6; text-align: center; }
  .iv-notif-footer-btn { font-size: 12px; color: var(--iv-accent); font-weight: 500; background: none; border: none; cursor: pointer; font-family: 'DM Sans', sans-serif; }

  /* ── CONFIRM MODAL ── */
  .iv-confirm-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 600; display: flex; align-items: center; justify-content: center; }
  .iv-confirm-box { background: #fff; border-radius: 16px; padding: 28px 26px; width: 360px; box-shadow: 0 20px 60px rgba(0,0,0,0.16); text-align: center; }
  .iv-confirm-icon { width: 52px; height: 52px; border-radius: 14px; background: var(--iv-accent-soft); display: flex; align-items: center; justify-content: center; margin: 0 auto 14px; font-size: 22px; }
  .iv-confirm-title { font-family: 'Sora', sans-serif; font-size: 16px; font-weight: 700; color: #0F1117; margin-bottom: 8px; }
  .iv-confirm-text { font-size: 12.5px; color: #9CA3AF; line-height: 1.6; margin-bottom: 22px; }
  .iv-confirm-id { font-family: monospace; font-size: 11px; background: #F4F5FA; color: #6B7280; padding: 2px 7px; border-radius: 4px; }
  .iv-confirm-btns { display: flex; gap: 10px; }
  .iv-confirm-cancel { flex: 1; padding: 11px; background: #F4F5FA; border: 1px solid #E5E7EB; border-radius: 9px; font-size: 13px; cursor: pointer; font-family: 'DM Sans', sans-serif; color: #374151; }
  .iv-confirm-cancel:hover { background: #E5E7EB; }
  .iv-confirm-ok { flex: 1; padding: 11px; background: var(--iv-accent); border: none; border-radius: 9px; font-size: 13px; font-weight: 700; cursor: pointer; font-family: 'Sora', sans-serif; color: #fff; }
  .iv-confirm-ok:hover { background: var(--iv-accent-dark); }

  /* ── TOAST ── */
  .iv-toast { position: fixed; bottom: 28px; right: 28px; background: #1C1C2E; color: #fff; padding: 12px 20px; border-radius: 10px; font-size: 13px; font-weight: 500; z-index: 999; box-shadow: 0 8px 28px rgba(0,0,0,0.2); display: flex; align-items: center; gap: 8px; animation: ivSlideUp 0.3s ease; }
  @keyframes ivSlideUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
`;

// ── DATA ───────────────────────────────────────────────────────────────────
// Réclamations affectées à cet intervenant (Khalid Amine)
const RECLAMATIONS_INIT = [
  {
    id: "ID-61876", titre: "Défaut de livraison majeur",
    service: "Logistique", cat: "Transporteur A", priorite: "haute",
    statut: "cours", date: "05 Nov 2023",
    description: "Plusieurs colis ont été livrés à la mauvaise adresse. Le client signale des erreurs répétées sur 3 livraisons consécutives.",
    affecteLe: "06 Nov 2023",
    timeline: [
      { icon: "🔵", bg: "#EEF2FF", text: <><strong>Réclamation créée</strong></>, time: "05 Nov 2023 – 08:00" },
      { icon: "👤", bg: "#FFF7ED", text: <><strong>Affectée à vous</strong> par Karim Alami</>, time: "06 Nov 2023 – 10:22" },
    ],
  },
  {
    id: "ID-88312", titre: "Mise à jour coordonnées fournisseur",
    service: "Technique", cat: "Info client", priorite: "normale",
    statut: "cours", date: "10 Nov 2023",
    description: "Les coordonnées du fournisseur principal doivent être mises à jour dans le système.",
    affecteLe: "11 Nov 2023",
    timeline: [
      { icon: "🔵", bg: "#EEF2FF", text: <><strong>Réclamation créée</strong></>, time: "10 Nov 2023 – 07:45" },
      { icon: "👤", bg: "#FFF7ED", text: <><strong>Affectée à vous</strong> par Aya Saïdi</>, time: "11 Nov 2023 – 09:10" },
    ],
  },
  {
    id: "ID-91045", titre: "Panne équipement réseau bureau C",
    service: "Technique", cat: "Maintenance", priorite: "urgent",
    statut: "attente", date: "15 Nov 2023",
    description: "L'équipement réseau du bureau C est en panne depuis ce matin. Impact sur 12 postes de travail.",
    affecteLe: "15 Nov 2023",
    timeline: [
      { icon: "🔵", bg: "#EEF2FF", text: <><strong>Réclamation créée</strong></>, time: "15 Nov 2023 – 07:30" },
      { icon: "👤", bg: "#FFF7ED", text: <><strong>Affectée à vous</strong> par Marc Lefebvre</>, time: "15 Nov 2023 – 08:15" },
    ],
  },
  {
    id: "ID-79544", titre: "Dysfonctionnement imprimante RDC",
    service: "Support IT", cat: "Matériel", priorite: "faible",
    statut: "resolu", date: "01 Nov 2023",
    description: "L'imprimante du rez-de-chaussée ne répond plus. Bourrage papier répété.",
    affecteLe: "02 Nov 2023",
    timeline: [
      { icon: "🔵", bg: "#EEF2FF", text: <><strong>Réclamation créée</strong></>, time: "01 Nov 2023 – 09:00" },
      { icon: "👤", bg: "#FFF7ED", text: <><strong>Affectée à vous</strong> par Marc Lefebvre</>, time: "02 Nov 2023 – 10:00" },
      { icon: "✅", bg: "#D1FAE5", text: <><strong>Résolue</strong> par vous — bourrage corrigé + rouleau remplacé</>, time: "03 Nov 2023 – 14:30" },
    ],
  },
];

const NOTIFS_INIT = [
  { id: 1, unread: true,  icon: "📋", bg: "#FFF7ED", text: <><strong>Réclamation ID-91045</strong> vient de vous être affectée</>,       time: "Il y a 10 min" },
  { id: 2, unread: true,  icon: "⚠️", bg: "#FEF3C7", text: <><strong>ID-61876</strong> est urgente — délai de résolution dépassé</>,      time: "Il y a 1h"     },
  { id: 3, unread: false, icon: "✅", bg: "#D1FAE5", text: <>Votre résolution sur <strong>ID-79544</strong> a été validée</>,             time: "03 Nov, 14:30" },
];

const statutLabel = { attente: "À traiter", cours: "En cours", resolu: "Résolu" };

function nowStr() {
  const d = new Date();
  const mois = ["Jan","Fév","Mar","Avr","Mai","Juin","Jul","Août","Sep","Oct","Nov","Déc"];
  return `${d.getDate().toString().padStart(2,"0")} ${mois[d.getMonth()]} ${d.getFullYear()} – ${d.getHours().toString().padStart(2,"0")}:${d.getMinutes().toString().padStart(2,"0")}`;
}

// ── LOGO ───────────────────────────────────────────────────────────────────
const Logo = () => (
  <div className="iv-sidebar-logo">
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <rect width="28" height="28" rx="8" fill="#F97316"/>
      <path d="M8 14C8 10.686 10.686 8 14 8C17.314 8 20 10.686 20 14C20 17.314 17.314 20 14 20"
        stroke="white" strokeWidth="1.9" strokeLinecap="round"/>
      <circle cx="14" cy="20" r="1.6" fill="white"/>
    </svg>
    <span>Bayan</span>
  </div>
);

// ── NOTIFICATION PANEL ─────────────────────────────────────────────────────
const NotifPanel = ({ notifs, onMarkAll, onMarkOne, onClose }) => {
  const unread = notifs.filter((n) => n.unread).length;
  return (
    <div className="iv-notif-overlay" onClick={onClose}>
      <div className="iv-notif-panel" onClick={(e) => e.stopPropagation()}>
        <div className="iv-notif-head">
          <div className="iv-notif-title">
            Notifications
            {unread > 0 && <span style={{ marginLeft:6, background:"#EF4444", color:"#fff", fontSize:10, fontWeight:700, borderRadius:99, padding:"1px 7px" }}>{unread}</span>}
          </div>
          {unread > 0 && <button className="iv-notif-mark-all" onClick={onMarkAll}>Tout lu</button>}
        </div>
        <div className="iv-notif-list">
          {notifs.map((n) => (
            <div key={n.id} className={`iv-notif-item${n.unread ? " unread" : ""}`} onClick={() => onMarkOne(n.id)}>
              <div className="iv-notif-icon" style={{ background: n.bg }}>{n.icon}</div>
              <div style={{ flex:1 }}>
                <div className="iv-notif-text">{n.text}</div>
                <div className="iv-notif-time">{n.time}</div>
              </div>
              {n.unread && <div className="iv-notif-dot-badge"/>}
            </div>
          ))}
        </div>
        <div className="iv-notif-footer">
          <button className="iv-notif-footer-btn" onClick={onClose}>Fermer</button>
        </div>
      </div>
    </div>
  );
};

// ── CONFIRM RESOLVE MODAL ──────────────────────────────────────────────────
const ConfirmResolve = ({ ticket, onCancel, onConfirm }) => (
  <div className="iv-confirm-overlay" onClick={(e) => e.target === e.currentTarget && onCancel()}>
    <div className="iv-confirm-box">
      <div className="iv-confirm-icon">✅</div>
      <div className="iv-confirm-title">Marquer comme résolue ?</div>
      <div className="iv-confirm-text">
        Confirmez-vous que la réclamation{" "}
        <span className="iv-confirm-id">{ticket.id}</span>{" "}
        a été <strong>entièrement résolue</strong> ? Cette action sera enregistrée dans l'historique.
      </div>
      <div className="iv-confirm-btns">
        <button className="iv-confirm-cancel" onClick={onCancel}>Annuler</button>
        <button className="iv-confirm-ok" onClick={() => onConfirm(ticket.id)}>Confirmer</button>
      </div>
    </div>
  </div>
);

// ── DETAIL PANEL ───────────────────────────────────────────────────────────
const DetailPanel = ({ ticket, onClose, onResolve, onInProgress }) => {
  const [comment, setComment] = useState("");

  const progVal = { attente: 10, cours: 55, resolu: 100 }[ticket.statut];

  return (
    <div className="iv-detail-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="iv-detail-panel">
        <div className="iv-detail-head">
          <span className="iv-detail-id">{ticket.id}</span>
          <button className="iv-close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="iv-detail-title">{ticket.titre}</div>
        <div className="iv-detail-badges">
          <span className={`iv-pri-badge ${ticket.priorite}`}>
            {ticket.priorite.charAt(0).toUpperCase() + ticket.priorite.slice(1)}
          </span>
          <span className={`iv-status-chip ${ticket.statut}`}>
            <span style={{ fontSize:8 }}>●</span> {statutLabel[ticket.statut]}
          </span>
        </div>

        {/* ── ACTION BUTTONS ── */}
        {ticket.statut !== "resolu" && (
          <>
            <button
              className="iv-resolve-btn"
              onClick={() => onResolve(ticket)}
            >
              ✅ Marquer comme résolue
            </button>
            <button
              className="iv-inprogress-btn"
              disabled={ticket.statut === "cours"}
              onClick={() => onInProgress(ticket.id)}
            >
              ▶ Passer en cours de traitement
            </button>
          </>
        )}
        {ticket.statut === "resolu" && (
          <div style={{ background:"#D1FAE5", border:"1px solid #A7F3D0", borderRadius:10, padding:"11px 14px", textAlign:"center", fontSize:13, color:"#065F46", fontWeight:500, marginBottom:6 }}>
            ✅ Cette réclamation est résolue
          </div>
        )}

        <div className="iv-divider"/>
        {[
          ["Service",     ticket.service],
          ["Catégorie",   ticket.cat],
          ["Date",        ticket.date],
          ["Affectée le", ticket.affecteLe],
        ].map(([k, v]) => (
          <div className="iv-detail-row" key={k}>
            <span className="iv-detail-key">{k}</span>
            <span className="iv-detail-val">{v}</span>
          </div>
        ))}

        <div style={{ marginTop: 10 }}>
          <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:"#9CA3AF", marginBottom:4 }}>
            <span>Avancement</span><span style={{ fontWeight:600, color:"#111827" }}>{progVal}%</span>
          </div>
          <div className="iv-prog-bar">
            <div className="iv-prog-fill" style={{ width:`${progVal}%` }}/>
          </div>
        </div>

        <div className="iv-divider"/>
        <div className="iv-section-title">Description</div>
        <p style={{ fontSize:13, color:"#374151", lineHeight:1.6, marginBottom:16 }}>{ticket.description}</p>

        {/* ── COMMENT ── */}
        {ticket.statut !== "resolu" && (
          <>
            <div className="iv-divider"/>
            <div className="iv-section-title">Ajouter un commentaire</div>
            <div className="iv-comment-box">
              <textarea
                placeholder="Décrivez l'avancement, les actions effectuées..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <button
                className="iv-comment-submit"
                disabled={!comment.trim()}
                onClick={() => {
                  if (!comment.trim()) return;
                  setComment("");
                }}
              >
                Envoyer
              </button>
              <div style={{ clear:"both" }}/>
            </div>
          </>
        )}

        <div className="iv-divider"/>
        <div className="iv-section-title">Historique</div>
        {ticket.timeline.map((item, i) => (
          <div className="iv-tl-item" key={i}>
            <div className="iv-tl-icon" style={{ background: item.bg }}>{item.icon}</div>
            <div>
              <div className="iv-tl-text">{item.text}</div>
              <div className="iv-tl-time">{item.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── MES RÉCLAMATIONS PAGE ──────────────────────────────────────────────────
const MesReclamationsPage = ({ reclamations, setReclamations, showToast }) => {
  const [filter,        setFilter]        = useState("toutes");
  const [searchQ,       setSearchQ]       = useState("");
  const [selected,      setSelected]      = useState(null);
  const [confirmTicket, setConfirmTicket] = useState(null);

  const filterFn = (r) => {
    if (filter === "atraiter") return r.statut === "attente";
    if (filter === "encours")  return r.statut === "cours";
    if (filter === "resolues") return r.statut === "resolu";
    if (filter === "urgentes") return r.priorite === "urgent";
    return true;
  };

  const displayed = reclamations.filter(
    (r) => filterFn(r) && (searchQ === "" || (r.titre + r.id + r.service).toLowerCase().includes(searchQ.toLowerCase()))
  );

  const handleInProgress = (id) => {
    setReclamations((prev) => prev.map((r) => r.id !== id || r.statut !== "attente" ? r : {
      ...r, statut: "cours",
      timeline: [...r.timeline, { icon: "▶️", bg: "#FFF7ED", text: <><strong>Prise en charge</strong> — en cours de traitement</>, time: nowStr() }],
    }));
    setSelected((prev) => prev?.id === id ? { ...prev, statut: "cours" } : prev);
    showToast("▶️ Réclamation passée en cours de traitement");
  };

  const handleResolve = (id) => {
    setReclamations((prev) => prev.map((r) => r.id !== id ? r : {
      ...r, statut: "resolu",
      timeline: [...r.timeline, { icon: "✅", bg: "#D1FAE5", text: <><strong>Résolue</strong> par vous</>, time: nowStr() }],
    }));
    setSelected(null);
    setConfirmTicket(null);
    showToast("✅ Réclamation marquée comme résolue !");
  };

  const counts = {
    total:    reclamations.length,
    encours:  reclamations.filter((r) => r.statut === "cours").length,
    resolues: reclamations.filter((r) => r.statut === "resolu").length,
  };

  return (
    <>
      {/* ── STATS ── */}
      <div className="iv-stats-band">
        {[
          { icon: "📋", bg: "#EEF2FF", val: counts.total,    label: "Total affectées"    },
          { icon: "⚙️", bg: "#FFF7ED", val: counts.encours,  label: "En cours"           },
          { icon: "✅", bg: "#D1FAE5", val: counts.resolues, label: "Résolues"           },
        ].map((s) => (
          <div className="iv-stat-card" key={s.label}>
            <div className="iv-stat-icon" style={{ background: s.bg }}>{s.icon}</div>
            <div>
              <div className="iv-stat-val">{s.val}</div>
              <div className="iv-stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── FILTERS ── */}
      <div className="iv-filters">
        <span className="iv-filter-label">Filtrer :</span>
        {[
          { key: "toutes",   label: "Toutes"     },
          { key: "atraiter", label: "À traiter"  },
          { key: "encours",  label: "En cours"   },
          { key: "resolues", label: "Résolues"   },
          { key: "urgentes", label: "Urgentes"   },
        ].map((f) => (
          <button key={f.key} className={`iv-filter-btn${filter === f.key ? " active" : ""}`} onClick={() => setFilter(f.key)}>
            {f.label}
          </button>
        ))}
        <div style={{ marginLeft:"auto" }}>
          <div className="iv-search-bar">
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
              <circle cx="6" cy="6" r="4.5" stroke="#9CA3AF" strokeWidth="1.4"/>
              <path d="M9.5 9.5L12 12" stroke="#9CA3AF" strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
            <input
              placeholder="Rechercher..."
              value={searchQ}
              onChange={(e) => setSearchQ(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* ── TABLE ── */}
      <div className="iv-table-wrap">
        <div className="iv-table-head">
          <div className="iv-th">ID</div>
          <div className="iv-th">Titre</div>
          <div className="iv-th">Service</div>
          <div className="iv-th">Priorité</div>
          <div className="iv-th">Statut</div>
          <div className="iv-th">Affectée le</div>
        </div>

        {displayed.length === 0 ? (
          <div className="iv-empty-table">
            <div className="iv-empty-icon">📭</div>
            <div className="iv-empty-text">Aucune réclamation trouvée</div>
          </div>
        ) : (
          displayed.map((r) => (
            <div className="iv-row" key={r.id} onClick={() => setSelected(r)}>
              <div className="iv-cell-id">{r.id}</div>
              <div className="iv-cell-title">{r.titre}</div>
              <div className="iv-cell-service">{r.service}</div>
              <div><span className={`iv-pri-badge ${r.priorite}`}>{r.priorite.charAt(0).toUpperCase()+r.priorite.slice(1)}</span></div>
              <div>
                <span className={`iv-status-chip ${r.statut}`}>
                  <span style={{ fontSize:8 }}>●</span> {statutLabel[r.statut]}
                </span>
              </div>
              <div className="iv-cell-date">{r.affecteLe}</div>
            </div>
          ))
        )}
      </div>

      {selected && (
        <DetailPanel
          ticket={selected}
          onClose={() => setSelected(null)}
          onResolve={(t) => setConfirmTicket(t)}
          onInProgress={handleInProgress}
        />
      )}

      {confirmTicket && (
        <ConfirmResolve
          ticket={confirmTicket}
          onCancel={() => setConfirmTicket(null)}
          onConfirm={handleResolve}
        />
      )}
    </>
  );
};

// ── PROFIL PAGE ────────────────────────────────────────────────────────────
const MonProfilPage = () => (
  <div className="iv-profil-card">
    <div className="iv-profil-header">
      <div className="iv-profil-av" style={{ background: "#F97316" }}>KA</div>
      <div>
        <div className="iv-profil-name">Khalid Amine</div>
        <div className="iv-profil-email">k.amine@prestataire-tech.ma</div>
        <div className="iv-profil-badge">Intervenant Externe</div>
      </div>
    </div>
    {[
      ["Société",         "Prestataire Tech Maroc"],
      ["Spécialité",      "Maintenance IT & Réseau"],
      ["Téléphone",       "+212 6 11 22 33 44"],
      ["Contrat",         "Prestation No. 2023-041"],
      ["Responsable",     "Marc Lefebvre (Support IT)"],
      ["Accès accordé",  "01 Oct 2023"],
    ].map(([k, v]) => (
      <div className="iv-profil-row" key={k}>
        <span className="iv-profil-key">{k}</span>
        <span className="iv-profil-val">{v}</span>
      </div>
    ))}

    {/* Droits */}
    <div style={{ marginTop:18, background:"#FFF7ED", border:"1px solid #FED7AA", borderRadius:10, padding:"13px 14px" }}>
      <div style={{ fontSize:11.5, fontWeight:700, color:"#C2410C", marginBottom:8 }}>🔒 Droits d'accès limités</div>
      {[
        ["✅","Consulter les réclamations affectées"],
        ["✅","Marquer une réclamation comme résolue"],
        ["✅","Ajouter des commentaires"],
        ["❌","Soumettre une nouvelle réclamation"],
        ["❌","Modifier ou supprimer des réclamations"],
        ["❌","Accéder aux réclamations non affectées"],
      ].map(([icon, label]) => (
        <div key={label} style={{ display:"flex", alignItems:"center", gap:8, fontSize:12.5, color: icon==="✅"?"#374151":"#9CA3AF", padding:"3px 0" }}>
          <span>{icon}</span><span>{label}</span>
        </div>
      ))}
    </div>
  </div>
);

// ── MAIN ───────────────────────────────────────────────────────────────────
export default function IntervenantDashboard() {
  const navigate = useNavigate();

  const [activePage,   setActivePage]   = useState("reclamations");
  const [reclamations, setReclamations] = useState(RECLAMATIONS_INIT);
  const [notifs,       setNotifs]       = useState(NOTIFS_INIT);
  const [showNotifs,   setShowNotifs]   = useState(false);
  const [toast,        setToast]        = useState(null);
  const toastTimer = useRef(null);

  const showToast = (msg) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2800);
  };

  const unreadCount = notifs.filter((n) => n.unread).length;

  const pageTitles = { reclamations: "Mes réclamations affectées", profil: "Mon profil" };

  const navItems = [
    {
      key: "reclamations", label: "Mes réclamations", section: "PRINCIPAL", badge: true,
      icon: <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="6" height="6" rx="1.5" fill="currentColor" opacity=".7"/><rect x="9" y="1" width="6" height="6" rx="1.5" fill="currentColor" opacity=".4"/><rect x="1" y="9" width="6" height="6" rx="1.5" fill="currentColor" opacity=".4"/><rect x="9" y="9" width="6" height="6" rx="1.5" fill="currentColor" opacity=".7"/></svg>,
    },
    {
      key: "profil", label: "Mon profil", section: "AUTRE",
      icon: <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.4"/><path d="M2 14c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
    },
  ];

  return (
    <>
      <style>{CSS}</style>
      <div className="iv-layout">

        {/* ── SIDEBAR ── */}
        <aside className="iv-sidebar">
          <Logo />
          <nav className="iv-sidebar-nav">
            {navItems.map((item) => (
              <div key={item.key}>
                {item.section && <div className="iv-nav-section">{item.section}</div>}
                <button
                  className={`iv-nav-item${activePage === item.key ? " active" : ""}`}
                  onClick={() => setActivePage(item.key)}
                >
                  {item.icon}
                  {item.label}
                  {item.badge && <span className="iv-nav-badge">{reclamations.filter(r=>r.statut!=="resolu").length}</span>}
                </button>
              </div>
            ))}
          </nav>

          {/* ── RESTRICTED NOTE ── */}
          <div className="iv-restricted-note">
            <div className="iv-restricted-title">
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                <circle cx="6" cy="6" r="5.5" stroke="#C2410C" strokeWidth="1.1"/>
                <path d="M6 3.5v3M6 8.5v.01" stroke="#C2410C" strokeWidth="1.3" strokeLinecap="round"/>
              </svg>
              Accès limité
            </div>
            <div className="iv-restricted-text">
              Vous êtes intervenant externe. Vous ne pouvez pas soumettre de réclamations.
            </div>
          </div>

          <div className="iv-sidebar-user">
            <div className="iv-user-avatar" style={{ background: "#F97316" }}>KA</div>
            <div>
              <div className="iv-user-name">Khalid Amine</div>
              <div className="iv-user-ext-badge">🔒 EXTERNE</div>
            </div>
          </div>
        </aside>

        {/* ── MAIN ── */}
        <div className="iv-main">
          <header className="iv-topbar">
            <div className="iv-topbar-title">{pageTitles[activePage]}</div>

            {/* Notification button */}
            <button className="iv-icon-btn" onClick={() => setShowNotifs((v) => !v)}>
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                <path d="M8 1.5a5 5 0 015 5v2.5l1 2H1l1-2V6.5a5 5 0 015-5z" stroke="#6B7280" strokeWidth="1.4"/>
                <path d="M6.5 13.5a1.5 1.5 0 003 0" stroke="#6B7280" strokeWidth="1.4"/>
              </svg>
              {unreadCount > 0 && <span className="iv-notif-dot">{unreadCount}</span>}
            </button>

            {/* Logout */}
            <button className="iv-icon-btn" onClick={() => navigate("/login")} title="Déconnexion">
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                <path d="M6 14H3a1 1 0 01-1-1V3a1 1 0 011-1h3M10 11l3-3-3-3M13 8H6"
                  stroke="#6B7280" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </header>

          <div className="iv-page-body">
            {activePage === "reclamations" && (
              <MesReclamationsPage
                reclamations={reclamations}
                setReclamations={setReclamations}
                showToast={showToast}
              />
            )}
            {activePage === "profil" && <MonProfilPage />}
          </div>
        </div>
      </div>

      {/* Notification panel */}
      {showNotifs && (
        <NotifPanel
          notifs={notifs}
          onMarkAll={() => setNotifs((p) => p.map((n) => ({ ...n, unread: false })))}
          onMarkOne={(id) => setNotifs((p) => p.map((n) => n.id === id ? { ...n, unread: false } : n))}
          onClose={() => setShowNotifs(false)}
        />
      )}

      {toast && <div className="iv-toast">{toast}</div>}
    </>
  );
}