import { useState, useRef, useEffect } from "react";

// ── CSS ────────────────────────────────────────────────────────────────────
export const MSG_CSS = `
  /* ── MESSAGERIE LAYOUT ── */
  .msg-layout { display: flex; height: calc(100vh - 60px); overflow: hidden; background: #F4F5FA; }

  /* ── CONTACT LIST (left panel) ── */
  .msg-contacts { width: 300px; flex-shrink: 0; background: #fff; border-right: 1px solid rgba(0,0,0,0.06); display: flex; flex-direction: column; }
  .msg-contacts-header { padding: 18px 16px 12px; border-bottom: 1px solid rgba(0,0,0,0.06); }
  .msg-contacts-title { font-family: 'Sora', sans-serif; font-size: 15px; font-weight: 700; color: #0F1117; margin-bottom: 12px; }
  .msg-search { display: flex; align-items: center; gap: 7px; background: #F4F5FA; border: 1px solid #E5E7EB; border-radius: 9px; padding: 8px 11px; }
  .msg-search input { background: none; border: none; outline: none; font-size: 12.5px; color: #0F1117; width: 100%; font-family: 'DM Sans', sans-serif; }
  .msg-search input::placeholder { color: #B0B7C3; }
  .msg-contacts-list { flex: 1; overflow-y: auto; padding: 8px; }
  .msg-contact-item { display: flex; align-items: center; gap: 10px; padding: 10px 10px; border-radius: 10px; cursor: pointer; transition: background 0.15s; position: relative; }
  .msg-contact-item:hover { background: #F4F5FA; }
  .msg-contact-item.active { background: #EEF2FF; }
  .msg-av { width: 38px; height: 38px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11.5px; font-weight: 700; color: #fff; flex-shrink: 0; position: relative; }
  .msg-online-dot { position: absolute; bottom: 1px; right: 1px; width: 9px; height: 9px; border-radius: 50%; background: #10B981; border: 1.5px solid #fff; }
  .msg-offline-dot { position: absolute; bottom: 1px; right: 1px; width: 9px; height: 9px; border-radius: 50%; background: #D1D5DB; border: 1.5px solid #fff; }
  .msg-contact-info { flex: 1; min-width: 0; }
  .msg-contact-name { font-size: 13px; font-weight: 500; color: #111827; margin-bottom: 2px; }
  .msg-contact-preview { font-size: 11.5px; color: #9CA3AF; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .msg-contact-meta { display: flex; flex-direction: column; align-items: flex-end; gap: 4px; }
  .msg-contact-time { font-size: 10px; color: #B0B7C3; }
  .msg-unread-badge { background: #4F46E5; color: #fff; font-size: 9px; font-weight: 700; border-radius: 99px; padding: 1px 6px; min-width: 16px; text-align: center; }

  /* ── CHAT AREA (right panel) ── */
  .msg-chat { flex: 1; display: flex; flex-direction: column; min-width: 0; }
  .msg-chat-header { height: 62px; background: #fff; border-bottom: 1px solid rgba(0,0,0,0.06); display: flex; align-items: center; justify-content: space-between; padding: 0 22px; flex-shrink: 0; }
  .msg-chat-header-left { display: flex; align-items: center; gap: 10px; }
  .msg-chat-name { font-family: 'Sora', sans-serif; font-size: 14px; font-weight: 700; color: #0F1117; }
  .msg-chat-status { font-size: 11px; color: #10B981; font-weight: 500; }
  .msg-chat-status.offline { color: #9CA3AF; }
  .msg-chat-actions { display: flex; gap: 6px; }
  .msg-action-btn { width: 32px; height: 32px; border-radius: 8px; border: 1px solid #E5E7EB; background: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.15s; }
  .msg-action-btn:hover { background: #F4F5FA; }

  /* ── MESSAGES ── */
  .msg-messages { flex: 1; overflow-y: auto; padding: 20px 22px; display: flex; flex-direction: column; gap: 4px; scroll-behavior: smooth; }
  .msg-messages::-webkit-scrollbar { width: 4px; }
  .msg-messages::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 99px; }

  /* date separator */
  .msg-date-sep { text-align: center; margin: 12px 0 8px; }
  .msg-date-sep span { font-size: 10.5px; color: #B0B7C3; background: #F4F5FA; padding: 3px 10px; border-radius: 99px; }

  /* bubble */
  .msg-row { display: flex; align-items: flex-end; gap: 8px; margin-bottom: 2px; }
  .msg-row.mine { flex-direction: row-reverse; }
  .msg-bubble-av { width: 26px; height: 26px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 9px; font-weight: 700; color: #fff; flex-shrink: 0; margin-bottom: 2px; }
  .msg-bubble-wrap { max-width: 62%; display: flex; flex-direction: column; }
  .msg-row.mine .msg-bubble-wrap { align-items: flex-end; }
  .msg-sender-name { font-size: 10px; color: #9CA3AF; margin-bottom: 3px; padding-left: 2px; }
  .msg-row.mine .msg-sender-name { text-align: right; padding-right: 2px; padding-left: 0; }
  .msg-bubble { padding: 10px 13px; border-radius: 14px; font-size: 13px; line-height: 1.55; word-break: break-word; position: relative; }
  .msg-bubble.theirs { background: #fff; color: #111827; border: 1px solid rgba(0,0,0,0.06); border-bottom-left-radius: 4px; box-shadow: 0 1px 4px rgba(0,0,0,0.04); }
  .msg-bubble.mine { background: #4F46E5; color: #fff; border-bottom-right-radius: 4px; }
  .msg-bubble-time { font-size: 9.5px; color: #B0B7C3; margin-top: 3px; padding: 0 3px; }
  .msg-row.mine .msg-bubble-time { text-align: right; color: rgba(79,70,229,0.6); }

  /* reactions */
  .msg-reaction { display: inline-flex; align-items: center; gap: 3px; background: #F4F5FA; border: 1px solid #E5E7EB; border-radius: 99px; padding: 2px 7px; font-size: 11px; margin-top: 4px; cursor: pointer; transition: background 0.15s; }
  .msg-reaction:hover { background: #EEF2FF; }
  .msg-reaction.mine { background: rgba(79,70,229,0.12); border-color: rgba(79,70,229,0.2); }

  /* file attachment */
  .msg-file { display: flex; align-items: center; gap: 9px; background: rgba(255,255,255,0.15); border-radius: 8px; padding: 8px 10px; margin-top: 4px; cursor: pointer; }
  .msg-bubble.theirs .msg-file { background: #F4F5FA; }
  .msg-file-icon { width: 28px; height: 28px; border-radius: 7px; background: #4F46E5; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .msg-bubble.mine .msg-file-icon { background: rgba(255,255,255,0.25); }
  .msg-file-name { font-size: 11.5px; font-weight: 500; }
  .msg-file-size { font-size: 10px; opacity: 0.65; }

  /* typing indicator */
  .msg-typing { display: flex; align-items: center; gap: 8px; padding: 6px 0 4px; }
  .msg-typing-dots { display: flex; gap: 3px; }
  .msg-typing-dots span { width: 6px; height: 6px; border-radius: 50%; background: #B0B7C3; animation: typingBounce 1.2s infinite; }
  .msg-typing-dots span:nth-child(2) { animation-delay: 0.2s; }
  .msg-typing-dots span:nth-child(3) { animation-delay: 0.4s; }
  @keyframes typingBounce { 0%,60%,100% { transform: translateY(0); } 30% { transform: translateY(-5px); } }
  .msg-typing-label { font-size: 11px; color: #9CA3AF; font-style: italic; }

  /* ── INPUT BAR ── */
  .msg-input-bar { background: #fff; border-top: 1px solid rgba(0,0,0,0.06); padding: 12px 16px; display: flex; align-items: flex-end; gap: 10px; }
  .msg-input-wrap { flex: 1; background: #F4F5FA; border: 1.5px solid #E5E7EB; border-radius: 12px; padding: 10px 12px; display: flex; align-items: flex-end; gap: 8px; transition: border-color 0.2s; }
  .msg-input-wrap.focused { border-color: #4F46E5; background: #fff; }
  .msg-input-wrap textarea { flex: 1; background: none; border: none; outline: none; font-size: 13.5px; font-family: 'DM Sans', sans-serif; color: #0F1117; resize: none; max-height: 120px; line-height: 1.5; }
  .msg-input-wrap textarea::placeholder { color: #B0B7C3; }
  .msg-input-attach { width: 26px; height: 26px; border: none; background: none; cursor: pointer; display: flex; align-items: center; justify-content: center; color: #9CA3AF; border-radius: 6px; transition: all 0.15s; flex-shrink: 0; }
  .msg-input-attach:hover { background: #E5E7EB; color: #4F46E5; }
  .msg-emoji-btn { width: 26px; height: 26px; border: none; background: none; cursor: pointer; font-size: 15px; border-radius: 6px; display: flex; align-items: center; justify-content: center; transition: background 0.15s; flex-shrink: 0; }
  .msg-emoji-btn:hover { background: #E5E7EB; }
  .msg-send-btn { width: 40px; height: 40px; border-radius: 11px; border: none; background: #4F46E5; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.2s, transform 0.1s; flex-shrink: 0; }
  .msg-send-btn:hover { background: #4338CA; }
  .msg-send-btn:active { transform: scale(0.94); }
  .msg-send-btn:disabled { background: #E5E7EB; cursor: not-allowed; }

  /* emoji picker */
  .msg-emoji-picker { position: absolute; bottom: 68px; right: 16px; background: #fff; border: 1px solid #E5E7EB; border-radius: 12px; padding: 10px; box-shadow: 0 8px 28px rgba(0,0,0,0.12); display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; z-index: 100; }
  .msg-emoji-picker button { width: 30px; height: 30px; font-size: 16px; border: none; background: none; cursor: pointer; border-radius: 6px; transition: background 0.15s; }
  .msg-emoji-picker button:hover { background: #F4F5FA; }

  /* ── EMPTY STATE ── */
  .msg-empty { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #B0B7C3; gap: 12px; }
  .msg-empty-icon { width: 56px; height: 56px; border-radius: 16px; background: #F4F5FA; display: flex; align-items: center; justify-content: center; }
  .msg-empty-text { font-size: 13.5px; color: #9CA3AF; }
  .msg-empty-sub { font-size: 12px; color: #C4C9D4; }

  /* scrollbar hidden for contacts */
  .msg-contacts-list::-webkit-scrollbar { width: 3px; }
  .msg-contacts-list::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 99px; }

  /* slide in animation */
  @keyframes msgSlideIn { from { opacity:0; transform: translateY(6px); } to { opacity:1; transform: translateY(0); } }
  .msg-bubble { animation: msgSlideIn 0.2s ease; }
`;

