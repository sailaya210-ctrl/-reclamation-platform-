import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usersAPI } from "./api";
import { useAuth } from "./AuthContext";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'DM Sans', sans-serif; background: #F4F5FA; color: #0F1117; }
  .dash-layout { display: flex; min-height: 100vh; }

  .sidebar { width: 220px; background: #fff; border-right: 1px solid rgba(0,0,0,0.06); display: flex; flex-direction: column; position: fixed; top: 0; left: 0; height: 100vh; z-index: 50; }
  .sidebar-logo { display: flex; align-items: center; gap: 8px; padding: 20px 20px 16px; border-bottom: 1px solid rgba(0,0,0,0.06); }
  .sidebar-logo span { font-family: 'Sora', sans-serif; font-weight: 700; font-size: 15.5px; color: #0F1117; letter-spacing: -0.3px; }
  .sidebar-nav { flex: 1; padding: 16px 12px; display: flex; flex-direction: column; gap: 4px; overflow-y: auto; }
  .nav-item { display: flex; align-items: center; gap: 10px; padding: 9px 12px; border-radius: 9px; cursor: pointer; font-size: 13.5px; color: #6B7280; font-weight: 400; transition: all 0.18s; border: none; background: none; width: 100%; text-align: left; font-family: 'DM Sans', sans-serif; }
  .nav-item:hover { background: #F4F5FA; color: #0F1117; }
  .nav-item.active { background: #EEF2FF; color: #4F46E5; font-weight: 500; }
  .sidebar-user { padding: 14px 16px; border-top: 1px solid rgba(0,0,0,0.06); display: flex; align-items: center; gap: 10px; }
  .user-avatar { width: 34px; height: 34px; border-radius: 50%; background: #4F46E5; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; color: #fff; flex-shrink: 0; }
  .user-name { font-size: 13px; font-weight: 500; color: #0F1117; }
  .user-role { font-size: 10.5px; color: #9CA3AF; }

  .main-content { margin-left: 220px; flex: 1; display: flex; flex-direction: column; min-height: 100vh; }

  .topbar { height: 60px; background: #fff; border-bottom: 1px solid rgba(0,0,0,0.06); display: flex; align-items: center; justify-content: space-between; padding: 0 32px; position: sticky; top: 0; z-index: 40; }
  .topbar-title { font-family: 'Sora', sans-serif; font-size: 18px; font-weight: 700; color: #0F1117; letter-spacing: -0.4px; }

  .search-wrap { position: relative; width: 300px; }
  .search-bar { display: flex; align-items: center; gap: 8px; background: #F4F5FA; border: 1.5px solid #E5E7EB; border-radius: 10px; padding: 8px 14px; transition: all 0.2s; }
  .search-bar.focused { border-color: #4F46E5; background: #fff; box-shadow: 0 0 0 3px rgba(79,70,229,0.08); }
  .search-bar input { background: none; border: none; outline: none; font-size: 13px; color: #0F1117; width: 100%; font-family: 'DM Sans', sans-serif; }
  .search-bar input::placeholder { color: #9CA3AF; }
  .search-dropdown { position: absolute; top: calc(100% + 6px); left: 0; right: 0; background: #fff; border: 1px solid #E5E7EB; border-radius: 12px; box-shadow: 0 8px 32px rgba(0,0,0,0.12); z-index: 200; overflow: hidden; }
  .search-result-item { display: flex; align-items: center; gap: 10px; padding: 10px 14px; cursor: pointer; transition: background 0.15s; border-bottom: 1px solid #F9FAFB; }
  .search-result-item:last-child { border-bottom: none; }
  .search-result-item:hover { background: #F4F5FA; }
  .sr-id { font-family: monospace; font-size: 10.5px; color: #9CA3AF; min-width: 72px; }
  .sr-title { font-size: 13px; color: #111827; font-weight: 500; flex: 1; }
  .sr-badge { font-size: 9px; font-weight: 700; padding: 2px 6px; border-radius: 4px; text-transform: uppercase; }
  .search-empty { padding: 20px; text-align: center; font-size: 13px; color: #9CA3AF; }

  .topbar-icons { display: flex; align-items: center; gap: 8px; }
  .icon-btn { width: 36px; height: 36px; border-radius: 9px; border: 1px solid #E5E7EB; background: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center; position: relative; transition: background 0.15s; }
  .icon-btn:hover { background: #F4F5FA; }
  .notif-count { position: absolute; top: -5px; right: -5px; width: 17px; height: 17px; border-radius: 50%; background: #EF4444; border: 2px solid #fff; display: flex; align-items: center; justify-content: center; font-size: 8px; font-weight: 700; color: #fff; }

  .notif-wrap { position: relative; }
  .notif-dropdown { position: absolute; top: calc(100% + 10px); right: 0; width: 340px; background: #fff; border: 1px solid #E5E7EB; border-radius: 16px; box-shadow: 0 16px 48px rgba(0,0,0,0.14); z-index: 300; overflow: hidden; }
  .notif-header { display: flex; align-items: center; justify-content: space-between; padding: 14px 16px; border-bottom: 1px solid #F3F4F6; }
  .notif-header-title { font-family: 'Sora', sans-serif; font-size: 14px; font-weight: 600; color: #0F1117; }
  .notif-mark-all { font-size: 11px; color: #4F46E5; cursor: pointer; font-weight: 500; background: none; border: none; font-family: 'DM Sans', sans-serif; }
  .notif-item { display: flex; align-items: flex-start; gap: 10px; padding: 12px 16px; border-bottom: 1px solid #F9FAFB; cursor: pointer; transition: background 0.15s; position: relative; }
  .notif-item:last-child { border-bottom: none; }
  .notif-item:hover { background: #FAFBFF; }
  .notif-item.unread { background: #FAFBFF; }
  .notif-item.unread::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 3px; background: #4F46E5; border-radius: 0 2px 2px 0; }
  .notif-icon { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 14px; flex-shrink: 0; }
  .notif-text { font-size: 12.5px; color: #374151; line-height: 1.5; flex: 1; }
  .notif-text strong { color: #0F1117; font-weight: 600; }
  .notif-time { font-size: 10.5px; color: #B0B7C3; margin-top: 3px; }
  .notif-footer { padding: 10px 16px; }
  .btn-notif-all { width: 100%; padding: 9px; background: #F4F5FA; border: 1px solid #E5E7EB; border-radius: 8px; font-size: 11.5px; font-weight: 600; color: #374151; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: background 0.15s; }
  .btn-notif-all:hover { background: #EEF2FF; color: #4F46E5; }

  .page-body { padding: 28px 32px; flex: 1; }

  .stat-cards { display: grid; grid-template-columns: repeat(5, 1fr); gap: 14px; margin-bottom: 24px; }
  .stat-card { background: #fff; border-radius: 14px; border: 1px solid rgba(0,0,0,0.06); padding: 18px 20px; cursor: pointer; transition: transform 0.18s, box-shadow 0.18s; }
  .stat-card:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(0,0,0,0.07); }
  .stat-card.urgent { border: 2px solid #4F46E5; background: #FAFBFF; }
  .stat-label { font-size: 9.5px; font-weight: 600; color: #9CA3AF; letter-spacing: 0.8px; text-transform: uppercase; margin-bottom: 8px; }
  .stat-value { font-family: 'Sora', sans-serif; font-size: 26px; font-weight: 700; color: #0F1117; letter-spacing: -0.6px; }
  .stat-card.urgent .stat-value { color: #4F46E5; }
  .stat-badge { display: inline-flex; align-items: center; gap: 3px; font-size: 10.5px; font-weight: 500; margin-top: 6px; border-radius: 5px; padding: 2px 6px; }
  .stat-badge.up { background: #D1FAE5; color: #059669; }
  .stat-badge.down { background: #FEE2E2; color: #DC2626; }
  .stat-badge.neutral { background: #F3F4F6; color: #6B7280; }

  .charts-row { display: grid; grid-template-columns: 1fr 340px; gap: 18px; margin-bottom: 24px; }
  .chart-card { background: #fff; border-radius: 16px; border: 1px solid rgba(0,0,0,0.06); padding: 22px 24px; }
  .chart-title { font-family: 'Sora', sans-serif; font-size: 14px; font-weight: 600; color: #0F1117; margin-bottom: 16px; }
  .chart-legend { display: flex; gap: 16px; margin-bottom: 18px; }
  .legend-item { display: flex; align-items: center; gap: 5px; font-size: 11px; color: #6B7280; }
  .legend-dot { width: 7px; height: 7px; border-radius: 50%; }

  .bar-chart { display: flex; align-items: flex-end; gap: 18px; height: 160px; padding-bottom: 24px; position: relative; }
  .bar-chart::after { content: ''; position: absolute; bottom: 24px; left: 0; right: 0; height: 1px; background: #F3F4F6; }
  .bar-group { display: flex; flex-direction: column; align-items: center; gap: 4px; flex: 1; position: relative; }
  .bars { display: flex; gap: 3px; align-items: flex-end; height: 130px; }
  .bar { width: 10px; border-radius: 4px 4px 0 0; transition: opacity 0.2s; cursor: pointer; }
  .bar:hover { opacity: 0.7; }
  .bar.soumis { background: #C7D2FE; }
  .bar.resolus { background: #10B981; }
  .bar.urgents { background: #F87171; }
  .bar-label { font-size: 10px; color: #B0B7C3; font-weight: 500; }
  .bar-active .bar-label { color: #4F46E5; font-weight: 600; }
  .bar-tooltip { position: absolute; top: -38px; left: 50%; transform: translateX(-50%); background: #1C1C2E; color: #fff; font-size: 10px; padding: 4px 8px; border-radius: 6px; white-space: nowrap; pointer-events: none; z-index: 10; }

  .donut-wrap { display: flex; flex-direction: column; gap: 10px; }
  .donut-svg-wrap { display: flex; justify-content: center; margin: 8px 0 12px; }
  .service-row { display: flex; align-items: center; justify-content: space-between; padding: 3px 0; }
  .service-left { display: flex; align-items: center; gap: 8px; font-size: 12.5px; color: #374151; }
  .service-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
  .service-pct { font-size: 12.5px; font-weight: 600; color: #0F1117; }

  .bottom-row { display: grid; grid-template-columns: 1fr 340px; gap: 18px; }
  .intervenant-row { display: flex; align-items: center; gap: 12px; padding: 12px 0; border-bottom: 1px solid #F3F4F6; }
  .intervenant-row:last-child { border-bottom: none; }
  .rank { font-size: 11px; font-weight: 600; color: #B0B7C3; width: 20px; text-align: center; }
  .int-avatar { width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; color: #fff; flex-shrink: 0; }
  .int-name { font-size: 13px; font-weight: 500; color: #111827; }
  .int-role { font-size: 10.5px; color: #9CA3AF; }
  .int-right { margin-left: auto; text-align: right; }
  .int-pct { font-size: 11px; color: #059669; font-weight: 600; margin-bottom: 4px; }
  .prog-bar-bg { width: 90px; height: 4px; background: #F0F0FF; border-radius: 99px; overflow: hidden; }
  .prog-bar-fill { height: 4px; background: linear-gradient(90deg, #4F46E5, #818CF8); border-radius: 99px; }

  .activity-item { display: flex; align-items: flex-start; gap: 10px; padding: 10px 0; border-bottom: 1px solid #F3F4F6; }
  .activity-item:last-child { border-bottom: none; }
  .act-icon { width: 30px; height: 30px; border-radius: 8px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 13px; }
  .act-text { font-size: 12.5px; color: #374151; line-height: 1.5; }
  .act-text strong { font-weight: 600; color: #0F1117; }
  .act-time { font-size: 10.5px; color: #B0B7C3; margin-top: 2px; }

  /* TICKETS PAGE */
  .tickets-toolbar { display: flex; align-items: center; gap: 10px; margin-bottom: 18px; flex-wrap: wrap; }
  .filter-select { padding: 7px 12px; border: 1px solid #E5E7EB; border-radius: 8px; font-size: 12.5px; color: #374151; background: #fff; outline: none; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: border-color 0.2s; }
  .filter-select:focus { border-color: #4F46E5; }
  .tickets-count { font-size: 12px; color: #9CA3AF; margin-left: auto; }
  .tickets-table { width: 100%; border-collapse: collapse; }
  .tickets-table th { font-size: 10px; font-weight: 600; color: #9CA3AF; letter-spacing: 0.7px; text-transform: uppercase; padding: 10px 14px; text-align: left; border-bottom: 1px solid #F3F4F6; }
  .tickets-table td { padding: 12px 14px; font-size: 13px; color: #374151; border-bottom: 1px solid #F9FAFB; }
  .tickets-table tr:hover td { background: #FAFBFF; cursor: pointer; }
  .tick-badge { font-size: 9.5px; font-weight: 700; padding: 3px 8px; border-radius: 5px; text-transform: uppercase; letter-spacing: 0.4px; }
  .tick-badge.urgent { background: #FEE2E2; color: #DC2626; }
  .tick-badge.cours { background: #FEF3C7; color: #D97706; }
  .tick-badge.resolu { background: #D1FAE5; color: #059669; }
  .tick-badge.attente { background: #F3F4F6; color: #6B7280; }
  .tick-badge.normal { background: #F3F4F6; color: #6B7280; }

  /* TICKET DETAIL PANEL */
  .detail-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.3); z-index: 400; display: flex; justify-content: flex-end; }
  .detail-panel { width: 420px; background: #fff; height: 100%; overflow-y: auto; padding: 28px 24px; box-shadow: -8px 0 40px rgba(0,0,0,0.12); }
  .detail-close { display: flex; align-items: center; justify-content: space-between; margin-bottom: 22px; }
  .detail-close-btn { width: 30px; height: 30px; border-radius: 8px; border: 1px solid #E5E7EB; background: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 16px; color: #6B7280; transition: background 0.15s; }
  .detail-close-btn:hover { background: #F4F5FA; }
  .detail-id { font-family: monospace; font-size: 11px; color: #9CA3AF; }
  .detail-title { font-family: 'Sora', sans-serif; font-size: 18px; font-weight: 700; color: #0F1117; margin: 10px 0 6px; }
  .detail-meta { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 20px; }
  .detail-divider { height: 1px; background: #F3F4F6; margin: 16px 0; }
  .detail-row { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; }
  .detail-key { font-size: 12px; color: #9CA3AF; font-weight: 500; }
  .detail-val { font-size: 13px; color: #111827; font-weight: 500; }
  .statut-select { padding: 6px 12px; border: 1px solid #E5E7EB; border-radius: 7px; font-size: 12.5px; color: #374151; background: #fff; outline: none; cursor: pointer; font-family: 'DM Sans', sans-serif; }
  .comment-box { width: 100%; border: 1px solid #E5E7EB; border-radius: 9px; padding: 10px 12px; font-size: 13px; font-family: 'DM Sans', sans-serif; color: #0F1117; resize: none; outline: none; transition: border-color 0.2s; margin-top: 12px; }
  .comment-box:focus { border-color: #4F46E5; }
  .btn-comment { margin-top: 10px; padding: 9px 18px; background: #4F46E5; color: #fff; border: none; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: 'Sora', sans-serif; transition: background 0.2s; }
  .btn-comment:hover { background: #4338CA; }
  .comment-item { padding: 10px 0; border-bottom: 1px solid #F9FAFB; }
  .comment-item:last-child { border-bottom: none; }
  .comment-author { font-size: 12px; font-weight: 600; color: #111827; }
  .comment-time { font-size: 10.5px; color: #B0B7C3; margin-left: 6px; }
  .comment-body { font-size: 12.5px; color: #374151; margin-top: 4px; line-height: 1.5; }

  /* USERS */
  .user-row { display: flex; align-items: center; gap: 12px; padding: 12px 0; border-bottom: 1px solid #F3F4F6; }
  .user-row:last-child { border-bottom: none; }
  .ur-avatar { width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; color: #fff; flex-shrink: 0; }
  .ur-name { font-size: 13px; font-weight: 500; color: #111827; }
  .ur-email { font-size: 11px; color: #9CA3AF; }
  .ur-role-badge { font-size: 10px; font-weight: 600; padding: 3px 8px; border-radius: 5px; }
  .ur-role-badge.admin { background: #EEF2FF; color: #4F46E5; }
  .ur-role-badge.resp { background: #FEF3C7; color: #D97706; }
  .ur-role-badge.emp { background: #F3F4F6; color: #6B7280; }
  .btn-delete { margin-left: 8px; padding: 5px 10px; background: #FEE2E2; color: #DC2626; border: none; border-radius: 6px; font-size: 11px; font-weight: 600; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: background 0.15s; }
  .btn-delete:hover { background: #FECACA; }

  /* MODAL ADD USER */
  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.35); z-index: 500; display: flex; align-items: center; justify-content: center; }
  .modal-box { background: #fff; border-radius: 18px; padding: 32px 28px; width: 400px; box-shadow: 0 20px 60px rgba(0,0,0,0.18); }
  .modal-title { font-family: 'Sora', sans-serif; font-size: 18px; font-weight: 700; color: #0F1117; margin-bottom: 22px; }
  .modal-field { margin-bottom: 16px; }
  .modal-label { font-size: 10.5px; font-weight: 600; color: #9CA3AF; text-transform: uppercase; letter-spacing: 0.7px; margin-bottom: 7px; display: block; }
  .modal-input { width: 100%; padding: 10px 13px; border: 1px solid #E5E7EB; border-radius: 9px; font-size: 13.5px; font-family: 'DM Sans', sans-serif; color: #0F1117; outline: none; transition: border-color 0.2s; }
  .modal-input:focus { border-color: #4F46E5; }
  .modal-actions { display: flex; gap: 10px; margin-top: 22px; }
  .btn-cancel { flex: 1; padding: 10px; background: #F4F5FA; border: 1px solid #E5E7EB; border-radius: 9px; font-size: 13px; cursor: pointer; font-family: 'DM Sans', sans-serif; color: #374151; }
  .btn-confirm { flex: 1; padding: 10px; background: #4F46E5; border: none; border-radius: 9px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: 'Sora', sans-serif; color: #fff; transition: background 0.2s; }
  .btn-confirm:hover { background: #4338CA; }

  /* PARAMS */
  .param-row { display: flex; align-items: center; justify-content: space-between; padding: 13px 0; border-bottom: 1px solid #F3F4F6; }
  .param-label { font-size: 13px; color: #374151; }
  .param-sub { font-size: 11px; color: #9CA3AF; margin-top: 2px; }
  .param-section-title { font-family: 'Sora', sans-serif; font-size: 14px; font-weight: 600; color: #0F1117; margin-bottom: 14px; }
  .toggle { width: 40px; height: 22px; border-radius: 99px; border: none; cursor: pointer; transition: background 0.2s; position: relative; flex-shrink: 0; }
  .toggle.on { background: #4F46E5; }
  .toggle.off { background: #D1D5DB; }
  .toggle::after { content: ''; position: absolute; top: 3px; width: 16px; height: 16px; border-radius: 50%; background: #fff; transition: left 0.2s; }
  .toggle.on::after { left: 21px; }
  .toggle.off::after { left: 3px; }
  .btn-save { background: #4F46E5; color: #fff; border: none; border-radius: 9px; padding: 10px 22px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: 'Sora', sans-serif; margin-top: 16px; transition: background 0.2s; }
  .btn-save:hover { background: #4338CA; }
  .btn-add { background: #4F46E5; color: #fff; border: none; border-radius: 9px; padding: 8px 16px; font-size: 12px; font-weight: 600; cursor: pointer; font-family: 'Sora', sans-serif; transition: background 0.2s; }
  .btn-add:hover { background: #4338CA; }

  /* STATS */
  .stats-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 18px; }
  .stats-big-card { background: #fff; border-radius: 16px; border: 1px solid rgba(0,0,0,0.06); padding: 22px 24px; }

  /* TOAST */
  .toast { position: fixed; bottom: 28px; right: 28px; background: #1C1C2E; color: #fff; padding: 12px 20px; border-radius: 10px; font-size: 13px; font-weight: 500; z-index: 999; box-shadow: 0 8px 28px rgba(0,0,0,0.2); display: flex; align-items: center; gap: 8px; animation: slideUp 0.3s ease; }
  @keyframes slideUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
`;

// ── DATA ─────────────────────────────────────────────────
const TICKETS_INIT = [
  { id: "ID-98250", titre: "Panne serveur principal",  service: "Informatique", priorite: "urgent", statut: "cours",   date: "20/04/2026", assign: "Karim A.",   comments: [{ author: "Karim A.", time: "Il y a 10 min", body: "Je regarde ça maintenant." }] },
  { id: "ID-98110", titre: "Remboursement médical",    service: "RH",           priorite: "normal", statut: "attente", date: "19/04/2026", assign: "Sarah L.",   comments: [] },
  { id: "ID-97904", titre: "Livraison manquante",      service: "Logistique",   priorite: "normal", statut: "resolu",  date: "18/04/2026", assign: "Zakaria A.", comments: [{ author: "Admin", time: "Hier", body: "Ticket clôturé avec succès." }] },
  { id: "ID-97800", titre: "Accès refusé CRM",         service: "Informatique", priorite: "urgent", statut: "cours",   date: "17/04/2026", assign: "Karim A.",   comments: [] },
  { id: "ID-97650", titre: "Facture incorrecte",       service: "Finance",      priorite: "normal", statut: "attente", date: "16/04/2026", assign: "Aya S.",     comments: [] },
  { id: "ID-97500", titre: "Climatisation en panne",   service: "Extérieure",   priorite: "normal", statut: "resolu",  date: "15/04/2026", assign: "Omar A.",    comments: [] },
  { id: "ID-97300", titre: "Problème imprimante",      service: "Informatique", priorite: "normal", statut: "resolu",  date: "14/04/2026", assign: "Sarah L.",   comments: [] },
  { id: "ID-97100", titre: "Badge accès refusé",       service: "RH",           priorite: "urgent", statut: "cours",   date: "13/04/2026", assign: "Aya S.",     comments: [] },
  { id: "ID-96900", titre: "Logiciel non mis à jour",  service: "Informatique", priorite: "normal", statut: "attente", date: "12/04/2026", assign: "Zakaria A.", comments: [] },
  { id: "ID-96700", titre: "Colis endommagé",          service: "Logistique",   priorite: "normal", statut: "resolu",  date: "11/04/2026", assign: "Omar A.",    comments: [] },
];

const USERS_INIT = [
  { initials: "AA", nom: "Ahmed Ataki",    email: "ahmed@bayan.ma",   role: "admin", color: "#4F46E5" },
  { initials: "KA", nom: "Karim Alami",    email: "karim@bayan.ma",   role: "resp",  color: "#10B981" },
  { initials: "SL", nom: "Sarah Lemarié",  email: "sarah@bayan.ma",   role: "emp",   color: "#F59E0B" },
  { initials: "ZA", nom: "Zakaria Achraf", email: "zakaria@bayan.ma", role: "emp",   color: "#8B5CF6" },
  { initials: "AS", nom: "Aya Saïl",       email: "aya@bayan.ma",     role: "resp",  color: "#EC4899" },
  { initials: "OM", nom: "Omar Almsaddek", email: "omar@bayan.ma",    role: "emp",   color: "#0EA5E9" },
];

const NOTIFS_INIT = [
  { id: 1, icon: "🔵", bg: "#EEF2FF", text: <><strong>Nouvelle réclamation ID-98250</strong> créée</>, time: "À l'instant", unread: true },
  { id: 2, icon: "✅", bg: "#D1FAE5", text: <><strong>ID-97904</strong> marquée comme résolue</>, time: "Il y a 12 min", unread: true },
  { id: 3, icon: "✏️", bg: "#FEF3C7", text: <>Statut mis à jour pour <strong>ID-98110</strong></>, time: "Il y a 45 min", unread: true },
  { id: 4, icon: "🔴", bg: "#FEE2E2", text: <>Alerte : <strong>5 réclamations</strong> en retard</>, time: "Il y a 1h", unread: false },
  { id: 5, icon: "👤", bg: "#F3F4F6", text: <>Nouvel utilisateur <strong>Jules Verne</strong> ajouté</>, time: "Il y a 2h", unread: false },
];

const statutLabel = { urgent: "Urgent", cours: "En cours", resolu: "Résolu", attente: "En attente" };
const roleLabel   = { admin: "Admin", resp: "Responsable", emp: "Employé" };
const colors      = ["#4F46E5","#10B981","#F59E0B","#8B5CF6","#EC4899","#0EA5E9","#EF4444","#14B8A6"];

const barData = [
  { label: "NOV", soumis: 80,  resolus: 60,  urgents: 15 },
  { label: "DEC", soumis: 95,  resolus: 75,  urgents: 18 },
  { label: "JAN", soumis: 70,  resolus: 55,  urgents: 12 },
  { label: "FEV", soumis: 110, resolus: 88,  urgents: 22 },
  { label: "MAR", soumis: 167, resolus: 130, urgents: 30, active: true },
  { label: "AVR", soumis: 40,  resolus: 30,  urgents: 8  },
];

const services = [
  { name: "Informatique", pct: 38, color: "#4F46E5" },
  { name: "Logistique",   pct: 24, color: "#10B981" },
  { name: "RH",           pct: 19, color: "#F59E0B" },
  { name: "Finance",      pct: 12, color: "#8B5CF6" },
  { name: "Extérieure",   pct: 7,  color: "#9CA3AF" },
];

const intervenants = [
  { rank: "🏆", initials: "KA", name: "Karim Alami",      role: "Superviseur Logistique",  pct: 98, color: "#4F46E5" },
  { rank: "#2", initials: "SL", name: "Sarah Lemarié",    role: "Support Client Senior",   pct: 92, color: "#10B981" },
  { rank: "#3", initials: "ZA", name: "Zakaria Achraf",   role: "Technicien IT",           pct: 89, color: "#F59E0B" },
  { rank: "#4", initials: "AS", name: "Aya Saïl",         role: "Responsable Facturation", pct: 85, color: "#8B5CF6" },
  { rank: "#5", initials: "OM", name: "Omar Almsaddek",   role: "Agent de maintenance",    pct: 81, color: "#EC4899" },
];

// ── HELPERS ───────────────────────────────────────────────
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

const Toggle = ({ init = true }) => {
  const [on, setOn] = useState(init);
  return <button className={`toggle ${on ? "on" : "off"}`} onClick={() => setOn(!on)} />;
};

const BarChart = ({ onBarClick }) => {
  const [hovered, setHovered] = useState(null);
  return (
    <div>
      <div className="chart-legend">
        <div className="legend-item"><div className="legend-dot" style={{ background: "#C7D2FE" }} />Soumises</div>
        <div className="legend-item"><div className="legend-dot" style={{ background: "#10B981" }} />Résolues</div>
        <div className="legend-item"><div className="legend-dot" style={{ background: "#F87171" }} />Urgentes</div>
      </div>
      <div className="bar-chart">
        {barData.map((d) => (
          <div key={d.label} className={`bar-group${d.active ? " bar-active" : ""}`}
            onMouseEnter={() => setHovered(d.label)} onMouseLeave={() => setHovered(null)}>
            {hovered === d.label && (
              <div className="bar-tooltip">S:{d.soumis} R:{d.resolus} U:{d.urgents}</div>
            )}
            <div className="bars">
              <div className="bar soumis"  style={{ height: `${(d.soumis  / 167) * 120}px` }} onClick={() => onBarClick && onBarClick(d)} />
              <div className="bar resolus" style={{ height: `${(d.resolus / 167) * 120}px` }} onClick={() => onBarClick && onBarClick(d)} />
              <div className="bar urgents" style={{ height: `${(d.urgents / 167) * 120}px` }} onClick={() => onBarClick && onBarClick(d)} />
            </div>
            <span className="bar-label">{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const Donut = () => {
  let cumulative = 0;
  const r = 54; const cx = 70; const cy = 70;
  const circumference = 2 * Math.PI * r;
  const segments = services.map((s) => { const offset = cumulative; cumulative += s.pct; return { ...s, offset }; });
  return (
    <div className="donut-wrap">
      <div className="donut-svg-wrap">
        <svg width="140" height="140" viewBox="0 0 140 140">
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="#F3F4F6" strokeWidth="18"/>
          {segments.map((s) => (
            <circle key={s.name} cx={cx} cy={cy} r={r} fill="none" stroke={s.color} strokeWidth="18"
              strokeDasharray={`${(s.pct/100)*circumference} ${circumference}`}
              strokeDashoffset={-((s.offset/100)*circumference)}
              style={{ transform: "rotate(-90deg)", transformOrigin: "70px 70px" }}/>
          ))}
          <text x={cx} y={cy-5} textAnchor="middle" fontSize="18" fontWeight="700" fill="#0F1117" fontFamily="Sora">1,284</text>
          <text x={cx} y={cy+13} textAnchor="middle" fontSize="9" fill="#9CA3AF" fontFamily="DM Sans">TOTAL</text>
        </svg>
      </div>
      {services.map((s) => (
        <div className="service-row" key={s.name}>
          <div className="service-left"><div className="service-dot" style={{ background: s.color }}/>{s.name}</div>
          <span className="service-pct">{s.pct}%</span>
        </div>
      ))}
    </div>
  );
};

// ── TICKET DETAIL PANEL ───────────────────────────────────
const TicketDetail = ({ ticket, onClose, onUpdateStatut, onAddComment }) => {
  const [comment, setComment] = useState("");
  const [statut, setStatut] = useState(ticket.statut);

  const handleStatut = (e) => {
    setStatut(e.target.value);
    onUpdateStatut(ticket.id, e.target.value);
  };

  const handleComment = () => {
    if (!comment.trim()) return;
    onAddComment(ticket.id, comment.trim());
    setComment("");
  };

  return (
    <div className="detail-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="detail-panel">
        <div className="detail-close">
          <span className="detail-id">{ticket.id}</span>
          <button className="detail-close-btn" onClick={onClose}>✕</button>
        </div>
        <div className="detail-title">{ticket.titre}</div>
        <div className="detail-meta">
          <span className={`tick-badge ${ticket.priorite === "urgent" ? "urgent" : "normal"}`}>{ticket.priorite}</span>
          <span className={`tick-badge ${statut}`}>{statutLabel[statut]}</span>
        </div>
        <div className="detail-divider"/>
        {[
          ["Service", ticket.service],
          ["Date", ticket.date],
          ["Assigné à", ticket.assign],
        ].map(([k, v]) => (
          <div className="detail-row" key={k}>
            <span className="detail-key">{k}</span>
            <span className="detail-val">{v}</span>
          </div>
        ))}
        <div className="detail-row">
          <span className="detail-key">Changer statut</span>
          <select className="statut-select" value={statut} onChange={handleStatut}>
            <option value="attente">En attente</option>
            <option value="cours">En cours</option>
            <option value="resolu">Résolu</option>
          </select>
        </div>
        <div className="detail-divider"/>
        <div className="chart-title" style={{ fontSize: 13, marginBottom: 10 }}>Commentaires ({ticket.comments.length})</div>
        {ticket.comments.length === 0 && <div style={{ fontSize: 12, color: "#B0B7C3", marginBottom: 10 }}>Aucun commentaire pour l'instant.</div>}
        {ticket.comments.map((c, i) => (
          <div className="comment-item" key={i}>
            <span className="comment-author">{c.author}</span>
            <span className="comment-time">{c.time}</span>
            <div className="comment-body">{c.body}</div>
          </div>
        ))}
        <textarea className="comment-box" rows={3} placeholder="Ajouter un commentaire..." value={comment} onChange={(e) => setComment(e.target.value)}/>
        <button className="btn-comment" onClick={handleComment}>Envoyer</button>
      </div>
    </div>
  );
};

// ── PAGES ─────────────────────────────────────────────────
const DashboardPage = ({ tickets, goToTickets }) => {
  const total   = tickets.length;
  const attente = tickets.filter(t => t.statut === "attente").length;
  const cours   = tickets.filter(t => t.statut === "cours").length;
  const resolus = tickets.filter(t => t.statut === "resolu").length;
  const urgents = tickets.filter(t => t.priorite === "urgent").length;

  return (
    <div>
      <div className="stat-cards">
        {[
          { label: "TOTAL DES RÉCLAMATIONS", value: total,   badge: "+12%", type: "up" },
          { label: "EN ATTENTE",             value: attente, badge: "+5%",  type: "up" },
          { label: "EN COURS",               value: cours,   badge: "-2%",  type: "down" },
          { label: "RÉSOLUES",               value: resolus, badge: "+18%", type: "up" },
          { label: "URGENTES",               value: urgents, badge: "— 0%", type: "neutral", urgent: true },
        ].map((s) => (
          <div key={s.label} className={`stat-card${s.urgent ? " urgent" : ""}`} onClick={goToTickets}>
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
            <span style={{ fontSize: 10.5, color: "#4F46E5", fontWeight: 600, letterSpacing: 0.4 }}>DÉTAILS DE PERFORMANCE</span>
          </div>
          {intervenants.map((i) => (
            <div className="intervenant-row" key={i.name}>
              <span className="rank">{i.rank}</span>
              <div className="int-avatar" style={{ background: i.color }}>{i.initials}</div>
              <div><div className="int-name">{i.name}</div><div className="int-role">{i.role}</div></div>
              <div className="int-right">
                <div className="int-pct">Résolution {i.pct}%</div>
                <div className="prog-bar-bg"><div className="prog-bar-fill" style={{ width: `${i.pct}%` }}/></div>
              </div>
            </div>
          ))}
        </div>
        <div className="chart-card">
          <div className="chart-title">Activité récente</div>
          {[
            { icon: "🔵", bg: "#EEF2FF", text: <><strong>Nouvelle réclamation ID-98250</strong> créée</>,          time: "À l'instant" },
            { icon: "✅", bg: "#D1FAE5", text: <><strong>ID-97904</strong> marquée comme résolue</>,              time: "Il y a 12 min" },
            { icon: "✏️", bg: "#FEF3C7", text: <>Statut mis à jour pour <strong>ID-98110</strong></>,            time: "Il y a 45 min" },
            { icon: "🔴", bg: "#FEE2E2", text: <>Alerte : <strong>5 réclamations</strong> en retard</>,          time: "Il y a 1h" },
            { icon: "👤", bg: "#F3F4F6", text: <>Nouvel utilisateur <strong>Jules Verne</strong> ajouté</>,      time: "Il y a 2h" },
          ].map((a, idx) => (
            <div className="activity-item" key={idx}>
              <div className="act-icon" style={{ background: a.bg }}>{a.icon}</div>
              <div><div className="act-text">{a.text}</div><div className="act-time">{a.time}</div></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const TicketsPage = ({ tickets, setTickets, showToast }) => {
  const [filterStatut,   setFilterStatut]   = useState("tous");
  const [filterService,  setFilterService]  = useState("tous");
  const [filterPriorite, setFilterPriorite] = useState("tous");
  const [searchLocal,    setSearchLocal]    = useState("");
  const [selected,       setSelected]       = useState(null);

  const filtered = tickets.filter(t => {
    const matchStatut    = filterStatut   === "tous" || t.statut   === filterStatut;
    const matchService   = filterService  === "tous" || t.service  === filterService;
    const matchPriorite  = filterPriorite === "tous" || t.priorite === filterPriorite;
    const matchSearch    = t.titre.toLowerCase().includes(searchLocal.toLowerCase()) ||
                           t.id.toLowerCase().includes(searchLocal.toLowerCase()) ||
                           t.service.toLowerCase().includes(searchLocal.toLowerCase());
    return matchStatut && matchService && matchPriorite && matchSearch;
  });

  const updateStatut = (id, newStatut) => {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, statut: newStatut } : t));
    if (selected?.id === id) setSelected(prev => ({ ...prev, statut: newStatut }));
    showToast("✅ Statut mis à jour !");
  };

  const addComment = (id, body) => {
    const newComment = { author: "Ahmed Ataki", time: "À l'instant", body };
    setTickets(prev => prev.map(t => t.id === id ? { ...t, comments: [...t.comments, newComment] } : t));
    if (selected?.id === id) setSelected(prev => ({ ...prev, comments: [...prev.comments, newComment] }));
    showToast("💬 Commentaire ajouté !");
  };

  const allServices = [...new Set(tickets.map(t => t.service))];

  return (
    <div>
      <div className="chart-card">
        <div className="tickets-toolbar">
          <input
            style={{ padding: "7px 12px", border: "1px solid #E5E7EB", borderRadius: 8, fontSize: 12.5, outline: "none", fontFamily: "'DM Sans',sans-serif", width: 180 }}
            placeholder="Chercher ticket..."
            value={searchLocal}
            onChange={e => setSearchLocal(e.target.value)}
          />
          <select className="filter-select" value={filterStatut} onChange={e => setFilterStatut(e.target.value)}>
            <option value="tous">Tous les statuts</option>
            <option value="attente">En attente</option>
            <option value="cours">En cours</option>
            <option value="resolu">Résolu</option>
          </select>
          <select className="filter-select" value={filterService} onChange={e => setFilterService(e.target.value)}>
            <option value="tous">Tous les services</option>
            {allServices.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select className="filter-select" value={filterPriorite} onChange={e => setFilterPriorite(e.target.value)}>
            <option value="tous">Toutes priorités</option>
            <option value="urgent">Urgent</option>
            <option value="normal">Normal</option>
          </select>
          <span className="tickets-count">{filtered.length} résultat{filtered.length !== 1 ? "s" : ""}</span>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table className="tickets-table">
            <thead>
              <tr><th>ID</th><th>Titre</th><th>Service</th><th>Priorité</th><th>Statut</th><th>Date</th><th>Assigné</th></tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: "center", padding: 28, color: "#9CA3AF", fontSize: 13 }}>Aucun ticket trouvé</td></tr>
              ) : filtered.map((t) => (
                <tr key={t.id} onClick={() => setSelected(t)}>
                  <td style={{ fontFamily: "monospace", fontSize: 11.5, color: "#9CA3AF" }}>{t.id}</td>
                  <td style={{ fontWeight: 500, color: "#111827" }}>{t.titre}</td>
                  <td>{t.service}</td>
                  <td><span className={`tick-badge ${t.priorite === "urgent" ? "urgent" : "normal"}`}>{t.priorite}</span></td>
                  <td><span className={`tick-badge ${t.statut}`}>{statutLabel[t.statut]}</span></td>
                  <td>{t.date}</td>
                  <td>{t.assign}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {selected && (
        <TicketDetail
          ticket={selected}
          onClose={() => setSelected(null)}
          onUpdateStatut={updateStatut}
          onAddComment={addComment}
        />
      )}
    </div>
  );
};

const UtilisateursPage = ({ users, setUsers, showToast }) => {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ nom: "", email: "", password: "", role: "emp" });

  const addUser = async () => {
    if (!form.nom.trim() || !form.email.trim() || !form.password.trim()) {
      showToast("⚠️ Veuillez remplir tous les champs.");
      return;
    }
    const initials = form.nom.trim().split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
    const newUser = { nom: form.nom, email: form.email, role: form.role, initials, color: colors[users.length % colors.length] };
    const roleMap = { emp: "employe", resp: "responsable", admin: "admin", intervenant: "intervenant" };
    try {
      await usersAPI.create({
        nom: form.nom.trim(),
        email: form.email.trim(),
        password: form.password.trim(),
        role: roleMap[form.role] || form.role,
      });
      setUsers(prev => [...prev, newUser]);
      setForm({ nom: "", email: "", password: "", role: "emp" });
      setShowModal(false);
      showToast("👤 Utilisateur ajouté ! Il peut maintenant se connecter.");
    } catch (err) {
      showToast("⚠️ Erreur: " + err.message);
    }
  };

  const deleteUser = (email) => {
    setUsers(prev => prev.filter(u => u.email !== email));
    showToast("🗑️ Utilisateur supprimé.");
  };

  return (
    <div className="chart-card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <div className="chart-title" style={{ marginBottom: 0 }}>Utilisateurs ({users.length})</div>
        <button className="btn-add" onClick={() => setShowModal(true)}>+ Ajouter</button>
      </div>
      {users.map((u) => (
        <div className="user-row" key={u.email}>
          <div className="ur-avatar" style={{ background: u.color }}>{u.initials}</div>
          <div>
            <div className="ur-name">{u.nom}</div>
            <div className="ur-email">{u.email}</div>
          </div>
          <span className={`ur-role-badge ${u.role}`} style={{ marginLeft: "auto" }}>{roleLabel[u.role]}</span>
          {u.role !== "admin" && (
            <button className="btn-delete" onClick={() => deleteUser(u.email)}>Supprimer</button>
          )}
        </div>
      ))}
      {showModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal-box">
            <div className="modal-title">Ajouter un utilisateur</div>
            {[
              { label: "Nom complet",  key: "nom",      type: "text",     placeholder: "ex: Mohammed Alami" },
              { label: "Email",        key: "email",    type: "email",    placeholder: "nom@bayan.ma" },
              { label: "Mot de passe", key: "password", type: "password", placeholder: "••••••••" },
            ].map(f => (
              <div className="modal-field" key={f.key}>
                <label className="modal-label">{f.label}</label>
                <input className="modal-input" type={f.type} placeholder={f.placeholder}
                  value={form[f.key]} onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}/>
              </div>
            ))}
            <div className="modal-field">
              <label className="modal-label">Rôle</label>
              <select className="modal-input" value={form.role} onChange={e => setForm(prev => ({ ...prev, role: e.target.value }))}>
                <option value="emp">Employé</option>
                <option value="resp">Responsable</option>
                <option value="intervenant">Intervenant</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowModal(false)}>Annuler</button>
              <button className="btn-confirm" onClick={addUser}>Ajouter</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StatistiquesPage = ({ tickets }) => {
  const total   = tickets.length;
  const resolus = tickets.filter(t => t.statut === "resolu").length;
  const taux    = Math.round((resolus / total) * 100);
  return (
    <div className="stats-grid">
      {[
        { title: "Taux de résolution",          value: `${taux}%`,  sub: `${resolus} résolues sur ${total}` },
        { title: "Délai moyen de résolution",   value: "24h",        sub: "En amélioration de 8% ce mois" },
        { title: "Satisfaction globale",        value: "98%",        sub: "Basé sur 890 évaluations" },
        { title: "Tickets traités aujourd'hui", value: "47",         sub: "+12 par rapport à hier" },
      ].map((s) => (
        <div className="stats-big-card" key={s.title}>
          <div className="stat-label">{s.title}</div>
          <div className="stat-value" style={{ fontSize: 36, margin: "10px 0 6px" }}>{s.value}</div>
          <div style={{ fontSize: 12, color: "#9CA3AF" }}>{s.sub}</div>
        </div>
      ))}
      <div className="stats-big-card" style={{ gridColumn: "1 / -1" }}>
        <div className="chart-title">Réclamations par mois</div>
        <BarChart />
      </div>
      <div className="stats-big-card" style={{ gridColumn: "1 / -1" }}>
        <div className="chart-title">Répartition par service</div>
        <Donut />
      </div>
    </div>
  );
};

const ParametresPage = () => (
  <div>
    {[
      { title: "Notifications", items: [
        { label: "Alertes email",        sub: "Recevoir les alertes par email",                 init: true  },
        { label: "Notifications push",   sub: "Activer les notifications navigateur",           init: false },
        { label: "Rapport hebdomadaire", sub: "Résumé chaque lundi matin",                      init: true  },
      ]},
      { title: "Sécurité", items: [
        { label: "Authentification 2FA",      sub: "Sécuriser l'accès par double authentification", init: true  },
        { label: "Session auto-déconnexion",  sub: "Après 30 minutes d'inactivité",                 init: false },
      ]},
      { title: "Système", items: [
        { label: "Mode sombre",   sub: "Interface en thème sombre",               init: false },
        { label: "Logs d'audit", sub: "Enregistrer toutes les actions admin",    init: true  },
      ]},
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

// ── NAV ITEMS ─────────────────────────────────────────────
const navItems = [
  { key: "dashboard", label: "Tableau de bord",
    icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.7"/><rect x="9" y="1" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.4"/><rect x="1" y="9" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.4"/><rect x="9" y="9" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.7"/></svg> },
  { key: "tickets",   label: "Réclamations",
    icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 4h12M2 8h8M2 12h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg> },
  { key: "stats",     label: "Statistiques",
    icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="8" width="3" height="7" rx="1" fill="currentColor" opacity="0.5"/><rect x="6" y="4" width="3" height="11" rx="1" fill="currentColor" opacity="0.7"/><rect x="11" y="1" width="3" height="14" rx="1" fill="currentColor"/></svg> },
  { key: "users",     label: "Utilisateurs",
    icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="6" cy="5" r="3" stroke="currentColor" strokeWidth="1.5"/><path d="M1 13c0-2.761 2.239-5 5-5s5 2.239 5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M11 7c1.657 0 3 1.343 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg> },
  { key: "params",    label: "Paramètres",
    icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.5"/><path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.05 3.05l1.414 1.414M11.536 11.536l1.414 1.414M3.05 12.95l1.414-1.414M11.536 4.464l1.414-1.414" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg> },
];

const pageTitles = { dashboard: "Gestion des Réclamations", tickets: "Toutes les Réclamations", stats: "Statistiques", users: "Utilisateurs", params: "Paramètres" };

// ── MAIN ──────────────────────────────────────────────────
export default function Dashboard() {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const [activePage,  setActivePage]  = useState("dashboard");
  const [tickets,     setTickets]     = useState(TICKETS_INIT);
  const [users,       setUsers]       = useState(USERS_INIT);
  const [notifs,      setNotifs]      = useState(NOTIFS_INIT);
  const [showNotifs,  setShowNotifs]  = useState(false);
  const [searchQ,     setSearchQ]     = useState("");
  const [searchFocus, setSearchFocus] = useState(false);
  const [toast,       setToast]       = useState(null);
  const notifRef = useRef(null);
  const toastTimer = useRef(null);

  const unreadCount = notifs.filter(n => n.unread).length;

  const showToast = (msg) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2800);
  };

  // Close notif dropdown on outside click
  useEffect(() => {
    const handler = (e) => { if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifs(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const markAllRead = () => setNotifs(prev => prev.map(n => ({ ...n, unread: false })));

  // Global search results
  const searchResults = searchQ.trim().length >= 1
    ? tickets.filter(t =>
        t.titre.toLowerCase().includes(searchQ.toLowerCase()) ||
        t.id.toLowerCase().includes(searchQ.toLowerCase()) ||
        t.service.toLowerCase().includes(searchQ.toLowerCase())
      ).slice(0, 6)
    : [];

  const handleSearchSelect = (ticket) => {
    setSearchQ("");
    setSearchFocus(false);
    setActivePage("tickets");
  };

  const renderPage = () => {
    switch (activePage) {
      case "dashboard": return <DashboardPage tickets={tickets} goToTickets={() => setActivePage("tickets")} />;
      case "tickets":   return <TicketsPage tickets={tickets} setTickets={setTickets} showToast={showToast} />;
      case "stats":     return <StatistiquesPage tickets={tickets} />;
      case "users":     return <UtilisateursPage users={users} setUsers={setUsers} showToast={showToast} />;
      case "params":    return <ParametresPage />;
      default:          return <DashboardPage tickets={tickets} goToTickets={() => setActivePage("tickets")} />;
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
              <button key={item.key} className={`nav-item${activePage === item.key ? " active" : ""}`} onClick={() => setActivePage(item.key)}>
                {item.icon}{item.label}
              </button>
            ))}
          </nav>
          <div className="sidebar-user">
            <div className="user-avatar" style={{ background: "#4F46E5" }}>
              {currentUser ? currentUser.nom.trim().split(" ").map(w => w[0]).join("").slice(0,2).toUpperCase() : "?"}
            </div>
            <div>
              <div className="user-name">{currentUser?.nom || "Utilisateur"}</div>
              <div className="user-role">{currentUser?.role || ""}</div>
            </div>
          </div>
        </aside>

        {/* MAIN */}
        <div className="main-content">
          <header className="topbar">
            <div className="topbar-title">{pageTitles[activePage]}</div>

            {/* GLOBAL SEARCH */}
            <div className="search-wrap">
              <div className={`search-bar${searchFocus ? " focused" : ""}`}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <circle cx="6" cy="6" r="4.5" stroke="#9CA3AF" strokeWidth="1.4"/>
                  <path d="M9.5 9.5L12 12" stroke="#9CA3AF" strokeWidth="1.4" strokeLinecap="round"/>
                </svg>
                <input
                  placeholder="Rechercher une réclamation..."
                  value={searchQ}
                  onChange={e => setSearchQ(e.target.value)}
                  onFocus={() => setSearchFocus(true)}
                  onBlur={() => setTimeout(() => setSearchFocus(false), 150)}
                />
                {searchQ && <span style={{ cursor: "pointer", color: "#9CA3AF", fontSize: 14 }} onClick={() => setSearchQ("")}>✕</span>}
              </div>
              {searchFocus && searchQ.trim().length >= 1 && (
                <div className="search-dropdown">
                  {searchResults.length === 0 ? (
                    <div className="search-empty">Aucun résultat pour "{searchQ}"</div>
                  ) : searchResults.map((t) => (
                    <div key={t.id} className="search-result-item" onMouseDown={() => handleSearchSelect(t)}>
                      <span className="sr-id">{t.id}</span>
                      <span className="sr-title">{t.titre}</span>
                      <span className="sr-service" style={{ fontSize: 11, color: "#9CA3AF" }}>{t.service}</span>
                      <span className={`tick-badge ${t.statut}`} style={{ fontSize: 9 }}>{statutLabel[t.statut]}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="topbar-icons">
              {/* NOTIFICATIONS */}
              <div className="notif-wrap" ref={notifRef}>
                <button className="icon-btn" onClick={() => setShowNotifs(!showNotifs)}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1.5a5 5 0 015 5v2.5l1 2H1l1-2V6.5a5 5 0 015-5z" stroke="#6B7280" strokeWidth="1.4"/><path d="M6.5 13.5a1.5 1.5 0 003 0" stroke="#6B7280" strokeWidth="1.4"/></svg>
                  {unreadCount > 0 && <span className="notif-count">{unreadCount}</span>}
                </button>
                {showNotifs && (
                  <div className="notif-dropdown">
                    <div className="notif-header">
                      <span className="notif-header-title">Notifications</span>
                      <button className="notif-mark-all" onClick={markAllRead}>Tout marquer lu</button>
                    </div>
                    {notifs.map((n) => (
                      <div key={n.id} className={`notif-item${n.unread ? " unread" : ""}`}
                        onClick={() => setNotifs(prev => prev.map(x => x.id === n.id ? { ...x, unread: false } : x))}>
                        <div className="notif-icon" style={{ background: n.bg }}>{n.icon}</div>
                        <div>
                          <div className="notif-text">{n.text}</div>
                          <div className="notif-time">{n.time}</div>
                        </div>
                      </div>
                    ))}
                    <div className="notif-footer">
                      <button className="btn-notif-all">Voir toutes les notifications</button>
                    </div>
                  </div>
                )}
              </div>

              {/* LOGOUT */}
              <button className="icon-btn" onClick={async () => { await logout(); navigate("/login"); }} title="Déconnexion">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 14H3a1 1 0 01-1-1V3a1 1 0 011-1h3M10 11l3-3-3-3M13 8H6" stroke="#6B7280" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </div>
          </header>

          <div className="page-body">{renderPage()}</div>
        </div>
      </div>

      {/* TOAST */}
      {toast && <div className="toast">{toast}</div>}
    </>
  );
}