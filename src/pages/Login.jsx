import { useState } from "react";
import { login, signup } from "../api.js";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("demo@petcomm.app");
  const [password, setPassword] = useState("demo1234");
  const [mode, setMode] = useState("login");
  const [err, setErr] = useState("");
  const nav = useNavigate();

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    try {
      if (mode === "signup") await signup(email, password);
      await login(email, password);
      nav("/");
    } catch (e) { setErr(e.message || "Erreur"); }
  }

  return (
    <div className="card">
      <h1 className="text-xl font-bold mb-4">{mode === "login" ? "Connexion" : "Créer un compte"}</h1>
      {err && <div className="text-red-600 mb-2">{err}</div>}
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="input" placeholder="email" value={email} onChange={e => setEmail(e.target.value)} />
        <input className="input" type="password" placeholder="mot de passe" value={password} onChange={e => setPassword(e.target.value)} />
        <button className="btn w-full">{mode === "login" ? "Se connecter" : "Créer le compte"}</button>
      </form>
      <div className="mt-3 text-sm">
        {mode === "login" ? (
          <button className="underline" onClick={() => setMode("signup")}>Pas de compte ? Créer un compte</button>
        ) : (
          <button className="underline" onClick={() => setMode("login")}>Déjà un compte ? Se connecter</button>
        )}
      </div>
    </div>
  );
}
