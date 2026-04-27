import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import MessagerieePage, { MSG_CSS } from "./MessagerieePage";
import { ticketsAPI, usersAPI } from "./api";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'DM Sans', sans-serif; background: #F4F5FA; color: #0F1117; }
  .resp-layout { display: flex; min-height: 100vh; }

  .sidebar { width: 230px; background: #fff; border-right: 1px solid rgba(0,0,0,0.06); display: flex; flex-direction: column; position: fixed; top: 0; left: 0; height: 100vh; z-index: 50; }
  .sidebar-logo { display: flex; align-items: center; gap: 8px; padding: 20px 20px 16px; border-bottom: 1px solid rgba(0,0,0,0.06); }
  .sidebar-logo span { font-family: 'Sora', sans-serif; font-weight: 700; font-size: 15.5px; color: #0F1117; letter-spacing: -0.3px; }
  .sidebar-section { padding: 14px 12px 6px; font-size: 9.5px; font-weight: 700; color: #C4C9D4; letter-spacing: 1.1px; text-transform: uppercase; }
  .sidebar-nav { flex: 1; padding: 8px 12px; display: flex; flex-direction: column; gap: 3px; overflow-y: auto; }
  .nav-item { display: flex; align-items: center; gap: 10px; padding: 9px 12px; border-radius: 9px; cursor: pointer; font-size: 13px; color: #6B7280; font-weight: 400; transition: all 0.18s; border: none; background: none; width: 100%; text-align: left; font-family: 'DM Sans', sans-serif; }
  .nav-item:hover { background: #F4F5FA; color: #0F1117; }
  .nav-item.active { background: #EEF2FF; color: #4F46E5; font-weight: 500; }
  .nav-badge { margin-left: auto; font-size: 9px; font-weight: 700; padding: 2px 6px; border-radius: 99px; color: #fff; }
  .nav-badge.red { background: #EF4444; }
  .nav-badge.blue { background: #4F46E5; }
  .sidebar-user { padding: 14px 16px; border-top: 1px solid rgba(0,0,0,0.06); display: flex; align-items: center; gap: 10px; }
  .u-av { width: 34px; height: 34px; border-radius: 50%; background: #4F46E5; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; color: #fff; flex-shrink: 0; }
  .u-name { font-size: 13px; font-weight: 500; color: #0F1117; }
  .u-role { font-size: 10.5px; color: #9CA3AF; }

  .main-content { margin-left: 230px; flex: 1; display: flex; flex-direction: column; min-height: 100vh; }

  .topbar { height: 60px; background: #fff; border-bottom: 1px solid rgba(0,0,0,0.06); display: flex; align-items: center; justify-content: space-between; padding: 0 32px; position: sticky; top: 0; z-index: 40; }
  .topbar-title { font-family: 'Sora', sans-serif; font-size: 17px; font-weight: 700; color: #0F1117; letter-spacing: -0.4px; }
  .topbar-right { display: flex; align-items: center; gap: 10px; }
  .resp-pill { background: #EEF2FF; color: #4F46E5; font-size: 11px; font-weight: 600; padding: 5px 12px; border-radius: 99px; }
  .icon-btn { width: 36px; height: 36px; border-radius: 9px; border: 1px solid #E5E7EB; background: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center; position: relative; transition: background 0.15s; }
  .icon-btn:hover { background: #F4F5FA; }
  .notif-count { position: absolute; top: -5px; right: -5px; width: 17px; height: 17px; border-radius: 50%; background: #EF4444; border: 2px solid #fff; display: flex; align-items: center; justify-content: center; font-size: 8px; font-weight: 700; color: #fff; }

  .notif-wrap { position: relative; }
  .notif-dropdown { position: absolute; top: calc(100% + 10px); right: 0; width: 320px; background: #fff; border: 1px solid #E5E7EB; border-radius: 14px; box-shadow: 0 16px 48px rgba(0,0,0,0.13); z-index: 300; overflow: hidden; max-height: 400px; overflow-y: auto; }
  .notif-header { display: flex; align-items: center; justify-content: space-between; padding: 13px 16px; border-bottom: 1px solid #F3F4F6; position: sticky; top: 0; background: #fff; }
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

  .page-body { padding: 26px 30px; flex: 1; }
  .card { background: #fff; border-radius: 16px; border: 1px solid rgba(0,0,0,0.06); padding: 20px 22px; }
  .card-title { font-family: 'Sora', sans-serif; font-size: 14px; font-weight: 600; color: #0F1117; margin-bottom: 16px; }

  .stats-row { display: grid; grid-template-columns: repeat(5, 1fr); gap: 14px; margin-bottom: 22px; }
  .stat-card { background: #fff; border-radius: 14px; border: 1px solid rgba(0,0,0,0.06); padding: 16px 18px; transition: transform 0.18s, box-shadow 0.18s; cursor: pointer; }
  .stat-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.07); }
  .stat-card.highlight { border: 2px solid #4F46E5; }
  .stat-label { font-size: 9px; font-weight: 600; color: #9CA3AF; letter-spacing: 0.8px; text-transform: uppercase; margin-bottom: 7px; }
  .stat-value { font-family: 'Sora', sans-serif; font-size: 24px; font-weight: 700; color: #0F1117; letter-spacing: -0.5px; }
  .stat-card.highlight .stat-value { color: #4F46E5; }
  .stat-sub { font-size: 10px; margin-top: 5px; color: #9CA3AF; }
  .stat-sub.green { color: #059669; }
  .stat-sub.red { color: #DC2626; }

  .services-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-bottom: 22px; }
  .service-card { background: #fff; border-radius: 14px; border: 1px solid rgba(0,0,0,0.06); padding: 16px 18px; cursor: pointer; transition: all 0.18s; position: relative; overflow: hidden; }
  .service-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.08); }
  .service-name { font-family: 'Sora', sans-serif; font-size: 13px; font-weight: 600; color: #111827; margin-bottom: 10px; display: flex; align-items: center; gap: 7px; }
  .service-stats { display: flex; gap: 10px; }
  .sv-stat { flex: 1; text-align: center; padding: 7px 4px; background: #F4F5FA; border-radius: 8px; }
  .sv-stat-val { font-family: 'Sora', sans-serif; font-size: 15px; font-weight: 700; color: #111827; }
  .sv-stat-lbl { font-size: 8.5px; color: #9CA3AF; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 1px; }
  .sv-urgent-badge { position: absolute; top: 10px; right: 10px; background: #FEE2E2; color: #DC2626; font-size: 8.5px; font-weight: 700; padding: 2px 6px; border-radius: 5px; }

  .toolbar { display: flex; align-items: center; gap: 10px; margin-bottom: 16px; flex-wrap: wrap; }
  .filter-select { padding: 7px 11px; border: 1px solid #E5E7EB; border-radius: 8px; font-size: 12px; color: #374151; background: #fff; outline: none; cursor: pointer; font-family: 'DM Sans', sans-serif; }
  .filter-select:focus { border-color: #4F46E5; }
  .search-inline { padding: 7px 12px; border: 1px solid #E5E7EB; border-radius: 8px; font-size: 12px; outline: none; font-family: 'DM Sans', sans-serif; width: 200px; }
  .search-inline:focus { border-color: #4F46E5; outline: none; }
  .count-lbl { font-size: 11.5px; color: #9CA3AF; margin-left: auto; }
  .tickets-table { width: 100%; border-collapse: collapse; }
  .tickets-table th { font-size: 10px; font-weight: 600; color: #9CA3AF; letter-spacing: 0.7px; text-transform: uppercase; padding: 9px 13px; text-align: left; border-bottom: 1px solid #F3F4F6; }
  .tickets-table td { padding: 11px 13px; font-size: 12.5px; color: #374151; border-bottom: 1px solid #F9FAFB; }
  .tickets-table tr:hover td { background: #FAFBFF; cursor: pointer; }
  .tbadge { font-size: 9px; font-weight: 700; padding: 3px 7px; border-radius: 5px; text-transform: uppercase; letter-spacing: 0.3px; white-space: nowrap; }
  .tbadge.urgent { background: #FEE2E2; color: #DC2626; }
  .tbadge.cours { background: #FEF3C7; color: #D97706; }
  .tbadge.resolu { background: #D1FAE5; color: #059669; }
  .tbadge.attente { background: #F3F4F6; color: #6B7280; }
  .tbadge.normal { background: #F3F4F6; color: #6B7280; }

  .detail-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.28); z-index: 400; display: flex; justify-content: flex-end; }
  .detail-panel { width: 420px; background: #fff; height: 100%; overflow-y: auto; padding: 26px 22px; box-shadow: -8px 0 40px rgba(0,0,0,0.10); }
  .dp-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px; }
  .dp-id { font-family: monospace; font-size: 11px; color: #9CA3AF; }
  .close-btn { width: 28px; height: 28px; border-radius: 7px; border: 1px solid #E5E7EB; background: none; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 14px; color: #6B7280; }
  .close-btn:hover { background: #F4F5FA; }
  .dp-title { font-family: 'Sora', sans-serif; font-size: 16px; font-weight: 700; color: #0F1117; margin: 8px 0 6px; }
  .dp-meta { display: flex; gap: 7px; flex-wrap: wrap; margin-bottom: 14px; }
  .divider { height: 1px; background: #F3F4F6; margin: 14px 0; }
  .dp-row { display: flex; justify-content: space-between; align-items: center; padding: 7px 0; }
  .dk { font-size: 11.5px; color: #9CA3AF; }
  .dv { font-size: 12.5px; color: #111827; font-weight: 500; }
  .mini-select { padding: 5px 10px; border: 1px solid #E5E7EB; border-radius: 7px; font-size: 12px; background: #fff; outline: none; font-family: 'DM Sans', sans-serif; cursor: pointer; color: #374151; }
  .comment-box { width: 100%; border: 1px solid #E5E7EB; border-radius: 8px; padding: 9px 11px; font-size: 12.5px; font-family: 'DM Sans', sans-serif; resize: none; outline: none; transition: border-color 0.2s; margin-top: 10px; color: #0F1117; }
  .comment-box:focus { border-color: #4F46E5; }
  .btn-send { margin-top: 8px; padding: 8px 16px; background: #4F46E5; color: #fff; border: none; border-radius: 7px; font-size: 12.5px; font-weight: 600; cursor: pointer; font-family: 'Sora', sans-serif; }
  .btn-send:hover { background: #4338CA; }
  .comment-item { padding: 8px 0; border-bottom: 1px solid #F9FAFB; }
  .comment-item:last-child { border-bottom: none; }
  .c-author { font-size: 11.5px; font-weight: 600; color: #111827; }
  .c-time { font-size: 10px; color: #B0B7C3; }
  .c-body { font-size: 12px; color: #374151; line-height: 1.5; }
  .history-item { display: flex; gap: 10px; padding: 7px 0; border-bottom: 1px solid #F9FAFB; }
  .history-item:last-child { border-bottom: none; }
  .h-dot { width: 8px; height: 8px; border-radius: 50%; margin-top: 4px; flex-shrink: 0; }
  .h-action { font-size: 12px; color: #374151; }
  .h-time { font-size: 10px; color: #B0B7C3; margin-top: 1px; }

  .af-item { display: flex; gap: 12px; padding: 13px 0; border-bottom: 1px solid #F3F4F6; position: relative; }
  .af-item:last-child { border-bottom: none; }
  .af-line { position: absolute; left: 15px; top: 44px; bottom: -13px; width: 1px; background: #F3F4F6; }
  .af-icon { width: 30px; height: 30px; border-radius: 8px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 13px; z-index: 1; }
  .af-text { font-size: 13px; color: #374151; line-height: 1.5; }
  .af-text strong { color: #0F1117; font-weight: 600; }
  .af-time { font-size: 10.5px; color: #B0B7C3; margin-top: 2px; }
  .af-service { display: inline-block; margin-top: 4px; background: #F4F5FA; border-radius: 5px; padding: 2px 8px; font-size: 10.5px; color: #6B7280; }

  .toast { position: fixed; bottom: 24px; right: 24px; background: #1C1C2E; color: #fff; padding: 11px 18px; border-radius: 10px; font-size: 13px; font-weight: 500; z-index: 999; box-shadow: 0 8px 28px rgba(0,0,0,0.18); animation: slideUp 0.3s ease; }
  @keyframes slideUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
  ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 99px; }

  .messages-list { border-right: 1px solid #E5E7EB; padding: 20px 18px; background: #fff; overflow-y: auto; }
  .messages-title-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; }
  .messages-title-row h3 { font-family: 'Sora', sans-serif; font-size: 17px; color: #0F1117; }
  .messages-title-row span { background: #EF4444; color: #fff; font-size: 10px; font-weight: 700; padding: 4px 10px; border-radius: 999px; }
  .messages-search { width: 100%; padding: 11px 14px; border-radius: 10px; border: 1px solid #E5E7EB; background: #F4F5FA; outline: none; margin-bottom: 18px; font-family: 'DM Sans', sans-serif; color: #111827; }
  .contact-list { display: flex; flex-direction: column; gap: 8px; }
  .contact-item { display: flex; align-items: center; gap: 12px; padding: 12px; border-radius: 14px; cursor: pointer; position: relative; transition: background 0.18s; }
  .contact-item:hover, .contact-item.active { background: #EEF2FF; }
  .contact-avatar { width: 46px; height: 46px; border-radius: 50%; color: #fff; font-weight: 700; font-size: 13px; display: flex; align-items: center; justify-content: center; position: relative; flex-shrink: 0; }
  .online-dot, .offline-dot { position: absolute; right: 2px; bottom: 2px; width: 11px; height: 11px; border-radius: 50%; border: 2px solid #fff; }
  .online-dot { background: #10B981; }
  .offline-dot { background: #D1D5DB; }
  .contact-info { flex: 1; min-width: 0; }
  .contact-top { display: flex; justify-content: space-between; gap: 8px; align-items: center; }
  .contact-top strong { font-size: 13px; color: #111827; }
  .contact-top small { font-size: 10px; color: #9CA3AF; }
  .contact-info p { font-size: 12px; color: #9CA3AF; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-top: 2px; }
  .contact-role { font-size: 10px; color: #4F46E5; display: block; margin-top: 2px; }
  .unread-badge { background: #4F46E5; color: #fff; font-size: 10px; font-weight: 700; border-radius: 999px; padding: 3px 7px; }
  .conversation-box { display: flex; flex-direction: column; background: #F4F5FA; min-width: 0; }
  .conversation-header { height: 72px; background: #fff; border-bottom: 1px solid #E5E7EB; padding: 0 24px; display: flex; align-items: center; gap: 12px; }
  .conversation-header h3 { font-size: 15px; font-family: 'Sora', sans-serif; color: #111827; }
  .conversation-header p { font-size: 12px; color: #10B981; margin-top: 2px; }
  .conversation-actions { margin-left: auto; display: flex; gap: 8px; }
  .conversation-actions button { width: 36px; height: 36px; border-radius: 10px; border: 1px solid #E5E7EB; background: #fff; cursor: pointer; }
  .conversation-actions button:hover { background: #F4F5FA; }
  .conversation-body { flex: 1; padding: 36px 26px; overflow-y: auto; }
  .today-label { text-align: center; color: #B0B7C3; font-size: 11px; margin-bottom: 22px; }
  .empty-conversation { text-align: center; color: #9CA3AF; font-size: 13px; margin-top: 80px; }
  .message-line { display: flex; gap: 10px; margin-bottom: 18px; }
  .message-line.me { justify-content: flex-end; }
  .mini-avatar { width: 30px; height: 30px; border-radius: 50%; color: #fff; font-size: 10px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .message-bubble { max-width: 560px; padding: 13px 16px; border-radius: 15px; font-size: 13.5px; line-height: 1.6; box-shadow: 0 4px 14px rgba(0,0,0,0.05); }
  .message-bubble.other { background: #fff; color: #111827; border-top-left-radius: 4px; }
  .message-bubble.me { background: #4F46E5; color: #fff; border-top-right-radius: 4px; }
  .message-time { display: block; font-size: 10px; color: #9CA3AF; margin-top: 4px; }
  .message-time.me { text-align: right; }
  .conversation-input { background: #fff; border-top: 1px solid #E5E7EB; padding: 14px 20px; display: flex; gap: 8px; align-items: center; }
  .conversation-input input { flex: 1; padding: 13px 15px; border-radius: 13px; border: 1px solid #E5E7EB; background: #F4F5FA; outline: none; font-size: 13px; color: #111827; font-family: 'DM Sans', sans-serif; }
  .emoji-btn, .attach-btn, .send-message-btn { border: none; cursor: pointer; }
  .emoji-btn, .attach-btn { background: transparent; font-size: 18px; }
  .send-message-btn { width: 44px; height: 44px; border-radius: 13px; background: #4F46E5; color: #fff; font-size: 18px; }
  .send-message-btn:hover { background: #4338CA; }

  .mobile-menu-btn { display: none; width: 36px; height: 36px; border-radius: 9px; border: 1px solid #E5E7EB; background: #fff; cursor: pointer; align-items: center; justify-content: center; font-size: 20px; color: #111827; }
  .mobile-backdrop { display: none; }

  @media (max-width: 768px) {
    .resp-layout { display: block; min-height: 100vh; }
    .sidebar { width: 260px; transform: translateX(-100%); transition: transform 0.25s ease; z-index: 1000; box-shadow: 10px 0 35px rgba(15,23,42,0.18); }
    .sidebar.mobile-open { transform: translateX(0); }
    .mobile-backdrop { display: block; position: fixed; inset: 0; background: rgba(15,23,42,0.35); z-index: 900; }
    .main-content { margin-left: 0; width: 100%; min-height: 100vh; }
    .topbar { height: 56px; padding: 0 12px; gap: 10px; }
    .mobile-menu-btn { display: flex; flex-shrink: 0; }
    .topbar-title { font-size: 13.5px; flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .topbar-right { gap: 6px; }
    .resp-pill { display: none; }
    .icon-btn { width: 34px; height: 34px; }
    .page-body { padding: 14px 12px; }
    .stats-row { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
    .stat-card { padding: 14px 12px; }
    .stat-value { font-size: 21px; }
    .services-grid { grid-template-columns: 1fr; gap: 10px; }
    .card { padding: 16px 14px; border-radius: 14px; }
    .toolbar { flex-direction: column; align-items: stretch; }
    .search-inline, .filter-select { width: 100%; }
    .count-lbl { margin-left: 0; }
    .tickets-table { min-width: 760px; }
    .detail-panel { width: 92vw; padding: 22px 18px; }
    .notif-dropdown { position: fixed; top: 62px; right: 10px; left: 10px; width: auto; max-height: 70vh; }
    .toast { left: 14px; right: 14px; bottom: 16px; text-align: center; }
  }

  @media (max-width: 430px) {
    .stats-row { grid-template-columns: 1fr; }
    .topbar-title { font-size: 13px; }
    .detail-panel { width: 100vw; }
  }
`;

// ── FALLBACK TICKETS ──────────────────────────────────────
const ALL_TICKETS = [
  { id:"ID-98250", titre:"Panne serveur principal",      service:"Informatique", priorite:"urgent", statut:"cours",   date:"20/04/2026", assign:"Zakaria A.", assignId:null, desc:"Serveur tombé à 09h14.", comments:[], history:[{action:"Ticket créé",who:"Sarah L.",time:"20/04 09:14",color:"#4F46E5"}] },
  { id:"ID-97800", titre:"Accès refusé CRM",             service:"Informatique", priorite:"urgent", statut:"cours",   date:"17/04/2026", assign:"Zakaria A.", assignId:null, desc:"Plusieurs employés bloqués.",    comments:[], history:[{action:"Ticket créé",who:"Karim A.",time:"17/04 10:00",color:"#4F46E5"}] },
  { id:"ID-97300", titre:"Problème imprimante",          service:"Informatique", priorite:"normal", statut:"resolu",  date:"14/04/2026", assign:"Sarah L.",   assignId:null, desc:"Imprimante 3e étage hors service.", comments:[], history:[{action:"Ticket créé",who:"Omar A.",time:"14/04 08:30",color:"#4F46E5"}] },
  { id:"ID-96900", titre:"Logiciel non mis à jour",      service:"Informatique", priorite:"normal", statut:"attente", date:"12/04/2026", assign:"Non assigné", assignId:null, desc:"Mise à jour ERP non appliquée.", comments:[], history:[{action:"Ticket créé",who:"Admin",time:"12/04 09:00",color:"#4F46E5"}] },
  { id:"ID-98110", titre:"Remboursement médical",        service:"RH",           priorite:"normal", statut:"attente", date:"19/04/2026", assign:"Aya S.",     assignId:null, desc:"Demande de remboursement.", comments:[], history:[{action:"Ticket créé",who:"Employé",time:"19/04 14:00",color:"#4F46E5"}] },
  { id:"ID-97100", titre:"Badge accès refusé",           service:"RH",           priorite:"urgent", statut:"cours",   date:"13/04/2026", assign:"Aya S.",     assignId:null, desc:"Badge bloqué au portail.", comments:[], history:[{action:"Ticket créé",who:"Employé",time:"13/04 08:00",color:"#4F46E5"}] },
  { id:"ID-97904", titre:"Livraison manquante",          service:"Logistique",   priorite:"normal", statut:"resolu",  date:"18/04/2026", assign:"Karim A.",   assignId:null, desc:"Colis non reçu.", comments:[], history:[{action:"Ticket créé",who:"Omar A.",time:"18/04",color:"#4F46E5"}] },
  { id:"ID-97200", titre:"Stock insuffisant",            service:"Logistique",   priorite:"urgent", statut:"cours",   date:"15/04/2026", assign:"Karim A.",   assignId:null, desc:"Stock critique.", comments:[], history:[{action:"Ticket créé",who:"Magasinier",time:"15/04",color:"#4F46E5"}] },
  { id:"ID-97650", titre:"Facture incorrecte",           service:"Finance",      priorite:"normal", statut:"attente", date:"16/04/2026", assign:"Omar A.",    assignId:null, desc:"Facture fournisseur erronée.", comments:[], history:[{action:"Ticket créé",who:"Comptable",time:"16/04",color:"#4F46E5"}] },
  { id:"ID-96800", titre:"Retard paiement fournisseur",  service:"Finance",      priorite:"urgent", statut:"cours",   date:"11/04/2026", assign:"Omar A.",    assignId:null, desc:"Fournisseur relance pour paiement.", comments:[], history:[{action:"Ticket créé",who:"Finance",time:"11/04",color:"#4F46E5"}] },
  { id:"ID-97500", titre:"Climatisation en panne",       service:"Externe",      priorite:"normal", statut:"resolu",  date:"15/04/2026", assign:"Prestataire externe", assignId:null, desc:"Climatisation hors service.", comments:[], history:[{action:"Ticket créé",who:"Employé",time:"15/04",color:"#4F46E5"}] },
  { id:"ID-96100", titre:"Ascenseur en panne",           service:"Externe",      priorite:"urgent", statut:"cours",   date:"07/04/2026", assign:"Prestataire externe", assignId:null, desc:"Ascenseur bloqué.", comments:[], history:[{action:"Ticket créé",who:"Sécurité",time:"07/04",color:"#4F46E5"}] },
];

const SERVICES_META = [
  { name:"Informatique", icon:"🖥️", color:"#4F46E5" },
  { name:"RH",           icon:"👥", color:"#10B981" },
  { name:"Logistique",   icon:"📦", color:"#F59E0B" },
  { name:"Finance",      icon:"💰", color:"#8B5CF6" },
  { name:"Externe",      icon:"🌐", color:"#EF4444" },
];

const NOTIFS_INIT = [
  { id:1, icon:"🔴", bg:"#FEE2E2", text:<><strong>ID-98250</strong> — Panne serveur critique non résolue</>,   time:"À l'instant",  unread:true  },
  { id:2, icon:"🔴", bg:"#FEE2E2", text:<><strong>ID-97200</strong> — Stock logistique critique</>,             time:"Il y a 30 min", unread:true  },
  { id:3, icon:"✅", bg:"#D1FAE5", text:<><strong>ID-97904</strong> — Livraison résolue par Karim A.</>,        time:"Il y a 1h",     unread:true  },
  { id:4, icon:"💬", bg:"#EEF2FF", text:<>Nouveau commentaire sur <strong>ID-97800</strong></>,                 time:"Il y a 2h",     unread:true  },
  { id:5, icon:"⚠️", bg:"#FEF3C7", text:<><strong>4 tickets urgents</strong> tous services confondus</>,        time:"Hier",          unread:false },
  { id:6, icon:"👤", bg:"#F3F4F6", text:<>Nouveau ticket <strong>Finance</strong> assigné à Omar A.</>,         time:"Hier",          unread:false },
];

const statutLabel = { cours:"En cours", resolu:"Résolu", attente:"En attente" };

// ── NORMALIZE TICKET FROM API ─────────────────────────────
const normalizeTicket = (t) => {
  const serviceName = t.service || "Informatique";
  const isExterne = serviceName === "Maintenance" || serviceName === "Externe";
  return {
    id: String(t.id),
    apiId: t.id,
    titre: t.titre || "Sans titre",
    service: isExterne ? "Externe" : serviceName,
    priorite: t.priorite || "normal",
    statut: t.statut || "attente",
    date: t.created_at ? new Date(t.created_at).toLocaleDateString("fr-FR") : "—",
    assign: t.assignee?.nom || t.assignee?.name || "Non assigné",
    assignId: t.assignee?.id || t.assignee_id || t.assigned_to || null,
    desc: t.description || "Aucune description.",
    comments: (t.commentaires || []).map((c) => ({
      author: c.user?.nom || "Utilisateur",
      time: c.created_at ? new Date(c.created_at).toLocaleString("fr-FR") : "—",
      body: c.contenu || "",
    })),
    history: [{
      action: "Ticket chargé depuis API",
      who: t.created_by?.nom || t.createdBy?.nom || "Employé",
      time: t.created_at ? new Date(t.created_at).toLocaleString("fr-FR") : "—",
      color: "#4F46E5",
    }],
  };
};

// ── BOT RESPONSE ──────────────────────────────────────────
const getBotResponse = (msg, tickets) => {
  const m = msg.toLowerCase();
  const urgent  = tickets.filter(t => t.priorite === "urgent");
  const attente = tickets.filter(t => t.statut   === "attente");
  const cours   = tickets.filter(t => t.statut   === "cours");
  const resolus = tickets.filter(t => t.statut   === "resolu");
  const services = [...new Set(tickets.map(t => t.service))];

  if (m.includes("bonjour")||m.includes("salut")||m.includes("salam")||m.includes("hello"))
    return `Bonjour ! 👋 Je suis l'assistant Bayan.\n\nVous gérez **${tickets.length} tickets** sur **${services.length} services** :\n• 🔴 ${urgent.length} urgents\n• 🟡 ${cours.length} en cours\n• ⏳ ${attente.length} en attente\n• ✅ ${resolus.length} résolus`;
  if (m.includes("urgent")||m.includes("critique"))
    return urgent.length === 0 ? "Aucun ticket urgent ! ✅" :
      `🔴 **${urgent.length} tickets urgents** :\n\n${urgent.map(t=>`• **${t.id}** [${t.service}] — ${t.titre}`).join("\n")}`;
  if (m.includes("attente"))
    return attente.length === 0 ? "Aucun ticket en attente ! 🎉" :
      `⏳ **${attente.length} tickets en attente** :\n\n${attente.map(t=>`• **${t.id}** [${t.service}] — ${t.titre}`).join("\n")}`;
  if (m.includes("résolu")||m.includes("resolu"))
    return `✅ **${resolus.length} tickets résolus** :\n\n${resolus.map(t=>`• **${t.id}** [${t.service}] — ${t.titre}`).join("\n")}`;
  if (m.includes("statist")||m.includes("bilan"))
    return `📊 **Bilan global :**\n\n• Total : ${tickets.length}\n• Taux résolution : ${tickets.length ? Math.round((resolus.length/tickets.length)*100) : 0}%\n• Urgents : ${urgent.length} 🔴\n• En cours : ${cours.length} 🟡\n• En attente : ${attente.length} ⏳\n• Résolus : ${resolus.length} ✅`;
  if (m.includes("informatique"))
    return `🖥️ **Informatique :**\n${tickets.filter(t=>t.service==="Informatique").map(t=>`• **${t.id}** — ${t.titre} [${statutLabel[t.statut]}]`).join("\n")}`;
  if (m.includes("rh"))
    return `👥 **RH :**\n${tickets.filter(t=>t.service==="RH").map(t=>`• **${t.id}** — ${t.titre} [${statutLabel[t.statut]}]`).join("\n")}`;
  if (m.includes("logistique"))
    return `📦 **Logistique :**\n${tickets.filter(t=>t.service==="Logistique").map(t=>`• **${t.id}** — ${t.titre} [${statutLabel[t.statut]}]`).join("\n")}`;
  if (m.includes("finance"))
    return `💰 **Finance :**\n${tickets.filter(t=>t.service==="Finance").map(t=>`• **${t.id}** — ${t.titre} [${statutLabel[t.statut]}]`).join("\n")}`;
  if (m.includes("externe"))
    return `🌐 **Externe :**\n${tickets.filter(t=>t.service==="Externe").map(t=>`• **${t.id}** — ${t.titre} [${statutLabel[t.statut]}]`).join("\n")}`;
  if (m.includes("merci"))
    return "Avec plaisir ! 😊";
  return `Je n'ai pas compris. Tapez **"aide"** pour voir les commandes disponibles.`;
};

// ── LOGO ─────────────────────────────────────────────────
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

// ── TICKET DETAIL PANEL ───────────────────────────────────
const TicketDetail = ({ ticket, onClose, onUpdateStatut, onUpdatePriorite, onUpdateAssign, onAddComment, users = [] }) => {
  const [comment,  setComment]  = useState("");
  const [statut,   setStatut]   = useState(ticket.statut);
  const [priorite, setPriorite] = useState(ticket.priorite);

  // For Externe tickets only show intervenants, otherwise show employes + intervenants
  const assignableUsers = ticket.service === "Externe"
    ? users.filter(u => u.role === "intervenant")
    : users.filter(u => u.role === "employe" || u.role === "intervenant");

  const getUserName = (u) => u?.nom || u?.name || "Utilisateur";

  const findAssignedUser = () => {
    if (ticket.assignId) {
      const byId = assignableUsers.find(u => String(u.id) === String(ticket.assignId));
      if (byId) return byId;
    }
    return assignableUsers.find(u =>
      String(getUserName(u)).trim().toLowerCase() === String(ticket.assign || "").trim().toLowerCase()
    );
  };

  const [assign, setAssign] = useState(() => {
    const user = findAssignedUser();
    return user ? String(user.id) : "";
  });

  useEffect(() => {
    setStatut(ticket.statut);
    setPriorite(ticket.priorite);
    const user = findAssignedUser();
    setAssign(user ? String(user.id) : "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticket.id, ticket.assign, ticket.assignId, users]);

  const changeAssign = (userId) => {
    setAssign(userId);
    if (!userId) return;
    onUpdateAssign(ticket.id, userId);
  };

  const submitComment = () => {
    if (!comment.trim()) return;
    onAddComment(ticket.id, comment.trim());
    setComment("");
  };

  return (
    <div className="detail-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="detail-panel">
        <div className="dp-top">
          <span className="dp-id">{ticket.id}</span>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="dp-title">{ticket.titre}</div>
        <div className="dp-meta">
          <span className={`tbadge ${priorite === "urgent" ? "urgent" : "normal"}`}>{priorite}</span>
          <span className={`tbadge ${statut}`}>{statutLabel[statut]}</span>
          <span style={{ fontSize:10.5, background:"#F4F5FA", padding:"3px 8px", borderRadius:5, color:"#6B7280" }}>{ticket.service}</span>
        </div>

        <p style={{ fontSize:12.5, color:"#6B7280", lineHeight:1.6 }}>{ticket.desc}</p>
        <div className="divider"/>

        {[["Service", ticket.service], ["Date", ticket.date]].map(([k,v]) => (
          <div className="dp-row" key={k}><span className="dk">{k}</span><span className="dv">{v}</span></div>
        ))}

        <div className="dp-row">
          <span className="dk">Assigné à</span>
          <select className="mini-select" value={assign} onChange={e => changeAssign(e.target.value)}>
            <option value="">Choisir {ticket.service === "Externe" ? "un intervenant" : "un employé"}</option>
            {assignableUsers.map(u => (
              <option key={u.id} value={String(u.id)}>{getUserName(u)}</option>
            ))}
          </select>
        </div>

        <div className="dp-row">
          <span className="dk">Statut</span>
          <select className="mini-select" value={statut} onChange={e => { setStatut(e.target.value); onUpdateStatut(ticket.id, e.target.value); }}>
            <option value="attente">En attente</option>
            <option value="cours">En cours</option>
            <option value="resolu">Résolu</option>
          </select>
        </div>

        <div className="dp-row">
          <span className="dk">Priorité</span>
          <select className="mini-select" value={priorite} onChange={e => { setPriorite(e.target.value); onUpdatePriorite(ticket.id, e.target.value); }}>
            <option value="normal">Normal</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>

        <div className="divider"/>
        <div className="card-title" style={{ fontSize:13, marginBottom:8 }}>Commentaires</div>
        {(ticket.comments || []).length === 0 && (
          <div style={{ fontSize:12, color:"#B0B7C3", marginBottom:8 }}>Aucun commentaire.</div>
        )}
        {(ticket.comments || []).map((c, i) => (
          <div className="comment-item" key={i}>
            <div style={{ display:"flex", gap:6, marginBottom:3 }}>
              <span className="c-author">{c.author}</span>
              <span className="c-time">{c.time}</span>
            </div>
            <div className="c-body">{c.body}</div>
          </div>
        ))}
        <textarea className="comment-box" rows={3} placeholder="Ajouter un commentaire..." value={comment} onChange={e => setComment(e.target.value)}/>
        <button className="btn-send" onClick={submitComment}>Envoyer</button>

        <div className="divider"/>
        <div className="card-title" style={{ fontSize:13, marginBottom:8 }}>Historique</div>
        {(ticket.history || []).map((h, i) => (
          <div className="history-item" key={i}>
            <div className="h-dot" style={{ background:h.color }}/>
            <div>
              <div className="h-action">{h.action} — <strong>{h.who}</strong></div>
              <div className="h-time">{h.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── OVERVIEW PAGE ─────────────────────────────────────────
const OverviewPage = ({ tickets, setActivePage, setFilterService }) => {
  const urgent  = tickets.filter(t => t.priorite === "urgent").length;
  const attente = tickets.filter(t => t.statut === "attente").length;
  const cours   = tickets.filter(t => t.statut === "cours").length;
  const resolus = tickets.filter(t => t.statut === "resolu").length;

  return (
    <div>
      <div className="stats-row">
        {[
          { label:"TOTAL TICKETS",  value:tickets.length, sub:`${SERVICES_META.length} services`, subType:"" },
          { label:"URGENTS",        value:urgent,  sub:"Action requise", subType:urgent>0?"red":"green" },
          { label:"EN COURS",       value:cours,   sub:"En traitement",  subType:"" },
          { label:"EN ATTENTE",     value:attente, sub:"À assigner",     subType:attente>0?"red":"green" },
          { label:"RÉSOLUS",        value:resolus, sub:`${tickets.length ? Math.round((resolus/tickets.length)*100) : 0}% résolution`, subType:"green", hl:true },
        ].map(s => (
          <div key={s.label} className={`stat-card${s.hl?" highlight":""}`} onClick={() => setActivePage("tickets")}>
            <div className="stat-label">{s.label}</div>
            <div className="stat-value">{s.value}</div>
            <div className={`stat-sub ${s.subType}`}>{s.sub}</div>
          </div>
        ))}
      </div>

      {urgent > 0 && (
        <div style={{ background:"#FEF2F2", border:"1px solid #FECACA", borderRadius:12, padding:"12px 18px", marginBottom:20, display:"flex", alignItems:"center", gap:10 }}>
          <span style={{ fontSize:16 }}>🔴</span>
          <span style={{ fontSize:13, color:"#DC2626", fontWeight:500 }}>{urgent} ticket(s) urgent(s) nécessitent une action immédiate</span>
          <button onClick={() => setActivePage("tickets")} style={{ marginLeft:"auto", padding:"5px 13px", background:"#DC2626", color:"#fff", border:"none", borderRadius:7, fontSize:11.5, fontWeight:600, cursor:"pointer", fontFamily:"'Sora',sans-serif" }}>Voir maintenant</button>
        </div>
      )}

      <div className="card-title" style={{ marginBottom:14 }}>Tous les services</div>
      <div className="services-grid">
        {SERVICES_META.map(s => {
          const st  = tickets.filter(t => t.service === s.name);
          const urg = st.filter(t => t.priorite === "urgent").length;
          const res = st.filter(t => t.statut === "resolu").length;
          const enc = st.filter(t => t.statut === "cours").length;
          return (
            <div key={s.name} className="service-card"
              onClick={() => { setFilterService(s.name); setActivePage("tickets"); }}>
              <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:s.color, borderRadius:"14px 14px 0 0" }}/>
              {urg > 0 && <span className="sv-urgent-badge">{urg} urgent</span>}
              <div className="service-name"><span style={{ fontSize:18 }}>{s.icon}</span>{s.name}</div>
              <div className="service-stats">
                {[["Total",st.length,"#374151"],["En cours",enc,"#D97706"],["Résolus",res,"#059669"]].map(([l,v,c]) => (
                  <div key={l} className="sv-stat">
                    <div className="sv-stat-val" style={{ color:c }}>{v}</div>
                    <div className="sv-stat-lbl">{l}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ── TICKETS PAGE ──────────────────────────────────────────
const TicketsPage = ({ tickets, setTickets, showToast, filterServiceInit, refreshTickets, users = [] }) => {
  const [filterStatut,   setFilterStatut]   = useState("tous");
  const [filterService,  setFilterService]  = useState(filterServiceInit || "tous");
  const [filterPriorite, setFilterPriorite] = useState("tous");
  const [searchQ,        setSearchQ]        = useState("");
  const [selected,       setSelected]       = useState(null);

  useEffect(() => { setFilterService(filterServiceInit || "tous"); }, [filterServiceInit]);

  const filtered = tickets.filter(t =>
    (filterStatut   === "tous" || t.statut   === filterStatut)
    && (filterService  === "tous" || t.service  === filterService)
    && (filterPriorite === "tous" || t.priorite === filterPriorite)
    && (t.titre.toLowerCase().includes(searchQ.toLowerCase()) || t.id.toLowerCase().includes(searchQ.toLowerCase()) || t.service.toLowerCase().includes(searchQ.toLowerCase()))
  );

  const getApiId = (id) => tickets.find(t => t.id === id)?.apiId || id;

  // ── UPDATE STATUT ──
  const updateStatut = async (id, val) => {
    try {
      await ticketsAPI.updateStatus(getApiId(id), val);
      setTickets(p => p.map(t => t.id === id ? {
        ...t, statut: val,
        history: [...(t.history || []), { action:`Statut → ${statutLabel[val]}`, who:"Responsable", time:"À l'instant", color:"#4F46E5" }]
      } : t));
      if (selected?.id === id) setSelected(p => ({ ...p, statut: val }));

      // Sync to localStorage
      const stored = JSON.parse(localStorage.getItem("bayan_tickets") || "[]");
      localStorage.setItem("bayan_tickets", JSON.stringify(
        stored.map(t => (String(t.id) === String(getApiId(id)) || String(t.id) === String(id)) ? { ...t, statut: val } : t)
      ));

      showToast("✅ Statut mis à jour !");
      refreshTickets?.();
    } catch (err) {
      console.error(err);
      showToast("❌ Erreur statut");
    }
  };

  // ── UPDATE PRIORITE ──
  const updatePriorite = async (id, val) => {
    try {
      await ticketsAPI.updatePriority(getApiId(id), val);
      setTickets(p => p.map(t => t.id === id ? {
        ...t, priorite: val,
        history: [...(t.history || []), { action:`Priorité → ${val}`, who:"Responsable", time:"À l'instant", color:"#EF4444" }]
      } : t));
      if (selected?.id === id) setSelected(p => ({ ...p, priorite: val }));
      showToast("⚡ Priorité mise à jour !");
      refreshTickets?.();
    } catch (err) {
      console.error(err);
      showToast("❌ Erreur priorité");
    }
  };

  // ── UPDATE ASSIGN — FIXED ──
  const updateAssign = async (id, userId) => {
    try {
      if (!userId) { showToast("❌ Choisissez un employé/intervenant"); return; }

      const userFromDB = users.find(u => String(u.id) === String(userId));
      if (!userFromDB) { showToast("❌ Utilisateur introuvable dans la base"); return; }

      const assignName = userFromDB.nom || userFromDB.name || "Utilisateur";

      await ticketsAPI.assign(getApiId(id), userFromDB.id);

      // Sync to localStorage so Intervenant dashboard can see it
      const allStored = JSON.parse(localStorage.getItem("bayan_tickets") || "[]");
      const updatedStored = allStored.map(t => {
        if (String(t.id) === String(getApiId(id)) || String(t.id) === String(id)) {
          return {
            ...t,
            assignee_id: userFromDB.id,
            assigned_to: userFromDB.id,
            assignId:    userFromDB.id,
            assign:      assignName,
            assignee:    { id: userFromDB.id, nom: assignName },
            statut:      "cours",
          };
        }
        return t;
      });
      localStorage.setItem("bayan_tickets", JSON.stringify(updatedStored));

      // Update React state
      setTickets(p => p.map(t => t.id === id ? {
        ...t,
        assign:   assignName,
        assignId: userFromDB.id,
        statut:   "cours",
        history:  [...(t.history || []), {
          action: `Assigné à → ${assignName}`,
          who:    "Responsable",
          time:   "À l'instant",
          color:  "#10B981",
        }],
      } : t));

      if (selected?.id === id) {
        setSelected(p => ({ ...p, assign: assignName, assignId: userFromDB.id, statut: "cours" }));
      }

      showToast(`✅ Assigné à ${assignName} !`);
      refreshTickets?.();
    } catch (err) {
      console.error(err);
      showToast("❌ Erreur assignation");
    }
  };

  // ── ADD COMMENT ──
  const addComment = async (id, body) => {
    try {
      await ticketsAPI.addComment(getApiId(id), body);
      const nc = { author:"Responsable", time:"À l'instant", body };
      setTickets(p => p.map(t => t.id === id ? {
        ...t,
        comments: [...(t.comments || []), nc],
        history:  [...(t.history  || []), { action:"Commentaire ajouté", who:"Responsable", time:"À l'instant", color:"#10B981" }]
      } : t));
      if (selected?.id === id) setSelected(p => ({ ...p, comments:[...(p.comments||[]), nc] }));
      showToast("💬 Commentaire envoyé !");
      refreshTickets?.();
    } catch (err) {
      console.error(err);
      showToast("❌ Erreur commentaire");
    }
  };

  return (
    <div>
      <div className="card">
        <div className="toolbar">
          <input className="search-inline" placeholder="Chercher un ticket..." value={searchQ} onChange={e => setSearchQ(e.target.value)}/>
          <select className="filter-select" value={filterService} onChange={e => setFilterService(e.target.value)}>
            <option value="tous">Tous les services</option>
            {SERVICES_META.map(s => <option key={s.name} value={s.name}>{s.icon} {s.name}</option>)}
          </select>
          <select className="filter-select" value={filterStatut} onChange={e => setFilterStatut(e.target.value)}>
            <option value="tous">Tous statuts</option>
            <option value="attente">En attente</option>
            <option value="cours">En cours</option>
            <option value="resolu">Résolu</option>
          </select>
          <select className="filter-select" value={filterPriorite} onChange={e => setFilterPriorite(e.target.value)}>
            <option value="tous">Toutes priorités</option>
            <option value="urgent">Urgent</option>
            <option value="normal">Normal</option>
          </select>
          <span className="count-lbl">{filtered.length} résultat{filtered.length!==1?"s":""}</span>
        </div>
        <div style={{ overflowX:"auto" }}>
          <table className="tickets-table">
            <thead>
              <tr><th>ID</th><th>Titre</th><th>Service</th><th>Priorité</th><th>Statut</th><th>Assigné</th><th>Date</th></tr>
            </thead>
            <tbody>
              {filtered.length === 0
                ? <tr><td colSpan={7} style={{ textAlign:"center", padding:28, color:"#9CA3AF", fontSize:13 }}>Aucun ticket trouvé</td></tr>
                : filtered.map(t => (
                  <tr key={t.id} onClick={() => setSelected(t)}>
                    <td style={{ fontFamily:"monospace", fontSize:11, color:"#9CA3AF" }}>{t.id}</td>
                    <td style={{ fontWeight:500, color:"#111827" }}>{t.titre}</td>
                    <td>
                      <span style={{ display:"flex", alignItems:"center", gap:5 }}>
                        <span>{SERVICES_META.find(s=>s.name===t.service)?.icon}</span>
                        <span style={{ fontSize:12 }}>{t.service}</span>
                      </span>
                    </td>
                    <td><span className={`tbadge ${t.priorite==="urgent"?"urgent":"normal"}`}>{t.priorite}</span></td>
                    <td><span className={`tbadge ${t.statut}`}>{statutLabel[t.statut]}</span></td>
                    <td style={{ fontSize:12 }}>{t.assign || "Non assigné"}</td>
                    <td style={{ fontSize:12, color:"#9CA3AF" }}>{t.date}</td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>
      {selected && (
        <TicketDetail
          ticket={selected}
          onClose={() => setSelected(null)}
          onUpdateStatut={updateStatut}
          onUpdatePriorite={updatePriorite}
          onUpdateAssign={updateAssign}
          onAddComment={addComment}
          users={users}
        />
      )}
    </div>
  );
};

// ── MESSAGERIE PAGE ───────────────────────────────────────
const ChatbotPage = () => <MessagerieePage />;

// ── ACTIVITE PAGE ─────────────────────────────────────────
const ActivitePage = ({ tickets }) => {
  const feed = [
    { icon:"🔴", bg:"#FEE2E2", text:<><strong>ID-98250</strong> — Panne serveur critique [Informatique]</>,  time:"Aujourd'hui 09:14", service:"Informatique" },
    { icon:"🔴", bg:"#FEE2E2", text:<><strong>ID-97200</strong> — Stock critique signalé [Logistique]</>,    time:"Aujourd'hui 08:50", service:"Logistique" },
    { icon:"✅", bg:"#D1FAE5", text:<><strong>ID-97904</strong> — Livraison résolue [Logistique]</>,          time:"Hier 18:30",         service:"Logistique" },
    { icon:"💬", bg:"#EEF2FF", text:<>Commentaire sur <strong>ID-97800</strong> [Informatique]</>,           time:"Hier 16:30",         service:"Informatique" },
    { icon:"✅", bg:"#D1FAE5", text:<><strong>ID-96200</strong> — Congé validé [RH]</>,                      time:"09/04 11:00",        service:"RH" },
    { icon:"⚡", bg:"#FEF3C7", text:<><strong>ID-96800</strong> escaladé urgent [Finance]</>,                time:"11/04 10:30",        service:"Finance" },
    { icon:"🔴", bg:"#FEE2E2", text:<><strong>ID-96100</strong> — Ascenseur bloqué [Externe]</>,             time:"07/04 09:00",        service:"Externe" },
    { icon:"✅", bg:"#D1FAE5", text:<><strong>ID-97500</strong> — Climatisation réparée [Externe]</>,        time:"16/04 14:00",        service:"Externe" },
  ];
  const serviceColor = { Informatique:"#4F46E5", RH:"#10B981", Logistique:"#F59E0B", Finance:"#8B5CF6", Externe:"#EF4444" };
  return (
    <div className="card">
      <div className="card-title">Journal d'activité — Tous les services</div>
      {feed.map((a, i) => (
        <div className="af-item" key={i}>
          {i < feed.length - 1 && <div className="af-line"/>}
          <div className="af-icon" style={{ background:a.bg }}>{a.icon}</div>
          <div>
            <div className="af-text">{a.text}</div>
            <div className="af-time">{a.time}</div>
            <span className="af-service" style={{ color:serviceColor[a.service], background:`${serviceColor[a.service]}15` }}>{a.service}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

// ── NAV ITEMS ─────────────────────────────────────────────
const navItems = [
  { key:"overview", label:"Vue d'ensemble",
    icon:<svg width="15" height="15" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.7"/><rect x="9" y="1" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.4"/><rect x="1" y="9" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.4"/><rect x="9" y="9" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.7"/></svg> },
  { key:"tickets", label:"Toutes les réclamations", badge:"urgents",
    icon:<svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M2 4h12M2 8h8M2 12h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg> },
  { key:"activite", label:"Activité récente",
    icon:<svg width="15" height="15" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.4"/><path d="M8 5v3.5l2 1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg> },
  { key:"chatbot", label:"Messagerie",
    icon:<svg width="15" height="15" viewBox="0 0 16 16" fill="none"><rect x="1" y="2" width="14" height="10" rx="3" stroke="currentColor" strokeWidth="1.4"/><path d="M4 14l2-2M12 14l-2-2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg> },
];

const pageTitles = { overview:"Vue d'ensemble — Tous les services", tickets:"Toutes les Réclamations", activite:"Activité récente", chatbot:"Messagerie" };

// ── MAIN EXPORT ───────────────────────────────────────────
export default function Responsable() {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  const [activePage,     setActivePage]     = useState("overview");
  const [tickets,        setTickets]        = useState([]);
  const [loadingTickets, setLoadingTickets] = useState(true);
  const [notifs,         setNotifs]         = useState(NOTIFS_INIT);
  const [showNotifs,     setShowNotifs]     = useState(false);
  const [toast,          setToast]          = useState(null);
  const [filterService,  setFilterService]  = useState("tous");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [users,          setUsers]          = useState([]);

  const notifRef = useRef(null);
  const toastRef = useRef(null);

  const unread = notifs.filter(n => n.unread).length;
  const urgent = tickets.filter(t => t.priorite === "urgent").length;

  const showToast = (msg) => {
    setToast(msg);
    clearTimeout(toastRef.current);
    toastRef.current = setTimeout(() => setToast(null), 2800);
  };

  // ── FETCH TICKETS FROM API ──
  const fetchTickets = async () => {
    try {
      setLoadingTickets(true);
      const res = await ticketsAPI.getAll();
      const payload = res?.data ?? res;
      const list = Array.isArray(payload) ? payload : (Array.isArray(payload?.data) ? payload.data : []);

      // Save raw list to localStorage so Intervenant dashboard can read it
      localStorage.setItem("bayan_tickets", JSON.stringify(list));

      setTickets(list.map(normalizeTicket));
    } catch (err) {
      console.error(err);
      // Fallback to static data if API fails
      setTickets(ALL_TICKETS);
      showToast("⚠️ Impossible de charger depuis l'API — données locales affichées");
    } finally {
      setLoadingTickets(false);
    }
  };

  useEffect(() => {
    fetchTickets();
    usersAPI.getAll()
      .then(res => {
        const payload = res?.data ?? res;
        const list = Array.isArray(payload) ? payload : (Array.isArray(payload?.data) ? payload.data : []);
        setUsers(list);
      })
      .catch(err => {
        console.error("Erreur chargement users", err);
        setUsers([]);
      });
  }, []);

  // Close notif dropdown on outside click
  useEffect(() => {
    const h = e => { if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifs(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const goToServiceTickets = (service) => {
    setFilterService(service);
    setActivePage("tickets");
    setMobileMenuOpen(false);
  };

  const handleNavClick = (page) => {
    setActivePage(page);
    setMobileMenuOpen(false);
  };

  const renderPage = () => {
    switch (activePage) {
      case "overview": return <OverviewPage tickets={tickets} setActivePage={setActivePage} setFilterService={goToServiceTickets}/>;
      case "tickets":  return <TicketsPage  tickets={tickets} setTickets={setTickets} showToast={showToast} filterServiceInit={filterService} refreshTickets={fetchTickets} users={users}/>;
      case "activite": return <ActivitePage tickets={tickets}/>;
      case "chatbot":  return <ChatbotPage/>;
      default:         return <OverviewPage tickets={tickets} setActivePage={setActivePage} setFilterService={goToServiceTickets}/>;
    }
  };

  return (
    <>
      <style>{CSS + MSG_CSS}</style>
      <div className="resp-layout">

        {/* ── SIDEBAR ── */}
        <aside className={`sidebar${mobileMenuOpen ? " mobile-open" : ""}`}>
          <Logo/>
          <div className="sidebar-nav">
            <div className="sidebar-section">Navigation</div>
            {navItems.map(item => (
              <button key={item.key} className={`nav-item${activePage===item.key?" active":""}`} onClick={() => handleNavClick(item.key)}>
                {item.icon}{item.label}
                {item.badge === "urgents" && urgent > 0 && <span className="nav-badge red">{urgent}</span>}
              </button>
            ))}
            <div className="sidebar-section" style={{ marginTop:8 }}>Services</div>
            {SERVICES_META.map(s => {
              const urg = tickets.filter(t => t.service===s.name && t.priorite==="urgent").length;
              return (
                <button key={s.name} className="nav-item" onClick={() => goToServiceTickets(s.name)}>
                  <span style={{ fontSize:14 }}>{s.icon}</span>
                  <span style={{ fontSize:12.5 }}>{s.name}</span>
                  {urg > 0 && <span className="nav-badge red">{urg}</span>}
                </button>
              );
            })}
          </div>
          <div className="sidebar-user">
            <div className="u-av">
              {currentUser ? currentUser.nom.trim().split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase() : "RS"}
            </div>
            <div>
              <div className="u-name">{currentUser?.nom || "Responsable"}</div>
              <div className="u-role">{currentUser?.role || "Responsable"}</div>
            </div>
          </div>
        </aside>

        {mobileMenuOpen && <div className="mobile-backdrop" onClick={() => setMobileMenuOpen(false)}/>}

        {/* ── MAIN ── */}
        <div className="main-content">
          <header className="topbar">
            <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(true)}>☰</button>
            <div className="topbar-title">{pageTitles[activePage]}</div>
            <div className="topbar-right">
              <span className="resp-pill">🏢 Responsable de Service</span>

              {/* NOTIFICATIONS */}
              <div className="notif-wrap" ref={notifRef}>
                <button className="icon-btn" onClick={() => setShowNotifs(!showNotifs)}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1.5a5 5 0 015 5v2.5l1 2H1l1-2V6.5a5 5 0 015-5z" stroke="#6B7280" strokeWidth="1.4"/><path d="M6.5 13.5a1.5 1.5 0 003 0" stroke="#6B7280" strokeWidth="1.4"/></svg>
                  {unread > 0 && <span className="notif-count">{unread}</span>}
                </button>
                {showNotifs && (
                  <div className="notif-dropdown">
                    <div className="notif-header">
                      <span className="notif-header-title">Notifications</span>
                      <button className="notif-mark-all" onClick={() => setNotifs(p => p.map(n => ({...n,unread:false})))}>Tout lu</button>
                    </div>
                    {notifs.map(n => (
                      <div key={n.id} className={`notif-item${n.unread?" unread":""}`}
                        onClick={() => setNotifs(p => p.map(x => x.id===n.id?{...x,unread:false}:x))}>
                        <div className="notif-icon" style={{ background:n.bg }}>{n.icon}</div>
                        <div><div className="notif-text">{n.text}</div><div className="notif-time">{n.time}</div></div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* LOGOUT */}
              <button className="icon-btn" onClick={async () => { await logout(); navigate("/login"); }} title="Déconnexion">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 14H3a1 1 0 01-1-1V3a1 1 0 011-1h3M10 11l3-3-3-3M13 8H6" stroke="#6B7280" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </div>
          </header>

          <div className="page-body">
            {loadingTickets && activePage !== "chatbot"
              ? <div className="card" style={{ color:"#6B7280", fontSize:13 }}>Chargement des réclamations...</div>
              : renderPage()
            }
          </div>
        </div>
      </div>

      {toast && <div className="toast">{toast}</div>}
    </>
  );
}