// ── MOCK DATA ──────────────────────────────────────────────────────────────
const ME = { id: "me", name: "Sarah Lemarié", initials: "SL", color: "#10B981" };

const CONTACTS = [
  { id: "u1", name: "Karim Alami",     initials: "KA", color: "#4F46E5", role: "Manager",         online: true  },
  { id: "u2", name: "Aya Saïdi",       initials: "AS", color: "#F59E0B", role: "Comptabilité",     online: true  },
  { id: "u3", name: "Marc Lefebvre",   initials: "ML", color: "#EF4444", role: "Support IT",       online: false },
  { id: "u4", name: "Nadia Benali",    initials: "NB", color: "#8B5CF6", role: "Logistique",       online: true  },
  { id: "u5", name: "Omar Tahiri",     initials: "OT", color: "#EC4899", role: "Technique",        online: false },
  { id: "u6", name: "Leila Mansouri",  initials: "LM", color: "#0EA5E9", role: "RH",               online: true  },
];

const INITIAL_CONVERSATIONS = {
  u1: [
    { id: 1, from: "u1", text: "Bonjour Sarah, as-tu avancé sur la réclamation ID-88242 ?", time: "09:10", date: "Aujourd'hui" },
    { id: 2, from: "me", text: "Oui, j'ai transmis le dossier au service comptabilité ce matin. En attente de leur retour.", time: "09:14", date: "Aujourd'hui" },
    { id: 3, from: "u1", text: "Parfait, tiens-moi informé dès que tu as une réponse. Priorité haute ce dossier.", time: "09:16", date: "Aujourd'hui" },
    { id: 4, from: "me", text: "Bien sûr, je reviens vers toi dans la journée 👍", time: "09:17", date: "Aujourd'hui" },
  ],
  u2: [
    { id: 1, from: "u2", text: "Salut Sarah ! Tu peux m'envoyer les justificatifs pour la note de frais ?", time: "14:30", date: "Hier" },
    { id: 2, from: "me", text: "Je les ai déposés sur le drive partagé dans le dossier RH/Octobre.", time: "14:45", date: "Hier" },
    { id: 3, from: "u2", text: "Reçu merci ! Je traite ça demain.", time: "14:50", date: "Hier" },
  ],
  u3: [
    { id: 1, from: "me", text: "Bonjour Marc, j'ai toujours un problème d'accès sur le portail client (ID-68245).", time: "10:00", date: "Hier" },
    { id: 2, from: "u3", text: "On a vu le ticket, c'est un bug connu. On devrait avoir un patch d'ici jeudi.", time: "10:22", date: "Hier" },
    { id: 3, from: "me", text: "D'accord, merci pour l'info !", time: "10:25", date: "Hier" },
    { id: 4, from: "u3", text: "Je te pingue dès que c'est déployé 🔧", time: "10:26", date: "Hier", file: { name: "patch-notes-v2.4.pdf", size: "124 Ko" } },
  ],
  u4: [],
  u5: [],
  u6: [
    { id: 1, from: "u6", text: "Sarah, rappel : formation sécurité vendredi 14h en salle B.", time: "08:00", date: "Hier" },
    { id: 2, from: "me", text: "Merci Leila, c'est noté !", time: "08:30", date: "Hier" },
  ],
};

