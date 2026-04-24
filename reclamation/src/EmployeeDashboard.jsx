import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MessagerieePage, { MSG_CSS } from "./MessagerieePage";

// ── CSS ────────────────────────────────────────────────────────────────────
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
  .emp-btn-new { background: #4F46E5; color: #fff; border: none; border-radius: 9px; padding: 9px 16px; font-size: 12.5px; font-weight: 600; cursor: pointer; font-family: 'Sora', sans-serif; display: flex; align-items: center; gap: 6px; transition: background 0.2s; }
  .emp-btn-new:hover { background: #4338CA; }

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
  .emp-col.drag-over { border-color: #4F46E5; background: #FAFBFF; }
  .emp-col-header { display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; border-bottom: 1px solid rgba(0,0,0,0.06); background: #fff; }
  .emp-col-title { font-size: 12.5px; font-weight: 500; color: #374151; display: flex; align-items: center; gap: 7px; }
  .emp-col-dot { width: 8px; height: 8px; border-radius: 50%; }
  .emp-col-count { font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 99px; background: #fff; border: 1px solid #E5E7EB; }
  .emp-col-body { padding: 12px; display: flex; flex-direction: column; gap: 10px; min-height: 340px; }

  /* CARD */
  .emp-card { background: #fff; border-radius: 12px; border: 1px solid rgba(0,0,0,0.07); padding: 13px 14px; cursor: grab; transition: transform 0.18s, box-shadow 0.18s, opacity 0.2s; user-select: none; }
  .emp-card:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,0.09); }
  .emp-card.dragging { opacity: 0.4; cursor: grabbing; transform: rotate(2deg) scale(1.03); box-shadow: 0 16px 40px rgba(0,0,0,0.2); }
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

  /* MOVE BUTTONS on card */
  .emp-card-actions { display: flex; gap: 6px; margin-top: 10px; padding-top: 9px; border-top: 1px solid #F3F4F6; }
  .emp-move-btn { flex: 1; padding: 5px 6px; border-radius: 7px; border: 1px solid #E5E7EB; background: #F9FAFB; font-size: 10.5px; font-weight: 500; cursor: pointer; font-family: 'DM Sans', sans-serif; color: #6B7280; transition: all 0.15s; white-space: nowrap; }
  .emp-move-btn:hover:not(:disabled) { background: #EEF2FF; border-color: #A5B4FC; color: #4F46E5; }
  .emp-move-btn.fwd:hover:not(:disabled) { background: #D1FAE5; border-color: #6EE7B7; color: #059669; }
  .emp-move-btn:disabled { opacity: 0.25; cursor: not-allowed; }

  /* DRAG HINT in empty col */
  .emp-drop-hint { border: 2px dashed #C7D2FE; border-radius: 10px; padding: 28px 0; text-align: center; font-size: 11.5px; color: #A5B4FC; }

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

  /* DETAIL MOVE BUTTONS */
  .emp-detail-move-row { display: flex; gap: 8px; margin-top: 14px; }
  .emp-detail-move-btn { flex: 1; padding: 9px 8px; border-radius: 9px; border: 1.5px solid #E5E7EB; background: #F9FAFB; font-size: 12px; font-weight: 500; cursor: pointer; font-family: 'DM Sans', sans-serif; color: #6B7280; transition: all 0.2s; text-align: center; }
  .emp-detail-move-btn:hover:not(:disabled) { background: #EEF2FF; border-color: #A5B4FC; color: #4F46E5; }
  .emp-detail-move-btn.fwd:hover:not(:disabled) { background: #D1FAE5; border-color: #6EE7B7; color: #059669; }
  .emp-detail-move-btn:disabled { opacity: 0.25; cursor: not-allowed; }

  /* DETAIL ACTION BUTTONS (edit / delete) */
  .emp-detail-action-row { display: flex; gap: 8px; margin-top: 10px; }
  .emp-detail-edit-btn { flex: 1; display: flex; align-items: center; justify-content: center; gap: 6px; padding: 9px; border-radius: 9px; border: 1.5px solid #E5E7EB; background: #F9FAFB; font-size: 12px; font-weight: 500; cursor: pointer; font-family: 'DM Sans', sans-serif; color: #374151; transition: all 0.2s; }
  .emp-detail-edit-btn:hover { background: #EEF2FF; border-color: #A5B4FC; color: #4F46E5; }
  .emp-detail-delete-btn { flex: 1; display: flex; align-items: center; justify-content: center; gap: 6px; padding: 9px; border-radius: 9px; border: 1.5px solid #FEE2E2; background: #FFF5F5; font-size: 12px; font-weight: 500; cursor: pointer; font-family: 'DM Sans', sans-serif; color: #EF4444; transition: all 0.2s; }
  .emp-detail-delete-btn:hover { background: #FEE2E2; border-color: #FCA5A5; }

  /* CARD MENU (⋮ button) */
  .emp-card-menu-wrap { position: relative; }
  .emp-card-menu-btn { width: 24px; height: 24px; border-radius: 6px; border: none; background: none; cursor: pointer; display: flex; align-items: center; justify-content: center; color: #B0B7C3; font-size: 14px; font-weight: 700; letter-spacing: 1px; transition: all 0.15s; flex-shrink: 0; }
  .emp-card-menu-btn:hover { background: #F4F5FA; color: #6B7280; }
  .emp-card-dropdown { position: absolute; top: 28px; right: 0; background: #fff; border: 1px solid #E5E7EB; border-radius: 10px; box-shadow: 0 8px 24px rgba(0,0,0,0.10); z-index: 50; min-width: 148px; overflow: hidden; animation: empSlideUp 0.15s ease; }
  .emp-card-dropdown-item { display: flex; align-items: center; gap: 8px; padding: 9px 13px; font-size: 12.5px; cursor: pointer; color: #374151; font-family: 'DM Sans', sans-serif; transition: background 0.12s; border: none; background: none; width: 100%; text-align: left; }
  .emp-card-dropdown-item:hover { background: #F4F5FA; }
  .emp-card-dropdown-item.danger { color: #EF4444; }
  .emp-card-dropdown-item.danger:hover { background: #FFF5F5; }
  .emp-card-dropdown-sep { height: 1px; background: #F3F4F6; margin: 3px 0; }

  /* DELETE CONFIRM MODAL */
  .emp-confirm-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 600; display: flex; align-items: center; justify-content: center; }
  .emp-confirm-box { background: #fff; border-radius: 16px; padding: 28px 26px; width: 360px; box-shadow: 0 20px 60px rgba(0,0,0,0.16); text-align: center; }
  .emp-confirm-icon { width: 48px; height: 48px; border-radius: 12px; background: #FFF5F5; display: flex; align-items: center; justify-content: center; margin: 0 auto 14px; }
  .emp-confirm-title { font-family: 'Sora', sans-serif; font-size: 16px; font-weight: 700; color: #0F1117; margin-bottom: 8px; }
  .emp-confirm-text { font-size: 12.5px; color: #9CA3AF; line-height: 1.6; margin-bottom: 22px; }
  .emp-confirm-id { font-family: monospace; font-size: 11px; background: #F4F5FA; color: #6B7280; padding: 2px 7px; border-radius: 4px; }
  .emp-confirm-btns { display: flex; gap: 10px; }
  .emp-confirm-cancel { flex: 1; padding: 11px; background: #F4F5FA; border: 1px solid #E5E7EB; border-radius: 9px; font-size: 13px; cursor: pointer; font-family: 'DM Sans', sans-serif; color: #374151; font-weight: 500; transition: background 0.15s; }
  .emp-confirm-cancel:hover { background: #E5E7EB; }
  .emp-confirm-delete { flex: 1; padding: 11px; background: #EF4444; border: none; border-radius: 9px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: 'Sora', sans-serif; color: #fff; transition: background 0.2s; }
  .emp-confirm-delete:hover { background: #DC2626; }

  /* TIMELINE */
  .emp-tl-item { display: flex; gap: 10px; padding: 9px 0; border-bottom: 1px solid #F9FAFB; }
  .emp-tl-item:last-child { border-bottom: none; }
  .emp-tl-icon { width: 28px; height: 28px; border-radius: 8px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 13px; margin-top: 1px; }
  .emp-tl-text { font-size: 12.5px; color: #374151; line-height: 1.5; }
  .emp-tl-text strong { color: #0F1117; font-weight: 600; }
  .emp-tl-time { font-size: 10.5px; color: #B0B7C3; margin-top: 2px; }

  /* MODAL */
  .emp-modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.35); z-index: 500; display: flex; align-items: center; justify-content: center; }
  .emp-modal { background: #fff; border-radius: 18px; width: 500px; max-height: 90vh; overflow-y: auto; box-shadow: 0 20px 60px rgba(0,0,0,0.18); }
  .emp-modal-head { display: flex; align-items: center; justify-content: space-between; padding: 20px 24px 16px; border-bottom: 1px solid rgba(0,0,0,0.06); position: sticky; top: 0; background: #fff; z-index: 1; }
  .emp-modal-title { font-family: 'Sora', sans-serif; font-size: 17px; font-weight: 700; color: #0F1117; }
  .emp-modal-body { padding: 22px 24px; }
  .emp-modal-section { font-size: 9.5px; font-weight: 600; color: #B0B7C3; letter-spacing: 0.9px; text-transform: uppercase; margin-bottom: 14px; }
  .emp-field { margin-bottom: 16px; }
  .emp-field label { display: block; font-size: 10.5px; font-weight: 600; color: #9CA3AF; text-transform: uppercase; letter-spacing: 0.7px; margin-bottom: 7px; }
  .emp-field input, .emp-field select, .emp-field textarea { width: 100%; padding: 10px 13px; border: 1.5px solid #E5E7EB; border-radius: 9px; font-size: 13.5px; font-family: 'DM Sans', sans-serif; color: #0F1117; background: #FAFAFA; outline: none; transition: border-color 0.2s; }
  .emp-field input:focus, .emp-field select:focus, .emp-field textarea:focus { border-color: #4F46E5; background: #fff; }
  .emp-field textarea { resize: none; min-height: 90px; line-height: 1.6; }
  .emp-fields-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .emp-pri-group { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
  .emp-pri-opt { padding: 8px; border: 1.5px solid #E5E7EB; border-radius: 8px; font-size: 12px; font-weight: 500; cursor: pointer; text-align: center; font-family: 'DM Sans', sans-serif; background: #fff; color: #6B7280; transition: all 0.15s; }
  .emp-pri-opt.sel-urgent  { background: #FEE2E2; border-color: #FCA5A5; color: #B91C1C; }
  .emp-pri-opt.sel-haute   { background: #FEF3C7; border-color: #FCD34D; color: #92400E; }
  .emp-pri-opt.sel-normale { background: #EEF2FF; border-color: #A5B4FC; color: #4338CA; }
  .emp-pri-opt.sel-faible  { background: #F3F4F6; border-color: #D1D5DB; color: #6B7280; }
  .emp-upload-zone { border: 1.5px dashed #D1D5DB; border-radius: 10px; padding: 22px; text-align: center; cursor: pointer; }
  .emp-upload-zone:hover { border-color: #4F46E5; background: #FAFBFF; }
  .emp-upload-txt { font-size: 12.5px; color: #6B7280; margin-top: 6px; }
  .emp-upload-txt span { color: #4F46E5; font-weight: 500; }
  .emp-upload-sub { font-size: 11px; color: #B0B7C3; margin-top: 3px; }
  .emp-modal-footer { padding: 16px 24px; border-top: 1px solid rgba(0,0,0,0.06); display: flex; justify-content: flex-end; gap: 10px; position: sticky; bottom: 0; background: #fff; }
  .emp-btn-cancel { padding: 10px 18px; background: #F4F5FA; border: 1px solid #E5E7EB; border-radius: 9px; font-size: 13px; cursor: pointer; font-family: 'DM Sans', sans-serif; color: #374151; }
  .emp-btn-cancel:hover { background: #E5E7EB; }
  .emp-btn-submit { padding: 10px 22px; background: #4F46E5; border: none; border-radius: 9px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: 'Sora', sans-serif; color: #fff; }
  .emp-btn-submit:hover { background: #4338CA; }

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

  /* PARAMS */
  .emp-params-card { background: #fff; border-radius: 16px; border: 1px solid rgba(0,0,0,0.06); padding: 22px 24px; margin-bottom: 16px; max-width: 520px; }
  .emp-params-section-title { font-family: 'Sora', sans-serif; font-size: 14px; font-weight: 600; color: #0F1117; margin-bottom: 14px; }
  .emp-param-row { display: flex; align-items: center; justify-content: space-between; padding: 11px 0; border-bottom: 1px solid #F9FAFB; }
  .emp-param-row:last-child { border-bottom: none; }
  .emp-param-label { font-size: 13px; color: #374151; }
  .emp-param-sub { font-size: 11px; color: #9CA3AF; margin-top: 2px; }
  .emp-toggle { width: 40px; height: 22px; border-radius: 99px; border: none; cursor: pointer; transition: background 0.2s; position: relative; flex-shrink: 0; }
  .emp-toggle.on  { background: #4F46E5; }
  .emp-toggle.off { background: #D1D5DB; }
  .emp-toggle::after { content: ''; position: absolute; top: 3px; width: 16px; height: 16px; border-radius: 50%; background: #fff; transition: left 0.2s; }
  .emp-toggle.on::after  { left: 21px; }
  .emp-toggle.off::after { left: 3px; }
  .emp-btn-save { background: #4F46E5; color: #fff; border: none; border-radius: 9px; padding: 10px 22px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: 'Sora', sans-serif; }
  .emp-btn-save:hover { background: #4338CA; }

  /* TOAST */
  .emp-toast { position: fixed; bottom: 28px; right: 28px; background: #1C1C2E; color: #fff; padding: 12px 20px; border-radius: 10px; font-size: 13px; font-weight: 500; z-index: 999; box-shadow: 0 8px 28px rgba(0,0,0,0.2); display: flex; align-items: center; gap: 8px; animation: empSlideUp 0.3s ease; }
  @keyframes empSlideUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }

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
  .emp-notif-empty { padding: 32px 16px; text-align: center; }
  .emp-notif-empty-icon { font-size: 28px; margin-bottom: 8px; }
  .emp-notif-empty-text { font-size: 13px; color: #9CA3AF; }
  .emp-notif-footer { padding: 10px 16px; border-top: 1px solid #F3F4F6; text-align: center; }
  .emp-notif-footer-btn { font-size: 12px; color: #4F46E5; font-weight: 500; background: none; border: none; cursor: pointer; font-family: 'DM Sans', sans-serif; }
  .emp-notif-footer-btn:hover { text-decoration: underline; }
`;

// ── DATA ───────────────────────────────────────────────────────────────────
const TICKETS_INIT = [
  {
    id: "ID-88242", titre: "Problème de facturation récurrent",
    service: "Comptabilité", cat: "Facturation", priorite: "urgent",
    statut: "attente", date: "12 Oct 2023", creePar: true, assignee: false, prog: 0,
    description: "La facturation mensuelle génère des doublons depuis 3 mois.",
    timeline: [
      { icon: "🔵", bg: "#EEF2FF", text: <><strong>Réclamation créée</strong> par vous</>, time: "12 Oct 2023 – 09:14" },
      { icon: "⏳", bg: "#F3F4F6", text: <>En attente d'assignation</>, time: "12 Oct 2023 – 09:15" },
    ],
  },
  {
    id: "ID-61876", titre: "Défaut de livraison majeur",
    service: "Logistique", cat: "Transporteur A", priorite: "haute",
    statut: "cours", date: "05 Nov 2023", creePar: false, assignee: true, prog: 50,
    description: "Plusieurs colis ont été livrés à la mauvaise adresse.",
    timeline: [
      { icon: "🔵", bg: "#EEF2FF", text: <><strong>Réclamation créée</strong></>, time: "05 Nov 2023 – 08:00" },
      { icon: "▶️", bg: "#FEF3C7", text: <>Passée en <strong>En cours</strong></>, time: "06 Nov 2023 – 10:22" },
    ],
  },
  {
    id: "ID-68245", titre: "Accès portail client bloqué",
    service: "Support IT", cat: "Authentification", priorite: "normale",
    statut: "attente", date: "18 Oct 2023", creePar: true, assignee: false, prog: 0,
    description: "Impossible de se connecter au portail depuis la mise à jour.",
    timeline: [
      { icon: "🔵", bg: "#EEF2FF", text: <><strong>Réclamation créée</strong> par vous</>, time: "18 Oct 2023 – 11:02" },
    ],
  },
  {
    id: "ID-88312", titre: "Mise à jour coordonnées fournisseur",
    service: "Technique", cat: "Info client", priorite: "normale",
    statut: "cours", date: "10 Nov 2023", creePar: false, assignee: true, prog: 50,
    description: "Les coordonnées du fournisseur principal doivent être actualisées.",
    timeline: [
      { icon: "🔵", bg: "#EEF2FF", text: <><strong>Réclamation créée</strong></>, time: "10 Nov 2023 – 07:45" },
      { icon: "▶️", bg: "#FEF3C7", text: <>Passée en <strong>En cours</strong></>, time: "11 Nov 2023 – 09:10" },
    ],
  },
  {
    id: "ID-79100", titre: "Remboursement note de frais",
    service: "RH", cat: "Finance", priorite: "faible",
    statut: "resolu", date: "02 Oct 2023", creePar: true, assignee: false, prog: 100,
    description: "Remboursement de la note de frais du déplacement de septembre.",
    timeline: [
      { icon: "🔵", bg: "#EEF2FF", text: <><strong>Réclamation créée</strong> par vous</>, time: "02 Oct 2023 – 14:20" },
      { icon: "▶️", bg: "#FEF3C7", text: <>Passée en <strong>En cours</strong></>, time: "03 Oct 2023 – 09:00" },
      { icon: "✅", bg: "#D1FAE5", text: <><strong>Terminée</strong> – remboursement effectué</>, time: "05 Oct 2023 – 16:45" },
    ],
  },
];

// ── COLUMN CONFIG ──────────────────────────────────────────────────────────
const COLUMNS = [
  { key: "attente", label: "À faire",  dotColor: "#9CA3AF", countColor: "#6B7280", prog: 0   },
  { key: "cours",   label: "En cours", dotColor: "#F59E0B", countColor: "#D97706", prog: 50  },
  { key: "resolu",  label: "Terminé",  dotColor: "#10B981", countColor: "#059669", prog: 100 },
];

const COL_KEYS     = ["attente", "cours", "resolu"];
const statutLabel  = { attente: "À faire", cours: "En cours", resolu: "Terminé" };
const progColors   = { attente: "#9CA3AF", cours: "#F59E0B",  resolu: "#10B981"  };

const TRANSITIONS = {
  "attente→cours":  { icon: "▶️", bg: "#FEF3C7", text: <><strong>En cours</strong> – prise en charge</> },
  "cours→resolu":   { icon: "✅", bg: "#D1FAE5", text: <><strong>Terminée</strong></> },
  "cours→attente":  { icon: "↩️", bg: "#F3F4F6", text: <>Renvoyée en <strong>À faire</strong></> },
  "resolu→cours":   { icon: "🔄", bg: "#FEF3C7", text: <>Réouverte en <strong>En cours</strong></> },
};

function nowStr() {
  const d = new Date();
  const mois = ["Jan","Fév","Mar","Avr","Mai","Juin","Jul","Août","Sep","Oct","Nov","Déc"];
  return `${d.getDate().toString().padStart(2,"0")} ${mois[d.getMonth()]} ${d.getFullYear()} – ${d.getHours().toString().padStart(2,"0")}:${d.getMinutes().toString().padStart(2,"0")}`;
}

// ── HELPERS ────────────────────────────────────────────────────────────────
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

const Toggle = ({ init = true }) => {
  const [on, setOn] = useState(init);
  return <button className={`emp-toggle ${on ? "on" : "off"}`} onClick={() => setOn(!on)} />;
};

// ── TICKET CARD ────────────────────────────────────────────────────────────
const TicketCard = ({ ticket, colIndex, onMove, onOpen, onEdit, onDelete }) => {
  const [dragging,  setDragging]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);
  const menuRef = useRef(null);

  // Close menu on outside click
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  const prevLabel = colIndex > 0 ? `← ${statutLabel[COL_KEYS[colIndex - 1]]}` : "";
  const nextLabel = colIndex < 2 ? `${statutLabel[COL_KEYS[colIndex + 1]]} →` : "";

  return (
    <div
      className={`emp-card${dragging ? " dragging" : ""}`}
      draggable
      onDragStart={(e) => {
        setDragging(true);
        e.dataTransfer.setData("ticketId", ticket.id);
        e.dataTransfer.effectAllowed = "move";
      }}
      onDragEnd={() => setDragging(false)}
      onClick={() => !menuOpen && onOpen(ticket)}
    >
      <div className="emp-card-top">
        <span className="emp-card-id">{ticket.id}</span>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span className={`emp-pri-badge ${ticket.priorite}`}>
            {ticket.priorite.charAt(0).toUpperCase() + ticket.priorite.slice(1)}
          </span>
          {/* ⋮ Menu */}
          <div className="emp-card-menu-wrap" ref={menuRef} onClick={(e) => e.stopPropagation()}>
            <button className="emp-card-menu-btn" onClick={() => setMenuOpen((v) => !v)}>⋮</button>
            {menuOpen && (
              <div className="emp-card-dropdown">
                <button className="emp-card-dropdown-item" onClick={() => { setMenuOpen(false); onEdit(ticket); }}>
                  <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                    <path d="M9.5 2.5l2 2L4 12H2v-2L9.5 2.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
                  </svg>
                  Modifier
                </button>
                <div className="emp-card-dropdown-sep"/>
                <button className="emp-card-dropdown-item danger" onClick={() => { setMenuOpen(false); onDelete(ticket); }}>
                  <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                    <path d="M2 3.5h10M5 3.5V2.5a.5.5 0 01.5-.5h3a.5.5 0 01.5.5v1M5.5 6v4M8.5 6v4M3 3.5l.7 8a1 1 0 001 .9h4.6a1 1 0 001-.9l.7-8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Supprimer
                </button>
              </div>
            )}
          </div>
        </div>
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
        <span className="emp-card-by">
          {ticket.creePar ? "Créée par moi" : ticket.assignee ? "Assignée à moi" : ""}
        </span>
      </div>

      {/* Boutons de déplacement */}
      <div className="emp-card-actions" onClick={(e) => e.stopPropagation()}>
        <button className="emp-move-btn" disabled={colIndex === 0} onClick={() => onMove(ticket.id, COL_KEYS[colIndex - 1])}>
          {prevLabel}
        </button>
        <button className="emp-move-btn fwd" disabled={colIndex === 2} onClick={() => onMove(ticket.id, COL_KEYS[colIndex + 1])}>
          {nextLabel}
        </button>
      </div>
    </div>
  );
};

// ── KANBAN COLUMN ──────────────────────────────────────────────────────────
const KanbanColumn = ({ col, colIndex, tickets, onMove, onOpen, onEdit, onDelete }) => {
  const [dragOver, setDragOver] = useState(false);

  return (
    <div
      className={`emp-col${dragOver ? " drag-over" : ""}`}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        const id = e.dataTransfer.getData("ticketId");
        if (id) onMove(id, col.key);
      }}
    >
      <div className="emp-col-header">
        <div className="emp-col-title">
          <div className="emp-col-dot" style={{ background: col.dotColor }}/>
          {col.label}
        </div>
        <span className="emp-col-count" style={{ color: col.countColor }}>{tickets.length}</span>
      </div>
      <div className="emp-col-body">
        {tickets.length === 0
          ? <div className="emp-drop-hint">Déposez une carte ici</div>
          : tickets.map((t) => (
              <TicketCard key={t.id} ticket={t} colIndex={colIndex} onMove={onMove} onOpen={onOpen} onEdit={onEdit} onDelete={onDelete} />
            ))
        }
      </div>
    </div>
  );
};

// ── DETAIL PANEL ───────────────────────────────────────────────────────────
const DetailPanel = ({ ticket, onClose, onMove, onEdit, onDelete }) => {
  const colIndex = COL_KEYS.indexOf(ticket.statut);

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

        {/* Déplacer */}
        <div className="emp-detail-move-row">
          <button className="emp-detail-move-btn" disabled={colIndex === 0} onClick={() => onMove(ticket.id, COL_KEYS[colIndex - 1])}>
            ← {colIndex > 0 ? statutLabel[COL_KEYS[colIndex - 1]] : ""}
          </button>
          <button className="emp-detail-move-btn fwd" disabled={colIndex === 2} onClick={() => onMove(ticket.id, COL_KEYS[colIndex + 1])}>
            {colIndex < 2 ? statutLabel[COL_KEYS[colIndex + 1]] : ""} →
          </button>
        </div>

        {/* Modifier / Supprimer */}
        <div className="emp-detail-action-row">
          <button className="emp-detail-edit-btn" onClick={() => { onClose(); onEdit(ticket); }}>
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
              <path d="M9.5 2.5l2 2L4 12H2v-2L9.5 2.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
            </svg>
            Modifier
          </button>
          <button className="emp-detail-delete-btn" onClick={() => { onClose(); onDelete(ticket); }}>
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
              <path d="M2 3.5h10M5 3.5V2.5a.5.5 0 01.5-.5h3a.5.5 0 01.5.5v1M5.5 6v4M8.5 6v4M3 3.5l.7 8a1 1 0 001 .9h4.6a1 1 0 001-.9l.7-8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Supprimer
          </button>
        </div>

        <div className="emp-divider"/>
        {[
          ["Service",   ticket.service],
          ["Catégorie", ticket.cat],
          ["Date",      ticket.date],
        ].map(([k, v]) => (
          <div className="emp-detail-row" key={k}>
            <span className="emp-detail-key">{k}</span>
            <span className="emp-detail-val">{v}</span>
          </div>
        ))}

        <div style={{ marginTop: 8, marginBottom: 4 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#9CA3AF" }}>
            <span>Avancement</span>
            <span style={{ fontWeight: 600, color: "#111827" }}>{ticket.prog}%</span>
          </div>
          <div className="emp-prog-detail-bar">
            <div className="emp-prog-detail-fill" style={{ width: `${ticket.prog}%`, background: progColors[ticket.statut] }}/>
          </div>
        </div>

        <div className="emp-divider"/>
        <div className="emp-section-title">Description</div>
        <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.6, marginBottom: 16 }}>{ticket.description}</p>

        <div className="emp-divider"/>
        <div className="emp-section-title">Historique</div>
        {ticket.timeline.map((item, i) => (
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

// ── MODAL ──────────────────────────────────────────────────────────────────
const ModalNouvelleReclamation = ({ onClose, onSubmit }) => {
  const [form, setForm]   = useState({ titre: "", service: "", cat: "", description: "" });
  const [pri,  setPri]    = useState("normale");

  return (
    <div className="emp-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="emp-modal">
        <div className="emp-modal-head">
          <span className="emp-modal-title">Nouvelle réclamation</span>
          <button className="emp-close-btn" onClick={onClose}>✕</button>
        </div>
        <div className="emp-modal-body">
          <div className="emp-modal-section">Informations générales</div>
          <div className="emp-field">
            <label>Titre *</label>
            <input placeholder="Ex : Problème de facturation client X"
              value={form.titre} onChange={(e) => setForm({ ...form, titre: e.target.value })}/>
          </div>
          <div className="emp-fields-row">
            <div className="emp-field">
              <label>Service *</label>
              <select value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })}>
                <option value="">Sélectionner...</option>
                {["Comptabilité","Logistique","Support IT","Technique","RH","Finance","Maintenance"].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="emp-field">
              <label>Catégorie</label>
              <select value={form.cat} onChange={(e) => setForm({ ...form, cat: e.target.value })}>
                <option value="">Sélectionner...</option>
                {["Facturation","Authentification","Transporteur A","Info client","Finance","Autre"].map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="emp-field">
            <label>Description *</label>
            <textarea placeholder="Décrivez le problème en détail..."
              value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}/>
          </div>
          <div className="emp-modal-section">Priorité</div>
          <div className="emp-pri-group">
            {["urgent","haute","normale","faible"].map((p) => (
              <button key={p} className={`emp-pri-opt${pri === p ? ` sel-${p}` : ""}`} onClick={() => setPri(p)}>
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
          <div className="emp-modal-section" style={{ marginTop: 20 }}>Pièces jointes</div>
          <div className="emp-upload-zone">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" style={{ margin: "0 auto 6px", display: "block" }}>
              <path d="M12 16V8M12 8l-3 3M12 8l3 3" stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3 16v1a4 4 0 004 4h10a4 4 0 004-4v-1" stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <div className="emp-upload-txt">Glissez vos fichiers ici ou <span>parcourez</span></div>
            <div className="emp-upload-sub">PNG, JPG, PDF jusqu'à 10 Mo</div>
          </div>
        </div>
        <div className="emp-modal-footer">
          <button className="emp-btn-cancel" onClick={onClose}>Annuler</button>
          <button className="emp-btn-submit" onClick={() => {
            if (!form.titre.trim() || !form.service || !form.description.trim()) return;
            onSubmit({ ...form, priorite: pri });
          }}>
            Soumettre la réclamation
          </button>
        </div>
      </div>
    </div>
  );
};

// ── MODAL MODIFIER ─────────────────────────────────────────────────────────
const ModalModifier = ({ ticket, onClose, onSave }) => {
  const [form, setForm] = useState({
    titre:       ticket.titre,
    service:     ticket.service,
    cat:         ticket.cat,
    description: ticket.description,
  });
  const [pri, setPri] = useState(ticket.priorite);

  return (
    <div className="emp-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="emp-modal">
        <div className="emp-modal-head">
          <div>
            <div className="emp-modal-title">Modifier la réclamation</div>
            <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 2, fontFamily: "monospace" }}>{ticket.id}</div>
          </div>
          <button className="emp-close-btn" onClick={onClose}>✕</button>
        </div>
        <div className="emp-modal-body">
          <div className="emp-modal-section">Informations générales</div>
          <div className="emp-field">
            <label>Titre *</label>
            <input value={form.titre} onChange={(e) => setForm({ ...form, titre: e.target.value })}/>
          </div>
          <div className="emp-fields-row">
            <div className="emp-field">
              <label>Service *</label>
              <select value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })}>
                {["Comptabilité","Logistique","Support IT","Technique","RH","Finance","Maintenance"].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="emp-field">
              <label>Catégorie</label>
              <select value={form.cat} onChange={(e) => setForm({ ...form, cat: e.target.value })}>
                {["Facturation","Authentification","Transporteur A","Info client","Finance","Autre"].map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="emp-field">
            <label>Description *</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}/>
          </div>
          <div className="emp-modal-section">Priorité</div>
          <div className="emp-pri-group">
            {["urgent","haute","normale","faible"].map((p) => (
              <button key={p} className={`emp-pri-opt${pri === p ? ` sel-${p}` : ""}`} onClick={() => setPri(p)}>
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <div className="emp-modal-footer">
          <button className="emp-btn-cancel" onClick={onClose}>Annuler</button>
          <button className="emp-btn-submit" onClick={() => {
            if (!form.titre.trim() || !form.service || !form.description.trim()) return;
            onSave({ ...form, priorite: pri });
          }}>
            Enregistrer les modifications
          </button>
        </div>
      </div>
    </div>
  );
};

// ── CONFIRM DELETE ──────────────────────────────────────────────────────────
const ConfirmDelete = ({ ticket, onCancel, onConfirm }) => (
  <div className="emp-confirm-overlay" onClick={(e) => e.target === e.currentTarget && onCancel()}>
    <div className="emp-confirm-box">
      <div className="emp-confirm-icon">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M3 6h18M8 6V4a1 1 0 011-1h6a1 1 0 011 1v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6M10 11v6M14 11v6" stroke="#EF4444" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <div className="emp-confirm-title">Supprimer cette réclamation ?</div>
      <div className="emp-confirm-text">
        Cette action est <strong>irréversible</strong>. La réclamation{" "}
        <span className="emp-confirm-id">{ticket.id}</span>{" "}
        sera définitivement supprimée.
      </div>
      <div className="emp-confirm-btns">
        <button className="emp-confirm-cancel" onClick={onCancel}>Annuler</button>
        <button className="emp-confirm-delete" onClick={() => onConfirm(ticket.id)}>
          Supprimer
        </button>
      </div>
    </div>
  </div>
);

// ── PAGE KANBAN ────────────────────────────────────────────────────────────
const MesReclamationsPage = ({ tickets, setTickets, showToast }) => {
  const [activeFilter, setActiveFilter] = useState("toutes");
  const [selected,     setSelected]     = useState(null);
  const [editTicket,   setEditTicket]   = useState(null);
  const [deleteTicket, setDeleteTicket] = useState(null);

  const filterFn = (t) => {
    if (activeFilter === "creees")    return t.creePar;
    if (activeFilter === "assignees") return t.assignee;
    if (activeFilter === "urgentes")  return t.priorite === "urgent";
    return true;
  };

  const getCol = (statut) => tickets.filter((t) => t.statut === statut && filterFn(t));

  const moveTicket = (id, toStatut) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id !== id || t.statut === toStatut) return t;
        const key = `${t.statut}→${toStatut}`;
        const tr  = TRANSITIONS[key] || { icon: "✏️", bg: "#F3F4F6", text: <>Statut mis à jour</> };
        const col = COLUMNS.find((c) => c.key === toStatut);
        return { ...t, statut: toStatut, prog: col.prog, timeline: [...t.timeline, { icon: tr.icon, bg: tr.bg, text: tr.text, time: nowStr() }] };
      })
    );
    setSelected((prev) => {
      if (!prev || prev.id !== id) return prev;
      const col = COLUMNS.find((c) => c.key === toStatut);
      const key = `${prev.statut}→${toStatut}`;
      const tr  = TRANSITIONS[key] || { icon: "✏️", bg: "#F3F4F6", text: <>Statut mis à jour</> };
      return { ...prev, statut: toStatut, prog: col.prog, timeline: [...prev.timeline, { icon: tr.icon, bg: tr.bg, text: tr.text, time: nowStr() }] };
    });
    showToast(`✅ Déplacé vers « ${statutLabel[toStatut]} »`);
  };

  const handleSaveEdit = (fields) => {
    const updated = { ...editTicket, ...fields, timeline: [...editTicket.timeline, { icon: "✏️", bg: "#EEF2FF", text: <><strong>Réclamation modifiée</strong></>, time: nowStr() }] };
    setTickets((prev) => prev.map((t) => t.id === updated.id ? updated : t));
    setEditTicket(null);
    showToast("✏️ Réclamation modifiée avec succès !");
  };

  const handleDelete = (id) => {
    setTickets((prev) => prev.filter((t) => t.id !== id));
    setDeleteTicket(null);
    setSelected(null);
    showToast("🗑️ Réclamation supprimée.");
  };

  return (
    <>
      <div className="emp-filters">
        <span className="emp-filter-label">Filtrer :</span>
        {[
          { key: "toutes",    label: "Toutes"          },
          { key: "creees",    label: "Créées par moi"   },
          { key: "assignees", label: "Assignées à moi"  },
          { key: "urgentes",  label: "Urgentes"         },
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

      <div style={{ fontSize: 11.5, color: "#B0B7C3", marginBottom: 16, display: "flex", alignItems: "center", gap: 5 }}>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2 6h8M7 3l3 3-3 3" stroke="#B0B7C3" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Glissez-déposez les cartes entre les colonnes, ou utilisez les boutons ← →
      </div>

      <div className="emp-kanban">
        {COLUMNS.map((col, i) => (
          <KanbanColumn
            key={col.key}
            col={col}
            colIndex={i}
            tickets={getCol(col.key)}
            onMove={moveTicket}
            onOpen={setSelected}
            onEdit={setEditTicket}
            onDelete={setDeleteTicket}
          />
        ))}
      </div>

      {selected && (
        <DetailPanel
          ticket={selected}
          onClose={() => setSelected(null)}
          onMove={moveTicket}
          onEdit={setEditTicket}
          onDelete={setDeleteTicket}
        />
      )}

      {editTicket && (
        <ModalModifier
          ticket={editTicket}
          onClose={() => setEditTicket(null)}
          onSave={handleSaveEdit}
        />
      )}

      {deleteTicket && (
        <ConfirmDelete
          ticket={deleteTicket}
          onCancel={() => setDeleteTicket(null)}
          onConfirm={handleDelete}
        />
      )}
    </>
  );
};

// ── PAGES PROFIL / PARAMS ──────────────────────────────────────────────────
const MonProfilPage = () => (
  <div className="emp-profil-card">
    <div className="emp-profil-header">
      <div className="emp-profil-av" style={{ background: "#10B981" }}>SL</div>
      <div>
        <div className="emp-profil-name">Sarah Lemarié</div>
        <div className="emp-profil-email">sarah@bayan.ma</div>
        <div className="emp-profil-badge">Employée</div>
      </div>
    </div>
    {[
      ["Département","Support Client"],["Poste","Agent Support Senior"],
      ["Téléphone","+212 6 00 00 00 00"],["Date d'entrée","01 Jan 2021"],["Manager","Karim Alami"],
    ].map(([k, v]) => (
      <div className="emp-profil-row" key={k}>
        <span className="emp-profil-key">{k}</span>
        <span className="emp-profil-val">{v}</span>
      </div>
    ))}
  </div>
);

const ParametresPage = () => (
  <div>
    {[
      { title: "Notifications", items: [
        { label: "Alertes email",       sub: "Recevoir les alertes de mes réclamations", init: true  },
        { label: "Notifications push",  sub: "Activées dans le navigateur",              init: false },
        { label: "Résumé hebdomadaire", sub: "Reçu chaque lundi matin",                  init: true  },
      ]},
      { title: "Sécurité", items: [
        { label: "Authentification 2FA",     sub: "Double authentification activée",    init: true  },
        { label: "Session auto-déconnexion", sub: "Après 30 min d'inactivité",          init: false },
      ]},
    ].map((section) => (
      <div className="emp-params-card" key={section.title}>
        <div className="emp-params-section-title">{section.title}</div>
        {section.items.map((item) => (
          <div className="emp-param-row" key={item.label}>
            <div>
              <div className="emp-param-label">{item.label}</div>
              <div className="emp-param-sub">{item.sub}</div>
            </div>
            <Toggle init={item.init} />
          </div>
        ))}
      </div>
    ))}
    <button className="emp-btn-save">Enregistrer les modifications</button>
  </div>
);

// ── NOTIFICATION DATA ──────────────────────────────────────────────────────
const NOTIFS_INIT = [
  { id: 1,  unread: true,  icon: "📋", bg: "#EEF2FF", text: <><strong>Réclamation ID-88242</strong> assignée au service Comptabilité</>,         time: "Il y a 5 min"   },
  { id: 2,  unread: true,  icon: "▶️", bg: "#FEF3C7", text: <><strong>Réclamation ID-61876</strong> est passée en <strong>En cours</strong></>,    time: "Il y a 22 min"  },
  { id: 3,  unread: true,  icon: "💬", bg: "#F0FDF4", text: <><strong>Karim Alami</strong> vous a envoyé un message</>,                           time: "Il y a 45 min"  },
  { id: 4,  unread: false, icon: "✅", bg: "#D1FAE5", text: <><strong>Réclamation ID-79100</strong> a été résolue avec succès</>,                  time: "Hier, 16:45"    },
  { id: 5,  unread: false, icon: "⚠️", bg: "#FEF3C7", text: <>Votre réclamation <strong>ID-68245</strong> est en attente depuis 5 jours</>,       time: "Hier, 09:00"    },
  { id: 6,  unread: false, icon: "👤", bg: "#F3E8FF", text: <><strong>Aya Saïdi</strong> a été assignée à votre réclamation ID-88312</>,          time: "12 Nov, 10:30"  },
];

// ── NOTIFICATION PANEL ─────────────────────────────────────────────────────
const NotificationPanel = ({ notifs, onMarkAll, onMarkOne, onClose }) => {
  const unreadCount = notifs.filter((n) => n.unread).length;

  return (
    <div className="emp-notif-overlay" onClick={onClose}>
      <div className="emp-notif-panel" onClick={(e) => e.stopPropagation()}>
        <div className="emp-notif-head">
          <div className="emp-notif-title">
            Notifications {unreadCount > 0 && (
              <span style={{ marginLeft: 6, background: "#4F46E5", color: "#fff", fontSize: 10, fontWeight: 700, borderRadius: 99, padding: "1px 7px" }}>
                {unreadCount}
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <button className="emp-notif-mark-all" onClick={onMarkAll}>Tout marquer lu</button>
          )}
        </div>

        <div className="emp-notif-list">
          {notifs.length === 0 ? (
            <div className="emp-notif-empty">
              <div className="emp-notif-empty-icon">🔔</div>
              <div className="emp-notif-empty-text">Aucune notification</div>
            </div>
          ) : (
            notifs.map((n) => (
              <div
                key={n.id}
                className={`emp-notif-item${n.unread ? " unread" : ""}`}
                onClick={() => onMarkOne(n.id)}
              >
                <div className="emp-notif-icon" style={{ background: n.bg }}>{n.icon}</div>
                <div className="emp-notif-content">
                  <div className="emp-notif-text">{n.text}</div>
                  <div className="emp-notif-time">{n.time}</div>
                </div>
                {n.unread && <div className="emp-notif-unread-dot"/>}
              </div>
            ))
          )}
        </div>

        {notifs.length > 0 && (
          <div className="emp-notif-footer">
            <button className="emp-notif-footer-btn" onClick={onClose}>Fermer</button>
          </div>
        )}
      </div>
    </div>
  );
};

// ── MAIN ───────────────────────────────────────────────────────────────────
export default function EmployeeDashboard() {
  const navigate = useNavigate();

  const [activePage,   setActivePage]   = useState("mes");
  const [tickets,      setTickets]      = useState(TICKETS_INIT);
  const [showModal,    setShowModal]    = useState(false);
  const [toast,        setToast]        = useState(null);
  const [notifs,       setNotifs]       = useState(NOTIFS_INIT);
  const [showNotifs,   setShowNotifs]   = useState(false);
  const toastTimer = useRef(null);

  const showToast = (msg) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  };

  const handleSubmit = ({ titre, service, cat, description, priorite }) => {
    const d = new Date();
    const mois = ["Jan","Fév","Mar","Avr","Mai","Juin","Jul","Août","Sep","Oct","Nov","Déc"];
    const date = `${d.getDate().toString().padStart(2,"0")} ${mois[d.getMonth()]} ${d.getFullYear()}`;
    const heure = `${d.getHours().toString().padStart(2,"0")}:${d.getMinutes().toString().padStart(2,"0")}`;
    setTickets((prev) => [{
      id: "ID-" + Math.floor(10000 + Math.random() * 90000),
      titre, service, cat: cat || "Autre", description, priorite,
      statut: "attente", date, creePar: true, assignee: false, prog: 0,
      timeline: [{ icon: "🔵", bg: "#EEF2FF", text: <><strong>Réclamation créée</strong> par vous</>, time: `${date} – ${heure}` }],
    }, ...prev]);
    setShowModal(false);
    setActivePage("mes");
    showToast("✅ Réclamation soumise avec succès !");
  };

  const handleNav = (key) => {
    if (key === "nouvelle") { setShowModal(true); return; }
    setActivePage(key);
  };

  const pageTitles = { mes: "Mes réclamations", messagerie: "Messagerie", profil: "Mon profil", params: "Paramètres" };

  const navItems = [
    { key: "mes",      label: "Mes réclamations",    section: "PRINCIPAL", badge: true,
      icon: <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="6" height="6" rx="1.5" fill="currentColor" opacity=".7"/><rect x="9" y="1" width="6" height="6" rx="1.5" fill="currentColor" opacity=".4"/><rect x="1" y="9" width="6" height="6" rx="1.5" fill="currentColor" opacity=".4"/><rect x="9" y="9" width="6" height="6" rx="1.5" fill="currentColor" opacity=".7"/></svg> },
    { key: "nouvelle", label: "Nouvelle réclamation", section: null,
      icon: <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg> },
    { key: "messagerie", label: "Messagerie", section: null, msgBadge: true,
      icon: <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M2 3a1 1 0 011-1h10a1 1 0 011 1v8a1 1 0 01-1 1H5l-3 3V3z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/></svg> },
    { key: "profil",   label: "Mon profil",           section: "AUTRE",
      icon: <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.4"/><path d="M2 14c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg> },
    { key: "params",   label: "Paramètres",           section: null,
      icon: <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.4"/><path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.05 3.05l1.41 1.41M11.54 11.54l1.41 1.41M3.05 12.95l1.41-1.41M11.54 4.46l1.41-1.41" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg> },
  ];

  const renderPage = () => {
    switch (activePage) {
      case "mes":         return <MesReclamationsPage tickets={tickets} setTickets={setTickets} showToast={showToast} />;
      case "messagerie":  return <MessagerieePage />;
      case "profil":      return <MonProfilPage />;
      case "params":      return <ParametresPage />;
      default:            return <MesReclamationsPage tickets={tickets} setTickets={setTickets} showToast={showToast} />;
    }
  };

  return (
    <>
      <style>{CSS + MSG_CSS}</style>
      <div className="emp-layout">

        {/* SIDEBAR */}
        <aside className="emp-sidebar">
          <Logo />
          <nav className="emp-sidebar-nav">
            {navItems.map((item) => (
              <div key={item.key}>
                {item.section && <div className="emp-nav-section">{item.section}</div>}
                <button
                  className={`emp-nav-item${activePage === item.key ? " active" : ""}`}
                  onClick={() => handleNav(item.key)}
                >
                  {item.icon}
                  {item.label}
                  {item.badge && <span className="emp-nav-badge">{tickets.length}</span>}
                  {item.msgBadge && <span className="emp-nav-badge" style={{ background: "#EF4444" }}>3</span>}
                </button>
              </div>
            ))}
          </nav>
          <div className="emp-sidebar-user">
            <div className="emp-user-avatar" style={{ background: "#10B981" }}>SL</div>
            <div>
              <div className="emp-user-name">Sarah Lemarié</div>
              <div className="emp-user-role">Employée</div>
            </div>
          </div>
        </aside>

        {/* MAIN */}
        <div className="emp-main">
          <header className="emp-topbar">
            <div className="emp-topbar-title">{pageTitles[activePage] || "Mes réclamations"}</div>
            <div className="emp-search-bar">
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                <circle cx="6" cy="6" r="4.5" stroke="#9CA3AF" strokeWidth="1.4"/>
                <path d="M9.5 9.5L12 12" stroke="#9CA3AF" strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
              <input placeholder="Rechercher une réclamation..."/>
            </div>
            <div className="emp-topbar-right">
              <button className="emp-icon-btn" onClick={() => setShowNotifs((v) => !v)} style={{ position: "relative" }}>
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                  <path d="M8 1.5a5 5 0 015 5v2.5l1 2H1l1-2V6.5a5 5 0 015-5z" stroke="#6B7280" strokeWidth="1.4"/>
                  <path d="M6.5 13.5a1.5 1.5 0 003 0" stroke="#6B7280" strokeWidth="1.4"/>
                </svg>
                {notifs.filter(n => n.unread).length > 0 && (
                  <span className="emp-notif-dot">{notifs.filter(n => n.unread).length}</span>
                )}
              </button>
              <button className="emp-btn-new" onClick={() => setShowModal(true)}>
                <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                  <path d="M6 1v10M1 6h10" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                Nouvelle réclamation
              </button>
              <button className="emp-icon-btn" onClick={() => navigate("/login")} title="Déconnexion">
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
          onMarkAll={() => setNotifs((prev) => prev.map((n) => ({ ...n, unread: false })))}
          onMarkOne={(id) => setNotifs((prev) => prev.map((n) => n.id === id ? { ...n, unread: false } : n))}
          onClose={() => setShowNotifs(false)}
        />
      )}

      {showModal && (
        <ModalNouvelleReclamation onClose={() => setShowModal(false)} onSubmit={handleSubmit} />
      )}

      {toast && <div className="emp-toast">{toast}</div>}
    </>
  );
}