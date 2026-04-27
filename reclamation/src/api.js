// FRONTEND ONLY API — no Laravel, no server, no fetch.
// Everything is saved in browser localStorage.

const LS_USERS = "bayan_front_users";
const LS_TICKETS = "bayan_front_tickets";
const LS_MESSAGES = "bayan_front_messages";
const LS_SESSION = "bayan_current_user";
const LS_TOKEN = "bayan_token";

const nowISO = () => new Date().toISOString();
const wait = (ms = 120) => new Promise((resolve) => setTimeout(resolve, ms));

const initials = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const DEFAULT_USERS = [
  { id: 1, nom: "Ahmed Ataki", email: "ahmed@bayan.ma", password: "admin123", motdepasse: "admin123", role: "admin", initiales: "AA", couleur: "#4F46E5" },
  { id: 2, nom: "Karim Alami", email: "karim@bayan.ma", password: "resp123", motdepasse: "resp123", role: "responsable", initiales: "KA", couleur: "#10B981" },
  { id: 3, nom: "Aya Saïl", email: "aya@bayan.ma", password: "resp123", motdepasse: "resp123", role: "responsable", initiales: "AS", couleur: "#EC4899" },
  { id: 4, nom: "Zakaria Achraf", email: "zakaria@bayan.ma", password: "emp123", motdepasse: "emp123", role: "employe", initiales: "ZA", couleur: "#8B5CF6" },
  { id: 5, nom: "Sarah Lemarié", email: "sarah@bayan.ma", password: "emp123", motdepasse: "emp123", role: "employe", initiales: "SL", couleur: "#F59E0B" },
  { id: 6, nom: "Omar Almsaddek", email: "omar@bayan.ma", password: "emp123", motdepasse: "emp123", role: "employe", initiales: "OM", couleur: "#0EA5E9" },
  { id: 7, nom: "Employé IT", email: "it@bayan.ma", password: "int123", motdepasse: "int123", role: "intervenant", type: "interne", initiales: "EI", couleur: "#14B8A6" },
  { id: 8, nom: "Technicien Externe", email: "externe@bayan.ma", password: "ext123", motdepasse: "ext123", role: "intervenant", type: "externe", initiales: "TE", couleur: "#F97316" },
];

const DEFAULT_TICKETS = [
  {
    id: 1,
    titre: "Problème de facturation récurrent",
    service: "Comptabilité",
    categorie: "Facturation",
    description: "La facturation mensuelle génère des doublons depuis 3 mois.",
    priorite: "urgent",
    statut: "attente",
    created_by: 4,
    created_by_name: "Zakaria Achraf",
    assigned_to: null,
    assignee_id: null,
    assignee: null,
    piece_jointe: "facture_octobre.pdf",
    created_at: "2026-04-20T09:14:00.000Z",
    updated_at: "2026-04-20T09:14:00.000Z",
    commentaires: [],
  },
  {
    id: 2,
    titre: "Accès portail client bloqué",
    service: "Support IT",
    categorie: "Authentification",
    description: "Impossible de se connecter au portail depuis la mise à jour.",
    priorite: "normal",
    statut: "cours",
    created_by: 5,
    created_by_name: "Sarah Lemarié",
    assigned_to: 7,
    assignee_id: 7,
    created_at: "2026-04-21T11:02:00.000Z",
    updated_at: "2026-04-22T10:00:00.000Z",
    commentaires: [],
  },
  {
    id: 3,
    titre: "Climatisation en panne",
    service: "Externe",
    categorie: "Maintenance",
    description: "La climatisation ne fonctionne plus dans la salle de réunion.",
    priorite: "haute",
    statut: "attente",
    created_by: 6,
    created_by_name: "Omar Almsaddek",
    assigned_to: 8,
    assignee_id: 8,
    created_at: "2026-04-23T08:45:00.000Z",
    updated_at: "2026-04-23T08:45:00.000Z",
    commentaires: [],
  },
];

const read = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const write = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
  return value;
};

const ensureSeed = () => {
  if (!localStorage.getItem(LS_USERS)) write(LS_USERS, DEFAULT_USERS);
  if (!localStorage.getItem(LS_TICKETS)) write(LS_TICKETS, DEFAULT_TICKETS);
  if (!localStorage.getItem(LS_MESSAGES)) write(LS_MESSAGES, []);
};

const users = () => { ensureSeed(); return read(LS_USERS, DEFAULT_USERS); };
const saveUsers = (list) => write(LS_USERS, list);

const attachAssignee = (ticket) => {
  const u = users().find((x) => Number(x.id) === Number(ticket.assigned_to || ticket.assignee_id));
  return {
    ...ticket,
    assignee_id: ticket.assigned_to || ticket.assignee_id || null,
    assigned_to: ticket.assigned_to || ticket.assignee_id || null,
    assignee: u ? { id: u.id, nom: u.nom, name: u.nom, email: u.email, role: u.role, type: u.type } : null,
  };
};

