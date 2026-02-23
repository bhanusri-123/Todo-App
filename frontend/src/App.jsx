import { useState, useEffect, useCallback } from "react";

// ─── Mock API (replace BASE_URL with http://localhost:8080 for real backend) ──
const USE_MOCK = false;
const BASE_URL = "http://localhost:8080/api/todos";

let _mockDb = [
  { id: 1, title: "Setup Spring Boot project", description: "Initialize Maven project with required dependencies", completed: true, createdAt: new Date(Date.now() - 86400000 * 3).toISOString() },
  { id: 2, title: "Design database schema", description: "Define entity models and relationships for the todo app", completed: true, createdAt: new Date(Date.now() - 86400000 * 2).toISOString() },
  { id: 3, title: "Implement REST API", description: "Create controller, service and repository layers with proper validation", completed: false, createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: 4, title: "Build React frontend", description: "Implement UI components with hooks and Axios integration", completed: false, createdAt: new Date(Date.now() - 3600000).toISOString() },
  { id: 5, title: "Write unit tests", description: "Test coverage target: 80% for all service layers", completed: false, createdAt: new Date().toISOString() },
];
let _nextId = 6;
const delay = (ms = 250) => new Promise(r => setTimeout(r, ms));

const mockApi = {
  getAll: async (completed) => { await delay(); return completed != null ? _mockDb.filter(t => t.completed === completed) : [..._mockDb].reverse(); },
  create: async (data) => { await delay(); const t = { id: _nextId++, completed: false, createdAt: new Date().toISOString(), ...data }; _mockDb.push(t); return t; },
  update: async (id, data) => { await delay(); _mockDb = _mockDb.map(t => t.id === id ? { ...t, ...data } : t); return _mockDb.find(t => t.id === id); },
  delete: async (id) => { await delay(); _mockDb = _mockDb.filter(t => t.id !== id); },
};

