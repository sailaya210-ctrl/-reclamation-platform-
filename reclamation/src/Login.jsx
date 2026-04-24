import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'DM Sans', sans-serif; background: #F4F5FA; color: #0F1117; }
  .navbar { display: flex; align-items: center; justify-content: space-between; padding: 0 48px; height: 60px; background: rgba(255,255,255,0.88); backdrop-filter: blur(14px); border-bottom: 1px solid rgba(0,0,0,0.06); position: sticky; top: 0; z-index: 100; }
  .login-center { flex: 1; display: flex; align-items: center; justify-content: center; padding: 48px 24px; min-height: calc(100vh - 60px); background: #F4F5FA; }
  .login-card { background: #fff; border-radius: 22px; border: 1px solid rgba(0,0,0,0.06); padding: 44px 40px; width: 100%; max-width: 440px; box-shadow: 0 8px 40px rgba(0,0,0,0.06); }
  .field-label { font-size: 10.5px; font-weight: 600; letter-spacing: 0.8px; color: #9CA3AF; text-transform: uppercase; margin-bottom: 8px; display: block; }
  .field-wrap { position: relative; margin-bottom: 18px; }
  .field-icon { position: absolute; left: 13px; top: 50%; transform: translateY(-50%); color: #C4C9D4; font-style: normal; pointer-events: none; }
  .field-input { width: 100%; padding: 11px 13px 11px 38px; border: 1.5px solid #E5E7EB; border-radius: 9px; font-size: 13.5px; font-family: 'DM Sans', sans-serif; color: #0F1117; background: #FAFAFA; outline: none; transition: border-color 0.2s; }
  .field-input:focus { border-color: #4F46E5; background: #fff; }
  .field-input.error { border-color: #EF4444; }
  .eye-btn { position: absolute; right: 13px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: #C4C9D4; font-size: 16px; padding: 0; }
  .error-box { background: #FEF2F2; border: 1px solid #FECACA; border-radius: 9px; padding: 10px 14px; margin-bottom: 16px; font-size: 12.5px; color: #DC2626; display: flex; align-items: center; gap: 8px; }
  .btn-submit { width: 100%; padding: 13px; background: #4F46E5; color: #fff; border: none; border-radius: 10px; font-size: 14px; font-weight: 600; font-family: 'Sora', sans-serif; cursor: pointer; transition: background 0.2s; margin-top: 8px; }
  .btn-submit:hover { background: #4338CA; }
  .btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }
  .secure-note { display: flex; align-items: center; justify-content: center; gap: 6px; margin-top: 18px; font-size: 11.5px; color: #B0B7C3; }
`;

const Logo = () => (
  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <rect width="28" height="28" rx="8" fill="#4F46E5" />
      <path d="M8 14C8 10.686 10.686 8 14 8C17.314 8 20 10.686 20 14C20 17.314 17.314 20 14 20" stroke="white" strokeWidth="1.9" strokeLinecap="round" />
      <circle cx="14" cy="20" r="1.6" fill="white" />
    </svg>
    <span style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 15.5, color: "#0F1117", letterSpacing: "-0.3px" }}>
      Bayan
    </span>
  </div>
);

export default function Login() {
  const navigate  = useNavigate();
  const { login } = useAuth();

  const [email,   setEmail]   = useState("");
  const [mdp,     setMdp]     = useState("");
  const [showMdp, setShowMdp] = useState(false);
  const [erreur,  setErreur]  = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setErreur("");
    if (!email.trim() || !mdp.trim()) {
      setErreur("Veuillez remplir tous les champs.");
      return;
    }
    setLoading(true);
    const result = await login(email, mdp);
    setLoading(false);

    if (!result.success) {
      setErreur(result.error);
      return;
    }

    const { role } = result.user;
    if (role === "admin")            navigate("/dashboard");
    else if (role === "responsable") navigate("/responsable");
    else if (role === "intervenant") navigate("/intervenant");
    else                             navigate("/employee");
  };

  return (
    <>
      <style>{CSS}</style>
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <nav className="navbar">
          <Logo />
          <button onClick={() => navigate("/")} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13.5, color: "#6B7280", fontFamily: "'DM Sans', sans-serif" }}>
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
            <p style={{ fontSize: 13, color: "#9CA3AF", textAlign: "center", marginBottom: 28 }}>
              Connectez-vous avec votre compte professionnel
            </p>

            {erreur && (
              <div className="error-box">
                <span>⚠️</span> {erreur}
              </div>
            )}

            <label className="field-label">Adresse email</label>
            <div className="field-wrap">
              <span className="field-icon">✉</span>
              <input
                className={`field-input${erreur ? " error" : ""}`}
                type="email"
                placeholder="nom@bayan.ma"
                value={email}
                onChange={e => { setEmail(e.target.value); setErreur(""); }}
                onKeyDown={e => e.key === "Enter" && handleLogin()}
              />
            </div>

            <label className="field-label">Mot de passe</label>
            <div className="field-wrap">
              <span className="field-icon">🔒</span>
              <input
                className={`field-input${erreur ? " error" : ""}`}
                type={showMdp ? "text" : "password"}
                placeholder="••••••••"
                value={mdp}
                onChange={e => { setMdp(e.target.value); setErreur(""); }}
                onKeyDown={e => e.key === "Enter" && handleLogin()}
              />
              <button className="eye-btn" onClick={() => setShowMdp(!showMdp)}>
                {showMdp ? "🙈" : "👁"}
              </button>
            </div>

            <button className="btn-submit" onClick={handleLogin} disabled={loading}>
              {loading ? "Connexion en cours..." : "Se connecter →"}
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