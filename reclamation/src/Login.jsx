import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'DM Sans', sans-serif; background: #F4F5FA; color: #0F1117; }

  .navbar {
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 48px; height: 60px;
    background: rgba(255,255,255,0.88);
    backdrop-filter: blur(14px);
    border-bottom: 1px solid rgba(0,0,0,0.06);
    position: sticky; top: 0; z-index: 100;
  }
  .nav-link {
    font-size: 13.5px; font-weight: 400; color: #6B7280;
    text-decoration: none; transition: color 0.2s;
  }
  .nav-link:hover { color: #0F1117; }

  .login-center {
    flex: 1; display: flex; align-items: center; justify-content: center;
    padding: 48px 24px; min-height: calc(100vh - 60px);
    background: #F4F5FA;
  }
  .login-card {
    background: #fff; border-radius: 22px;
    border: 1px solid rgba(0,0,0,0.06);
    padding: 44px 40px; width: 100%; max-width: 440px;
    box-shadow: 0 8px 40px rgba(0,0,0,0.06);
  }
  .role-tabs { display: flex; background: #F4F5FA; border-radius: 10px; padding: 4px; margin-bottom: 28px; gap: 2px; }
  .role-tab {
    flex: 1; padding: 8px; border: none; border-radius: 7px;
    font-size: 12.5px; font-family: 'DM Sans', sans-serif;
    cursor: pointer; color: #6B7280; background: none; transition: all 0.2s;
  }
  .role-tab.active { background: #fff; color: #0F1117; font-weight: 500; box-shadow: 0 1px 4px rgba(0,0,0,0.08); }
  .field-label { font-size: 10.5px; font-weight: 600; letter-spacing: 0.8px; color: #9CA3AF; text-transform: uppercase; margin-bottom: 8px; display: block; }
  .field-wrap { position: relative; margin-bottom: 18px; }
  .field-icon { position: absolute; left: 13px; top: 50%; transform: translateY(-50%); color: #C4C9D4; font-style: normal; }
  .field-input {
    width: 100%; padding: 11px 13px 11px 38px;
    border: 1px solid #E5E7EB; border-radius: 9px;
    font-size: 13.5px; font-family: 'DM Sans', sans-serif;
    color: #0F1117; background: #FAFAFA; outline: none; transition: border-color 0.2s;
  }
  .field-input:focus { border-color: #4F46E5; background: #fff; }
  .btn-submit {
    width: 100%; padding: 13px; background: #4F46E5; color: #fff;
    border: none; border-radius: 10px; font-size: 14px; font-weight: 600;
    font-family: 'Sora', sans-serif; cursor: pointer; transition: background 0.2s; margin-top: 8px;
  }
  .btn-submit:hover { background: #4338CA; }
  .secure-note { display: flex; align-items: center; justify-content: center; gap: 6px; margin-top: 18px; font-size: 11.5px; color: #B0B7C3; }
  .eye-btn { position: absolute; right: 13px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: #C4C9D4; font-size: 16px; }
`;

const Logo = () => (
  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <rect width="28" height="28" rx="8" fill="#4F46E5" />
      <path d="M8 14C8 10.686 10.686 8 14 8C17.314 8 20 10.686 20 14C20 17.314 17.314 20 14 20"
        stroke="white" strokeWidth="1.9" strokeLinecap="round" />
      <circle cx="14" cy="20" r="1.6" fill="white" />
    </svg>
    <span style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 15.5, color: "#0F1117", letterSpacing: "-0.3px" }}>
      Bayan
    </span>
  </div>
);

export default function Login() {
  const navigate = useNavigate();
  const [role, setRole] = useState("Employé");
  const [showPwd, setShowPwd] = useState(false);
  const roles = ["Employé", "Responsable", "Admin", "Intervenant"];

  const handleLogin = () => {
  const user = {
    role: role,
    email: "test@bayan.ma"
  };

  // 🔐 sauvegarder utilisateur
  localStorage.setItem("user", JSON.stringify(user));

  // 🔀 redirection selon rôle
  if (role === "Admin") navigate("/dashboard");
  else if (role === "Responsable") navigate("/responsable");
  else if (role === "Employé") navigate("/employee");
  else if (role === "Intervenant") navigate("/intervenant");
};

  return (
    <>
      <style>{CSS}</style>
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <nav className="navbar">
          <Logo />
          <button
            onClick={() => navigate("/")}
            style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13.5, color: "#6B7280", fontFamily: "'DM Sans', sans-serif" }}
          >
            ← Accueil
          </button>
        </nav>

        <div className="login-center">
          <div className="login-card">
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 22 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: "#EEF2FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
                  <path d="M8 14C8 10.686 10.686 8 14 8C17.314 8 20 10.686 20 14C20 17.314 17.314 20 14 20" stroke="#4F46E5" strokeWidth="1.9" strokeLinecap="round"/>
                  <circle cx="14" cy="20" r="1.6" fill="#4F46E5"/>
                </svg>
              </div>
            </div>

            <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: 24, fontWeight: 700, textAlign: "center", letterSpacing: "-0.5px", marginBottom: 6 }}>
              Accéder à votre espace
            </h2>
            <p style={{ fontSize: 13.5, color: "#9CA3AF", textAlign: "center", marginBottom: 28 }}>
              Entrez vos identifiants professionnels
            </p>

            {/* Sélecteur de rôle */}
            <div className="role-tabs">
              {roles.map((r) => (
                <button
                  key={r}
                  className={`role-tab${role === r ? " active" : ""}`}
                  onClick={() => setRole(r)}
                >
                  {r}
                </button>
              ))}
            </div>

            <label className="field-label">Adresse email</label>
            <div className="field-wrap">
              <span className="field-icon">✉</span>
              <input className="field-input" type="email" placeholder="nom@bayan.ma" />
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <label className="field-label" style={{ marginBottom: 0 }}>Mot de passe</label>
              <a href="#" style={{ fontSize: 12, color: "#4F46E5", fontWeight: 500, textDecoration: "none" }}>
                Mot de passe oublié ?
              </a>
            </div>
            <div className="field-wrap">
              <span className="field-icon">🔒</span>
              <input className="field-input" type={showPwd ? "text" : "password"} placeholder="••••••••" />
              <button className="eye-btn" onClick={() => setShowPwd(!showPwd)}>
                {showPwd ? "🙈" : "👁"}
              </button>
            </div>

            <button className="btn-submit" onClick={handleLogin}>
              Se connecter
            </button>

            <div className="secure-note">
              🔒 Accès sécurisé — Personnel interne uniquement
            </div>
          </div>
        </div>
      </div>
    </>
  );
}