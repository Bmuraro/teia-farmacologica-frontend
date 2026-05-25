import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Pill, LogOut } from 'lucide-react';
import { AuthService } from '../services/AuthService';
import { useState, useEffect } from 'react';

interface NavbarProps {
  onOpenAuth: () => void;
}

export function Navbar({ onOpenAuth }: NavbarProps) {
  const navigate = useNavigate();
  const location = useLocation(); // Necessário para saber em qual tela estamos

  // 1. Transformamos o usuário logado em um estado do React
  const [usuarioLogado, setUsuarioLogado] = useState(AuthService.getUsuarioLogado());

  // 2. Criamos o "Ouvinte" de eventos
  useEffect(() => {
    const handleAuthChange = () => {
      setUsuarioLogado(AuthService.getUsuarioLogado());
    };

    // Fica escutando o evento customizado 'authChange'
    window.addEventListener('authChange', handleAuthChange);

    // Limpeza de memória
    return () => window.removeEventListener('authChange', handleAuthChange);
  }, []);

  // 3. O botão de Sair dispara o evento para a barra sumir na hora
  const handleLogout = () => {
    AuthService.logout();
    window.dispatchEvent(new Event('authChange')); // Avisa que deslogou
    navigate('/');
  };

  // Função para estilizar o link ativo
  const navLinkStyle = (path: string) => ({
    textDecoration: 'none',
    fontSize: '0.95rem',
    fontWeight: 600,
    color: location.pathname === path ? 'var(--lab-blue)' : 'var(--text-muted)',
    borderBottom: location.pathname === path ? '2px solid var(--lab-blue)' : '2px solid transparent',
    paddingBottom: '4px',
    transition: 'all 0.2s ease'
  });

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem 2.5rem',
      backgroundColor: '#ffffff',
      borderBottom: '1px solid rgba(0,0,0,0.05)',
      boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
    }}>

      {/* Logo */}
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
        <Pill size={28} color="var(--lab-blue)" />
        <span style={{ fontSize: '1.2rem', fontWeight: 800, letterSpacing: '-1px', color: 'var(--text-main)' }}>
          Teia <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>Farmacológica</span>
        </span>
      </Link>

      {/* Links Centrais */}
      <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
        <Link to="/" style={navLinkStyle('/')}>Início</Link>
        <Link to="/sobre" style={navLinkStyle('/sobre')}>Sobre</Link>

        {/* CORREÇÃO: Usando a variável exata 'usuarioLogado' */}
        {usuarioLogado && (
          <Link to="/laboratorio" style={navLinkStyle('/laboratorio')}>Laboratório</Link>
        )}
      </div>

      {/* Área do Usuário */}
      <div>
        {/* CORREÇÃO: Usando a variável exata 'usuarioLogado' */}
        {usuarioLogado ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Olá, <strong>{usuarioLogado.nome}</strong>
            </span>
            <button
              onClick={handleLogout}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                background: '#fee2e2', color: '#ff1744',
                border: 'none', padding: '6px 12px', borderRadius: '6px',
                cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem'
              }}
            >
              <LogOut size={16} /> Sair
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenAuth}
            className="btn-lab"
            style={{ padding: '0.5rem 1.5rem', fontSize: '0.9rem' }}
          >
            Entrar
          </button>
        )}
      </div>

    </nav>
  );
}