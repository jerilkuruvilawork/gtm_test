import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

// --- UI helpers ---
function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-2xl shadow-sm border border-slate-200 bg-white p-4 ${className}`}>{children}</div>;
}

function Button({ children, onClick, type = "button", className = "" }: { children: React.ReactNode; onClick?: any; type?: "button" | "submit"; className?: string }) {
  return (
    <button type={type} onClick={onClick} className={`px-4 py-2 rounded-xl border bg-slate-900 text-white hover:opacity-90 active:opacity-80 ${className}`}>
      {children}
    </button>
  );
}

// --- Types ---
interface Todo {
  id: string;
  text: string;
  done: boolean;
  createdAt?: number;
}

const SEED_TODOS: Todo[] = [
  { id: "1", text: "Prepare demo slides", done: false, createdAt: Date.now() - 86400000 },
  { id: "2", text: "Record screen capture", done: true, createdAt: Date.now() - 43200000 },
  { id: "3", text: "Share link with team", done: false, createdAt: Date.now() - 3600000 },
];

const LS_KEY = "demo_static_todos_v1";

function useStaticTodos() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    return SEED_TODOS;
  });

  function add(text: string) {
    const t: Todo = { id: crypto.randomUUID(), text, done: false, createdAt: Date.now() };
    setTodos((prev) => {
      const updated = [t, ...prev];
      localStorage.setItem(LS_KEY, JSON.stringify(updated));
      return updated;
    });
  }
  function toggle(id: string) {
    setTodos((prev) => {
      const updated = prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
      localStorage.setItem(LS_KEY, JSON.stringify(updated));
      return updated;
    });
  }
  function remove(id: string) {
    setTodos((prev) => {
      const updated = prev.filter((t) => t.id !== id);
      localStorage.setItem(LS_KEY, JSON.stringify(updated));
      return updated;
    });
  }
  function clearAll() {
    setTodos([]);
    localStorage.removeItem(LS_KEY);
  }

  return { todos, add, toggle, remove, clearAll };
}

export default function App() {
  function Header() {
    return (
      <header className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">React SPA Demo (Static Data)</h1>
            <p className="text-slate-500">No Firebase. No GTM. Ready for GitHub Pages.</p>
          </div>
          <nav className="flex items-center gap-3 text-sm">
            <Link className="underline text-slate-700" to="/">Home</Link>
            <Link className="underline text-slate-700" to="/todos">Todos</Link>
            <Link className="underline text-slate-700" to="/reports">Reports</Link>
            <Link className="underline text-slate-700" to="/about">About</Link>
          </nav>
        </div>
      </header>
    );
  }

  function HomePage() {
    return (
      <main className="max-w-4xl mx-auto p-6 grid gap-6">
        <Card>
          <h2 className="text-lg font-semibold mb-2">Welcome</h2>
          <p className="text-slate-600">This SPA uses static data (localStorage) and multiple routes to demonstrate GitHub Pages deployment.</p>
        </Card>
      </main>
    );
  }

  function TodosPage() {
    const { todos, add, toggle, remove, clearAll } = useStaticTodos();
    const [newTodo, setNewTodo] = useState("");

    function onSubmit(e: React.FormEvent) {
      e.preventDefault();
      const text = newTodo.trim();
      if (!text) return;
      add(text);
      setNewTodo("");
    }

    return (
      <main className="max-w-4xl mx-auto p-6 grid gap-6">
        <Card>
          <form onSubmit={onSubmit} className="flex gap-3">
            <input
              className="flex-1 rounded-xl border p-3 outline-none focus:ring-2 focus:ring-slate-300"
              placeholder="Add a todo"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
            />
            <Button type="submit">Add</Button>
            <Button onClick={clearAll} className="bg-red-600">Clear all</Button>
          </form>
        </Card>
        <Card>
          <h2 className="text-lg font-semibold mb-3">Todos</h2>
          {todos.length === 0 ? (
            <p className="text-slate-500">No todos yet.</p>
          ) : (
            <ul className="space-y-2">
              {todos.map((t) => (
                <li key={t.id} className="flex items-center justify-between gap-3 p-3 rounded-xl border bg-white">
                  <label className="flex items-center gap-3">
                    <input type="checkbox" checked={t.done} onChange={() => toggle(t.id)} />
                    <span className={`${t.done ? "line-through text-slate-400" : ""}`}>{t.text}</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <Button onClick={() => toggle(t.id)} className="bg-slate-700">{t.done ? "Undo" : "Done"}</Button>
                    <Button onClick={() => remove(t.id)} className="bg-red-600">Delete</Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </main>
    );
  }

  function ReportsPage() {
    const [downloaded, setDownloaded] = useState(false);
    return (
      <main className="max-w-4xl mx-auto p-6 grid gap-6">
        <Card>
          <h2 className="text-lg font-semibold mb-2">Reports</h2>
          <p className="text-slate-600">Static placeholder page for demo purposes.</p>
          <Button onClick={() => setDownloaded(true)}>Download weekly report</Button>
          {downloaded && <p className="text-sm text-emerald-700 mt-2">Downloaded!</p>}
        </Card>
      </main>
    );
  }

  function AboutPage() {
    return (
      <main className="max-w-4xl mx-auto p-6 grid gap-6">
        <Card>
          <h2 className="text-lg font-semibold mb-2">About</h2>
          <p className="text-slate-600">This is a static demo app for GitHub Pages deployment.</p>
        </Card>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/todos" element={<TodosPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
        <footer className="max-w-4xl mx-auto p-6 text-center text-slate-400 text-sm">
          Static demo. No external services used.
        </footer>
      </BrowserRouter>
    </div>
  );
}