const EMOJIS = ["😊","👍","🙏","❤️","🔥","😂","😮","👀","✅","⚡","🚀","💡","📎","🎉","😎","🤝"];

function timeNow() {
  const d = new Date();
  return `${d.getHours().toString().padStart(2,"0")}:${d.getMinutes().toString().padStart(2,"0")}`;
}

// ── COMPONENT ──────────────────────────────────────────────────────────────
export default function MessagerieePage() {
  const [conversations, setConversations] = useState(INITIAL_CONVERSATIONS);
  const [activeContact, setActiveContact] = useState(null);
  const [searchQ,       setSearchQ]       = useState("");
  const [inputText,     setInputText]     = useState("");
  const [inputFocused,  setInputFocused]  = useState(false);
  const [showEmoji,     setShowEmoji]     = useState(false);
  const [typing,        setTyping]        = useState(false);
  const [unread,        setUnread]        = useState({ u1: 0, u2: 1, u3: 0, u4: 2, u5: 0, u6: 0 });

  const messagesEndRef = useRef(null);
  const textareaRef    = useRef(null);
  const typingTimer    = useRef(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => { scrollToBottom(); }, [conversations, activeContact]);

  const selectContact = (contact) => {
    setActiveContact(contact);
    setUnread((prev) => ({ ...prev, [contact.id]: 0 }));
    setShowEmoji(false);
  };

  const sendMessage = () => {
    if (!inputText.trim() || !activeContact) return;
    const msg = { id: Date.now(), from: "me", text: inputText.trim(), time: timeNow(), date: "Aujourd'hui" };
    setConversations((prev) => ({
      ...prev,
      [activeContact.id]: [...(prev[activeContact.id] || []), msg],
    }));
    setInputText("");
    textareaRef.current?.focus();

    // Simulate reply after 1.5s
    setTyping(true);
    clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => {
      setTyping(false);
      const replies = [
        "Merci pour l'info !",
        "Ok, je regarde ça de mon côté.",
        "Bien reçu 👍",
        "Je reviens vers toi rapidement.",
        "D'accord, je prends note.",
        "Super, merci Sarah !",
        "Parfait, on en discute demain ?",
      ];
      const reply = {
        id: Date.now() + 1,
        from: activeContact.id,
        text: replies[Math.floor(Math.random() * replies.length)],
        time: timeNow(),
        date: "Aujourd'hui",
      };
      setConversations((prev) => ({
        ...prev,
        [activeContact.id]: [...(prev[activeContact.id] || []), reply],
      }));
    }, 1500 + Math.random() * 1000);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const insertEmoji = (emoji) => {
    setInputText((prev) => prev + emoji);
    setShowEmoji(false);
    textareaRef.current?.focus();
  };

  const filteredContacts = CONTACTS.filter((c) =>
    c.name.toLowerCase().includes(searchQ.toLowerCase()) ||
    c.role.toLowerCase().includes(searchQ.toLowerCase())
  );

  const totalUnread = Object.values(unread).reduce((a, b) => a + b, 0);

  const msgs = activeContact ? (conversations[activeContact.id] || []) : [];

  // Group messages by date
  const groupedMsgs = [];
  let lastDate = null;
  msgs.forEach((m) => {
    if (m.date !== lastDate) { groupedMsgs.push({ type: "date", date: m.date }); lastDate = m.date; }
    groupedMsgs.push({ type: "msg", ...m });
  });

  return (
    <div className="msg-layout">

      {/* ── CONTACT LIST ── */}
      <div className="msg-contacts">
        <div className="msg-contacts-header">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div className="msg-contacts-title">Messages</div>
            {totalUnread > 0 && (
              <span style={{ background: "#EF4444", color: "#fff", fontSize: 10, fontWeight: 700, borderRadius: 99, padding: "1px 7px" }}>
                {totalUnread} nouveau{totalUnread > 1 ? "x" : ""}
              </span>
            )}
          </div>
          <div className="msg-search" style={{ marginTop: 10 }}>
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
              <circle cx="6" cy="6" r="4.5" stroke="#B0B7C3" strokeWidth="1.4"/>
              <path d="M9.5 9.5L12 12" stroke="#B0B7C3" strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
            <input
              placeholder="Rechercher..."
              value={searchQ}
              onChange={(e) => setSearchQ(e.target.value)}
            />
          </div>
        </div>

        <div className="msg-contacts-list">
          {filteredContacts.map((contact) => {
            const convMsgs   = conversations[contact.id] || [];
            const lastMsg    = convMsgs[convMsgs.length - 1];
            const isActive   = activeContact?.id === contact.id;
            const unreadCnt  = unread[contact.id] || 0;

            return (
              <div
                key={contact.id}
                className={`msg-contact-item${isActive ? " active" : ""}`}
                onClick={() => selectContact(contact)}
              >
                <div className="msg-av" style={{ background: contact.color }}>
                  {contact.initials}
                  <div className={contact.online ? "msg-online-dot" : "msg-offline-dot"}/>
                </div>
                <div className="msg-contact-info">
                  <div className="msg-contact-name">{contact.name}</div>
                  <div className="msg-contact-preview">
                    {lastMsg
                      ? (lastMsg.from === "me" ? "Vous : " : "") + (lastMsg.file ? "📎 Fichier joint" : lastMsg.text)
                      : <span style={{ fontStyle: "italic", color: "#C4C9D4" }}>Démarrer une conversation</span>
                    }
                  </div>
                </div>
                <div className="msg-contact-meta">
                  {lastMsg && <div className="msg-contact-time">{lastMsg.time}</div>}
                  {unreadCnt > 0 && <div className="msg-unread-badge">{unreadCnt}</div>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── CHAT AREA ── */}
      {activeContact ? (
        <div className="msg-chat" style={{ position: "relative" }}>

          {/* Header */}
          <div className="msg-chat-header">
            <div className="msg-chat-header-left">
              <div className="msg-av" style={{ background: activeContact.color, width: 36, height: 36, fontSize: 10.5 }}>
                {activeContact.initials}
                <div className={activeContact.online ? "msg-online-dot" : "msg-offline-dot"}/>
              </div>
              <div>
                <div className="msg-chat-name">{activeContact.name}</div>
                <div className={`msg-chat-status${activeContact.online ? "" : " offline"}`}>
                  {activeContact.online ? "● En ligne" : "○ Hors ligne"} · {activeContact.role}
                </div>
              </div>
            </div>
            <div className="msg-chat-actions">
              {/* Phone */}
              <button className="msg-action-btn" title="Appel">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M3 2h3l1.5 3.5-1.8 1.1a8 8 0 004.7 4.7L11.5 9.5 15 11v3a1 1 0 01-1 1A13 13 0 012 3a1 1 0 011-1z" stroke="#6B7280" strokeWidth="1.3" strokeLinejoin="round"/>
                </svg>
              </button>
              {/* Video */}
              <button className="msg-action-btn" title="Vidéo">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <rect x="1" y="4" width="9" height="8" rx="1.5" stroke="#6B7280" strokeWidth="1.3"/>
                  <path d="M10 7l5-3v8l-5-3V7z" stroke="#6B7280" strokeWidth="1.3" strokeLinejoin="round"/>
                </svg>
              </button>
              {/* Info */}
              <button className="msg-action-btn" title="Infos">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="6.5" stroke="#6B7280" strokeWidth="1.3"/>
                  <path d="M8 7v5M8 5.5v.01" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="msg-messages">
            {groupedMsgs.map((item, i) => {
              if (item.type === "date") {
                return (
                  <div className="msg-date-sep" key={`date-${i}`}>
                    <span>{item.date}</span>
                  </div>
                );
              }
              const isMe     = item.from === "me";
              const contact  = CONTACTS.find((c) => c.id === item.from);
              const sender   = isMe ? ME : contact;
              const showAv   = !isMe && (
                i === groupedMsgs.length - 1 ||
                groupedMsgs[i + 1]?.from !== item.from ||
                groupedMsgs[i + 1]?.type === "date"
              );

              return (
                <div className={`msg-row${isMe ? " mine" : ""}`} key={item.id}>
                  <div style={{ width: 26, flexShrink: 0 }}>
                    {!isMe && showAv && (
                      <div className="msg-bubble-av" style={{ background: sender?.color }}>
                        {sender?.initials}
                      </div>
                    )}
                  </div>
                  <div className="msg-bubble-wrap">
                    {!isMe && showAv && (
                      <div className="msg-sender-name">{sender?.name}</div>
                    )}
                    <div className={`msg-bubble ${isMe ? "mine" : "theirs"}`}>
                      {item.text}
                      {item.file && (
                        <div className="msg-file">
                          <div className="msg-file-icon">
                            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                              <path d="M9 1H4a1 1 0 00-1 1v12a1 1 0 001 1h8a1 1 0 001-1V6L9 1z" stroke="white" strokeWidth="1.3"/>
                              <path d="M9 1v5h5" stroke="white" strokeWidth="1.3" strokeLinecap="round"/>
                            </svg>
                          </div>
                          <div>
                            <div className="msg-file-name">{item.file.name}</div>
                            <div className="msg-file-size">{item.file.size}</div>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="msg-bubble-time">{item.time}</div>
                  </div>
                </div>
              );
            })}

            {/* Typing indicator */}
            {typing && (
              <div className="msg-row">
                <div style={{ width: 26, flexShrink: 0 }}>
                  <div className="msg-bubble-av" style={{ background: activeContact.color }}>
                    {activeContact.initials}
                  </div>
                </div>
                <div className="msg-bubble-wrap">
                  <div className="msg-bubble theirs" style={{ padding: "10px 14px" }}>
                    <div className="msg-typing-dots">
                      <span/><span/><span/>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef}/>
          </div>

          {/* Input bar */}
          <div className="msg-input-bar" style={{ position: "relative" }}>
            {showEmoji && (
              <div className="msg-emoji-picker">
                {EMOJIS.map((e) => (
                  <button key={e} onClick={() => insertEmoji(e)}>{e}</button>
                ))}
              </div>
            )}
            <div className={`msg-input-wrap${inputFocused ? " focused" : ""}`}>
              <textarea
                ref={textareaRef}
                rows={1}
                placeholder={`Message à ${activeContact.name}...`}
                value={inputText}
                onChange={(e) => {
                  setInputText(e.target.value);
                  // Auto-resize
                  e.target.style.height = "auto";
                  e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
                }}
                onKeyDown={handleKeyDown}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
              />
              <button className="msg-emoji-btn" onClick={() => setShowEmoji((v) => !v)}>😊</button>
              <button className="msg-input-attach">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M14 8.5l-5.5 5.5a4 4 0 01-5.66-5.66L8 3a2.5 2.5 0 013.54 3.54L6 12a1 1 0 01-1.41-1.41L9.5 5.5"
                    stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
            <button
              className="msg-send-btn"
              onClick={sendMessage}
              disabled={!inputText.trim()}
            >
              <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
                <path d="M16 2L2 7.5l5.5 1.5L10 16l6-14z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      ) : (
        /* Empty state */
        <div className="msg-chat">
          <div className="msg-empty">
            <div className="msg-empty-icon">
              <svg width="26" height="26" viewBox="0 0 28 28" fill="none">
                <path d="M4 6a2 2 0 012-2h16a2 2 0 012 2v12a2 2 0 01-2 2H8l-4 4V6z"
                  stroke="#C4C9D4" strokeWidth="1.5" strokeLinejoin="round"/>
                <path d="M8 10h12M8 14h8" stroke="#C4C9D4" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="msg-empty-text">Sélectionnez une conversation</div>
            <div className="msg-empty-sub">Choisissez un collègue pour démarrer ou continuer un échange</div>
          </div>
        </div>
      )}
    </div>
  );
}