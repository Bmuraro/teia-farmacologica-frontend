import { useState, useEffect, useRef, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pill, Activity, AlertTriangle, TrendingUp, Globe, FileText } from 'lucide-react';
import { AuthService } from '../services/AuthService';

// Componente utilitário para animação de scroll
function RevealOnScroll({ children, delay = 0 }: { children: ReactNode, delay?: number }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal-wrapper ${isVisible ? 'is-visible' : ''}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
interface HomeProps {
  onOpenAuth: () => void;
}

export function Home({ onOpenAuth }: HomeProps) {
  const navigate = useNavigate();

  const handleAcessarLaboratorio = () => {
    const usuarioLogado = AuthService.getUsuarioLogado();
    if (usuarioLogado) {
      navigate('/laboratorio');
    } else {
      onOpenAuth();
    }
  };

  return (
    <div style={{ minHeight: '100vh', overflowX: 'hidden' }}>

      {/* 1. HERO SECTION*/}
      <section style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '85vh', padding: '0 20px' }}>
        <div className="lab-panel" style={{ padding: '4rem 3rem', textAlign: 'center', maxWidth: '700px', width: '100%' }}>
          <div style={{ color: 'var(--lab-blue)', marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
            <Pill size={64} strokeWidth={1.5} />
          </div>

          <h1 style={{ fontSize: '3.5rem', fontWeight: 800, letterSpacing: '-2px', marginBottom: '1rem', color: 'var(--text-main)' }}>
            A <span style={{ color: 'var(--lab-blue)' }}>Teia</span>
          </h1>

          <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '3rem' }}>
            Uma plataforma de inteligência farmacológica que mapeia visualmente as interações entre princípios ativos, prevendo riscos combinatórios e auxiliando na tomada de decisões laboratoriais com precisão algorítmica.
          </p>

          <button className="btn-lab" onClick={handleAcessarLaboratorio}>
            Acessar Laboratório
          </button>
        </div>
      </section>

      {/* 2. O PROBLEMA (POLIFARMÁCIA) */}
      <section style={{ padding: '5rem 20px', backgroundColor: '#f8fafc' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>

          <RevealOnScroll>
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
              <h2 style={{ fontSize: '2.5rem', color: 'var(--text-main)', letterSpacing: '-1px' }}>A Anatomia do Caos</h2>
              <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', maxWidth: '800px', margin: '1rem auto' }}>
                A medicina moderna trata cada doença isoladamente, ignorando o impacto cumulativo de misturar múltiplas substâncias no mesmo organismo — um fenômeno conhecido como <strong>polifarmácia</strong>.
              </p>
            </div>
          </RevealOnScroll>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>

            <RevealOnScroll delay={100}>
              <div className="lab-panel" style={{ padding: '2rem', height: '100%' }}>
                <Activity size={32} color="var(--lab-blue)" style={{ marginBottom: '1rem' }} />
                <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>O Ponto de Ruptura</h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
                  A partir do <strong>quinto medicamento</strong> de uso contínuo, a previsibilidade clínica despenca. O risco de "cascatas de prescrição" — onde o efeito colateral de um remédio é tratado com outro — dispara exponencialmente.
                </p>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={300}>
              <div className="lab-panel" style={{ padding: '2rem', height: '100%' }}>
                <Globe size={32} color="var(--lab-blue)" style={{ marginBottom: '1rem' }} />
                <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Estatísticas Globais</h3>
                <ul style={{ color: 'var(--text-muted)', lineHeight: '1.8', paddingLeft: '1.2rem' }}>
                  <li><strong>EUA:</strong> 44,1% dos idosos estão em polifarmácia (5+ medicamentos).</li>
                  <li><strong>Europa:</strong> 36,2% de prevalência em adultos mais velhos.</li>
                  <li><strong>Brasil (SP):</strong> 32% dos idosos consomem 5+ medicamentos diariamente.</li>
                </ul>
              </div>
            </RevealOnScroll>

          </div>
        </div>
      </section>

      {/* 3. IMPACTO E RISCOS (DADOS) */}
      <section style={{ padding: '6rem 20px', backgroundColor: '#ffffff' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>

          <RevealOnScroll>
            <h2 style={{ fontSize: '2rem', color: 'var(--text-main)', textAlign: 'center', marginBottom: '3rem' }}>
              Impacto Clínico e Hospitalar
            </h2>
          </RevealOnScroll>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>

            <RevealOnScroll delay={100}>
              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', padding: '1.5rem', backgroundColor: '#fee2e2', borderRadius: '12px', borderLeft: '4px solid #ff1744' }}>
                <AlertTriangle size={32} color="#ff1744" />
                <div>
                  <h4 style={{ color: '#991b1b', fontSize: '1.1rem', marginBottom: '0.2rem' }}>Mortalidade no Brasil</h4>
                  <p style={{ color: '#b91c1c', fontSize: '0.95rem' }}>Entre 2009 e 2018, foram registradas <strong>95.231 mortes</strong> causadas diretamente por eventos adversos a medicamentos (~9.500/ano).</p>
                </div>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={200}>
              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', padding: '1.5rem', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <TrendingUp size={32} color="var(--lab-blue)" />
                <div>
                  <h4 style={{ color: 'var(--text-main)', fontSize: '1.1rem', marginBottom: '0.2rem' }}>Risco Ampliado</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Idosos em polifarmácia têm <strong>1,6x mais chances de morrer</strong> e elevam o risco de internações hospitalares entre 32% e 41%.</p>
                </div>
              </div>
            </RevealOnScroll>

          </div>
        </div>
      </section>

      {/* 4. A SOLUÇÃO (A TEIA) */}
      <section style={{ padding: '5rem 20px', backgroundColor: '#0f172a', color: '#ffffff' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <RevealOnScroll>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', color: '#ffffff' }}>Por que a Teia é vital?</h2>
            <p style={{ fontSize: '1.15rem', color: '#cbd5e1', lineHeight: '1.8', marginBottom: '2rem' }}>
              Pacientes hospitalizados com 5+ medicamentos possuem uma prevalência de <strong>80% de interações potenciais</strong> apenas via enzimas hepáticas (CYP450). Sem um motor relacional como a Teia Farmacológica para cruzar dados do OpenFDA em tempo real, prescrições são feitas no escuro, baseadas na eficácia isolada de um ativo.
            </p>
            <button className="btn-lab" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} style={{ backgroundColor: 'var(--lab-blue)', color: '#fff', border: 'none' }}>
              Subir e Testar Plataforma
            </button>
          </RevealOnScroll>
        </div>
      </section>

      {/* 5. FONTES */}
      <section style={{ padding: '3rem 20px', backgroundColor: '#ffffff', borderTop: '1px solid #e2e8f0' }}>
        <RevealOnScroll>
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              <FileText size={18} />
              <span style={{ fontWeight: 600, fontSize: '0.9rem', textTransform: 'uppercase' }}>Fundamentação Científica</span>
            </div>
            <ul style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.6', paddingLeft: '1rem', columns: '1 2', gap: '3rem' }}>
              <li style={{ marginBottom: '0.5rem' }}>Silva, L. T. et al. (2024). Mortality related to adverse drug events in Brazil. <em>Revista de Saúde Pública</em>.</li>
              <li style={{ marginBottom: '0.5rem' }}>Romano-Lieber, N. S. (2018). Polifarmácia em SP: Estudo SABE. <em>Rev. Bras. Epidemiologia</em>.</li>
              <li style={{ marginBottom: '0.5rem' }}>Bonanno, E. G. (2025). Polypharmacy Update (SHARE). <em>Journal of Clinical Medicine</em>.</li>
              <li style={{ marginBottom: '0.5rem' }}>Wang, X. (2023). Trends of polypharmacy in U.S. adults. <em>Global Health Research</em>.</li>
              <li style={{ marginBottom: '0.5rem' }}>Chae, J. (2024). Hospitalization, emergency visits, and death in older adults.</li>
            </ul>
          </div>
        </RevealOnScroll>
      </section>

    </div>
  );
}