const tickets = () => { ensureSeed(); return read(LS_TICKETS, DEFAULT_TICKETS).map(attachAssignee); };
const saveTickets = (list) => write(LS_TICKETS, list);

const currentUser = () => read(LS_SESSION, null);
const requireUser = () => {
  const u = currentUser();
  if (!u) throw new Error("Vous devez vous connecter.");
  return u;
};

export const authAPI = {
  async login(email, password) {
    await wait();
    ensureSeed();
    const user = users().find(
      (u) => u.email.toLowerCase() === String(email).trim().toLowerCase() &&
             (u.password === password || u.motdepasse === password)
    );
    if (!user) throw new Error("Email ou mot de passe incorrect.");
    const safeUser = { ...user };
    delete safeUser.password;
    delete safeUser.motdepasse;
    localStorage.setItem(LS_TOKEN, "frontend-demo-token");
    write(LS_SESSION, safeUser);
    return { token: "frontend-demo-token", user: safeUser };
  },

  async me() {
    await wait(60);
    const user = currentUser();
    if (!user) throw new Error("Session expirée.");
    return user;
  },

  async logout() {
    await wait(60);
    localStorage.removeItem(LS_TOKEN);
    localStorage.removeItem(LS_SESSION);
    return { success: true };
  },
};

export const usersAPI = {
  async getAll() {
    await wait();
    return users().map((u) => {
      const clean = { ...u, name: u.nom };
      delete clean.password;
      delete clean.motdepasse;
      return clean;
    });
  },

  async create(data) {
    await wait();
    const list = users();
    if (list.some((u) => u.email.toLowerCase() === String(data.email).toLowerCase())) {
      throw new Error("Cet email existe déjà.");
    }
    const newUser = {
      id: Math.max(0, ...list.map((u) => Number(u.id))) + 1,
      nom: data.nom || data.name,
      name: data.nom || data.name,
      email: data.email,
      password: data.password || data.motdepasse || "123456",
      motdepasse: data.password || data.motdepasse || "123456",
      role: data.role || "employe",
      type: data.type || null,
      initiales: initials(data.nom || data.name),
      couleur: data.couleur || "#4F46E5",
    };
    saveUsers([...list, newUser]);
    return newUser;
  },

  async delete(id) {
    await wait();
    saveUsers(users().filter((u) => Number(u.id) !== Number(id)));
    return { success: true };
  },
};

export const ticketsAPI = {
  async getAll(filters = {}) {
    await wait();
    let list = tickets();
    if (filters.statut) list = list.filter((t) => t.statut === filters.statut);
    if (filters.service) list = list.filter((t) => t.service === filters.service);
    return list;
  },

  async getOne(id) {
    await wait();
    const ticket = tickets().find((t) => Number(t.id) === Number(id));
    if (!ticket) throw new Error("Réclamation introuvable.");
    return ticket;
  },

  async create(data) {
    await wait();
    const me = currentUser() || users()[3];
    const list = tickets();
    const newTicket = {
      id: Math.max(0, ...list.map((t) => Number(t.id))) + 1,
      titre: data.titre || data.title || "Sans titre",
      service: data.service || "Support IT",
      categorie: data.categorie || data.cat || "Autre",
      description: data.description || data.desc || "",
      priorite: data.priorite || "normal",
      statut: data.statut || "attente",
      created_by: me.id,
      created_by_name: me.nom || me.name,
      assigned_to: data.assigned_to || data.assignee_id || null,
      assignee_id: data.assigned_to || data.assignee_id || null,
      piece_jointe: data.piece_jointe || data.attachmentName || null,
      created_at: nowISO(),
      updated_at: nowISO(),
      commentaires: [],
    };
    saveTickets([...list, newTicket]);
    return attachAssignee(newTicket);
  },

  async update(id, data) {
    await wait();
    let found = null;
    const list = tickets().map((t) => {
      if (Number(t.id) !== Number(id)) return t;
      found = { ...t, ...data, updated_at: nowISO() };
      return found;
    });
    if (!found) throw new Error("Réclamation introuvable.");
    saveTickets(list);
    return attachAssignee(found);
  },

  async delete(id) {
    await wait();
    saveTickets(tickets().filter((t) => Number(t.id) !== Number(id)));
    return { success: true };
  },

  async assign(id, userId) {
    return this.update(id, { assigned_to: Number(userId), assignee_id: Number(userId), statut: "cours" });
  },

  async updateStatus(id, statut) {
    return this.update(id, { statut });
  },

  async updatePriority(id, priorite) {
    return this.update(id, { priorite });
  },

  async addComment(id, contenu) {
    await wait();
    const me = currentUser() || { id: 0, nom: "Utilisateur" };
    let savedComment = null;
    const list = tickets().map((t) => {
      if (Number(t.id) !== Number(id)) return t;
      savedComment = {
        id: Date.now(),
        user_id: me.id,
        user: { id: me.id, nom: me.nom || me.name },
        contenu,
        created_at: nowISO(),
      };
      return { ...t, commentaires: [...(t.commentaires || []), savedComment], updated_at: nowISO() };
    });
    saveTickets(list);
    return savedComment;
  },

  async getStats() {
    await wait();
    const list = tickets();
    return {
      total: list.length,
      attente: list.filter((t) => t.statut === "attente").length,
      cours: list.filter((t) => t.statut === "cours").length,
      resolu: list.filter((t) => t.statut === "resolu").length,
      urgent: list.filter((t) => t.priorite === "urgent").length,
    };
  },
};

