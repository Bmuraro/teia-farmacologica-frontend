import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Home } from './pages/Home';
import { Sobre } from './pages/Sobre';
import { Laboratorio } from './pages/Laboratorio';
import { AuthModal } from './components/AuthModal';
import { AuthService } from './services/AuthService';
import { Footer } from './components/Footer';

function Navbar({ onOpenAuth }: { onOpenAuth: () => void }) {
  const location = useLocation();
  const [usuario, setUsuario] = useState(AuthService.getUsuarioLogado());

  useEffect(() => {
    setUsuario(AuthService.getUsuarioLogado());
  }, [location.pathname]);

  const handleLogout = () => {
    AuthService.logout();
    setUsuario(null);
  };

  return (
    <header className="lab-panel" style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '1rem 2rem', margin: '1rem',
      borderTop: 'none', borderLeft: 'none', borderRight: 'none',
      borderRadius: '0 0 16px 16px'
    }}>
      <div style={{ fontWeight: 'bold', fontSize: '1.5rem', color: 'var(--lab-blue)', letterSpacing: '2px' }}>
        TEIA_
      </div>

      <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
        <Link to="/" style={{ color: 'var(--text-main)', textDecoration: 'none', fontWeight: 600 }}>Início</Link>
        <Link to="/sobre" style={{ color: 'var(--text-main)', textDecoration: 'none', fontWeight: 600 }}>Sobre o Projeto</Link>

        {/* Acesso condicional à rota do Laboratório */}
        {usuario && (
          <Link to="/laboratorio" style={{ color: 'var(--text-main)', textDecoration: 'none', fontWeight: 600 }}>Laboratório</Link>
        )}

        {/* Área de Autenticação Dinâmica no Topo */}
        {usuario ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: '1px solid #e2e8f0', paddingLeft: '1rem' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Olá, <strong>{usuario.nome}</strong>
            </span>
            <button
              onClick={handleLogout}
              style={{
                background: '#fee2e2', color: '#ff1744',
                border: 'none', padding: '6px 12px', borderRadius: '6px',
                cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem'
              }}
            >
              Sair
            </button>
          </div>
        ) : (
          <button className="btn-lab" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }} onClick={onOpenAuth}>
            Entrar
          </button>
        )}
      </nav>
    </header>
  );
}

function AppRouter() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar onOpenAuth={() => setIsAuthModalOpen(true)} />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />

      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home onOpenAuth={() => setIsAuthModalOpen(true)} />} />          <Route path="/laboratorio" element={<Laboratorio />} />
          <Route path="/sobre" element={<Sobre />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

// O BrowserRouter envolve tudo
function App() {
  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  );
}

export default App;