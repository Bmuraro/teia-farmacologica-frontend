import { Link } from 'react-router-dom';
import { Pill, GitBranch, Briefcase, BookOpen, Mail } from 'lucide-react';

export function Footer() {
    const anoAtual = new Date().getFullYear();

    return (
        <footer style={{
            backgroundColor: '#ffffff',
            borderTop: '1px solid rgba(0,0,0,0.05)',
            padding: '4rem 2rem 2rem 2rem',
            marginTop: 'auto'
        }}>
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '3rem',
                marginBottom: '3rem'
            }}>

                {/* Coluna 1: Marca e Identidade */}
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                        <Pill size={24} color="var(--lab-blue)" />
                        <span style={{ fontSize: '1.2rem', fontWeight: 800, letterSpacing: '-1px', color: 'var(--text-main)' }}>
                            Teia <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>Farmacológica</span>
                        </span>
                    </div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                        Plataforma de inteligência de dados e análise combinatória projetada para mitigar riscos de polifarmácia e fornecer suporte algorítmico à decisão clínica.
                    </p>
                </div>

                {/* Coluna 2: Navegação Rápida */}
                <div>
                    <h4 style={{ color: 'var(--text-main)', fontWeight: 600, marginBottom: '1.2rem', fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Plataforma
                    </h4>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                        <li><Link to="/" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }}>Início</Link></li>
                        <li><Link to="/laboratorio" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }}>Ambiente de Laboratório</Link></li>
                        <li><Link to="/sobre" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }}>Documentação e Engenharia</Link></li>
                    </ul>
                </div>

                {/* Coluna 3: Redes e Repositórios */}
                <div>
                    <h4 style={{ color: 'var(--text-main)', fontWeight: 600, marginBottom: '1.2rem', fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Ecossistema & Código
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                        <a href="" target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }}>
                            <GitBranch size={18} />
                            <span>Repositório GitHub</span>
                        </a>

                        <a href="" target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }}>
                            <Briefcase size={18} />
                            <span>Rede Profissional (LinkedIn)</span>
                        </a>

                        <a href="" target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }}>
                            <BookOpen size={18} />
                            <span>Artigos Técnicos (Medium)</span>
                        </a>

                        <a href="" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }}>
                            <Mail size={18} />
                            <span>Fale com a Engenharia</span>
                        </a>

                    </div>
                </div>

            </div>

            {/* Linha de Copyright */}
            <div style={{
                borderTop: '1px solid rgba(0,0,0,0.05)',
                paddingTop: '1.5rem',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem'
            }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    &copy; {anoAtual} Teia Farmacológica. Todos os direitos reservados.
                </span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', opacity: 0.7 }}>
                    Desenvolvido com React, TypeScript e Spring Boot. Os dados apresentados não substituem o julgamento médico profissional.
                </span>
            </div>
        </footer>
    );
}