const fileToDataUrl = (file) =>
  new Promise((resolve, reject) => {
    if (!file) return resolve(null);
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Impossible de lire le fichier."));
    reader.readAsDataURL(file);
  });

const formatDateLabel = (iso) => {
  const d = new Date(iso);
  const today = new Date();
  return d.toDateString() === today.toDateString() ? "Aujourd'hui" : d.toLocaleDateString('fr-FR');
};

const formatTimeLabel = (iso) => {
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
};

const normalizeMessage = (m, meId) => ({
  ...m,
  from: Number(m.sender_id) === Number(meId) ? "me" : "them",
  contenu: m.contenu || "",
  time: formatTimeLabel(m.created_at),
  date: formatDateLabel(m.created_at),
  lu: !!m.lu,
  fichier_nom: m.fichier_nom || m.file_name || null,
  fichier_taille: m.fichier_taille || m.file_size || null,
  file_url: m.file_url || null,
  file_path: m.file_path || null,
});

export const messagesAPI = {
  async getContacts() {
    await wait();
    const me = requireUser();
    const allMessages = read(LS_MESSAGES, []);
    return users()
      .filter((u) => Number(u.id) !== Number(me.id) && u.role !== "admin")
      .map((u) => {
        const convo = allMessages
          .filter((m) =>
            (Number(m.sender_id) === Number(me.id) && Number(m.receiver_id) === Number(u.id)) ||
            (Number(m.sender_id) === Number(u.id) && Number(m.receiver_id) === Number(me.id))
          )
          .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        const last = convo[convo.length - 1];
        return {
          id: u.id,
          nom: u.nom,
          name: u.nom,
          email: u.email,
          role: u.role,
          type: u.type,
          initiales: u.initiales,
          couleur: u.couleur,
          unread: convo.filter((m) => Number(m.receiver_id) === Number(me.id) && !m.lu).length,
          last_msg: last ? normalizeMessage(last, me.id) : null,
        };
      });
  },

  async getConversation(userId) {
    await wait();
    const me = requireUser();
    const all = read(LS_MESSAGES, []);
    const normalized = all
      .filter((m) =>
        (Number(m.sender_id) === Number(me.id) && Number(m.receiver_id) === Number(userId)) ||
        (Number(m.sender_id) === Number(userId) && Number(m.receiver_id) === Number(me.id))
      )
      .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
      .map((m) => normalizeMessage(m, me.id));

    write(LS_MESSAGES, all.map((m) =>
      Number(m.sender_id) === Number(userId) && Number(m.receiver_id) === Number(me.id)
        ? { ...m, lu: true }
        : m
    ));
    return normalized;
  },

  async send(receiverId, contenu, file = null) {
    await wait();
    const me = requireUser();
    const fileUrl = file ? await fileToDataUrl(file) : null;
    const msg = {
      id: Date.now(),
      sender_id: me.id,
      receiver_id: Number(receiverId),
      contenu: contenu || (file ? "Fichier joint" : ""),
      fichier_nom: file?.name || null,
      fichier_taille: file ? `${Math.round(file.size / 1024)} Ko` : null,
      file_url: fileUrl,
      file_path: null,
      lu: false,
      created_at: nowISO(),
      sender: { id: me.id, nom: me.nom || me.name },
    };
    write(LS_MESSAGES, [...read(LS_MESSAGES, []), msg]);
    return normalizeMessage(msg, me.id);
  },

  async getUnreadCount() {
    await wait(60);
    const me = requireUser();
    const count = read(LS_MESSAGES, []).filter((m) => Number(m.receiver_id) === Number(me.id) && !m.lu).length;
    return { count };
  },
};

// For testing: run localStorage.clear() in console to reset all frontend-only data.
