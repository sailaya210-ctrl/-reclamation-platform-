import { useState, useRef, useEffect, useCallback } from "react";
import { messagesAPI } from "./api";
import { useAuth } from "./AuthContext";

// ── CSS ────────────────────────────────────────────────────────────────────
export const MSG_CSS = `
.msg-layout {
  display: flex;
  height: calc(100vh - 112px);
  max-height: calc(100vh - 112px);
  overflow: hidden;
  background: #F4F5FA;
}
  .msg-chat {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  height: 100%;
  overflow: hidden;
}

.msg-messages {
  flex: 1;
  overflow-y: auto;
  min-height: 0;
}

.msg-input-bar {
  flex-shrink: 0;
}

.msg-chat-header {
  flex-shrink: 0;
}
  .msg-contacts { width: 300px; flex-shrink: 0; background: #fff; border-right: 1px solid rgba(0,0,0,0.06); display: flex; flex-direction: column; }
  .msg-contacts-header { padding: 18px 16px 12px; border-bottom: 1px solid rgba(0,0,0,0.06); }
  .msg-contacts-title { font-family: 'Sora', sans-serif; font-size: 15px; font-weight: 700; color: #0F1117; margin-bottom: 12px; }
  .msg-search { display: flex; align-items: center; gap: 7px; background: #F4F5FA; border: 1px solid #E5E7EB; border-radius: 9px; padding: 8px 11px; }
  .msg-search input { background: none; border: none; outline: none; font-size: 12.5px; color: #0F1117; width: 100%; font-family: 'DM Sans', sans-serif; }
  .msg-search input::placeholder { color: #B0B7C3; }
  .msg-contacts-list { flex: 1; overflow-y: auto; padding: 8px; }
  .msg-contact-item { display: flex; align-items: center; gap: 10px; padding: 10px; border-radius: 10px; cursor: pointer; transition: background 0.15s; position: relative; }
  .msg-contact-item:hover { background: #F4F5FA; }
  .msg-contact-item.active { background: #EEF2FF; }
  .msg-av { width: 38px; height: 38px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11.5px; font-weight: 700; color: #fff; flex-shrink: 0; position: relative; }
  .msg-contact-info { flex: 1; min-width: 0; }
  .msg-contact-name { font-size: 13px; font-weight: 500; color: #111827; margin-bottom: 2px; }
  .msg-contact-preview { font-size: 11.5px; color: #9CA3AF; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .msg-contact-meta { display: flex; flex-direction: column; align-items: flex-end; gap: 4px; }
  .msg-contact-time { font-size: 10px; color: #B0B7C3; }
  .msg-unread-badge { background: #4F46E5; color: #fff; font-size: 9px; font-weight: 700; border-radius: 99px; padding: 1px 6px; min-width: 16px; text-align: center; }

  .msg-chat { flex: 1; display: flex; flex-direction: column; min-width: 0; height: 100%; }
  .msg-chat-header { height: 62px; background: #fff; border-bottom: 1px solid rgba(0,0,0,0.06); display: flex; align-items: center; justify-content: space-between; padding: 0 22px; flex-shrink: 0; }
  .msg-chat-header-left { display: flex; align-items: center; gap: 10px; }
  .msg-chat-name { font-family: 'Sora', sans-serif; font-size: 14px; font-weight: 700; color: #0F1117; }
  .msg-chat-status { font-size: 11px; color: #9CA3AF; font-weight: 500; }

  .msg-messages { flex: 1; overflow-y: auto; padding: 20px 22px; display: flex; flex-direction: column; gap: 4px; scroll-behavior: smooth; min-height: 0; }
  .msg-messages::-webkit-scrollbar { width: 4px; }
  .msg-messages::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 99px; }

  .msg-date-sep { text-align: center; margin: 12px 0 8px; }
  .msg-date-sep span { font-size: 10.5px; color: #B0B7C3; background: #F4F5FA; padding: 3px 10px; border-radius: 99px; }

  .msg-row { display: flex; align-items: flex-end; gap: 8px; margin-bottom: 2px; }
  .msg-row.mine { flex-direction: row-reverse; }
  .msg-bubble-av { width: 26px; height: 26px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 9px; font-weight: 700; color: #fff; flex-shrink: 0; }
  .msg-bubble-wrap { max-width: 62%; display: flex; flex-direction: column; }
  .msg-row.mine .msg-bubble-wrap { align-items: flex-end; }
  .msg-sender-name { font-size: 10px; color: #9CA3AF; margin-bottom: 3px; padding-left: 2px; }
  .msg-bubble { padding: 10px 13px; border-radius: 14px; font-size: 13px; line-height: 1.55; word-break: break-word; animation: msgSlideIn 0.2s ease; }
  .msg-bubble.theirs { background: #fff; color: #111827; border: 1px solid rgba(0,0,0,0.06); border-bottom-left-radius: 4px; box-shadow: 0 1px 4px rgba(0,0,0,0.04); }
  .msg-bubble.mine { background: #4F46E5; color: #fff; border-bottom-right-radius: 4px; }
  .msg-bubble-time { font-size: 9.5px; color: #B0B7C3; margin-top: 3px; padding: 0 3px; }
  .msg-row.mine .msg-bubble-time { text-align: right; color: rgba(79,70,229,0.6); }
  .msg-read-status { font-size: 9px; color: rgba(79,70,229,0.5); text-align: right; padding: 0 3px; }

  .msg-file { display: flex; align-items: center; gap: 9px; background: rgba(255,255,255,0.15); border-radius: 8px; padding: 8px 10px; margin-top: 4px; cursor: pointer; }
  .msg-bubble.theirs .msg-file { background: #F4F5FA; }
  .msg-file-icon { width: 28px; height: 28px; border-radius: 7px; background: #4F46E5; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .msg-bubble.mine .msg-file-icon { background: rgba(255,255,255,0.25); }
  .msg-file-name { font-size: 11.5px; font-weight: 500; }
  .msg-file-size { font-size: 10px; opacity: 0.65; }

  .msg-typing { display: flex; align-items: center; gap: 8px; padding: 6px 0 4px; }
  .msg-typing-dots { display: flex; gap: 3px; }
  .msg-typing-dots span { width: 6px; height: 6px; border-radius: 50%; background: #B0B7C3; animation: typingBounce 1.2s infinite; }
  .msg-typing-dots span:nth-child(2) { animation-delay: 0.2s; }
  .msg-typing-dots span:nth-child(3) { animation-delay: 0.4s; }
  @keyframes typingBounce { 0%,60%,100% { transform: translateY(0); } 30% { transform: translateY(-5px); } }

  .msg-input-bar { background: #fff; border-top: 1px solid rgba(0,0,0,0.06); padding: 12px 16px; display: flex; align-items: flex-end; gap: 10px; flex-shrink: 0; }
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

  .msg-emoji-picker { position: absolute; bottom: 68px; right: 16px; background: #fff; border: 1px solid #E5E7EB; border-radius: 12px; padding: 10px; box-shadow: 0 8px 28px rgba(0,0,0,0.12); display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; z-index: 100; }
  .msg-emoji-picker button { width: 30px; height: 30px; font-size: 16px; border: none; background: none; cursor: pointer; border-radius: 6px; transition: background 0.15s; }
  .msg-emoji-picker button:hover { background: #F4F5FA; }

  .msg-empty { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #B0B7C3; gap: 12px; }
  .msg-empty-icon { width: 56px; height: 56px; border-radius: 16px; background: #F4F5FA; display: flex; align-items: center; justify-content: center; }
  .msg-empty-text { font-size: 13.5px; color: #9CA3AF; }
  .msg-empty-sub { font-size: 12px; color: #C4C9D4; }

  .msg-loading { flex: 1; display: flex; align-items: center; justify-content: center; color: #B0B7C3; font-size: 13px; }
  .msg-error { background: #FEF2F2; border: 1px solid #FECACA; border-radius: 8px; padding: 8px 12px; font-size: 12px; color: #EF4444; margin: 8px 16px; }

  .msg-contacts-list::-webkit-scrollbar { width: 3px; }
  .msg-contacts-list::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 99px; }
 

.msg-file {
  text-decoration: none;
  color: inherit;
}

@media (max-width: 900px) {
  .msg-layout {
    height: calc(100vh - 96px);
    max-height: calc(100vh - 96px);
  }

  .msg-contacts {
    width: 260px;
  }

  .msg-bubble-wrap {
    max-width: 78%;
  }
}

@media (max-width: 600px) {
  .msg-layout {
    flex-direction: column;
    height: calc(100vh - 70px);
    max-height: calc(100vh - 70px);
  }

  .msg-contacts {
    width: 100%;
    height: 38%;
    min-height: 230px;
    border-right: none;
    border-bottom: 1px solid rgba(0,0,0,0.06);
  }

  .msg-chat {
    height: 62%;
    min-height: 0;
  }

  .msg-chat-header {
    height: 54px;
    padding: 0 12px;
  }

  .msg-messages {
    padding: 12px;
  }

  .msg-bubble-wrap {
    max-width: 88%;
  }

  .msg-input-bar {
    padding: 8px;
    gap: 7px;
  }

  .msg-input-wrap {
    padding: 8px 9px;
  }

  .msg-input-wrap textarea {
    font-size: 12.5px;
  }

  .msg-send-btn {
    width: 36px;
    height: 36px;
  }
}



  @keyframes msgSlideIn { from { opacity:0; transform: translateY(6px); } to { opacity:1; transform: translateY(0); } }
`;