const realApi = {
  getAll: async (completed) => { const url = completed != null ? `${BASE_URL}?completed=${completed}` : BASE_URL; const r = await fetch(url); return r.json(); },
  create: async (data) => { const r = await fetch(BASE_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }); return r.json(); },
  update: async (id, data) => { const r = await fetch(`${BASE_URL}/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }); return r.json(); },
  delete: async (id) => { await fetch(`${BASE_URL}/${id}`, { method: "DELETE" }); },
};

const api = USE_MOCK ? mockApi : realApi;

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=Cabinet+Grotesk:wght@300;400;500;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --cream: #f5f0e8;
    --warm-white: #faf8f3;
    --sand: #e8dfc8;
    --terra: #c4622d;
    --terra-light: #e07a4a;
    --terra-pale: #f5ddd0;
    --sage: #6b7c5e;
    --sage-light: #8fa07f;
    --charcoal: #2a2420;
    --brown: #6b4c38;
    --muted: #9b8878;
    --border: rgba(107, 76, 56, 0.12);
    --shadow: rgba(42, 36, 32, 0.08);
    --r: 20px;
    --display: 'Playfair Display', Georgia, serif;
    --body: 'Cabinet Grotesk', sans-serif;
  }

  html { scroll-behavior: smooth; }

  body {
    background: var(--cream);
    color: var(--charcoal);
    font-family: var(--body);
    min-height: 100vh;
    background-image:
      radial-gradient(ellipse 80% 50% at 20% 10%, rgba(196,98,45,0.06) 0%, transparent 60%),
      radial-gradient(ellipse 60% 40% at 80% 80%, rgba(107,124,94,0.07) 0%, transparent 55%);
  }

  
  .app { display: grid; grid-template-columns: 300px 1fr; min-height: 100vh; }

  
  .sidebar {
    background: var(--charcoal);
    padding: 48px 32px;
    display: flex; flex-direction: column; gap: 0;
    position: sticky; top: 0; height: 100vh; overflow-y: auto;
  }

  .brand { margin-bottom: 48px; }
  .brand-mark { 
    width: 44px; height: 44px; border-radius: 12px;
    background: var(--terra); display: grid; place-items: center;
    font-family: var(--display); font-size: 22px; color: white;
    font-style: italic; margin-bottom: 20px;
    box-shadow: 0 8px 24px rgba(196,98,45,0.4);
  }
  .brand-name { font-family: var(--display); font-size: 22px; font-weight: 700; color: var(--warm-white); letter-spacing: -0.02em; line-height: 1.1; }
  .brand-tag { font-size: 11px; color: var(--muted); letter-spacing: 0.12em; text-transform: uppercase; margin-top: 4px; }

  .sidebar-section { margin-bottom: 36px; }
  .sidebar-label { font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--muted); margin-bottom: 10px; }

  
  .stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
  .stat-card {
    background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.06);
    border-radius: 12px; padding: 14px; cursor: default;
  }
  .stat-num { font-family: var(--display); font-size: 28px; font-weight: 900; color: var(--warm-white); line-height: 1; }
  .stat-label { font-size: 10px; color: var(--muted); margin-top: 2px; text-transform: uppercase; letter-spacing: 0.08em; }
  .stat-card.accent .stat-num { color: var(--terra-light); }

  
  .ring-wrap { display: flex; align-items: center; gap: 16px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; padding: 16px; }
  .ring-svg { flex-shrink: 0; }
  .ring-track { fill: none; stroke: rgba(255,255,255,0.08); stroke-width: 5; }
  .ring-prog { fill: none; stroke: var(--terra); stroke-width: 5; stroke-linecap: round; transform: rotate(-90deg); transform-origin: 50% 50%; transition: stroke-dashoffset 0.7s cubic-bezier(0.34,1.56,0.64,1); }
  .ring-pct { font-family: var(--display); font-size: 13px; font-weight: 700; fill: var(--warm-white); }
  .ring-info { flex: 1; }
  .ring-title { font-size: 13px; font-weight: 500; color: var(--warm-white); }
  .ring-sub { font-size: 11px; color: var(--muted); margin-top: 2px; }

  
  .nav-items { display: flex; flex-direction: column; gap: 4px; }
  .nav-item {
    display: flex; align-items: center; justify-content: space-between;
    padding: 10px 14px; border-radius: 10px; cursor: pointer;
    font-size: 14px; font-weight: 500; color: rgba(255,255,255,0.55);
    transition: all 0.18s; border: 1px solid transparent;
  }
  .nav-item:hover { background: rgba(255,255,255,0.06); color: var(--warm-white); }
  .nav-item.active { background: var(--terra); color: white; border-color: rgba(224,122,74,0.4); }
  .nav-item.active .nav-count { background: rgba(255,255,255,0.25); color: white; }
  .nav-dot { width: 7px; height: 7px; border-radius: 50%; margin-right: 10px; flex-shrink: 0; }
  .nav-left { display: flex; align-items: center; }
  .nav-count { font-size: 11px; background: rgba(255,255,255,0.08); color: var(--muted); padding: 2px 8px; border-radius: 99px; }

  .sidebar-footer { margin-top: auto; padding-top: 24px; border-top: 1px solid rgba(255,255,255,0.06); }
  .footer-text { font-size: 11px; color: rgba(255,255,255,0.2); line-height: 1.6; }

  
  .main { padding: 48px 52px; overflow-y: auto; }

  
  .main-header { margin-bottom: 36px; }
  .main-greeting { font-size: 13px; color: var(--muted); font-weight: 400; margin-bottom: 6px; }
  .main-title { font-family: var(--display); font-size: clamp(32px, 3vw, 44px); font-weight: 900; color: var(--charcoal); letter-spacing: -0.03em; line-height: 1.1; }
  .main-title em { color: var(--terra); font-style: italic; }
  .main-subtitle { font-size: 14px; color: var(--muted); margin-top: 8px; font-weight: 400; }

  
  .add-card {
    background: white; border: 1.5px solid var(--border);
    border-radius: var(--r); padding: 24px;
    box-shadow: 0 4px 24px var(--shadow);
    margin-bottom: 28px;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .add-card:focus-within {
    border-color: rgba(196,98,45,0.35);
    box-shadow: 0 4px 32px rgba(196,98,45,0.1);
  }
  .add-header { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
  .add-avatar { width: 38px; height: 38px; background: var(--terra-pale); border-radius: 11px; display: grid; place-items: center; color: var(--terra); font-size: 18px; flex-shrink: 0; }
  .add-headline { font-family: var(--display); font-size: 17px; font-weight: 700; color: var(--charcoal); }
  .add-sub { font-size: 12px; color: var(--muted); margin-top: 1px; }
  .add-inputs { display: flex; flex-direction: column; gap: 10px; }
  .inp-wrap { position: relative; }
  .field-inp {
    width: 100%; background: var(--warm-white); border: 1.5px solid var(--border);
    border-radius: 12px; padding: 12px 16px; color: var(--charcoal);
    font-family: var(--body); font-size: 15px; font-weight: 500;
    outline: none; transition: border-color 0.2s;
  }
  .field-inp::placeholder { color: var(--muted); font-weight: 400; }
  .field-inp:focus { border-color: rgba(196,98,45,0.4); background: white; }
  .field-inp.desc { font-size: 13px; font-weight: 400; resize: none; }
  .add-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 14px; }
  .char-count { font-size: 11px; color: var(--muted); }
  .add-btn {
    background: var(--terra); color: white; border: none;
    font-family: var(--body); font-weight: 700; font-size: 14px;
    padding: 10px 24px; border-radius: 12px; cursor: pointer;
    transition: all 0.2s; letter-spacing: 0.01em;
    box-shadow: 0 4px 16px rgba(196,98,45,0.35);
  }
  .add-btn:hover:not(:disabled) { background: var(--terra-light); transform: translateY(-1px); box-shadow: 0 6px 20px rgba(196,98,45,0.45); }
  .add-btn:active { transform: translateY(0); }
  .add-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; box-shadow: none; }

  
  .section-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
  .section-title { font-family: var(--display); font-size: 20px; font-weight: 700; color: var(--charcoal); }
  .section-count { font-size: 12px; color: var(--muted); background: var(--sand); padding: 4px 12px; border-radius: 99px; font-weight: 500; }

  
  .todo-list { display: flex; flex-direction: column; gap: 10px; }

  
  .todo-card {
    background: white; border: 1.5px solid var(--border);
    border-radius: var(--r); padding: 18px 20px;
    display: flex; gap: 14px; align-items: flex-start;
    transition: all 0.22s; cursor: default;
    box-shadow: 0 2px 12px var(--shadow);
    animation: cardIn 0.32s cubic-bezier(0.34, 1.56, 0.64, 1);
    position: relative; overflow: hidden;
  }
  @keyframes cardIn {
    from { opacity: 0; transform: translateY(10px) scale(0.98); }
    to { opacity: 1; transform: none; }
  }
  .todo-card:hover { border-color: rgba(196,98,45,0.25); box-shadow: 0 6px 24px rgba(196,98,45,0.1); transform: translateY(-1px); }
  .todo-card.completed { background: var(--warm-white); opacity: 0.7; }
  .todo-card.removing { animation: cardOut 0.28s forwards; }
  @keyframes cardOut { to { opacity: 0; transform: translateX(20px) scale(0.97); max-height: 0; padding: 0; margin: 0; } }

  
  .todo-card::before {
    content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 4px;
    background: var(--terra-pale); border-radius: 0 3px 3px 0;
    transition: background 0.2s;
  }
  .todo-card:hover::before { background: var(--terra); }
  .todo-card.completed::before { background: var(--sage-light); }

  
  .check-btn {
    width: 24px; height: 24px; border-radius: 50%; border: 2px solid var(--sand);
    background: transparent; cursor: pointer; flex-shrink: 0; margin-top: 1px;
    display: grid; place-items: center; transition: all 0.2s; position: relative;
  }
  .check-btn:hover { border-color: var(--terra); background: var(--terra-pale); }
  .check-btn.done { background: var(--sage); border-color: var(--sage); }
  .check-inner { width: 10px; height: 10px; border-radius: 50%; background: white; opacity: 0; transition: opacity 0.18s; }
  .check-btn.done .check-inner { opacity: 1; }
  .check-btn.done::after { content: '✓'; position: absolute; color: white; font-size: 11px; font-weight: 900; }
  .check-btn.done .check-inner { display: none; }

  
  .todo-body { flex: 1; min-width: 0; }
  .todo-title { font-size: 15px; font-weight: 600; color: var(--charcoal); line-height: 1.35; word-break: break-word; transition: color 0.2s; }
  .todo-card.completed .todo-title { text-decoration: line-through; color: var(--muted); }
  .todo-desc { font-size: 13px; color: var(--muted); margin-top: 4px; line-height: 1.55; word-break: break-word; }
  .todo-footer { display: flex; align-items: center; gap: 8px; margin-top: 10px; flex-wrap: wrap; }
  .todo-date { font-size: 11px; color: var(--muted); }
  .todo-pill {
    font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase;
    font-weight: 600; padding: 2px 9px; border-radius: 99px;
  }
  .pill-done { background: rgba(107,124,94,0.12); color: var(--sage); }
  .pill-active { background: var(--terra-pale); color: var(--terra); }

  
  .edit-field {
    width: 100%; background: var(--warm-white); border: 1.5px solid rgba(196,98,45,0.3);
    border-radius: 10px; padding: 8px 12px; color: var(--charcoal);
    font-family: var(--body); font-size: 14px; font-weight: 500;
    outline: none; transition: border-color 0.2s; display: block;
  }
  .edit-field:focus { border-color: var(--terra); }
  .edit-field.desc { font-size: 13px; font-weight: 400; margin-top: 6px; resize: none; }
  .edit-row { display: flex; gap: 6px; margin-top: 8px; }
  .btn-xs {
    font-family: var(--body); font-size: 12px; font-weight: 600;
    padding: 5px 14px; border-radius: 8px; border: none; cursor: pointer; transition: all 0.15s;
  }
  .btn-save { background: var(--terra); color: white; }
  .btn-save:hover { background: var(--terra-light); }
  .btn-cancel { background: var(--sand); color: var(--charcoal); }
  .btn-cancel:hover { background: var(--border); }

  
  .todo-actions { display: flex; flex-direction: column; gap: 4px; opacity: 0; transition: opacity 0.18s; }
  .todo-card:hover .todo-actions { opacity: 1; }
  .act-btn {
    width: 28px; height: 28px; border-radius: 8px; border: 1.5px solid var(--border);
    background: transparent; cursor: pointer; display: grid; place-items: center;
    font-size: 12px; color: var(--muted); transition: all 0.15s;
  }
  .act-btn:hover { background: var(--warm-white); color: var(--charcoal); border-color: var(--sand); }
  .act-btn.del:hover { background: #fff0f0; color: #d64040; border-color: rgba(214,64,64,0.25); }

  
  .empty { text-align: center; padding: 72px 24px; }
  .empty-illustration { font-size: 56px; margin-bottom: 16px; animation: float 3s ease-in-out infinite; }
  @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
  .empty-title { font-family: var(--display); font-size: 22px; font-weight: 700; color: var(--charcoal); margin-bottom: 6px; }
  .empty-sub { font-size: 14px; color: var(--muted); }

  
  .loading { display: flex; align-items: center; justify-content: center; padding: 60px; gap: 8px; }
  .dot { width: 8px; height: 8px; border-radius: 50%; background: var(--terra); animation: bounce 1.2s infinite; }
  .dot:nth-child(2) { animation-delay: 0.15s; background: var(--muted); }
  .dot:nth-child(3) { animation-delay: 0.3s; background: var(--sage); }
  @keyframes bounce { 0%,80%,100% { transform: scale(0.6); opacity: 0.4; } 40% { transform: scale(1); opacity: 1; } }


  .toast-wrap { position: fixed; bottom: 28px; right: 28px; display: flex; flex-direction: column; gap: 8px; z-index: 999; }
  .toast { background: var(--charcoal); color: var(--warm-white); padding: 12px 18px; border-radius: 12px; font-size: 13px; font-weight: 500; box-shadow: 0 8px 32px rgba(0,0,0,0.25); animation: toastIn 0.3s cubic-bezier(0.34,1.56,0.64,1); display: flex; align-items: center; gap: 8px; }
  .toast.success { border-left: 3px solid var(--sage); }
  .toast.error { border-left: 3px solid #d64040; }
  @keyframes toastIn { from { opacity:0; transform: translateY(12px) scale(0.96); } to { opacity:1; transform: none; } }

  
  @media (max-width: 900px) {
    .app { grid-template-columns: 1fr; }
    .sidebar { position: relative; height: auto; flex-direction: row; flex-wrap: wrap; padding: 24px; gap: 16px; }
    .main { padding: 28px 20px; }
    .stats-grid { grid-template-columns: repeat(4, 1fr); }
    .brand { margin-bottom: 0; }
  }
`;


const fmtDate = (iso) => new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
const RADIUS = 30;
const CIRC = 2 * Math.PI * RADIUS;


let _toastId = 0;
function useToast() {
  const [toasts, setToasts] = useState([]);
  const push = useCallback((msg, type = "success") => {
    const id = ++_toastId;
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 2800);
  }, []);
  return { toasts, push };
}


function ProgressRing({ pct }) {
  const offset = CIRC - (pct / 100) * CIRC;
  return (
    <div className="ring-wrap">
      <svg className="ring-svg" width="64" height="64" viewBox="0 0 80 80">
        <circle className="ring-track" cx="40" cy="40" r={RADIUS} />
        <circle className="ring-prog" cx="40" cy="40" r={RADIUS} strokeDasharray={CIRC} strokeDashoffset={offset} />
        <text className="ring-pct" x="40" y="45" textAnchor="middle" fontSize="14" fontWeight="700" fill="white">{pct}%</text>
      </svg>
      <div className="ring-info">
        <div className="ring-title">Completion</div>
        <div className="ring-sub">Keep going! 🌱</div>
      </div>
    </div>
  );
}

function TodoCard({ todo, onToggle, onDelete, onUpdate, toast }) {
  const [editing, setEditing] = useState(false);
  const [eTitle, setETitle] = useState(todo.title);
  const [eDesc, setEDesc] = useState(todo.description || "");
  const [removing, setRemoving] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleDelete = () => {
    setRemoving(true);
    setTimeout(() => onDelete(todo.id), 280);
  };

  const handleSave = async () => {
    if (!eTitle.trim()) return;
    setSaving(true);
    await onUpdate(todo.id, { title: eTitle.trim(), description: eDesc.trim() });
    setSaving(false);
    setEditing(false);
    toast("Task updated ✓");
  };

  const cancelEdit = () => {
    setEditing(false);
    setETitle(todo.title);
    setEDesc(todo.description || "");
  };

  const onKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSave(); }
    if (e.key === "Escape") cancelEdit();
  };

  return (
    <div className={`todo-card ${todo.completed ? "completed" : ""} ${removing ? "removing" : ""}`}>
      <button
        className={`check-btn ${todo.completed ? "done" : ""}`}
        onClick={() => onToggle(todo.id, !todo.completed)}
        title="Toggle complete"
      />
      <div className="todo-body">
        {editing ? (
          <>
            <input className="edit-field" value={eTitle} onChange={e => setETitle(e.target.value)} onKeyDown={onKey} autoFocus />
            <input className="edit-field desc" value={eDesc} onChange={e => setEDesc(e.target.value)} onKeyDown={onKey} placeholder="Description…" />
            <div className="edit-row">
              <button className="btn-xs btn-save" onClick={handleSave} disabled={saving || !eTitle.trim()}>{saving ? "…" : "Save"}</button>
              <button className="btn-xs btn-cancel" onClick={cancelEdit}>Cancel</button>
            </div>
          </>
        ) : (
          <>
            <div className="todo-title">{todo.title}</div>
            {todo.description && <div className="todo-desc">{todo.description}</div>}
            <div className="todo-footer">
              <span className="todo-date">{fmtDate(todo.createdAt)}</span>
              <span className={`todo-pill ${todo.completed ? "pill-done" : "pill-active"}`}>
                {todo.completed ? "✓ Done" : "Active"}
              </span>
            </div>
          </>
        )}
      </div>
      {!editing && (
        <div className="todo-actions">
          <button className="act-btn" title="Edit" onClick={() => setEditing(true)}>✎</button>
          <button className="act-btn del" title="Delete" onClick={handleDelete}>✕</button>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const { toasts, push } = useToast();

  const totalAll = todos.length;
  const doneCount = todos.filter(t => t.completed).length;
  const activeCount = todos.filter(t => !t.completed).length;

  const totalForStats = USE_MOCK ? _mockDb.length : todos.length;
  const doneForStats = USE_MOCK ? _mockDb.filter(t => t.completed).length : doneCount;
  const pct = totalForStats ? Math.round((doneForStats / totalForStats) * 100) : 0;

  const loadTodos = useCallback(async (f = filter) => {
    const completed = f === "active" ? false : f === "done" ? true : null;
    const data = await api.getAll(completed);
    setTodos(data);
    setLoading(false);
  }, [filter]);

  useEffect(() => { setLoading(true); loadTodos(filter); }, [filter]);

  const handleAdd = async () => {
    if (!newTitle.trim()) return;
    setAdding(true);
    try {
      await api.create({ title: newTitle.trim(), description: newDesc.trim() || undefined });
      setNewTitle(""); setNewDesc("");
      push("Task added! 🌿");
      await loadTodos();
    } catch { push("Failed to add task", "error"); }
    finally { setAdding(false); }
  };

  const handleToggle = async (id, completed) => {
    await api.update(id, { completed });
    push(completed ? "Marked as done 🎉" : "Marked as active");
    await loadTodos();
  };

  const handleDelete = async (id) => {
    await api.delete(id);
    push("Task deleted");
    await loadTodos();
  };

  const handleUpdate = async (id, data) => {
    await api.update(id, data);
    await loadTodos();
  };

  const navItems = [
    { key: "all", label: "All Tasks", dot: "#c4622d", count: totalAll },
    { key: "active", label: "In Progress", dot: "#6b7c5e", count: activeCount },
    { key: "done", label: "Completed", dot: "#c8b89a", count: doneCount },
  ];

  const emptyMessages = {
    all: { icon: "🌱", title: "Fresh start!", sub: "Add your first task above to get going." },
    active: { icon: "✨", title: "All caught up!", sub: "No active tasks — you're on top of it." },
    done: { icon: "🏆", title: "Nothing completed yet", sub: "Finish a task and it'll appear here." },
  };

  return (
    <>
      <style>{styles}</style>

      <div className="app">
        {/* ── Sidebar ── */}
        <aside className="sidebar">
          <div className="brand">
            <div className="brand-mark">t</div>
            <div className="brand-name">Taskery</div>
            <div className="brand-tag">Personal Task Manager</div>
          </div>

          <div className="sidebar-section">
            <div className="sidebar-label">Overview</div>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-num">{USE_MOCK ? _mockDb.length : todos.length}</div>
                <div className="stat-label">Total</div>
              </div>
              <div className="stat-card accent">
                <div className="stat-num">{USE_MOCK ? _mockDb.filter(t=>!t.completed).length : activeCount}</div>
                <div className="stat-label">Active</div>
              </div>
              <div className="stat-card" style={{gridColumn:"1/-1"}}>
                <ProgressRing pct={pct} />
              </div>
            </div>
          </div>

          <div className="sidebar-section">
            <div className="sidebar-label">Filter</div>
            <div className="nav-items">
              {navItems.map(n => (
                <div key={n.key} className={`nav-item ${filter === n.key ? "active" : ""}`} onClick={() => setFilter(n.key)}>
                  <div className="nav-left">
                    <div className="nav-dot" style={{ background: n.dot }} />
                    {n.label}
                  </div>
                  <span className="nav-count">{n.count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="sidebar-footer">
            <div className="footer-text">Built with Spring Boot + React<br />In-memory H2 Database</div>
          </div>
        </aside>

        {/* ── Main ── */}
        <main className="main">
          <div className="main-header">
            <div className="main-greeting">Good day 👋</div>
            <h1 className="main-title">Your <em>tasks,</em><br />organized.</h1>
            <p className="main-subtitle">{new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</p>
          </div>

          {/* Add form */}
          <div className="add-card">
            <div className="add-header">
              <div className="add-avatar">✦</div>
              <div>
                <div className="add-headline">New Task</div>
                <div className="add-sub">What needs to get done?</div>
              </div>
            </div>
            <div className="add-inputs">
              <input
                className="field-inp"
                placeholder="Task title (required)…"
                value={newTitle}
                maxLength={255}
                onChange={e => setNewTitle(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleAdd()}
              />
              <input
                className="field-inp desc"
                placeholder="Add description (optional)…"
                value={newDesc}
                onChange={e => setNewDesc(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleAdd()}
              />
            </div>
            <div className="add-footer">
              <span className="char-count">{newTitle.length}/255</span>
              <button className="add-btn" onClick={handleAdd} disabled={!newTitle.trim() || adding}>
                {adding ? "Adding…" : "+ Add Task"}
              </button>
            </div>
          </div>

          {/* Task list */}
          <div className="section-row">
            <div className="section-title">
              {filter === "all" ? "All Tasks" : filter === "active" ? "In Progress" : "Completed"}
            </div>
            <div className="section-count">{todos.length} item{todos.length !== 1 ? "s" : ""}</div>
          </div>

          {loading ? (
            <div className="loading">
              <div className="dot" /><div className="dot" /><div className="dot" />
            </div>
          ) : todos.length === 0 ? (
            <div className="empty">
              <div className="empty-illustration">{emptyMessages[filter].icon}</div>
              <div className="empty-title">{emptyMessages[filter].title}</div>
              <div className="empty-sub">{emptyMessages[filter].sub}</div>
            </div>
          ) : (
            <div className="todo-list">
              {todos.map(t => (
                <TodoCard
                  key={t.id}
                  todo={t}
                  onToggle={handleToggle}
                  onDelete={handleDelete}
                  onUpdate={handleUpdate}
                  toast={push}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Toast notifications */}
      <div className="toast-wrap">
        {toasts.map(t => (
          <div key={t.id} className={`toast ${t.type}`}>{t.msg}</div>
        ))}
      </div>
    </>
  );
}
