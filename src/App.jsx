import { Routes, Route, Navigate, Link, useNavigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Animals from "./pages/Animals.jsx";
import Plan from "./pages/Plan.jsx";
import { logout } from "./api.js";

function isAuthed() {
  return !!localStorage.getItem("token");
}

function Private({ children }) {
  return isAuthed() ? children : <Navigate to="/login" replace />;
}

function NavBar() {
  const nav = useNavigate();
  return (
    <div className="flex items-center justify-between p-4 border-b bg-white">
      <Link to="/" className="font-bold text-emerald-700">PetComm</Link>
      <div className="flex gap-2">
        <Link className="btn" to="/">Mes animaux</Link>
        {isAuthed() ? (
          <button className="btn" onClick={() => { logout(); nav("/login"); }}>
            Déconnexion
          </button>
        ) : (
          <Link className="btn" to="/login">Connexion</Link>
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="max-w-3xl mx-auto p-4">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Private><Animals /></Private>} />
          <Route path="/plan/:diagnosisId" element={<Private><Plan /></Private>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}
