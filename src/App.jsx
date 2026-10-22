import { useAuth } from './context/AuthContext.jsx';
import AuthForm from './components/AuthForm.jsx';

export default function App() {
  const { user, loading, logout } = useAuth();

  if (loading) return <p className="p-8">Cargando...</p>
  if (!user) return <AuthForm />

  return (
    <div className="mx-auto max-w-2xl p-8">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Gestor de Tareas</h1>
        <div className="flex items-center gap-3 text-sm">
          <span>{user.email}</span>
          <button onClick={logout} className="rounded bg-gray-200 px-3 py-1 hover:bg-gray-300">
            Salir
          </button>
        </div>
      </header>
    </div>
  );
}