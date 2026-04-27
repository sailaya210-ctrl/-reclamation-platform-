import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import MessagerieePage, { MSG_CSS } from "./MessagerieePage";

// ── CSS — identique à EmployeeDashboard (mêmes classes emp-*) ──────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'DM Sans', sans-serif; background: #F4F5FA; color: #0F1117; }

  .emp-layout { display: flex; min-height: 100vh; }

  /* SIDEBAR */
  .emp-sidebar { width: 220px; background: #fff; border-right: 1px solid rgba(0,0,0,0.06); display: flex; flex-direction: column; position: fixed; top: 0; left: 0; height: 100vh; z-index: 50; }
  .emp-sidebar-logo { display: flex; align-items: center; gap: 8px; padding: 20px 20px 16px; border-bottom: 1px solid rgba(0,0,0,0.06); }
  .emp-sidebar-logo span { font-family: 'Sora', sans-serif; font-weight: 700; font-size: 15.5px; color: #0F1117; letter-spacing: -0.3px; }
  .emp-sidebar-nav { flex: 1; padding: 16px 12px; display: flex; flex-direction: column; gap: 2px; overflow-y: auto; }
  .emp-nav-section { font-size: 9.5px; font-weight: 600; color: #B0B7C3; letter-spacing: 0.9px; text-transform: uppercase; padding: 10px 10px 4px; }
  .emp-nav-item { display: flex; align-items: center; gap: 10px; padding: 9px 12px; border-radius: 9px; cursor: pointer; font-size: 13.5px; color: #6B7280; font-weight: 400; transition: all 0.18s; border: none; background: none; width: 100%; text-align: left; font-family: 'DM Sans', sans-serif; }
  .emp-nav-item:hover { background: #F4F5FA; color: #0F1117; }
  .emp-nav-item.active { background: #EEF2FF; color: #4F46E5; font-weight: 500; }
  .emp-nav-badge { margin-left: auto; background: #4F46E5; color: #fff; font-size: 10px; font-weight: 700; border-radius: 99px; padding: 1px 7px; }
  .emp-sidebar-user { padding: 14px 16px; border-top: 1px solid rgba(0,0,0,0.06); display: flex; align-items: center; gap: 10px; }
  .emp-user-avatar { width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; color: #fff; flex-shrink: 0; }
  .emp-user-name { font-size: 13px; font-weight: 500; color: #0F1117; }
  .emp-user-role { font-size: 10.5px; color: #9CA3AF; }

  /* badge externe sous le rôle */
  .iv-ext-badge { display: inline-flex; align-items: center; gap: 3px; font-size: 9px; font-weight: 700; color: #92400E; background: #FEF3C7; border-radius: 4px; padding: 2px 6px; margin-top: 3px; letter-spacing: 0.3px; }

  /* MAIN */
  .emp-main { margin-left: 220px; flex: 1; display: flex; flex-direction: column; min-height: 100vh; }

  /* TOPBAR */
  .emp-topbar { height: 60px; background: #fff; border-bottom: 1px solid rgba(0,0,0,0.06); display: flex; align-items: center; justify-content: space-between; padding: 0 32px; position: sticky; top: 0; z-index: 40; }
  .emp-topbar-title { font-family: 'Sora', sans-serif; font-size: 18px; font-weight: 700; color: #0F1117; letter-spacing: -0.4px; }
  .emp-search-bar { display: flex; align-items: center; gap: 8px; background: #F4F5FA; border: 1.5px solid #E5E7EB; border-radius: 10px; padding: 8px 14px; transition: all 0.2s; width: 260px; }
  .emp-search-bar input { background: none; border: none; outline: none; font-size: 13px; color: #0F1117; width: 100%; font-family: 'DM Sans', sans-serif; }
  .emp-search-bar input::placeholder { color: #9CA3AF; }
  .emp-topbar-right { display: flex; align-items: center; gap: 10px; }
  .emp-icon-btn { width: 36px; height: 36px; border-radius: 9px; border: 1px solid #E5E7EB; background: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center; position: relative; transition: background 0.15s; }
  .emp-icon-btn:hover { background: #F4F5FA; }
  .emp-notif-dot { position: absolute; top: -4px; right: -4px; width: 14px; height: 14px; border-radius: 50%; background: #EF4444; border: 2px solid #fff; font-size: 8px; font-weight: 700; color: #fff; display: flex; align-items: center; justify-content: center; }

  /* PAGE BODY */
  .emp-page-body { padding: 28px 32px; flex: 1; }

  /* FILTERS */
  .emp-filters { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; flex-wrap: wrap; }
  .emp-filter-label { font-size: 12px; color: #6B7280; font-weight: 500; }
  .emp-filter-btn { padding: 6px 14px; border-radius: 99px; border: 1.5px solid #E5E7EB; background: #fff; font-size: 12px; cursor: pointer; font-family: 'DM Sans', sans-serif; color: #6B7280; transition: all 0.15s; }
  .emp-filter-btn:hover { border-color: #4F46E5; color: #4F46E5; }
  .emp-filter-btn.active { background: #4F46E5; color: #fff; border-color: #4F46E5; font-weight: 500; }

  /* KANBAN */
  .emp-kanban { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
  .emp-col { background: #F9FAFB; border-radius: 14px; border: 2px solid transparent; overflow: hidden; transition: border-color 0.2s, background 0.2s; }
  .emp-col-header { display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; border-bottom: 1px solid rgba(0,0,0,0.06); background: #fff; }
  .emp-col-title { font-size: 12.5px; font-weight: 500; color: #374151; display: flex; align-items: center; gap: 7px; }
  .emp-col-dot { width: 8px; height: 8px; border-radius: 50%; }
  .emp-col-count { font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 99px; background: #fff; border: 1px solid #E5E7EB; }
  .emp-col-body { padding: 12px; display: flex; flex-direction: column; gap: 10px; min-height: 340px; }

  /* CARD */
  .emp-card { background: #fff; border-radius: 12px; border: 1px solid rgba(0,0,0,0.07); padding: 13px 14px; cursor: pointer; transition: transform 0.18s, box-shadow 0.18s; user-select: none; }
  .emp-card:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,0.09); }
  .emp-card-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
  .emp-card-id { font-family: monospace; font-size: 10.5px; color: #B0B7C3; }
  .emp-pri-badge { font-size: 9.5px; font-weight: 700; padding: 3px 7px; border-radius: 5px; text-transform: uppercase; letter-spacing: 0.3px; }
  .emp-pri-badge.urgent  { background: #FEE2E2; color: #B91C1C; }
  .emp-pri-badge.haute   { background: #FEF3C7; color: #92400E; }
  .emp-pri-badge.normale { background: #EEF2FF; color: #4338CA; }
  .emp-pri-badge.faible  { background: #F3F4F6; color: #6B7280; }
  .emp-card-title { font-size: 13px; font-weight: 500; color: #111827; margin-bottom: 8px; line-height: 1.4; }
  .emp-card-tags { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 10px; }
  .emp-tag { font-size: 10.5px; color: #6B7280; background: #F3F4F6; padding: 2px 7px; border-radius: 4px; }
  .emp-prog-bg { height: 3px; background: #F0F0F0; border-radius: 99px; overflow: hidden; margin-bottom: 10px; }
  .emp-prog-fill { height: 3px; border-radius: 99px; transition: width 0.5s ease; }
  .emp-card-footer { display: flex; align-items: center; justify-content: space-between; }
  .emp-card-date { font-size: 10.5px; color: #B0B7C3; display: flex; align-items: center; gap: 4px; }
  .emp-card-by { font-size: 10.5px; color: #4F46E5; font-weight: 500; }

  /* bouton résoudre rapide sur la carte */
  .iv-card-resolve-btn { margin-top: 10px; padding-top: 9px; border-top: 1px solid #F3F4F6; width: 100%; padding: 8px; border-radius: 8px; border: 1.5px solid #D1FAE5; background: #F0FDF4; font-size: 11.5px; font-weight: 600; cursor: pointer; font-family: 'DM Sans', sans-serif; color: #059669; transition: all 0.15s; display: flex; align-items: center; justify-content: center; gap: 5px; }
  .iv-card-resolve-btn:hover { background: #D1FAE5; border-color: #6EE7B7; }

  /* EMPTY COL */
  .emp-drop-hint { border: 2px dashed #E5E7EB; border-radius: 10px; padding: 28px 0; text-align: center; font-size: 11.5px; color: #D1D5DB; }

  /* DETAIL PANEL */
  .emp-detail-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.3); z-index: 400; display: flex; justify-content: flex-end; }
  .emp-detail-panel { width: 400px; background: #fff; height: 100%; overflow-y: auto; padding: 26px 22px; box-shadow: -8px 0 40px rgba(0,0,0,0.12); }
  .emp-detail-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px; }
  .emp-detail-id { font-family: monospace; font-size: 11px; color: #9CA3AF; }
  .emp-close-btn { width: 30px; height: 30px; border-radius: 8px; border: 1px solid #E5E7EB; background: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 16px; color: #6B7280; }
  .emp-close-btn:hover { background: #F4F5FA; }
  .emp-detail-title { font-family: 'Sora', sans-serif; font-size: 17px; font-weight: 700; color: #0F1117; margin: 10px 0 8px; }
  .emp-detail-badges { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 16px; }
  .emp-status-badge { font-size: 10px; font-weight: 700; padding: 3px 9px; border-radius: 5px; }
  .emp-status-badge.attente { background: #F3F4F6; color: #4B5563; }
  .emp-status-badge.cours   { background: #FEF3C7; color: #92400E; }
  .emp-status-badge.resolu  { background: #D1FAE5; color: #065F46; }
  .emp-divider { height: 1px; background: #F3F4F6; margin: 14px 0; }
  .emp-detail-row { display: flex; justify-content: space-between; align-items: center; padding: 7px 0; }
  .emp-detail-key { font-size: 12px; color: #9CA3AF; }
  .emp-detail-val { font-size: 13px; color: #111827; font-weight: 500; }
  .emp-section-title { font-size: 13px; font-weight: 600; color: #0F1117; margin-bottom: 10px; }
  .emp-prog-detail-bar { height: 6px; background: #F0F0F0; border-radius: 99px; overflow: hidden; margin-top: 6px; }
  .emp-prog-detail-fill { height: 6px; border-radius: 99px; transition: width 0.5s ease; }

  /* RESOLVE button in detail panel */
  .iv-resolve-btn { width: 100%; padding: 13px; background: #10B981; border: none; border-radius: 11px; font-size: 14px; font-weight: 700; cursor: pointer; font-family: 'Sora', sans-serif; color: #fff; display: flex; align-items: center; justify-content: center; gap: 8px; transition: background 0.2s, transform 0.1s; margin-bottom: 8px; }
  .iv-resolve-btn:hover { background: #059669; }
  .iv-resolve-btn:active { transform: scale(0.98); }
  .iv-inprogress-btn { width: 100%; padding: 10px; background: #FFF7ED; border: 1.5px solid #FED7AA; border-radius: 10px; font-size: 12.5px; font-weight: 600; cursor: pointer; font-family: 'DM Sans', sans-serif; color: #C2410C; display: flex; align-items: center; justify-content: center; gap: 6px; transition: all 0.2s; margin-bottom: 4px; }
  .iv-inprogress-btn:hover:not(:disabled) { background: #FFEDD5; }
  .iv-inprogress-btn:disabled { opacity: 0.35; cursor: not-allowed; }
  .iv-resolved-banner { background: #D1FAE5; border: 1px solid #A7F3D0; border-radius: 10px; padding: 11px 14px; text-align: center; font-size: 13px; color: #065F46; font-weight: 600; margin-bottom: 8px; }

  /* COMMENT BOX */
  .iv-comment-label { font-size: 13px; font-weight: 600; color: #0F1117; margin-bottom: 8px; }
  .iv-comment-area { width: 100%; padding: 10px 12px; border: 1.5px solid #E5E7EB; border-radius: 9px; font-size: 13px; font-family: 'DM Sans', sans-serif; color: #0F1117; background: #FAFAFA; outline: none; resize: none; min-height: 80px; line-height: 1.55; transition: border-color 0.2s; }
  .iv-comment-area:focus { border-color: #4F46E5; background: #fff; }
  .iv-comment-area::placeholder { color: #B0B7C3; }
  .iv-comment-submit { margin-top: 8px; float: right; padding: 8px 16px; background: #4F46E5; border: none; border-radius: 8px; font-size: 12.5px; font-weight: 600; cursor: pointer; font-family: 'Sora', sans-serif; color: #fff; transition: background 0.15s; }
  .iv-comment-submit:hover { background: #4338CA; }
  .iv-comment-submit:disabled { background: #D1D5DB; cursor: not-allowed; }

  /* TIMELINE */
  .emp-tl-item { display: flex; gap: 10px; padding: 9px 0; border-bottom: 1px solid #F9FAFB; }
  .emp-tl-item:last-child { border-bottom: none; }
  .emp-tl-icon { width: 28px; height: 28px; border-radius: 8px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 13px; margin-top: 1px; }
  .emp-tl-text { font-size: 12.5px; color: #374151; line-height: 1.5; }
  .emp-tl-text strong { color: #0F1117; font-weight: 600; }
  .emp-tl-time { font-size: 10.5px; color: #B0B7C3; margin-top: 2px; }

  /* PROFIL */
  .emp-profil-card { background: #fff; border-radius: 16px; border: 1px solid rgba(0,0,0,0.06); padding: 28px; max-width: 520px; }
  .emp-profil-header { display: flex; align-items: center; gap: 16px; margin-bottom: 22px; padding-bottom: 18px; border-bottom: 1px solid #F3F4F6; }
  .emp-profil-av { width: 56px; height: 56px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 17px; font-weight: 700; color: #fff; }
  .emp-profil-name { font-family: 'Sora', sans-serif; font-size: 17px; font-weight: 700; color: #0F1117; }
  .emp-profil-email { font-size: 12.5px; color: #9CA3AF; margin-top: 2px; }
  .emp-profil-badge { display: inline-block; font-size: 10px; font-weight: 600; padding: 3px 9px; border-radius: 5px; background: #F3F4F6; color: #6B7280; margin-top: 5px; }
  .emp-profil-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #F9FAFB; }
  .emp-profil-row:last-child { border-bottom: none; }
  .emp-profil-key { font-size: 12.5px; color: #9CA3AF; }
  .emp-profil-val { font-size: 13px; font-weight: 500; color: #111827; }

  /* NOTIFICATION PANEL */
  .emp-notif-overlay { position: fixed; inset: 0; z-index: 300; }
  .emp-notif-panel { position: absolute; top: 52px; right: 72px; width: 340px; background: #fff; border-radius: 14px; border: 1px solid rgba(0,0,0,0.08); box-shadow: 0 12px 40px rgba(0,0,0,0.14); overflow: hidden; animation: notifSlide 0.18s ease; }
  @keyframes notifSlide { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }
  .emp-notif-head { display: flex; align-items: center; justify-content: space-between; padding: 14px 16px 10px; border-bottom: 1px solid #F3F4F6; }
  .emp-notif-title { font-family: 'Sora', sans-serif; font-size: 14px; font-weight: 700; color: #0F1117; }
  .emp-notif-mark-all { font-size: 11.5px; color: #4F46E5; font-weight: 500; background: none; border: none; cursor: pointer; padding: 0; font-family: 'DM Sans', sans-serif; }
  .emp-notif-mark-all:hover { text-decoration: underline; }
  .emp-notif-list { max-height: 360px; overflow-y: auto; }
  .emp-notif-list::-webkit-scrollbar { width: 3px; }
  .emp-notif-list::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 99px; }
  .emp-notif-item { display: flex; align-items: flex-start; gap: 10px; padding: 12px 16px; border-bottom: 1px solid #F9FAFB; cursor: pointer; transition: background 0.12s; position: relative; }
  .emp-notif-item:last-child { border-bottom: none; }
  .emp-notif-item:hover { background: #F9FAFB; }
  .emp-notif-item.unread { background: #FAFBFF; }
  .emp-notif-item.unread::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 3px; background: #4F46E5; border-radius: 0 2px 2px 0; }
  .emp-notif-icon { width: 34px; height: 34px; border-radius: 9px; display: flex; align-items: center; justify-content: center; font-size: 15px; flex-shrink: 0; margin-top: 1px; }
  .emp-notif-content { flex: 1; min-width: 0; }
  .emp-notif-text { font-size: 12.5px; color: #374151; line-height: 1.45; }
  .emp-notif-text strong { color: #0F1117; font-weight: 600; }
  .emp-notif-time { font-size: 10.5px; color: #B0B7C3; margin-top: 3px; }
  .emp-notif-unread-dot { width: 7px; height: 7px; border-radius: 50%; background: #4F46E5; flex-shrink: 0; margin-top: 5px; }
  .emp-notif-footer { padding: 10px 16px; border-top: 1px solid #F3F4F6; text-align: center; }
  .emp-notif-footer-btn { font-size: 12px; color: #4F46E5; font-weight: 500; background: none; border: none; cursor: pointer; font-family: 'DM Sans', sans-serif; }
  .emp-notif-footer-btn:hover { text-decoration: underline; }

  /* CONFIRM MODAL */
  .emp-confirm-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 600; display: flex; align-items: center; justify-content: center; }
  .emp-confirm-box { background: #fff; border-radius: 16px; padding: 28px 26px; width: 360px; box-shadow: 0 20px 60px rgba(0,0,0,0.16); text-align: center; }
  .emp-confirm-icon { width: 52px; height: 52px; border-radius: 14px; background: #D1FAE5; display: flex; align-items: center; justify-content: center; margin: 0 auto 14px; font-size: 24px; }
  .emp-confirm-title { font-family: 'Sora', sans-serif; font-size: 16px; font-weight: 700; color: #0F1117; margin-bottom: 8px; }
  .emp-confirm-text { font-size: 12.5px; color: #9CA3AF; line-height: 1.6; margin-bottom: 22px; }
  .emp-confirm-id { font-family: monospace; font-size: 11px; background: #F4F5FA; color: #6B7280; padding: 2px 7px; border-radius: 4px; }
  .emp-confirm-btns { display: flex; gap: 10px; }
  .emp-confirm-cancel { flex: 1; padding: 11px; background: #F4F5FA; border: 1px solid #E5E7EB; border-radius: 9px; font-size: 13px; cursor: pointer; font-family: 'DM Sans', sans-serif; color: #374151; font-weight: 500; }
  .emp-confirm-cancel:hover { background: #E5E7EB; }
  .emp-confirm-ok { flex: 1; padding: 11px; background: #10B981; border: none; border-radius: 9px; font-size: 13px; font-weight: 700; cursor: pointer; font-family: 'Sora', sans-serif; color: #fff; }
  .emp-confirm-ok:hover { background: #059669; }

  /* TOAST */
  .emp-toast { position: fixed; bottom: 28px; right: 28px; background: #1C1C2E; color: #fff; padding: 12px 20px; border-radius: 10px; font-size: 13px; font-weight: 500; z-index: 999; box-shadow: 0 8px 28px rgba(0,0,0,0.2); display: flex; align-items: center; gap: 8px; animation: empSlideUp 0.3s ease; }
  @keyframes empSlideUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }

  /* ── RESPONSIVE ── */
  @media (max-width: 1024px) {
    .emp-sidebar { width: 180px; }
    .emp-main { margin-left: 180px; }
    .emp-topbar { padding: 0 20px; }
    .emp-page-body { padding: 20px; }
    .emp-search-bar { width: 220px; }
    .emp-kanban { gap: 12px; }
  }

  @media (max-width: 768px) {
    /* SIDEBAR → bottom nav */
    .emp-sidebar {
      width: 100%; height: 60px; top: auto; bottom: 0;
      flex-direction: row; border-right: none; border-top: 1px solid rgba(0,0,0,0.08);
      z-index: 100;
    }
    .emp-sidebar-logo { display: none; }
    .emp-sidebar-user { display: none; }
    .emp-sidebar-nav {
      flex-direction: row; padding: 0; gap: 0; overflow-x: auto;
      justify-content: space-around; width: 100%;
    }
    .emp-nav-item { flex-direction: column; gap: 2px; padding: 8px 6px;
      font-size: 9px; border-radius: 0; min-width: 50px; }
    .emp-nav-section { display: none; }

    /* MAIN */
    .emp-main { margin-left: 0; padding-bottom: 60px; }

    /* TOPBAR */
    .emp-topbar { padding: 0 12px; height: 52px; gap: 8px; }
    .emp-topbar-title { font-size: 14px; max-width: 120px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .emp-search-bar { width: 100%; max-width: 160px; font-size: 12px; padding: 6px 10px; }
    .emp-topbar-right { gap: 6px; }
    .emp-icon-btn { width: 32px; height: 32px; }

    /* PAGE BODY */
    .emp-page-body { padding: 12px; }

    /* FILTERS */
    .emp-filters { gap: 6px; margin-bottom: 10px; }
    .emp-filter-btn { padding: 5px 10px; font-size: 11px; }

    /* KANBAN */
    .emp-kanban { grid-template-columns: 1fr; gap: 12px; }
    .emp-col-body { min-height: 300px; }

    /* CARD */
    .emp-card { padding: 10px 12px; }
    .emp-card-title { font-size: 12px; }
    .emp-pri-badge { font-size: 8.5px; padding: 2px 5px; }

    /* DETAIL PANEL */
    .emp-detail-panel {
      width: 100%; max-width: 380px; border-radius: 16px 16px 0 0;
      position: fixed; bottom: 0; right: 0; height: auto; max-height: 90vh;
    }

    /* MODAL */
    .emp-modal { width: calc(100% - 24px); max-width: 500px; }

    /* TOAST */
    .emp-toast { bottom: 72px; right: 12px; left: 12px; font-size: 12px; }
  }

  @media (max-width: 480px) {
    .emp-sidebar-nav { gap: 0; }
    .emp-nav-item { font-size: 8px; min-width: 44px; padding: 6px 4px; }
    .emp-topbar-title { max-width: 80px; font-size: 12px; }
    .emp-search-bar { display: none; }

    .emp-page-body { padding: 10px; }
    .emp-kanban { grid-template-columns: 1fr; gap: 10px; }
    .emp-col-body { min-height: 280px; }

    .emp-card { padding: 8px 10px; }
    .emp-card-title { font-size: 11px; }
    .emp-tag { font-size: 9px; }
    .emp-card-date { font-size: 9px; }

    .emp-confirm-box { width: 90%; max-width: 340px; padding: 20px 18px; }
    .emp-modal { width: calc(100% - 16px); padding: 16px; }
  }
`;


const LS_USER = "bayan_current_user";
const LS_TICKETS = "bayan_tickets";

function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem(LS_USER) || "null");
  } catch {
    return null;
  }
}

function getAllTickets() {
  try {
    return JSON.parse(localStorage.getItem(LS_TICKETS) || "[]");
  } catch {
    return [];
  }
}
function saveAllTickets(tickets) {
  localStorage.setItem(LS_TICKETS, JSON.stringify(tickets));
}

function checkIsExternal(user) {
  const all = JSON.stringify(user || {}).toLowerCase();
  return all.includes("externe") || all.includes("external");
}


function initials(name = "") {
  const result = String(name)
    .trim()
    .split(/\s+/)
    .map((x) => x[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return result || "?";
}

function sameId(a, b) {
  const clean = (v) => String(v || "")
    .replace("ID-", "")
    .replace(/^0+/, "");

  return clean(a) === clean(b);
}

function normalizePriority(p) {
  const value = String(p || "normale").toLowerCase();
  if (value === "normal") return "normale";
  return value;
}

function displayTicketId(id) {
  const value = String(id || "");
  if (value.startsWith("ID-")) return value;
  return `ID-${value.padStart(5, "0")}`;
}

function makeTimeline(t) {
  if (Array.isArray(t.timeline) && t.timeline.length > 0) return t.timeline;

  return [
    {
      icon: "🔵",
      bg: "#EEF2FF",
      text: <><strong>Réclamation créée</strong></>,
      time: t.date || t.created_at || nowStr(),
    },
    {
      icon: "👤",
      bg: "#FEF3C7",
      text: <><strong>Affectée à vous</strong></>,
      time: t.assigned_at || t.date || nowStr(),
    },
  ];
}

function ticketToIntervenantCard(t) {
  const statut = t.statut || t.status || "attente";
  const col = COLUMNS.find((c) => c.key === statut);

  return {
    rawId: t.rawId || t.id,
    id: displayTicketId(t.id),
    titre: t.titre || t.title || "Sans titre",
    service: t.service || t.serviceName || "Support IT",
    cat: t.categorie || t.cat || t.category || "Autre",
    priorite: normalizePriority(t.priorite || t.priority),
    statut,
    date: t.date || (t.created_at ? new Date(t.created_at).toLocaleDateString("fr-FR") : ""),
    prog: t.prog ?? col?.prog ?? 0,
    description: t.description || t.desc || "",
    affectePar: t.affectePar || t.created_by_name || t.createdBy || "Responsable",
    timeline: makeTimeline(t),
    comments: t.comments || t.commentaires || [],
    piece_jointe: t.piece_jointe || t.attachmentName || t.fileName || null,
    assignType: t.assignType || t.intervenantType || t.assignee?.type || null,
    assignee_id: t.assignee_id || t.assigned_to || t.assignId || t.intervenant_id || null,
  };
}
function getTicketsForIntervenant(currentUser) {
  const savedTickets = getAllTickets();

  if (savedTickets.length === 0) {
    return TICKETS_INIT;
  }

  const meId = String(currentUser?.id || "").trim();
  const myName = String(currentUser?.nom || currentUser?.name || "").trim().toLowerCase();
  const myEmail = String(currentUser?.email || "").trim().toLowerCase();
  const isExternal = checkIsExternal(currentUser);

  const mine = savedTickets.filter((t) => {
    const ticketText = JSON.stringify(t || {}).toLowerCase();

    const assignedIds = [
      t.assignee_id,
      t.assigned_to,
      t.assignId,
      t.intervenant_id,
      t.intervenantId,
      t.assignee?.id,
      t.assignedTo?.id,
      t.intervenant?.id,
    ].filter((v) => v !== undefined && v !== null).map((v) => String(v).trim());

    const assignedToMeById = meId && assignedIds.includes(meId);
    const assignedToMeByName = myName && ticketText.includes(myName);
    const assignedToMeByEmail = myEmail && ticketText.includes(myEmail);

    const assignedToExternal =
      ticketText.includes("externe") ||
      ticketText.includes("external") ||
      String(t.assignType || "").toLowerCase() === "externe" ||
      String(t.intervenantType || "").toLowerCase() === "externe" ||
      String(t.type_intervenant || "").toLowerCase() === "externe" ||
      String(t.typeIntervenant || "").toLowerCase() === "externe";

    return (
      assignedToMeById ||
      assignedToMeByName ||
      assignedToMeByEmail ||
      (isExternal && assignedToExternal)
    );
  });

  return mine.map(ticketToIntervenantCard);
}

function updateTicketInStorage(ticketId, updater) {
  const all = getAllTickets();
  if (all.length === 0) return;

  const updated = all.map((t) => {
    if (sameId(t.id || t.rawId, ticketId)) return updater(t);
    return t;
  });

  saveAllTickets(updated);
}

// ── DATA ───────────────────────────────────────────────────────────────────
const TICKETS_INIT = [
  {
    id: "ID-61876", titre: "Défaut de livraison majeur",
    service: "Logistique", cat: "Transporteur A", priorite: "haute",
    statut: "cours", date: "05 Nov 2023", prog: 50,
    description: "Plusieurs colis ont été livrés à la mauvaise adresse. Le client signale des erreurs répétées sur 3 livraisons consécutives.",
    affectePar: "Karim Alami",
    timeline: [
      { icon: "🔵", bg: "#EEF2FF", text: <><strong>Réclamation créée</strong></>, time: "05 Nov 2023 – 08:00" },
      { icon: "👤", bg: "#FEF3C7", text: <><strong>Affectée à vous</strong> par Karim Alami</>, time: "06 Nov 2023 – 10:22" },
    ],
  },
  {
    id: "ID-88312", titre: "Mise à jour coordonnées fournisseur",
    service: "Technique", cat: "Info client", priorite: "normale",
    statut: "attente", date: "10 Nov 2023", prog: 0,
    description: "Les coordonnées du fournisseur principal doivent être mises à jour dans le système ERP.",
    affectePar: "Aya Saïdi",
    timeline: [
      { icon: "🔵", bg: "#EEF2FF", text: <><strong>Réclamation créée</strong></>, time: "10 Nov 2023 – 07:45" },
      { icon: "👤", bg: "#FEF3C7", text: <><strong>Affectée à vous</strong> par Aya Saïdi</>, time: "11 Nov 2023 – 09:10" },
    ],
  },
  {
    id: "ID-91045", titre: "Panne équipement réseau bureau C",
    service: "Technique", cat: "Maintenance", priorite: "urgent",
    statut: "attente", date: "15 Nov 2023", prog: 0,
    description: "L'équipement réseau du bureau C est en panne depuis ce matin. Impact sur 12 postes de travail.",
    affectePar: "Marc Lefebvre",
    timeline: [
      { icon: "🔵", bg: "#EEF2FF", text: <><strong>Réclamation créée</strong></>, time: "15 Nov 2023 – 07:30" },
      { icon: "👤", bg: "#FEF3C7", text: <><strong>Affectée à vous</strong> par Marc Lefebvre</>, time: "15 Nov 2023 – 08:15" },
    ],
  },
  {
    id: "ID-79544", titre: "Dysfonctionnement imprimante RDC",
    service: "Support IT", cat: "Matériel", priorite: "faible",
    statut: "resolu", date: "01 Nov 2023", prog: 100,
    description: "L'imprimante du rez-de-chaussée ne répond plus. Bourrage papier répété.",
    affectePar: "Marc Lefebvre",
    timeline: [
      { icon: "🔵", bg: "#EEF2FF", text: <><strong>Réclamation créée</strong></>, time: "01 Nov 2023 – 09:00" },
      { icon: "👤", bg: "#FEF3C7", text: <><strong>Affectée à vous</strong> par Marc Lefebvre</>, time: "02 Nov 2023 – 10:00" },
      { icon: "✅", bg: "#D1FAE5", text: <><strong>Résolue</strong> par vous — bourrage corrigé, rouleau remplacé</>, time: "03 Nov 2023 – 14:30" },
    ],
  },
];

const NOTIFS_INIT = [
  { id: 1, unread: true,  icon: "📋", bg: "#FEF3C7", text: <><strong>ID-91045</strong> vient de vous être affectée — urgente</>,    time: "Il y a 10 min" },
  { id: 2, unread: true,  icon: "⚠️", bg: "#FEE2E2", text: <><strong>ID-61876</strong> — délai de résolution dépassé</>,            time: "Il y a 1h" },
  { id: 3, unread: false, icon: "✅", bg: "#D1FAE5", text: <>Votre résolution sur <strong>ID-79544</strong> a été validée</>,       time: "03 Nov, 14:30" },
];

const COLUMNS = [
  { key: "attente", label: "À faire",  dotColor: "#9CA3AF", countColor: "#6B7280", prog: 0   },
  { key: "cours",   label: "En cours", dotColor: "#F59E0B", countColor: "#D97706", prog: 50  },
  { key: "resolu",  label: "Terminé",  dotColor: "#10B981", countColor: "#059669", prog: 100 },
];

const COL_KEYS   = ["attente", "cours", "resolu"];
const statutLabel = { attente: "À faire", cours: "En cours", resolu: "Terminé" };
const progColors  = { attente: "#9CA3AF", cours: "#F59E0B", resolu: "#10B981" };

const TRANSITIONS = {
  "attente→cours": { icon: "▶️", bg: "#FEF3C7", text: <><strong>Prise en charge</strong> — en cours de traitement</> },
  "cours→resolu":  { icon: "✅", bg: "#D1FAE5", text: <><strong>Résolue</strong> par vous</> },
  "attente→resolu":{ icon: "✅", bg: "#D1FAE5", text: <><strong>Résolue</strong> par vous</> },
};

function nowStr() {
  const d = new Date();
  const m = ["Jan","Fév","Mar","Avr","Mai","Juin","Jul","Août","Sep","Oct","Nov","Déc"];
  return `${d.getDate().toString().padStart(2,"0")} ${m[d.getMonth()]} ${d.getFullYear()} – ${d.getHours().toString().padStart(2,"0")}:${d.getMinutes().toString().padStart(2,"0")}`;
}

// ── LOGO ───────────────────────────────────────────────────────────────────
const Logo = () => (
  <div className="emp-sidebar-logo">
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <rect width="28" height="28" rx="8" fill="#4F46E5"/>
      <path d="M8 14C8 10.686 10.686 8 14 8C17.314 8 20 10.686 20 14C20 17.314 17.314 20 14 20"
        stroke="white" strokeWidth="1.9" strokeLinecap="round"/>
      <circle cx="14" cy="20" r="1.6" fill="white"/>
    </svg>
    <span>Bayan</span>
  </div>
);

// ── NOTIFICATION PANEL ─────────────────────────────────────────────────────
const NotificationPanel = ({ notifs, onMarkAll, onMarkOne, onClose }) => {
  const unreadCount = notifs.filter((n) => n.unread).length;
  return (
    <div className="emp-notif-overlay" onClick={onClose}>
      <div className="emp-notif-panel" onClick={(e) => e.stopPropagation()}>
        <div className="emp-notif-head">
          <div className="emp-notif-title">
            Notifications{" "}
            {unreadCount > 0 && (
              <span style={{ marginLeft:6, background:"#EF4444", color:"#fff", fontSize:10, fontWeight:700, borderRadius:99, padding:"1px 7px" }}>
                {unreadCount}
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <button className="emp-notif-mark-all" onClick={onMarkAll}>Tout marquer lu</button>
          )}
        </div>
        <div className="emp-notif-list">
          {notifs.map((n) => (
            <div key={n.id} className={`emp-notif-item${n.unread ? " unread" : ""}`} onClick={() => onMarkOne(n.id)}>
              <div className="emp-notif-icon" style={{ background: n.bg }}>{n.icon}</div>
              <div className="emp-notif-content">
                <div className="emp-notif-text">{n.text}</div>
                <div className="emp-notif-time">{n.time}</div>
              </div>
              {n.unread && <div className="emp-notif-unread-dot"/>}
            </div>
          ))}
        </div>
        <div className="emp-notif-footer">
          <button className="emp-notif-footer-btn" onClick={onClose}>Fermer</button>
        </div>
      </div>
    </div>
  );
};

// ── CONFIRM RESOLVE ────────────────────────────────────────────────────────
const ConfirmResolve = ({ ticket, onCancel, onConfirm }) => (
  <div className="emp-confirm-overlay" onClick={(e) => e.target === e.currentTarget && onCancel()}>
    <div className="emp-confirm-box">
      <div className="emp-confirm-icon">✅</div>
      <div className="emp-confirm-title">Marquer comme résolue ?</div>
      <div className="emp-confirm-text">
        Confirmez-vous que la réclamation{" "}
        <span className="emp-confirm-id">{ticket.id}</span>{" "}
        a été <strong>entièrement résolue</strong> ?<br/>Cette action sera enregistrée dans l'historique.
      </div>
      <div className="emp-confirm-btns">
        <button className="emp-confirm-cancel" onClick={onCancel}>Annuler</button>
        <button className="emp-confirm-ok" onClick={() => onConfirm(ticket.id)}>Confirmer</button>
      </div>
    </div>
  </div>
);

// ── TICKET CARD ────────────────────────────────────────────────────────────
const TicketCard = ({ ticket, colIndex, onOpen, onQuickAction }) => (
  <div className="emp-card" onClick={() => onOpen(ticket)}>
    <div className="emp-card-top">
      <span className="emp-card-id">{ticket.id}</span>
      <span className={`emp-pri-badge ${ticket.priorite}`}>
        {ticket.priorite.charAt(0).toUpperCase() + ticket.priorite.slice(1)}
      </span>
    </div>
    <div className="emp-card-title">{ticket.titre}</div>
    <div className="emp-card-tags">
      <span className="emp-tag">{ticket.service}</span>
      <span className="emp-tag">{ticket.cat}</span>
    </div>
    <div className="emp-prog-bg">
      <div className="emp-prog-fill" style={{ width: `${ticket.prog}%`, background: progColors[ticket.statut] }}/>
    </div>
    <div className="emp-card-footer">
      <span className="emp-card-date">
        <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
          <rect x="1" y="2" width="10" height="9" rx="1.5" stroke="#B0B7C3" strokeWidth="1.2"/>
          <path d="M4 1v2M8 1v2M1 5h10" stroke="#B0B7C3" strokeWidth="1.2" strokeLinecap="round"/>
        </svg>
        {ticket.date}
      </span>
      <span className="emp-card-by">Assignée à moi</span>
    </div>

    {/* Bouton rapide selon statut */}
    {ticket.statut !== "resolu" && (
      <div onClick={(e) => e.stopPropagation()}>
        {ticket.statut === "attente" && (
          <button
            className="iv-card-resolve-btn"
            style={{ marginTop:10, paddingTop:8, borderTop:"1px solid #F3F4F6", background:"#FFF7ED", borderColor:"#FED7AA", color:"#C2410C" }}
            onClick={() => onQuickAction(ticket.id, "cours")}
          >
            ▶ Prendre en charge
          </button>
        )}
        {ticket.statut === "cours" && (
          <button
            className="iv-card-resolve-btn"
            onClick={() => onQuickAction(ticket.id, "resolve")}
          >
            ✅ Marquer résolue
          </button>
        )}
      </div>
    )}
  </div>
);

// ── KANBAN COLUMN ──────────────────────────────────────────────────────────
const KanbanColumn = ({ col, tickets, colIndex, onOpen, onQuickAction }) => (
  <div className="emp-col">
    <div className="emp-col-header">
      <div className="emp-col-title">
        <div className="emp-col-dot" style={{ background: col.dotColor }}/>
        {col.label}
      </div>
      <span className="emp-col-count" style={{ color: col.countColor }}>{tickets.length}</span>
    </div>
    <div className="emp-col-body">
      {tickets.length === 0
        ? <div className="emp-drop-hint">Aucune réclamation</div>
        : tickets.map((t) => (
            <TicketCard key={t.id} ticket={t} colIndex={colIndex} onOpen={onOpen} onQuickAction={onQuickAction} />
          ))
      }
    </div>
  </div>
);

// ── DETAIL PANEL ───────────────────────────────────────────────────────────
const DetailPanel = ({ ticket, onClose, onMove, onConfirmResolve, onAddComment }) => {
  const [comment, setComment] = useState("");
  const progVal  = { attente: 0, cours: 50, resolu: 100 }[ticket.statut];

  const submitComment = () => {
    if (!comment.trim()) return;
    onAddComment(ticket.id, comment.trim());
    setComment("");
  };

  const comments = ticket.comments || [];

  return (
    <div className="emp-detail-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="emp-detail-panel">
        <div className="emp-detail-head">
          <span className="emp-detail-id">{ticket.id}</span>
          <button className="emp-close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="emp-detail-title">{ticket.titre}</div>
        <div className="emp-detail-badges">
          <span className={`emp-pri-badge ${ticket.priorite}`}>
            {ticket.priorite.charAt(0).toUpperCase() + ticket.priorite.slice(1)}
          </span>
          <span className={`emp-status-badge ${ticket.statut}`}>{statutLabel[ticket.statut]}</span>
        </div>

        {ticket.statut === "resolu" ? (
          <div className="iv-resolved-banner">✅ Cette réclamation est résolue</div>
        ) : (
          <>
            <button className="iv-resolve-btn" onClick={() => onConfirmResolve(ticket)}>
              ✅ Marquer comme résolue
            </button>
            <button
              className="iv-inprogress-btn"
              disabled={ticket.statut === "cours"}
              onClick={() => onMove(ticket.id, "cours")}
            >
              ▶ Passer en cours de traitement
            </button>
          </>
        )}

        <div className="emp-divider"/>
        {[
          ["Service",      ticket.service],
          ["Catégorie",    ticket.cat],
          ["Date",         ticket.date],
          ["Affectée par", ticket.affectePar],
          ...(ticket.piece_jointe ? [["Pièce jointe", `📎 ${ticket.piece_jointe}`]] : []),
        ].map(([k, v]) => (
          <div className="emp-detail-row" key={k}>
            <span className="emp-detail-key">{k}</span>
            <span className="emp-detail-val">{v}</span>
          </div>
        ))}

        <div style={{ marginTop:10, marginBottom:4 }}>
          <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:"#9CA3AF" }}>
            <span>Avancement</span>
            <span style={{ fontWeight:600, color:"#111827" }}>{progVal}%</span>
          </div>
          <div className="emp-prog-detail-bar">
            <div className="emp-prog-detail-fill" style={{ width:`${progVal}%`, background: progColors[ticket.statut] }}/>
          </div>
        </div>

        <div className="emp-divider"/>
        <div className="emp-section-title">Description</div>
        <p style={{ fontSize:13, color:"#374151", lineHeight:1.6, marginBottom:16 }}>
          {ticket.description || "Aucune description."}
        </p>

        {ticket.statut !== "resolu" && (
          <>
            <div className="emp-divider"/>
            <div className="iv-comment-label">Ajouter un commentaire</div>
            <textarea
              className="iv-comment-area"
              placeholder="Décrivez l'avancement, les actions effectuées..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button className="iv-comment-submit" disabled={!comment.trim()} onClick={submitComment}>
              Envoyer
            </button>
            <div style={{ clear:"both" }}/>
          </>
        )}

        {comments.length > 0 && (
          <>
            <div className="emp-divider"/>
            <div className="emp-section-title">Commentaires</div>
            {comments.map((c, i) => (
              <div key={i} style={{ marginTop:10, background:"#F9FAFB", borderRadius:8, padding:"9px 12px", fontSize:12.5, color:"#374151" }}>
                <div><strong>{c.author || c.user?.nom || "Utilisateur"}</strong></div>
                <div>{c.body || c.contenu || c.text}</div>
                <div style={{ fontSize:10.5, color:"#B0B7C3", marginTop:3 }}>{c.date || c.time}</div>
              </div>
            ))}
          </>
        )}

        <div className="emp-divider"/>
        <div className="emp-section-title">Historique</div>
        {(ticket.timeline || []).map((item, i) => (
          <div className="emp-tl-item" key={i}>
            <div className="emp-tl-icon" style={{ background: item.bg }}>{item.icon}</div>
            <div>
              <div className="emp-tl-text">{item.text}</div>
              <div className="emp-tl-time">{item.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── PAGE : MES RÉCLAMATIONS ────────────────────────────────────────────────
const MesReclamationsPage = ({ tickets, setTickets, showToast, currentUser }) => {
  const [activeFilter, setActiveFilter] = useState("toutes");
  const [selected,     setSelected]     = useState(null);
  const [confirmTkt,   setConfirmTkt]   = useState(null);

  const filterFn = (t) => {
    if (activeFilter === "creees")    return false;
    if (activeFilter === "urgentes")  return t.priorite === "urgent";
    return true;
  };

  const getCol = (statut) => tickets.filter((t) => t.statut === statut && filterFn(t));

const moveTicket = (id, toStatut) => {
  const col = COLUMNS.find((c) => c.key === toStatut);

  const updatedVisibleTickets = tickets.map((t) => {
    if (!sameId(t.id, id) || t.statut === toStatut) return t;

    return {
      ...t,
      statut: toStatut,
      prog: col.prog,
      timeline: [
        ...(t.timeline || []),
        {
          icon: toStatut === "resolu" ? "✅" : "▶️",
          bg: toStatut === "resolu" ? "#D1FAE5" : "#FEF3C7",
          text: toStatut === "resolu"
            ? <><strong>Résolue</strong> par vous</>
            : <><strong>Prise en charge</strong> — en cours de traitement</>,
          time: nowStr(),
        },
      ],
    };
  });

  setTickets(updatedVisibleTickets);

  const allTickets = getAllTickets();

  const updatedAllTickets = allTickets.map((t) => {
    if (!sameId(t.id || t.rawId, id)) return t;

    return {
      ...t,
      statut: toStatut,
      prog: col.prog,
    };
  });

  saveAllTickets(updatedAllTickets);

  setSelected((prev) => {
    if (!prev || !sameId(prev.id, id)) return prev;
    return updatedVisibleTickets.find((t) => sameId(t.id, id)) || prev;
  });

  showToast(`✅ Réclamation passée en « ${statutLabel[toStatut]} »`);
};
  const addComment = (ticketId, body) => {
    const newComment = {
      author: currentUser?.nom || currentUser?.name || "Intervenant",
      body,
      date: nowStr(),
    };

    updateTicketInStorage(ticketId, (t) => ({
      ...t,
      comments: [...(t.comments || t.commentaires || []), newComment],
    }));

    setTickets((prev) => prev.map((t) => {
      if (!sameId(t.id, ticketId)) return t;
      return { ...t, comments: [...(t.comments || []), newComment] };
    }));

    setSelected((prev) => {
      if (!prev || !sameId(prev.id, ticketId)) return prev;
      return { ...prev, comments: [...(prev.comments || []), newComment] };
    });

    showToast("💬 Commentaire ajouté");
  };

  const handleQuickAction = (id, action) => {
    if (action === "resolve") {
      const t = tickets.find((x) => sameId(x.id, id));
      if (t) setConfirmTkt(t);
    } else {
      moveTicket(id, action);
    }
  };

  const handleResolve = (id) => {
    moveTicket(id, "resolu");
    setConfirmTkt(null);
    setSelected(null);
  };

  return (
    <>
      <div className="emp-filters">
        <span className="emp-filter-label">Filtrer :</span>
        {[
          { key: "toutes",   label: "Toutes"    },
          { key: "urgentes", label: "Urgentes"  },
        ].map((f) => (
          <button
            key={f.key}
            className={`emp-filter-btn${activeFilter === f.key ? " active" : ""}`}
            onClick={() => setActiveFilter(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div style={{ fontSize:11.5, color:"#B0B7C3", marginBottom:16, display:"flex", alignItems:"center", gap:5 }}>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2 6h8M7 3l3 3-3 3" stroke="#B0B7C3" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Cliquez sur une carte pour voir le détail et résoudre la réclamation
      </div>

      <div className="emp-kanban">
        {COLUMNS.map((col, i) => (
          <KanbanColumn
            key={col.key}
            col={col}
            colIndex={i}
            tickets={getCol(col.key)}
            onOpen={setSelected}
            onQuickAction={handleQuickAction}
          />
        ))}
      </div>

      {selected && (
        <DetailPanel
          ticket={selected}
          onClose={() => setSelected(null)}
          onMove={moveTicket}
          onConfirmResolve={(t) => setConfirmTkt(t)}
          onAddComment={addComment}
        />
      )}

      {confirmTkt && (
        <ConfirmResolve
          ticket={confirmTkt}
          onCancel={() => setConfirmTkt(null)}
          onConfirm={handleResolve}
        />
      )}
    </>
  );
};

// ── PAGE : MON PROFIL ──────────────────────────────────────────────────────
const MonProfilPage = ({ currentUser }) => {
  const name = currentUser?.nom || currentUser?.name || "Intervenant";
  const isExternal = checkIsExternal(currentUser);
  const type = isExternal ? "EXTERNE" : "INTERNE";
  const badgeText = isExternal ? "Intervenant Externe" : "Intervenant Interne";

  return (
    <div className="emp-profil-card">
      <div className="emp-profil-header">
        <div className="emp-profil-av" style={{ background: currentUser?.couleur || "#8B5CF6" }}>
          {currentUser?.initiales || initials(name)}
        </div>
        <div>
          <div className="emp-profil-name">{name}</div>
          <div className="emp-profil-email">{currentUser?.email || "intervenant@bayan.ma"}</div>
          <div className="emp-profil-badge">{badgeText}</div>
        </div>
      </div>

      {[
        ["Rôle", "Intervenant"],
        ["Type", type],
        ["Droits", "Voir / traiter les réclamations affectées"],
      ].map(([k, v]) => (
        <div className="emp-profil-row" key={k}>
          <span className="emp-profil-key">{k}</span>
          <span className="emp-profil-val">{v}</span>
        </div>
      ))}

      <div style={{ marginTop:18, background:"#FAFBFF", border:"1px solid #E0E7FF", borderRadius:10, padding:"14px 16px" }}>
        <div style={{ fontSize:12, fontWeight:700, color:"#3730A3", marginBottom:10 }}>Droits d'accès</div>
        {[
          { ok: true,  label: "Consulter les réclamations affectées" },
          { ok: true,  label: "Passer une réclamation en cours" },
          { ok: true,  label: "Marquer une réclamation comme résolue" },
          { ok: true,  label: "Ajouter des commentaires de suivi" },
          { ok: false, label: "Soumettre une nouvelle réclamation" },
          { ok: false, label: "Modifier ou supprimer des réclamations" },
          { ok: false, label: "Voir les réclamations non affectées" },
        ].map(({ ok, label }) => (
          <div key={label} style={{ display:"flex", alignItems:"center", gap:8, fontSize:12.5, color: ok ? "#374151" : "#9CA3AF", padding:"3px 0" }}>
            <span>{ok ? "✅" : "❌"}</span><span style={{ textDecoration: ok ? "none" : "line-through" }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── MAIN ───────────────────────────────────────────────────────────────────
export default function IntervenantDashboard() {
  const navigate = useNavigate();

  const [currentUser] = useState(() => getCurrentUser());
  const [activePage, setActivePage] = useState("mes");
   const [tickets, setTickets] = useState(() => getTicketsForIntervenant(getCurrentUser()));
  const [notifs,     setNotifs]     = useState(NOTIFS_INIT);
  const [showNotifs, setShowNotifs] = useState(false);
  const [toast,      setToast]      = useState(null);
  const toastTimer = useRef(null);
// Add this useEffect after the existing ones
useEffect(() => {
  const onFocus = () => {
    setTickets(getTicketsForIntervenant(currentUser));
  };
  window.addEventListener("focus", onFocus);
  return () => window.removeEventListener("focus", onFocus);
}, [currentUser]);
  useEffect(() => {
    setTickets(getTicketsForIntervenant(currentUser));
  }, [currentUser]);

  const showToast = (msg) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  };

  const doLogout = () => {
    localStorage.removeItem(LS_USER);
    navigate("/login");
  };

  const userName = currentUser?.nom || currentUser?.name || "Intervenant";
  const userInitials = currentUser?.initiales || initials(userName);
 
const isExternal = checkIsExternal(currentUser);
  const pageTitles = { mes: "Mes réclamations affectées", messagerie: "Messagerie", profil: "Mon profil" };

  const navItems = [
    {
      key: "mes", label: "Mes réclamations", section: "PRINCIPAL", badge: true,
      icon: <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="6" height="6" rx="1.5" fill="currentColor" opacity=".7"/><rect x="9" y="1" width="6" height="6" rx="1.5" fill="currentColor" opacity=".4"/><rect x="1" y="9" width="6" height="6" rx="1.5" fill="currentColor" opacity=".4"/><rect x="9" y="9" width="6" height="6" rx="1.5" fill="currentColor" opacity=".7"/></svg>,
    },
    {
      key: "messagerie", label: "Messagerie", section: null, msgBadge: true,
      icon: <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M2 3a1 1 0 011-1h10a1 1 0 011 1v8a1 1 0 01-1 1H5l-3 3V3z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/></svg>,
    },
    {
      key: "profil", label: "Mon profil", section: "AUTRE",
      icon: <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.4"/><path d="M2 14c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
    },
  ];

  const renderPage = () => {
    switch (activePage) {
      case "mes":
        return (
          <MesReclamationsPage
            tickets={tickets}
            setTickets={setTickets}
            showToast={showToast}
            currentUser={currentUser}
          />
        );
      case "messagerie":
        return <MessagerieePage />;
      case "profil":
        return <MonProfilPage currentUser={currentUser} />;
      default:
        return (
          <MesReclamationsPage
            tickets={tickets}
            setTickets={setTickets}
            showToast={showToast}
            currentUser={currentUser}
          />
        );
    }
  };

  return (
    <>
      <style>{CSS + MSG_CSS}</style>
      <div className="emp-layout">

        {/* ── SIDEBAR ── */}
        <aside className="emp-sidebar">
          <Logo />
          <nav className="emp-sidebar-nav">
            {navItems.map((item) => (
              <div key={item.key}>
                {item.section && <div className="emp-nav-section">{item.section}</div>}
                <button
                  className={`emp-nav-item${activePage === item.key ? " active" : ""}`}
                  onClick={() => setActivePage(item.key)}
                >
                  {item.icon}
                  {item.label}
                  {item.badge && (
                    <span className="emp-nav-badge">{tickets.filter(t => t.statut !== "resolu").length}</span>
                  )}
                  {item.msgBadge && (
                    <span className="emp-nav-badge" style={{ background: "#EF4444" }}>2</span>
                  )}
                </button>
              </div>
            ))}
          </nav>

          <div className="emp-sidebar-user">
            <div className="emp-user-avatar" style={{ background: currentUser?.couleur || "#8B5CF6" }}>
              {userInitials}
            </div>
            <div>
              <div className="emp-user-name">{userName}</div>
              <div className="emp-user-role">Intervenant</div>
              <div className="iv-ext-badge">🔒 {isExternal ? "EXTERNE" : "INTERNE"}</div>
            </div>
          </div>
        </aside>

        {/* ── MAIN ── */}
        <div className="emp-main">
          <header className="emp-topbar">
            <div className="emp-topbar-title">{pageTitles[activePage]}</div>

            <div className="emp-search-bar">
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                <circle cx="6" cy="6" r="4.5" stroke="#9CA3AF" strokeWidth="1.4"/>
                <path d="M9.5 9.5L12 12" stroke="#9CA3AF" strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
              <input placeholder="Rechercher une réclamation..."/>
            </div>

            <div className="emp-topbar-right">
              <button className="emp-icon-btn" onClick={() => setShowNotifs((v) => !v)}>
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                  <path d="M8 1.5a5 5 0 015 5v2.5l1 2H1l1-2V6.5a5 5 0 015-5z" stroke="#6B7280" strokeWidth="1.4"/>
                  <path d="M6.5 13.5a1.5 1.5 0 003 0" stroke="#6B7280" strokeWidth="1.4"/>
                </svg>
                {notifs.filter(n => n.unread).length > 0 && (
                  <span className="emp-notif-dot">{notifs.filter(n => n.unread).length}</span>
                )}
              </button>
              <button className="emp-icon-btn" onClick={doLogout} title="Déconnexion">
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                  <path d="M6 14H3a1 1 0 01-1-1V3a1 1 0 011-1h3M10 11l3-3-3-3M13 8H6"
                    stroke="#6B7280" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </header>

          <div className={activePage === "messagerie" ? "" : "emp-page-body"}>{renderPage()}</div>
        </div>
      </div>

      {showNotifs && (
        <NotificationPanel
          notifs={notifs}
          onMarkAll={() => setNotifs((p) => p.map((n) => ({ ...n, unread: false })))}
          onMarkOne={(id) => setNotifs((p) => p.map((n) => n.id === id ? { ...n, unread: false } : n))}
          onClose={() => setShowNotifs(false)}
        />
      )}

      {toast && <div className="emp-toast">{toast}</div>}
    </>
  );
}
