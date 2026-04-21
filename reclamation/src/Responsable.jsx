import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'DM Sans', sans-serif; background: #F4F5FA; color: #0F1117; }
  .resp-layout { display: flex; min-height: 100vh; }

  /* ── SIDEBAR ── */
  .sidebar { width: 230px; background: #fff; border-right: 1px solid rgba(0,0,0,0.06); display: flex; flex-direction: column; position: fixed; top: 0; left: 0; height: 100vh; z-index: 50; }
  .sidebar-logo { display: flex; align-items: center; gap: 8px; padding: 20px 20px 16px; border-bottom: 1px solid rgba(0,0,0,0.06); }
  .sidebar-logo span { font-family: 'Sora', sans-serif; font-weight: 700; font-size: 15.5px; color: #0F1117; letter-spacing: -0.3px; }
  .sidebar-section { padding: 14px 12px 6px; font-size: 9.5px; font-weight: 700; color: #C4C9D4; letter-spacing: 1.1px; text-transform: uppercase; }
  .sidebar-nav { flex: 1; padding: 8px 12px; display: flex; flex-direction: column; gap: 3px; overflow-y: auto; }
  .nav-item { display: flex; align-items: center; gap: 10px; padding: 9px 12px; border-radius: 9px; cursor: pointer; font-size: 13.5px; color: #6B7280; font-weight: 400; transition: all 0.18s; border: none; background: none; width: 100%; text-align: left; font-family: 'DM Sans', sans-serif; }
  .nav-item:hover { background: #F4F5FA; color: #0F1117; }
  .nav-item.active { background: #EEF2FF; color: #4F46E5; font-weight: 500; }
  .nav-badge { margin-left: auto; background: #4F46E5; color: #fff; font-size: 9px; font-weight: 700; padding: 2px 6px; border-radius: 99px; }
  .nav-badge.orange { background: #F59E0B; }
  .sidebar-user { padding: 14px 16px; border-top: 1px solid rgba(0,0,0,0.06); display: flex; align-items: center; gap: 10px; }
  .user-avatar { width: 34px; height: 34px; border-radius: 50%; background: #10B981; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; color: #fff; flex-shrink: 0; }
  .user-name { font-size: 13px; font-weight: 500; color: #0F1117; }
  .user-role { font-size: 10.5px; color: #9CA3AF; }

  /* ── MAIN ── */
  .main-content { margin-left: 230px; flex: 1; display: flex; flex-direction: column; min-height: 100vh; }

  /* ── TOPBAR ── */
  .topbar { height: 60px; background: #fff; border-bottom: 1px solid rgba(0,0,0,0.06); display: flex; align-items: center; justify-content: space-between; padding: 0 32px; position: sticky; top: 0; z-index: 40; }
  .topbar-title { font-family: 'Sora', sans-serif; font-size: 17px; font-weight: 700; color: #0F1117; letter-spacing: -0.4px; }
  .topbar-right { display: flex; align-items: center; gap: 10px; }
  .service-pill { background: #EEF2FF; color: #4F46E5; font-size: 11px; font-weight: 600; padding: 5px 12px; border-radius: 99px; letter-spacing: 0.3px; }
  .icon-btn { width: 36px; height: 36px; border-radius: 9px; border: 1px solid #E5E7EB; background: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center; position: relative; transition: background 0.15s; }
  .icon-btn:hover { background: #F4F5FA; }
  .notif-count { position: absolute; top: -5px; right: -5px; width: 17px; height: 17px; border-radius: 50%; background: #EF4444; border: 2px solid #fff; display: flex; align-items: center; justify-content: center; font-size: 8px; font-weight: 700; color: #fff; }

  /* ── NOTIF DROPDOWN ── */
  .notif-wrap { position: relative; }
  .notif-dropdown { position: absolute; top: calc(100% + 10px); right: 0; width: 320px; background: #fff; border: 1px solid #E5E7EB; border-radius: 14px; box-shadow: 0 16px 48px rgba(0,0,0,0.13); z-index: 300; overflow: hidden; }
  .notif-header { display: flex; align-items: center; justify-content: space-between; padding: 13px 16px; border-bottom: 1px solid #F3F4F6; }
  .notif-header-title { font-family: 'Sora', sans-serif; font-size: 13.5px; font-weight: 600; color: #0F1117; }
  .notif-mark-all { font-size: 11px; color: #4F46E5; cursor: pointer; font-weight: 500; background: none; border: none; font-family: 'DM Sans', sans-serif; }
  .notif-item { display: flex; align-items: flex-start; gap: 10px; padding: 11px 16px; border-bottom: 1px solid #F9FAFB; cursor: pointer; transition: background 0.15s; position: relative; }
  .notif-item:last-child { border-bottom: none; }
  .notif-item:hover { background: #FAFBFF; }
  .notif-item.unread { background: #FAFBFF; }
  .notif-item.unread::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 3px; background: #4F46E5; border-radius: 0 2px 2px 0; }
  .notif-icon { width: 30px; height: 30px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 13px; flex-shrink: 0; }
  .notif-text { font-size: 12px; color: #374151; line-height: 1.5; flex: 1; }
  .notif-text strong { color: #0F1117; font-weight: 600; }
  .notif-time { font-size: 10px; color: #B0B7C3; margin-top: 2px; }

  /* ── PAGE BODY ── */
  .page-body { padding: 26px 30px; flex: 1; }

  /* ── CARDS ── */
  .card { background: #fff; border-radius: 16px; border: 1px solid rgba(0,0,0,0.06); padding: 20px 22px; }
  .card-title { font-family: 'Sora', sans-serif; font-size: 14px; font-weight: 600; color: #0F1117; margin-bottom: 16px; }

  /* ── OVERVIEW PAGE ── */
  .overview-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 22px; }
  .stat-card { background: #fff; border-radius: 14px; border: 1px solid rgba(0,0,0,0.06); padding: 16px 18px; transition: transform 0.18s, box-shadow 0.18s; cursor: pointer; }
  .stat-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.07); }
  .stat-card.accent { border: 2px solid #10B981; }
  .stat-label { font-size: 9.5px; font-weight: 600; color: #9CA3AF; letter-spacing: 0.8px; text-transform: uppercase; margin-bottom: 7px; }
  .stat-value { font-family: 'Sora', sans-serif; font-size: 24px; font-weight: 700; color: #0F1117; letter-spacing: -0.5px; }
  .stat-card.accent .stat-value { color: #10B981; }
  .stat-sub { font-size: 10.5px; margin-top: 5px; }
  .stat-sub.up { color: #059669; }
  .stat-sub.down { color: #DC2626; }
  .overview-row { display: grid; grid-template-columns: 1fr 300px; gap: 18px; margin-bottom: 22px; }

  /* ── TICKETS ── */
  .toolbar { display: flex; align-items: center; gap: 10px; margin-bottom: 16px; flex-wrap: wrap; }
  .filter-select { padding: 7px 11px; border: 1px solid #E5E7EB; border-radius: 8px; font-size: 12px; color: #374151; background: #fff; outline: none; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: border-color 0.2s; }
  .filter-select:focus { border-color: #4F46E5; }
  .search-inline { padding: 7px 12px; border: 1px solid #E5E7EB; border-radius: 8px; font-size: 12px; outline: none; font-family: 'DM Sans', sans-serif; width: 180px; transition: border-color 0.2s; }
  .search-inline:focus { border-color: #4F46E5; }
  .count-badge { font-size: 11.5px; color: #9CA3AF; margin-left: auto; }
  .tickets-table { width: 100%; border-collapse: collapse; }
  .tickets-table th { font-size: 10px; font-weight: 600; color: #9CA3AF; letter-spacing: 0.7px; text-transform: uppercase; padding: 9px 13px; text-align: left; border-bottom: 1px solid #F3F4F6; }
  .tickets-table td { padding: 11px 13px; font-size: 12.5px; color: #374151; border-bottom: 1px solid #F9FAFB; }
  .tickets-table tr:hover td { background: #FAFBFF; cursor: pointer; }
  .tbadge { font-size: 9px; font-weight: 700; padding: 3px 7px; border-radius: 5px; text-transform: uppercase; letter-spacing: 0.4px; }
  .tbadge.urgent { background: #FEE2E2; color: #DC2626; }
  .tbadge.cours { background: #FEF3C7; color: #D97706; }
  .tbadge.resolu { background: #D1FAE5; color: #059669; }
  .tbadge.attente { background: #F3F4F6; color: #6B7280; }
  .tbadge.normal { background: #F3F4F6; color: #6B7280; }

  /* ── DETAIL PANEL ── */
  .detail-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.28); z-index: 400; display: flex; justify-content: flex-end; }
  .detail-panel { width: 400px; background: #fff; height: 100%; overflow-y: auto; padding: 26px 22px; box-shadow: -8px 0 40px rgba(0,0,0,0.10); }
  .detail-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px; }
  .close-btn { width: 28px; height: 28px; border-radius: 7px; border: 1px solid #E5E7EB; background: none; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 14px; color: #6B7280; }
  .close-btn:hover { background: #F4F5FA; }
  .detail-title { font-family: 'Sora', sans-serif; font-size: 16px; font-weight: 700; color: #0F1117; margin: 8px 0 6px; }
  .detail-meta { display: flex; gap: 7px; flex-wrap: wrap; margin-bottom: 16px; }
  .divider { height: 1px; background: #F3F4F6; margin: 14px 0; }
  .detail-row { display: flex; justify-content: space-between; align-items: center; padding: 7px 0; }
  .dk { font-size: 11.5px; color: #9CA3AF; }
  .dv { font-size: 12.5px; color: #111827; font-weight: 500; }
  .statut-select { padding: 5px 10px; border: 1px solid #E5E7EB; border-radius: 7px; font-size: 12px; color: #374151; background: #fff; outline: none; font-family: 'DM Sans', sans-serif; cursor: pointer; }
  .priority-select { padding: 5px 10px; border: 1px solid #E5E7EB; border-radius: 7px; font-size: 12px; color: #374151; background: #fff; outline: none; font-family: 'DM Sans', sans-serif; cursor: pointer; }
  .comment-box { width: 100%; border: 1px solid #E5E7EB; border-radius: 8px; padding: 9px 11px; font-size: 12.5px; font-family: 'DM Sans', sans-serif; color: #0F1117; resize: none; outline: none; transition: border-color 0.2s; margin-top: 10px; }
  .comment-box:focus { border-color: #4F46E5; }
  .btn-comment { margin-top: 8px; padding: 8px 16px; background: #4F46E5; color: #fff; border: none; border-radius: 7px; font-size: 12.5px; font-weight: 600; cursor: pointer; font-family: 'Sora', sans-serif; }
  .btn-comment:hover { background: #4338CA; }
  .comment-item { padding: 9px 0; border-bottom: 1px solid #F9FAFB; }
  .comment-item:last-child { border-bottom: none; }
  .c-author { font-size: 11.5px; font-weight: 600; color: #111827; }
  .c-time { font-size: 10px; color: #B0B7C3; margin-left: 5px; }
  .c-body { font-size: 12px; color: #374151; margin-top: 3px; line-height: 1.5; }
  .history-item { display: flex; gap: 10px; padding: 8px 0; border-bottom: 1px solid #F9FAFB; }
  .history-item:last-child { border-bottom: none; }
  .h-dot { width: 8px; height: 8px; border-radius: 50%; margin-top: 4px; flex-shrink: 0; }
  .h-text { font-size: 12px; color: #374151; line-height: 1.5; }
  .h-time { font-size: 10px; color: #B0B7C3; margin-top: 2px; }

  /* ── CHATBOT ── */
  .chat-layout { display: grid; grid-template-columns: 260px 1fr; gap: 18px; height: calc(100vh - 112px); }
  .chat-sidebar { display: flex; flex-direction: column; gap: 12px; }
  .chat-info-card { background: #fff; border-radius: 14px; border: 1px solid rgba(0,0,0,0.06); padding: 16px; }
  .chat-info-title { font-size: 11px; font-weight: 700; color: #9CA3AF; letter-spacing: 0.8px; text-transform: uppercase; margin-bottom: 10px; }
  .chat-suggestion { padding: 9px 11px; background: #F4F5FA; border-radius: 8px; font-size: 12px; color: #374151; cursor: pointer; transition: background 0.15s; margin-bottom: 6px; border: 1px solid transparent; }
  .chat-suggestion:hover { background: #EEF2FF; border-color: #C7D2FE; color: #4F46E5; }
  .chat-suggestion:last-child { margin-bottom: 0; }
  .chat-main { display: flex; flex-direction: column; background: #fff; border-radius: 16px; border: 1px solid rgba(0,0,0,0.06); overflow: hidden; }
  .chat-header { padding: 16px 20px; border-bottom: 1px solid #F3F4F6; display: flex; align-items: center; gap: 12px; }
  .bot-avatar { width: 36px; height: 36px; border-radius: 10px; background: linear-gradient(135deg, #4F46E5, #818CF8); display: flex; align-items: center; justify-content: center; font-size: 17px; flex-shrink: 0; }
  .bot-name { font-family: 'Sora', sans-serif; font-size: 14px; font-weight: 600; color: #0F1117; }
  .bot-status { font-size: 11px; color: #10B981; display: flex; align-items: center; gap: 4px; }
  .status-dot { width: 6px; height: 6px; border-radius: 50%; background: #10B981; }
  .chat-messages { flex: 1; overflow-y: auto; padding: 20px; display: flex; flex-direction: column; gap: 14px; }
  .msg-wrap { display: flex; align-items: flex-end; gap: 8px; }
  .msg-wrap.user { flex-direction: row-reverse; }
  .msg-avatar { width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 700; color: #fff; flex-shrink: 0; }
  .msg-bubble { max-width: 72%; padding: 10px 14px; border-radius: 14px; font-size: 13px; line-height: 1.55; }
  .msg-bubble.bot { background: #F4F5FA; color: #111827; border-radius: 4px 14px 14px 14px; }
  .msg-bubble.user { background: #4F46E5; color: #fff; border-radius: 14px 4px 14px 14px; }
  .msg-time { font-size: 10px; color: #B0B7C3; margin-top: 4px; text-align: right; }
  .msg-time.bot { text-align: left; }
  .chat-input-wrap { padding: 14px 20px; border-top: 1px solid #F3F4F6; display: flex; gap: 10px; align-items: flex-end; }
  .chat-input { flex: 1; border: 1.5px solid #E5E7EB; border-radius: 10px; padding: 10px 14px; font-size: 13px; font-family: 'DM Sans', sans-serif; outline: none; resize: none; color: #0F1117; transition: border-color 0.2s; max-height: 100px; }
  .chat-input:focus { border-color: #4F46E5; }
  .chat-send { width: 38px; height: 38px; border-radius: 10px; background: #4F46E5; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: background 0.2s; }
  .chat-send:hover { background: #4338CA; }
  .typing-indicator { display: flex; gap: 4px; align-items: center; padding: 10px 14px; background: #F4F5FA; border-radius: 4px 14px 14px 14px; width: fit-content; }
  .typing-dot { width: 6px; height: 6px; border-radius: 50%; background: #9CA3AF; animation: typing 1.2s infinite; }
  .typing-dot:nth-child(2) { animation-delay: 0.2s; }
  .typing-dot:nth-child(3) { animation-delay: 0.4s; }
  @keyframes typing { 0%,60%,100% { opacity:0.3; transform:scale(1); } 30% { opacity:1; transform:scale(1.2); } }

  /* ── ACTIVITE ── */
  .activity-feed { display: flex; flex-direction: column; gap: 0; }
  .af-item { display: flex; gap: 12px; padding: 13px 0; border-bottom: 1px solid #F3F4F6; position: relative; }
  .af-item:last-child { border-bottom: none; }
  .af-line { position: absolute; left: 15px; top: 46px; bottom: -13px; width: 1px; background: #F3F4F6; }
  .af-icon { width: 30px; height: 30px; border-radius: 8px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 13px; z-index: 1; }
  .af-content { flex: 1; }
  .af-text { font-size: 13px; color: #374151; line-height: 1.5; }
  .af-text strong { color: #0F1117; font-weight: 600; }
  .af-time { font-size: 10.5px; color: #B0B7C3; margin-top: 2px; }
  .af-tag { display: inline-flex; align-items: center; gap: 4px; margin-top: 5px; background: #F4F5FA; border-radius: 5px; padding: 2px 7px; font-size: 10.5px; color: #6B7280; }

  /* ── TOAST ── */
  .toast { position: fixed; bottom: 24px; right: 24px; background: #1C1C2E; color: #fff; padding: 11px 18px; border-radius: 10px; font-size: 13px; font-weight: 500; z-index: 999; box-shadow: 0 8px 28px rgba(0,0,0,0.18); display: flex; align-items: center; gap: 8px; animation: slideUp 0.3s ease; }
  @keyframes slideUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }

  /* ── SCROLLBAR ── */
  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 99px; }
`;

// ── DATA ─────────────────────────────────────────────────
const TICKETS = [
  { id: "ID-98250", titre: "Panne serveur principal",   service: "Informatique", priorite: "urgent", statut: "cours",   date: "20/04/2026", assign: "Zakaria A.", desc: "Le serveur principal est tombé en panne à 09h14. Les équipes sont mobilisées.", comments: [{ author: "Zakaria A.", time: "Il y a 20 min", body: "Diagnostic en cours, problème réseau identifié." }], history: [{ action: "Ticket créé", who: "Sarah L.", time: "20/04 09:14", color: "#4F46E5" }, { action: "Assigné à Zakaria A.", who: "Admin", time: "20/04 09:20", color: "#10B981" }, { action: "Statut → En cours", who: "Zakaria A.", time: "20/04 09:35", color: "#F59E0B" }] },
  { id: "ID-98110", titre: "Remboursement médical",     service: "Informatique", priorite: "normal", statut: "attente", date: "19/04/2026", assign: "Sarah L.",   desc: "Demande de remboursement pour frais médicaux du mois de mars.", comments: [], history: [{ action: "Ticket créé", who: "Sarah L.", time: "19/04 14:00", color: "#4F46E5" }] },
  { id: "ID-97800", titre: "Accès refusé CRM",          service: "Informatique", priorite: "urgent", statut: "cours",   date: "17/04/2026", assign: "Zakaria A.", desc: "Plusieurs employés ne peuvent plus accéder au CRM depuis hier.", comments: [{ author: "Admin", time: "Hier 16h", body: "Vérification des droits en cours." }], history: [{ action: "Ticket créé", who: "Karim A.", time: "17/04 10:00", color: "#4F46E5" }, { action: "Escaladé → Urgent", who: "Responsable", time: "17/04 10:30", color: "#EF4444" }] },
  { id: "ID-97300", titre: "Problème imprimante",       service: "Informatique", priorite: "normal", statut: "resolu",  date: "14/04/2026", assign: "Sarah L.",   desc: "L'imprimante du 3e étage ne répond plus.", comments: [{ author: "Sarah L.", time: "14/04", body: "Pilote réinstallé, problème résolu." }], history: [{ action: "Ticket créé", who: "Omar A.", time: "14/04 08:30", color: "#4F46E5" }, { action: "Résolu", who: "Sarah L.", time: "14/04 11:00", color: "#10B981" }] },
  { id: "ID-96900", titre: "Logiciel non mis à jour",   service: "Informatique", priorite: "normal", statut: "attente", date: "12/04/2026", assign: "Zakaria A.", desc: "La mise à jour planifiée de l'ERP n'a pas été appliquée.", comments: [], history: [{ action: "Ticket créé", who: "Admin", time: "12/04 09:00", color: "#4F46E5" }] },
  { id: "ID-96500", titre: "VPN inaccessible",          service: "Informatique", priorite: "urgent", statut: "resolu",  date: "10/04/2026", assign: "Zakaria A.", desc: "Le VPN était inaccessible pour les équipes distantes.", comments: [{ author: "Zakaria A.", time: "10/04", body: "Certificat renouvelé. VPN opérationnel." }], history: [{ action: "Ticket créé", who: "Sarah L.", time: "10/04 07:00", color: "#4F46E5" }, { action: "Résolu en urgence", who: "Zakaria A.", time: "10/04 09:30", color: "#10B981" }] },
];

const NOTIFS_INIT = [
  { id: 1, icon: "🔴", bg: "#FEE2E2", text: <><strong>ID-98250</strong> — Panne critique non résolue</>,       time: "À l'instant", unread: true },
  { id: 2, icon: "✅", bg: "#D1FAE5", text: <><strong>ID-97300</strong> marqué comme résolu par Sarah</>,      time: "Il y a 2h",   unread: true },
  { id: 3, icon: "💬", bg: "#EEF2FF", text: <>Nouveau commentaire sur <strong>ID-97800</strong></>,            time: "Il y a 3h",   unread: true },
  { id: 4, icon: "⚠️", bg: "#FEF3C7", text: <><strong>3 tickets</strong> en attente depuis +48h</>,            time: "Hier",        unread: false },
  { id: 5, icon: "👤", bg: "#F3F4F6", text: <>Nouveau ticket assigné par <strong>Admin</strong></>,            time: "Hier",        unread: false },
];

const statutLabel = { cours: "En cours", resolu: "Résolu", attente: "En attente" };

// ── BOT RESPONSES ─────────────────────────────────────────
const getBotResponse = (msg, tickets) => {
  const m = msg.toLowerCase();
  const urgent   = tickets.filter(t => t.priorite === "urgent");
  const attente  = tickets.filter(t => t.statut   === "attente");
  const cours    = tickets.filter(t => t.statut   === "cours");
  const resolus  = tickets.filter(t => t.statut   === "resolu");

  if (m.includes("bonjour") || m.includes("salut") || m.includes("salam"))
    return `Bonjour ! Je suis l'assistant Bayan de votre service Informatique 🤖\n\nVous avez actuellement **${tickets.length} tickets** dans votre service :\n• ${urgent.length} urgents 🔴\n• ${cours.length} en cours 🟡\n• ${attente.length} en attente ⏳\n• ${resolus.length} résolus ✅\n\nComment puis-je vous aider ?`;

  if (m.includes("urgent") || m.includes("critique") || m.includes("priorité"))
    return urgent.length === 0
      ? "Aucun ticket urgent pour le moment. Tout va bien ! ✅"
      : `Il y a **${urgent.length} ticket(s) urgent(s)** :\n\n${urgent.map(t => `• **${t.id}** — ${t.titre} (${statutLabel[t.statut]})`).join("\n")}\n\nJe vous recommande de les traiter en priorité.`;

  if (m.includes("attente") || m.includes("pending"))
    return attente.length === 0
      ? "Aucun ticket en attente ! 🎉"
      : `**${attente.length} ticket(s) en attente** :\n\n${attente.map(t => `• **${t.id}** — ${t.titre}`).join("\n")}\n\nPensez à les assigner rapidement.`;

  if (m.includes("résolu") || m.includes("resolu") || m.includes("clôturé") || m.includes("ferme"))
    return `**${resolus.length} ticket(s) résolu(s)** ce mois :\n\n${resolus.map(t => `• **${t.id}** — ${t.titre}`).join("\n")}\n\nBon travail à votre équipe ! 🏆`;

  if (m.includes("cours") || m.includes("traitement") || m.includes("progres"))
    return `**${cours.length} ticket(s) en cours** de traitement :\n\n${cours.map(t => `• **${t.id}** — ${t.titre} → Assigné à ${t.assign}`).join("\n")}`;

  if (m.includes("statistique") || m.includes("stats") || m.includes("rapport") || m.includes("bilan"))
    return `📊 **Bilan du service Informatique :**\n\n• Total tickets : ${tickets.length}\n• Taux de résolution : ${Math.round((resolus.length/tickets.length)*100)}%\n• Tickets urgents : ${urgent.length}\n• En attente : ${attente.length}\n• En cours : ${cours.length}\n• Résolus : ${resolus.length}\n\nVotre équipe performe bien ce mois ! 💪`;

  if (m.includes("equipe") || m.includes("équipe") || m.includes("assign") || m.includes("interven"))
    return `👥 **Équipe du service Informatique :**\n\n• **Zakaria Achraf** — Technicien IT (${tickets.filter(t=>t.assign==="Zakaria A.").length} tickets)\n• **Sarah Lemarié** — Support Client Senior (${tickets.filter(t=>t.assign==="Sarah L.").length} tickets)\n\nVoulez-vous plus de détails sur un membre ?`;

  if (m.includes("98250") || m.includes("panne") || m.includes("serveur"))
    return `🔴 **Ticket ID-98250 — Panne serveur principale**\n\nStatut : En cours ⚙️\nAssigné à : Zakaria Achraf\nDate : 20/04/2026\n\nDernier commentaire : "Diagnostic en cours, problème réseau identifié."\n\nCe ticket est urgent. Souhaitez-vous envoyer une mise à jour à l'équipe ?`;

  if (m.includes("help") || m.includes("aide") || m.includes("que peux") || m.includes("quoi faire"))
    return `Je peux vous aider avec :\n\n🔍 **Recherche** — "Montre les tickets urgents"\n📊 **Stats** — "Donne-moi les statistiques"\n👥 **Équipe** — "Qui travaille sur quoi ?"\n⏳ **En attente** — "Quels tickets sont en attente ?"\n✅ **Résolus** — "Combien de tickets résolus ?"\n\nPosez-moi n'importe quelle question !`;

  if (m.includes("merci") || m.includes("shukran") || m.includes("3afak"))
    return "Avec plaisir ! 😊 N'hésitez pas si vous avez d'autres questions.";

  return `Je n'ai pas bien compris votre demande. Essayez :\n\n• "Tickets urgents"\n• "Statistiques du service"\n• "Équipe et assignations"\n• "Tickets en attente"\n\nOu tapez "aide" pour voir tout ce que je peux faire.`;
};

// ── COMPONENTS ────────────────────────────────────────────
const Logo = () => (
  <div className="sidebar-logo">
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <rect width="28" height="28" rx="8" fill="#4F46E5"/>
      <path d="M8 14C8 10.686 10.686 8 14 8C17.314 8 20 10.686 20 14C20 17.314 17.314 20 14 20" stroke="white" strokeWidth="1.9" strokeLinecap="round"/>
      <circle cx="14" cy="20" r="1.6" fill="white"/>
    </svg>
    <span>Bayan</span>
  </div>
);

// ── TICKET DETAIL ─────────────────────────────────────────
const TicketDetail = ({ ticket, onClose, onUpdateStatut, onUpdatePriorite, onAddComment }) => {
  const [comment,  setComment]  = useState("");
  const [statut,   setStatut]   = useState(ticket.statut);
  const [priorite, setPriorite] = useState(ticket.priorite);

  const handleStatut = (e) => { setStatut(e.target.value); onUpdateStatut(ticket.id, e.target.value); };
  const handlePriorite = (e) => { setPriorite(e.target.value); onUpdatePriorite(ticket.id, e.target.value); };
  const handleComment = () => { if (!comment.trim()) return; onAddComment(ticket.id, comment.trim()); setComment(""); };

  return (
    <div className="detail-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="detail-panel">
        <div className="detail-top">
          <span style={{ fontFamily: "monospace", fontSize: 11, color: "#9CA3AF" }}>{ticket.id}</span>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        <div className="detail-title">{ticket.titre}</div>
        <div className="detail-meta">
          <span className={`tbadge ${priorite === "urgent" ? "urgent" : "normal"}`}>{priorite}</span>
          <span className={`tbadge ${statut}`}>{statutLabel[statut]}</span>
        </div>
        <p style={{ fontSize: 12.5, color: "#6B7280", lineHeight: 1.6, marginBottom: 4 }}>{ticket.desc}</p>
        <div className="divider"/>
        {[["Service", ticket.service], ["Date", ticket.date], ["Assigné à", ticket.assign]].map(([k,v]) => (
          <div className="detail-row" key={k}><span className="dk">{k}</span><span className="dv">{v}</span></div>
        ))}
        <div className="detail-row">
          <span className="dk">Statut</span>
          <select className="statut-select" value={statut} onChange={handleStatut}>
            <option value="attente">En attente</option>
            <option value="cours">En cours</option>
            <option value="resolu">Résolu</option>
          </select>
        </div>
        <div className="detail-row">
          <span className="dk">Priorité</span>
          <select className="priority-select" value={priorite} onChange={handlePriorite}>
            <option value="normal">Normal</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>
        <div className="divider"/>

        {/* HISTORY */}
        <div className="card-title" style={{ fontSize: 13, marginBottom: 10 }}>Historique</div>
        {ticket.history.map((h, i) => (
          <div className="history-item" key={i}>
            <div className="h-dot" style={{ background: h.color }}/>
            <div>
              <div className="h-text">{h.action} — <strong>{h.who}</strong></div>
              <div className="h-time">{h.time}</div>
            </div>
          </div>
        ))}
        <div className="divider"/>

        {/* COMMENTS */}
        <div className="card-title" style={{ fontSize: 13, marginBottom: 10 }}>Commentaires ({ticket.comments.length})</div>
        {ticket.comments.length === 0 && <div style={{ fontSize: 12, color: "#B0B7C3", marginBottom: 10 }}>Aucun commentaire.</div>}
        {ticket.comments.map((c, i) => (
          <div className="comment-item" key={i}>
            <span className="c-author">{c.author}</span><span className="c-time">{c.time}</span>
            <div className="c-body">{c.body}</div>
          </div>
        ))}
        <textarea className="comment-box" rows={3} placeholder="Ajouter un commentaire..." value={comment} onChange={e => setComment(e.target.value)}/>
        <button className="btn-comment" onClick={handleComment}>Envoyer</button>
      </div>
    </div>
  );
};

// ── OVERVIEW PAGE ─────────────────────────────────────────
const OverviewPage = ({ tickets, setActivePage }) => {
  const urgent  = tickets.filter(t => t.priorite === "urgent").length;
  const attente = tickets.filter(t => t.statut   === "attente").length;
  const cours   = tickets.filter(t => t.statut   === "cours").length;
  const resolus = tickets.filter(t => t.statut   === "resolu").length;

  const recent = [...tickets].sort((a,b) => b.id.localeCompare(a.id)).slice(0,4);

  return (
    <div>
      <div className="overview-grid">
        {[
          { label: "TOTAL TICKETS", value: tickets.length, sub: "Ce mois", subType: "up", accent: false },
          { label: "EN COURS",      value: cours,          sub: "Traitement actif", subType: "up", accent: false },
          { label: "EN ATTENTE",    value: attente,        sub: "À assigner", subType: "down", accent: false },
          { label: "RÉSOLUS",       value: resolus,        sub: `${Math.round((resolus/tickets.length)*100)}% taux résolution`, subType: "up", accent: true },
        ].map(s => (
          <div key={s.label} className={`stat-card${s.accent ? " accent" : ""}`} onClick={() => setActivePage("tickets")}>
            <div className="stat-label">{s.label}</div>
            <div className="stat-value">{s.value}</div>
            <div className={`stat-sub ${s.subType}`}>{s.sub}</div>
          </div>
        ))}
      </div>

      {urgent > 0 && (
        <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 12, padding: "12px 16px", marginBottom: 18, display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 16 }}>🔴</span>
          <span style={{ fontSize: 13, color: "#DC2626", fontWeight: 500 }}>{urgent} ticket(s) urgent(s) nécessitent votre attention immédiate</span>
          <button onClick={() => setActivePage("tickets")} style={{ marginLeft: "auto", padding: "5px 12px", background: "#DC2626", color: "#fff", border: "none", borderRadius: 7, fontSize: 11.5, fontWeight: 600, cursor: "pointer", fontFamily: "'Sora',sans-serif" }}>Voir maintenant</button>
        </div>
      )}

      <div className="overview-row">
        <div className="card">
          <div className="card-title">Tickets récents</div>
          <table className="tickets-table">
            <thead><tr><th>ID</th><th>Titre</th><th>Statut</th><th>Assigné</th></tr></thead>
            <tbody>
              {recent.map(t => (
                <tr key={t.id}>
                  <td style={{ fontFamily: "monospace", fontSize: 11, color: "#9CA3AF" }}>{t.id}</td>
                  <td style={{ fontWeight: 500, color: "#111827", maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.titre}</td>
                  <td><span className={`tbadge ${t.statut}`}>{statutLabel[t.statut]}</span></td>
                  <td style={{ fontSize: 12 }}>{t.assign}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card">
          <div className="card-title">Répartition statuts</div>
          {[
            { label: "En cours",   value: cours,   color: "#F59E0B", total: tickets.length },
            { label: "En attente", value: attente, color: "#9CA3AF", total: tickets.length },
            { label: "Résolus",    value: resolus, color: "#10B981", total: tickets.length },
            { label: "Urgents",    value: urgent,  color: "#EF4444", total: tickets.length },
          ].map(s => (
            <div key={s.label} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                <span style={{ fontSize: 12, color: "#374151" }}>{s.label}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#111827" }}>{s.value}</span>
              </div>
              <div style={{ height: 5, background: "#F3F4F6", borderRadius: 99, overflow: "hidden" }}>
                <div style={{ height: 5, background: s.color, borderRadius: 99, width: `${(s.value/s.total)*100}%`, transition: "width 0.6s ease" }}/>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ── TICKETS PAGE ──────────────────────────────────────────
const TicketsPage = ({ tickets, setTickets, showToast }) => {
  const [filterStatut,   setFilterStatut]   = useState("tous");
  const [filterPriorite, setFilterPriorite] = useState("tous");
  const [searchQ,        setSearchQ]        = useState("");
  const [selected,       setSelected]       = useState(null);

  const filtered = tickets.filter(t => {
    const ms = filterStatut   === "tous" || t.statut   === filterStatut;
    const mp = filterPriorite === "tous" || t.priorite === filterPriorite;
    const mq = t.titre.toLowerCase().includes(searchQ.toLowerCase()) || t.id.toLowerCase().includes(searchQ.toLowerCase());
    return ms && mp && mq;
  });

  const updateStatut = (id, val) => {
    setTickets(p => p.map(t => t.id === id ? { ...t, statut: val, history: [...t.history, { action: `Statut → ${statutLabel[val]}`, who: "Karim Alami", time: "À l'instant", color: "#4F46E5" }] } : t));
    if (selected?.id === id) setSelected(p => ({ ...p, statut: val }));
    showToast("✅ Statut mis à jour !");
  };

  const updatePriorite = (id, val) => {
    setTickets(p => p.map(t => t.id === id ? { ...t, priorite: val, history: [...t.history, { action: `Priorité → ${val}`, who: "Karim Alami", time: "À l'instant", color: "#EF4444" }] } : t));
    if (selected?.id === id) setSelected(p => ({ ...p, priorite: val }));
    showToast("⚡ Priorité mise à jour !");
  };

  const addComment = (id, body) => {
    const nc = { author: "Karim Alami", time: "À l'instant", body };
    setTickets(p => p.map(t => t.id === id ? { ...t, comments: [...t.comments, nc], history: [...t.history, { action: "Commentaire ajouté", who: "Karim Alami", time: "À l'instant", color: "#10B981" }] } : t));
    if (selected?.id === id) setSelected(p => ({ ...p, comments: [...p.comments, nc] }));
    showToast("💬 Commentaire envoyé !");
  };

  return (
    <div>
      <div className="card">
        <div className="toolbar">
          <input className="search-inline" placeholder="Chercher..." value={searchQ} onChange={e => setSearchQ(e.target.value)}/>
          <select className="filter-select" value={filterStatut} onChange={e => setFilterStatut(e.target.value)}>
            <option value="tous">Tous les statuts</option>
            <option value="attente">En attente</option>
            <option value="cours">En cours</option>
            <option value="resolu">Résolu</option>
          </select>
          <select className="filter-select" value={filterPriorite} onChange={e => setFilterPriorite(e.target.value)}>
            <option value="tous">Toutes priorités</option>
            <option value="urgent">Urgent</option>
            <option value="normal">Normal</option>
          </select>
          <span className="count-badge">{filtered.length} ticket{filtered.length !== 1 ? "s" : ""}</span>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table className="tickets-table">
            <thead><tr><th>ID</th><th>Titre</th><th>Priorité</th><th>Statut</th><th>Assigné</th><th>Date</th></tr></thead>
            <tbody>
              {filtered.length === 0
                ? <tr><td colSpan={6} style={{ textAlign: "center", padding: 28, color: "#9CA3AF", fontSize: 13 }}>Aucun ticket trouvé</td></tr>
                : filtered.map(t => (
                  <tr key={t.id} onClick={() => setSelected(t)}>
                    <td style={{ fontFamily: "monospace", fontSize: 11, color: "#9CA3AF" }}>{t.id}</td>
                    <td style={{ fontWeight: 500, color: "#111827" }}>{t.titre}</td>
                    <td><span className={`tbadge ${t.priorite === "urgent" ? "urgent" : "normal"}`}>{t.priorite}</span></td>
                    <td><span className={`tbadge ${t.statut}`}>{statutLabel[t.statut]}</span></td>
                    <td>{t.assign}</td>
                    <td>{t.date}</td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>
      {selected && (
        <TicketDetail ticket={selected} onClose={() => setSelected(null)}
          onUpdateStatut={updateStatut} onUpdatePriorite={updatePriorite} onAddComment={addComment}/>
      )}
    </div>
  );
};

// ── CHATBOT PAGE ──────────────────────────────────────────
const ChatbotPage = ({ tickets }) => {
  const [messages, setMessages] = useState([
    { id: 1, from: "bot", text: "Bonjour Karim ! 👋\n\nJe suis votre assistant Bayan pour le service **Informatique**.\n\nComment puis-je vous aider aujourd'hui ?", time: "maintenant" }
  ]);
  const [input,   setInput]   = useState("");
  const [typing,  setTyping]  = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, typing]);

  const send = (msg) => {
    const text = (msg || input).trim();
    if (!text) return;
    const userMsg = { id: Date.now(), from: "user", text, time: "maintenant" };
    setMessages(p => [...p, userMsg]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      const botResp = getBotResponse(text, tickets);
      setTyping(false);
      setMessages(p => [...p, { id: Date.now() + 1, from: "bot", text: botResp, time: "maintenant" }]);
    }, 900 + Math.random() * 600);
  };

  const handleKey = (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } };

  const formatText = (text) => {
    return text.split("\n").map((line, i) => {
      const formatted = line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
      return <div key={i} dangerouslySetInnerHTML={{ __html: formatted || "&nbsp;" }} />;
    });
  };

  const suggestions = ["Tickets urgents", "Statistiques du service", "Équipe et assignations", "Tickets en attente", "Bilan du mois"];

  return (
    <div className="chat-layout">
      <div className="chat-sidebar">
        <div className="chat-info-card">
          <div className="chat-info-title">Questions rapides</div>
          {suggestions.map(s => (
            <div key={s} className="chat-suggestion" onClick={() => send(s)}>{s}</div>
          ))}
        </div>
        <div className="chat-info-card">
          <div className="chat-info-title">Résumé service</div>
          {[
            { label: "Tickets total",  val: tickets.length },
            { label: "Urgents",        val: tickets.filter(t => t.priorite === "urgent").length },
            { label: "En cours",       val: tickets.filter(t => t.statut === "cours").length },
            { label: "Résolus",        val: tickets.filter(t => t.statut === "resolu").length },
          ].map(r => (
            <div key={r.label} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #F3F4F6", fontSize: 12.5 }}>
              <span style={{ color: "#6B7280" }}>{r.label}</span>
              <span style={{ fontWeight: 600, color: "#111827" }}>{r.val}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="chat-main">
        <div className="chat-header">
          <div className="bot-avatar">🤖</div>
          <div>
            <div className="bot-name">Assistant Bayan</div>
            <div className="bot-status"><span className="status-dot"/>En ligne — Service Informatique</div>
          </div>
        </div>

        <div className="chat-messages">
          {messages.map(m => (
            <div key={m.id} className={`msg-wrap ${m.from}`}>
              {m.from === "bot"
                ? <div className="msg-avatar" style={{ background: "linear-gradient(135deg,#4F46E5,#818CF8)", borderRadius: 10, fontSize: 14 }}>🤖</div>
                : <div className="msg-avatar" style={{ background: "#10B981" }}>KA</div>
              }
              <div>
                <div className={`msg-bubble ${m.from}`}>{formatText(m.text)}</div>
                <div className={`msg-time ${m.from}`}>{m.time}</div>
              </div>
            </div>
          ))}
          {typing && (
            <div className="msg-wrap">
              <div className="msg-avatar" style={{ background: "linear-gradient(135deg,#4F46E5,#818CF8)", borderRadius: 10, fontSize: 14 }}>🤖</div>
              <div className="typing-indicator">
                <div className="typing-dot"/><div className="typing-dot"/><div className="typing-dot"/>
              </div>
            </div>
          )}
          <div ref={bottomRef}/>
        </div>

        <div className="chat-input-wrap">
          <textarea className="chat-input" rows={1} placeholder="Posez votre question..." value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKey}/>
          <button className="chat-send" onClick={() => send()}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M13.5 2.5L7 9M13.5 2.5L9 13.5L7 9M13.5 2.5L2.5 6.5L7 9" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

// ── ACTIVITE PAGE ─────────────────────────────────────────
const ActivitePage = ({ tickets }) => {
  const feed = [
    { icon: "🔴", bg: "#FEE2E2", text: <><strong>ID-98250</strong> — Panne serveur signalée comme critique</>,         time: "Aujourd'hui 09:14", tag: "Urgent" },
    { icon: "💬", bg: "#EEF2FF", text: <>Commentaire ajouté sur <strong>ID-97800</strong> par Zakaria A.</>,           time: "Hier 16:30",         tag: "Commentaire" },
    { icon: "✅", bg: "#D1FAE5", text: <><strong>ID-97300</strong> — Problème imprimante résolu par Sarah L.</>,        time: "14/04 11:00",        tag: "Résolu" },
    { icon: "⚡", bg: "#FEF3C7", text: <><strong>ID-97800</strong> escaladé en priorité urgente</>,                    time: "17/04 10:30",        tag: "Escalade" },
    { icon: "🔵", bg: "#EEF2FF", text: <>Nouveau ticket <strong>ID-98110</strong> créé par Sarah L.</>,                time: "19/04 14:00",        tag: "Nouveau" },
    { icon: "👤", bg: "#F3F4F6", text: <>Ticket <strong>ID-96900</strong> assigné à Zakaria A.</>,                     time: "12/04 09:05",        tag: "Assignation" },
    { icon: "✅", bg: "#D1FAE5", text: <><strong>ID-96500</strong> — VPN inaccessible résolu en urgence</>,            time: "10/04 09:30",        tag: "Résolu" },
  ];
  return (
    <div className="card">
      <div className="card-title">Journal d'activité — Service Informatique</div>
      <div className="activity-feed">
        {feed.map((a, i) => (
          <div className="af-item" key={i}>
            {i < feed.length - 1 && <div className="af-line"/>}
            <div className="af-icon" style={{ background: a.bg }}>{a.icon}</div>
            <div className="af-content">
              <div className="af-text">{a.text}</div>
              <div className="af-time">{a.time}</div>
              <div className="af-tag">{a.tag}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── NAV ───────────────────────────────────────────────────
const navItems = [
  { key: "overview",  label: "Vue d'ensemble",   badge: null,
    icon: <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.7"/><rect x="9" y="1" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.4"/><rect x="1" y="9" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.4"/><rect x="9" y="9" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.7"/></svg> },
  { key: "tickets",   label: "Réclamations",      badge: "urgents",
    icon: <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M2 4h12M2 8h8M2 12h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg> },
  { key: "activite",  label: "Activité récente",  badge: null,
    icon: <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.4"/><path d="M8 5v3.5l2 1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg> },
  { key: "chatbot",   label: "Assistant IA",      badge: null,
    icon: <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><rect x="1" y="2" width="14" height="10" rx="3" stroke="currentColor" strokeWidth="1.4"/><path d="M4 14l2-2M12 14l-2-2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg> },
];

const pageTitles = { overview: "Vue d'ensemble", tickets: "Mes Réclamations", activite: "Activité récente", chatbot: "Assistant IA" };

// ── MAIN ──────────────────────────────────────────────────
export default function Responsable() {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState("overview");
  const [tickets,    setTickets]    = useState(TICKETS);
  const [notifs,     setNotifs]     = useState(NOTIFS_INIT);
  const [showNotifs, setShowNotifs] = useState(false);
  const [toast,      setToast]      = useState(null);
  const notifRef  = useRef(null);
  const toastRef  = useRef(null);

  const unread = notifs.filter(n => n.unread).length;
  const urgent = tickets.filter(t => t.priorite === "urgent").length;

  const showToast = (msg) => {
    setToast(msg);
    clearTimeout(toastRef.current);
    toastRef.current = setTimeout(() => setToast(null), 2800);
  };

  useEffect(() => {
    const h = (e) => { if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifs(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const renderPage = () => {
    switch (activePage) {
      case "overview":  return <OverviewPage  tickets={tickets} setActivePage={setActivePage}/>;
      case "tickets":   return <TicketsPage   tickets={tickets} setTickets={setTickets} showToast={showToast}/>;
      case "activite":  return <ActivitePage  tickets={tickets}/>;
      case "chatbot":   return <ChatbotPage   tickets={tickets}/>;
      default:          return <OverviewPage  tickets={tickets} setActivePage={setActivePage}/>;
    }
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="resp-layout">

        {/* SIDEBAR */}
        <aside className="sidebar">
          <Logo/>
          <div className="sidebar-nav">
            <div className="sidebar-section">Navigation</div>
            {navItems.map(item => (
              <button key={item.key} className={`nav-item${activePage === item.key ? " active" : ""}`} onClick={() => setActivePage(item.key)}>
                {item.icon}
                {item.label}
                {item.badge === "urgents" && urgent > 0 && <span className="nav-badge orange">{urgent}</span>}
              </button>
            ))}
          </div>
          <div className="sidebar-user">
            <div className="user-avatar">KA</div>
            <div>
              <div className="user-name">Karim Alami</div>
              <div className="user-role">Responsable — Informatique</div>
            </div>
          </div>
        </aside>

        {/* MAIN */}
        <div className="main-content">
          <header className="topbar">
            <div className="topbar-title">{pageTitles[activePage]}</div>
            <div className="topbar-right">
              <span className="service-pill">🖥️ Service Informatique</span>

              {/* NOTIFS */}
              <div className="notif-wrap" ref={notifRef}>
                <button className="icon-btn" onClick={() => setShowNotifs(!showNotifs)}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1.5a5 5 0 015 5v2.5l1 2H1l1-2V6.5a5 5 0 015-5z" stroke="#6B7280" strokeWidth="1.4"/><path d="M6.5 13.5a1.5 1.5 0 003 0" stroke="#6B7280" strokeWidth="1.4"/></svg>
                  {unread > 0 && <span className="notif-count">{unread}</span>}
                </button>
                {showNotifs && (
                  <div className="notif-dropdown">
                    <div className="notif-header">
                      <span className="notif-header-title">Notifications</span>
                      <button className="notif-mark-all" onClick={() => setNotifs(p => p.map(n => ({ ...n, unread: false })))}>Tout lu</button>
                    </div>
                    {notifs.map(n => (
                      <div key={n.id} className={`notif-item${n.unread ? " unread" : ""}`}
                        onClick={() => setNotifs(p => p.map(x => x.id === n.id ? { ...x, unread: false } : x))}>
                        <div className="notif-icon" style={{ background: n.bg }}>{n.icon}</div>
                        <div>
                          <div className="notif-text">{n.text}</div>
                          <div className="notif-time">{n.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* LOGOUT */}
              <button className="icon-btn" onClick={() => navigate("/")} title="Déconnexion">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 14H3a1 1 0 01-1-1V3a1 1 0 011-1h3M10 11l3-3-3-3M13 8H6" stroke="#6B7280" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </div>
          </header>

          <div className="page-body">{renderPage()}</div>
        </div>
      </div>

      {toast && <div className="toast">{toast}</div>}
    </>
  );
}