// ── Helpers ────────────────────────────────────────────────────────────────
const COLORS = ["#4F46E5","#10B981","#F59E0B","#EF4444","#8B5CF6","#EC4899","#0EA5E9","#14B8A6"];
const EMOJIS = ["😊","👍","🙏","❤️","🔥","😂","😮","👀","✅","⚡","🚀","💡","📎","🎉","😎","🤝"];

function getColor(id) {
  return COLORS[id % COLORS.length];
}

function getInitials(nom) {
  if (!nom) return "?";
  return nom.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

function timeNow() {
  const d = new Date();
  return `${d.getHours().toString().padStart(2,"0")}:${d.getMinutes().toString().padStart(2,"0")}`;
}

// ── COMPONENT ──────────────────────────────────────────────────────────────
export default function MessagerieePage() {
  const { currentUser } = useAuth();

  const [contacts,      setContacts]      = useState([]);
  const [activeContact, setActiveContact] = useState(null);
  const [messages,      setMessages]      = useState([]);
  const [searchQ,       setSearchQ]       = useState("");
  const [inputText,     setInputText]     = useState("");
  const [inputFocused,  setInputFocused]  = useState(false);
  const [showEmoji,     setShowEmoji]     = useState(false);
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [loadingMsgs,     setLoadingMsgs]     = useState(false);
  const [sending,         setSending]         = useState(false);
  const [error,           setError]           = useState(null);

  const messagesEndRef = useRef(null);
  const textareaRef    = useRef(null);
  const fileInputRef   = useRef(null);
  const pollRef        = useRef(null);

  const scrollToBottom = () =>
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => { scrollToBottom(); }, [messages]);

  // ── Charger contacts ───────────────────────────────────────────
  const loadContacts = useCallback(async () => {
    try {
      const data = await messagesAPI.getContacts();
      setContacts(data);
    } catch (e) {
      setError("Impossible de charger les contacts.");
    } finally {
      setLoadingContacts(false);
    }
  }, []);

  useEffect(() => {
    loadContacts();
    // Rafraîchir contacts toutes les 15s pour les badges non lus
    const interval = setInterval(loadContacts, 15000);
    return () => clearInterval(interval);
  }, [loadContacts]);

  // ── Charger conversation ───────────────────────────────────────
  const loadConversation = useCallback(async (contactId) => {
    setLoadingMsgs(true);
    setError(null);
    try {
      const data = await messagesAPI.getConversation(contactId);
      setMessages(data);
    } catch (e) {
      setError("Impossible de charger la conversation.");
    } finally {
      setLoadingMsgs(false);
    }
  }, []);

  const selectContact = async (contact) => {
    setActiveContact(contact);
    setShowEmoji(false);
    setMessages([]);

    // Remettre unread à 0 localement
    setContacts((prev) =>
      prev.map((c) => c.id === contact.id ? { ...c, unread: 0 } : c)
    );

    await loadConversation(contact.id);

    // Polling toutes les 5s pour nouveaux messages
    clearInterval(pollRef.current);
    pollRef.current = setInterval(async () => {
      try {
        const data = await messagesAPI.getConversation(contact.id);
        setMessages(data);
      } catch (_) {}
    }, 5000);
  };

  useEffect(() => {
    return () => clearInterval(pollRef.current);
  }, []);
// ── Envoyer un message ─────────────────────────────────────────
const sendMessage = async () => {
  if (!inputText.trim() || !activeContact || sending) return;

  const text = inputText.trim();
  setInputText("");
  setSending(true);
  setError(null);

  const tempMsg = {
    id: `temp-${Date.now()}`,
    from: "me",
    contenu: text,
    time: timeNow(),
    date: "Aujourd'hui",
    lu: false,
  };

  setMessages((prev) => [...prev, tempMsg]);

  try {
    const sent = await messagesAPI.send(activeContact.id, text);

    // Normalize backend response to frontend shape
    const normalizedMsg = {
      id: sent.id ?? tempMsg.id,
      from: "me",
      contenu: sent.contenu ?? text,
      time: sent.time ?? tempMsg.time,
      date: sent.date ?? "Aujourd'hui",
      lu: sent.lu ?? false,
      fichier_nom: sent.fichier_nom ?? null,
      fichier_taille: sent.fichier_taille ?? null,
      file_path: sent.file_path ?? null,
    };

    setMessages((prev) =>
      prev.map((m) => (m.id === tempMsg.id ? normalizedMsg : m))
    );

  } catch (e) {
    setError("Échec de l'envoi du message.");
    setMessages((prev) => prev.filter((m) => m.id !== tempMsg.id));
    setInputText(text);
  } finally {
    setSending(false);
  }
};

// ── Envoyer fichier ─────────────────────────────────────────
const handleAttachFile = async (e) => {
  const file = e.target.files?.[0];
  if (!file || !activeContact) return;

  const sizeKo = Math.round(file.size / 1024);

  const tempMsg = {
    id: `temp-${Date.now()}`,
    from: "me",
    contenu: "Fichier joint",
    fichier_nom: file.name,
    fichier_taille: `${sizeKo} Ko`,
    time: timeNow(),
    date: "Aujourd'hui",
  };

  setMessages((prev) => [...prev, tempMsg]);

  try {
    const sent = await messagesAPI.send(activeContact.id, "Fichier joint", file);

    const normalizedMsg = {
      id: sent.id ?? tempMsg.id,
      from: "me",
      contenu: sent.contenu ?? "Fichier joint",
      time: sent.time ?? tempMsg.time,
      date: sent.date ?? "Aujourd'hui",
      lu: sent.lu ?? false,
      fichier_nom: sent.fichier_nom ?? file.name,
      fichier_taille: sent.fichier_taille ?? tempMsg.fichier_taille,
      file_path: sent.file_path ?? null,
    };

    setMessages((prev) =>
      prev.map((m) => (m.id === tempMsg.id ? normalizedMsg : m))
    );

  } catch (e) {
    setError("Erreur envoi fichier");
    setMessages((prev) => prev.filter((m) => m.id !== tempMsg.id));
  }
};
 

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const insertEmoji = (emoji) => {
    setInputText((prev) => prev + emoji);
    setShowEmoji(false);
    textareaRef.current?.focus();
  };

  // ── Filtrer contacts ───────────────────────────────────────────
  const filteredContacts = contacts.filter((c) =>
    c.nom?.toLowerCase().includes(searchQ.toLowerCase()) ||
    c.role?.toLowerCase().includes(searchQ.toLowerCase())
  );

  const totalUnread = contacts.reduce((a, c) => a + (c.unread || 0), 0);

  // ── Grouper messages par date ──────────────────────────────────
  const groupedMsgs = [];
  let lastDate = null;
  messages.forEach((m) => {
    if (m.date !== lastDate) {
      groupedMsgs.push({ type: "date", date: m.date });
      lastDate = m.date;
    }
    groupedMsgs.push({ type: "msg", ...m });
  });

  // ── RENDER ─────────────────────────────────────────────────────
  return (
    <div className="msg-layout">

      {/* ── CONTACTS ── */}
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
          {loadingContacts ? (
            <div style={{ padding: 20, textAlign: "center", color: "#B0B7C3", fontSize: 12 }}>
              Chargement...
            </div>
          ) : filteredContacts.length === 0 ? (
            <div style={{ padding: 20, textAlign: "center", color: "#B0B7C3", fontSize: 12 }}>
              Aucun contact trouvé
            </div>
          ) : (
            filteredContacts.map((contact) => {
              const isActive  = activeContact?.id === contact.id;
              const unreadCnt = contact.unread || 0;
              const color     = getColor(contact.id);
              const initials  = getInitials(contact.nom);

              return (
                <div
                  key={contact.id}
                  className={`msg-contact-item${isActive ? " active" : ""}`}
                  onClick={() => selectContact(contact)}
                >
                  <div className="msg-av" style={{ background: color }}>
                    {initials}
                  </div>
                  <div className="msg-contact-info">
                    <div className="msg-contact-name">{contact.nom}</div>
                    <div className="msg-contact-preview">
                      {contact.last_msg
                        ? (contact.last_msg.sender_id === currentUser?.id ? "Vous : " : "") +
                          contact.last_msg.contenu
                        : <span style={{ fontStyle: "italic", color: "#C4C9D4" }}>Démarrer une conversation</span>
                      }
                    </div>
                  </div>
                  <div className="msg-contact-meta">
                    {contact.last_msg && (
                      <div className="msg-contact-time">{contact.last_msg.created_at}</div>
                    )}
                    {unreadCnt > 0 && (
                      <div className="msg-unread-badge">{unreadCnt}</div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ── CHAT ── */}
      {activeContact ? (
        <div className="msg-chat" style={{ position: "relative" }}>

          {/* Header */}
          <div className="msg-chat-header">
            <div className="msg-chat-header-left">
              <div className="msg-av" style={{ background: getColor(activeContact.id), width: 36, height: 36, fontSize: 10.5 }}>
                {getInitials(activeContact.nom)}
              </div>
              <div>
                <div className="msg-chat-name">{activeContact.nom}</div>
                <div className="msg-chat-status">{activeContact.role}</div>
              </div>
            </div>
          </div>

          {/* Error */}
          {error && <div className="msg-error">{error}</div>}

          {/* Messages */}
          <div className="msg-messages">
            {loadingMsgs ? (
              <div className="msg-loading">Chargement de la conversation...</div>
            ) : (
              groupedMsgs.map((item, i) => {
                if (item.type === "date") {
                  return (
                    <div className="msg-date-sep" key={`date-${i}`}>
                      <span>{item.date}</span>
                    </div>
                  );
                }

                const isMe     = item.from === "me";
                const color    = getColor(activeContact.id);
                const initials = getInitials(activeContact.nom);

                return (
                  <div className={`msg-row${isMe ? " mine" : ""}`} key={item.id}>
                    <div style={{ width: 26, flexShrink: 0 }}>
                      {!isMe && (
                        <div className="msg-bubble-av" style={{ background: color }}>
                          {initials}
                        </div>
                      )}
                    </div>
                    <div className="msg-bubble-wrap">
                      <div className={`msg-bubble ${isMe ? "mine" : "theirs"}`}>
                        {item.contenu}
                       {item.fichier_nom && (
  <a
  className="msg-file"
  href={item.file_url || item.file_path || "#"}
  target="_blank"
  rel="noopener noreferrer"
>
    <div className="msg-file-icon">
      📎
    </div>

    <div>
      <div className="msg-file-name">{item.fichier_nom}</div>
      <div className="msg-file-size">{item.fichier_taille}</div>
    </div>
  </a>
)}
                      </div>
                      <div className="msg-bubble-time">{item.time}</div>
                      {isMe && (
                        <div className="msg-read-status">
                          {item.lu ? "✓✓ Lu" : "✓ Envoyé"}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef}/>
          </div>

          {/* Input */}
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
                placeholder={`Message à ${activeContact.nom}...`}
                value={inputText}
                onChange={(e) => {
                  setInputText(e.target.value);
                  e.target.style.height = "auto";
                  e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
                }}
                onKeyDown={handleKeyDown}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
              />
              <button className="msg-emoji-btn" onClick={() => setShowEmoji((v) => !v)}>😊</button>
              <input
                ref={fileInputRef}
                type="file"
                style={{ display: "none" }}
                onChange={handleAttachFile}
              />
              <button
                className="msg-input-attach"
                type="button"
                onClick={() => fileInputRef.current?.click()}
                title="Joindre un fichier"
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M14 8.5l-5.5 5.5a4 4 0 01-5.66-5.66L8 3a2.5 2.5 0 013.54 3.54L6 12a1 1 0 01-1.41-1.41L9.5 5.5"
                    stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
            <button
              className="msg-send-btn"
              onClick={sendMessage}
              disabled={!inputText.trim() || sending}
            >
              <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
                <path d="M16 2L2 7.5l5.5 1.5L10 16l6-14z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      ) : (
        <div className="msg-chat">
          {error && <div className="msg-error">{error}</div>}
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