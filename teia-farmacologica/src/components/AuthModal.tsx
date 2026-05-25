import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Importação do gancho de navegação
import { X, User, Lock, Mail } from 'lucide-react';
import { AuthService } from '../services/AuthService';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [erro, setErro] = useState('');

  // 2. Inicialização do navegador
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErro('');

    const formData = new FormData(e.currentTarget);
    const nome = formData.get('nome') as string;
    const email = formData.get('email') as string;
    const senha = formData.get('senha') as string;

    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexEmail.test(email)) {
      setErro('Formato de e-mail inválido. (Ex: operador@teia.com.br)');
      return;
    }

    try {
      if (!isLogin) {
        await AuthService.cadastrar(nome, email, senha);
        await new Promise(resolve => setTimeout(resolve, 150));
        await AuthService.login(email, senha);
      } else {
        await AuthService.login(email, senha);
      }

      // Atualiza a Navbar
      setTimeout(() => {
        window.dispatchEvent(new Event('authChange'));
      }, 50);

      setErro('');
      onClose(); // Fecha o modal

      // 3. O REDIRECIONAMENTO IMEDIATO PARA O LABORATÓRIO
      navigate('/laboratorio');

    } catch (err: any) {
      setErro(err.message);
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.6)',
      backdropFilter: 'blur(4px)',
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      zIndex: 9999
    }}>

      <div className="lab-panel" style={{
        width: '100%', maxWidth: '400px', padding: '2.5rem', position: 'relative',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.3)'
      }}>

        <button onClick={() => { setErro(''); onClose(); }} style={{
          position: 'absolute', top: '15px', right: '15px',
          background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer'
        }}>
          <X size={24} />
        </button>

        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: 'var(--text-main)' }}>
          {isLogin ? 'Acesso ao Laboratório' : 'Credenciamento'}
        </h2>

        {erro && (
          <div style={{ background: '#fee2e2', color: '#ff1744', padding: '12px', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem', textAlign: 'center', border: '1px solid #fca5a5' }}>
            {erro}
          </div>
        )}

        <form style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }} onSubmit={handleSubmit}>

          {!isLogin && (
            <div>
              <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>Nome de Operador</label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: '10px', top: '12px', color: 'var(--lab-blue)' }} />
                <input name="nome" type="text" placeholder="Ex: Ada Lovelace" style={{ width: '100%', padding: '0.8rem 0.8rem 0.8rem 2.5rem', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '6px', background: '#fff' }} required={!isLogin} />
              </div>
            </div>
          )}

          <div>
            <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>E-mail Institucional</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '10px', top: '12px', color: 'var(--lab-blue)' }} />
              <input name="email" type="email" placeholder="operador@teia.com" style={{ width: '100%', padding: '0.8rem 0.8rem 0.8rem 2.5rem', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '6px', background: '#fff' }} required />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>Chave de Segurança (Senha)</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '10px', top: '12px', color: 'var(--lab-blue)' }} />
              <input name="senha" type="password" placeholder="••••••••" style={{ width: '100%', padding: '0.8rem 0.8rem 0.8rem 2.5rem', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '6px', background: '#fff' }} required />
            </div>
          </div>

          <button type="submit" className="btn-lab" style={{ marginTop: '0.5rem', width: '100%' }}>
            {isLogin ? 'Iniciar Sessão' : 'Registrar Operador'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          {isLogin ? 'Não possui credenciais? ' : 'Já é credenciado? '}
          <span
            style={{ color: 'var(--lab-blue)', fontWeight: 600, cursor: 'pointer' }}
            onClick={() => { setIsLogin(!isLogin); setErro(''); }}
          >
            {isLogin ? 'Cadastrar' : 'Entrar'}
          </span>
        </p>

      </div>
    </div>
  );
}