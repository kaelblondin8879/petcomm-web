import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { getPlan, togglePlanItem, listProgress, addProgress } from "../api.js";

export default function Plan() {
  const { diagnosisId } = useParams();
  const location = useLocation();
  const animalId = location.state?.animalId;
  const [items, setItems] = useState([]);
  const [progress, setProgress] = useState([]);
  const [note, setNote] = useState("");
  const [err, setErr] = useState("");

  async function refresh() {
    try {
      setErr("");
      const p = await getPlan(diagnosisId);
      setItems(p || []);
      if (animalId) {
        const pr = await listProgress(animalId);
        setProgress(pr || []);
      }
    } catch (e) { setErr(e.message); }
  }
  useEffect(() => { refresh(); }, [diagnosisId]);

  async function onToggle(id) {
    try { await togglePlanItem(id); refresh(); }
    catch (e) { setErr(e.message); }
  }
  async function onAddProgress(e) {
    e.preventDefault();
    if (!animalId || !note) return;
    try { await addProgress(animalId, note); setNote(""); refresh(); }
    catch(e){ setErr(e.message); }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">Plan d’actions</h1>
      {err && <div className="text-red-600">{err}</div>}

      <div className="card">
        <ul className="space-y-2">
          {items.map(it => (
            <li key={it.id} className="flex items-center justify-between">
              <div>
                <div className="font-medium">{it.title}</div>
                {it.description && <div className="text-sm text-gray-600">{it.description}</div>}
              </div>
              <button className={`btn ${it.done ? "bg-gray-500 hover:bg-gray-600" : ""}`} onClick={() => onToggle(it.id)}>
                {it.done ? "Terminé" : "Marquer fait"}
              </button>
            </li>
          ))}
          {items.length === 0 && <div className="text-gray-500">Plan vide.</div>}
        </ul>
      </div>

      {animalId && (
        <div className="card">
          <h2 className="font-semibold mb-3">Suivi des progrès</h2>
          <form className="flex gap-2 items-center mb-3" onSubmit={onAddProgress}>
            <input className="input" placeholder="Note (ex: séance 1 bien passée)" value={note} onChange={e=>setNote(e.target.value)} />
            <button className="btn">Ajouter</button>
          </form>
          <ul className="space-y-2">
            {progress.map(p => (
              <li key={p.id} className="border rounded p-2">
                <div className="text-sm text-gray-600">{new Date(p.created_at).toLocaleString()}</div>
                <div>{p.note}</div>
              </li>
            ))}
            {progress.length === 0 && <div className="text-gray-500">Pas encore de notes.</div>}
          </ul>
        </div>
      )}
    </div>
  );
}
