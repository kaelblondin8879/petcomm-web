import { useEffect, useState } from "react";
import { addAnimal, listAnimals, runDiagnosis } from "../api.js";
import { useNavigate } from "react-router-dom";

export default function Animals() {
  const [animals, setAnimals] = useState([]);
  const [name, setName] = useState("");
  const [species, setSpecies] = useState("dog");
  const [err, setErr] = useState("");
  const nav = useNavigate();

  async function refresh() {
    try {
      setErr("");
      const data = await listAnimals();
      setAnimals(data || []);
    } catch (e) { setErr(e.message); }
  }
  useEffect(() => { refresh(); }, []);

  async function onAdd(e) {
    e.preventDefault();
    if (!name) return;
    try {
      await addAnimal({ name, species });
      setName("");
      refresh();
    } catch (e) { setErr(e.message); }
  }

  async function onDiagnose(animalId) {
    try {
      const diag = await runDiagnosis(animalId);
      nav(`/plan/${diag.id}`, { state: { animalId } });
    } catch (e) { setErr(e.message); }
  }

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="font-semibold mb-3">Ajouter un animal</h2>
        {err && <div className="text-red-600 mb-2">{err}</div>}
        <form className="flex gap-2 items-center" onSubmit={onAdd}>
          <input className="input max-w-xs" placeholder="Nom (ex: Rocky)" value={name} onChange={e=>setName(e.target.value)} />
          <select className="input max-w-[160px]" value={species} onChange={e=>setSpecies(e.target.value)}>
            <option value="dog">Chien</option>
            <option value="cat">Chat</option>
            <option value="rabbit">Lapin</option>
          </select>
          <button className="btn">Ajouter</button>
        </form>
      </div>

      <div className="card">
        <h2 className="font-semibold mb-3">Mes animaux</h2>
        <ul className="space-y-2">
          {animals.map(a => (
            <li key={a.id} className="flex items-center justify-between border rounded p-3">
              <div>
                <div className="font-medium">{a.name}</div>
                <div className="text-sm text-gray-600">{a.species}</div>
              </div>
              <button className="btn" onClick={() => onDiagnose(a.id)}>Lancer un diagnostic</button>
            </li>
          ))}
          {animals.length === 0 && <div className="text-gray-500">Aucun animal pour l’instant.</div>}
        </ul>
      </div>
    </div>
  );
}
