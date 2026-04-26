const BASE_URL = "http://localhost:8000/api";

const getHeaders = () => {
  const token = localStorage.getItem("bayan_token");
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const apiFetch = async (endpoint, options = {}) => {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: getHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    // Laravel validation errors come in data.errors (object), not data.message
    if (data.errors) {
      const messages = Object.values(data.errors).flat().join(" | ");
      throw new Error(messages);
    }
    throw new Error(data.message || `Erreur serveur (${response.status})`);
  }

  return data;
};

export const authAPI = {
  login: (email, password) =>
    apiFetch("/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  me: () => apiFetch("/me"),

  logout: () =>
    apiFetch("/logout", {
      method: "POST",
    }),
};

export const ticketsAPI = {
  getAll: (filters = {}) =>
    apiFetch(`/tickets?${new URLSearchParams(filters)}`),

  create: (data) =>
    apiFetch("/tickets", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getOne: (id) => apiFetch(`/tickets/${id}`),

  update: (id, data) =>
    apiFetch(`/tickets/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id) =>
    apiFetch(`/tickets/${id}`, {
      method: "DELETE",
    }),

  addComment: (id, contenu) =>
    apiFetch(`/tickets/${id}/comment`, {
      method: "POST",
      body: JSON.stringify({ contenu }),
    }),

  getStats: () => apiFetch("/stats"),

  assign: (id, userId) =>
    apiFetch(`/tickets/${id}/assign`, {
      method: "PUT",
      body: JSON.stringify({ assigned_to: userId }),
    }),

  updateStatus: (id, statut) =>
    apiFetch(`/tickets/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ statut }),
    }),

  updatePriority: (id, priorite) =>
    apiFetch(`/tickets/${id}/priority`, {
      method: "PUT",
      body: JSON.stringify({ priorite }),
    }),
};

export const usersAPI = {
  getAll: () => apiFetch("/users"),

  create: (data) =>
    apiFetch("/users", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  delete: (id) =>
    apiFetch(`/users/${id}`, {
      method: "DELETE",
    }),
};

// ── MESSAGES API ──────────────────────────────────────────────────────────
export const messagesAPI = {
  // Liste des contacts avec dernier message + non lus
  getContacts: () => apiFetch("/messages/contacts"),

  // Historique complet de la conversation avec un user
  getConversation: (userId) => apiFetch(`/messages/${userId}`),

  // Envoyer un message
  send: (receiverId, contenu, file = null) => {
  const formData = new FormData();
  formData.append("receiver_id", receiverId);
  formData.append("contenu", contenu);

  if (file) {
    formData.append("file", file);
  }

  const token = localStorage.getItem("bayan_token");

  return fetch("http://localhost:8000/api/messages", {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  }).then(async (res) => {
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Erreur serveur");
    return data;
  });
},
 
 

  // Nombre total de messages non lus
  getUnreadCount: () => apiFetch("/messages/unread"),
};