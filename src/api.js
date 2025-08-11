const API = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

function authHeader() {
  const t = localStorage.getItem("token");
  return t ? { Authorization: `Bearer ${t}` } : {};
}

async function request(path, { method = "GET", body, auth = true, form = false } = {}) {
  const headers = auth ? { ...authHeader() } : {};
  if (!form && body) headers["Content-Type"] = "application/json";

  const res = await fetch(`${API}${path}`, {
    method,
    headers,
    body: body ? (form ? body : JSON.stringify(body)) : undefined,
  });

  if (!res.ok) {
    const msg = await res.text().catch(() => "");
    throw new Error(`${res.status} ${res.statusText} ${msg}`.trim());
  }
  const ct = res.headers.get("content-type") || "";
  return ct.includes("application/json") ? res.json() : null;
}

// Auth
export async function signup(email, password) {
  return request("/auth/signup", { method: "POST", auth: false, body: { email, password } });
}
export async function login(email, password) {
  const form = new URLSearchParams();
  form.set("username", email);
  form.set("password", password);
  const data = await request("/auth/token", { method: "POST", auth: false, form: true, body: form });
  localStorage.setItem("token", data.access_token);
  return data;
}
export function logout() {
  localStorage.removeItem("token");
}

// Animals
export async function listAnimals() {
  return request("/animals");
}
export async function addAnimal({ name, species }) {
  return request("/animals", { method: "POST", body: { name, species } });
}

// Diagnosis & Plan
export async function runDiagnosis(animalId) {
  return request(`/diagnosis/${animalId}`, { method: "POST" });
}
export async function getPlan(diagnosisId) {
  return request(`/plan/${diagnosisId}`);
}
export async function togglePlanItem(itemId) {
  return request(`/plan/${itemId}/toggle`, { method: "PATCH" });
}

// Progress (optionnel)
export async function addProgress(animalId, note) {
  return request(`/progress/${animalId}`, { method: "POST", body: { note } });
}
export async function listProgress(animalId) {
  return request(`/progress/${animalId}`);
}
