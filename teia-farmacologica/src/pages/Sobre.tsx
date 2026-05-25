import { useState } from 'react';
import { Monitor, Server, Database, Network, Send } from 'lucide-react';

// Importação das imagens locais
import fotoMembro1 from '../assets/Bruno.jpg';
import fotoMembro2 from '../assets/Mikhael.png';
import fotoMembro3 from '../assets/Marcelo.png';

export function Sobre() {
  const [techAtiva, setTechAtiva] = useState<string | null>(null);

  const tecnologias = [
    { id: 'react', nome: 'React & TypeScript', desc: 'Interface de usuário (SPA) construída para navegação fluida sem recarregamentos, com tipagem estática rigorosa para prevenir falhas de integração.', icon: <Monitor size={32} /> },
    { id: 'java', nome: 'Java 21 & Spring Boot', desc: 'Motor de backend rodando a mais recente máquina virtual Java. Responsável por expor a API RESTful e calcular a análise combinatória O(n²).', icon: <Server size={32} /> },
    { id: 'mysql', nome: 'MySQL via Docker', desc: 'Persistência relacional isolada em contêiner. Garante integridade das chaves e atua como cache hiper-rápido para as interações medicamentosas.', icon: <Database size={32} /> },
    { id: 'cytoscape', nome: 'Cytoscape.js', desc: 'Motor físico matemático responsável por calcular a atração e repulsão dos nós, renderizando a rede de grafos interativa no navegador.', icon: <Network size={32} /> }
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>

      {/* 1. O PITCH (Vídeo) */}
      <section style={{ marginBottom: '5rem', textAlign: 'center' }}>
        <h2 style={{ color: 'var(--text-main)', marginBottom: '1.5rem', fontSize: '2rem' }}>O Projeto</h2>
        <div className="lab-panel" style={{ padding: '1rem', maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '8px' }}>
            <iframe
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
              src="https://www.youtube.com/embed/0AmHVjf9gNk?si=21kA3rHAU35g3U5k"
              title="Teia Farmacológica"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </section>

      {/* 2. STACK TECNOLÓGICA */}
      <section style={{ marginBottom: '5rem' }}>
        <h2 style={{ color: 'var(--text-main)', marginBottom: '1.5rem', textAlign: 'center' }}>Tecnologias Utilizadas</h2>

        <div className="lab-panel" style={{ padding: '2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'start' }}>
          {/* Painel Esquerdo: Botões das Tecnologias */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {tecnologias.map((tech) => (
              <div
                key={tech.id}
                className="lab-card"
                onMouseEnter={() => setTechAtiva(tech.id)}
                onMouseLeave={() => setTechAtiva(null)}
                style={{
                  padding: '2rem 1rem',
                  textAlign: 'center',
                  cursor: 'crosshair',
                  border: techAtiva === tech.id ? '1px solid var(--lab-blue)' : '',
                  boxShadow: techAtiva === tech.id ? '0 8px 20px rgba(0, 188, 212, 0.15)' : '',
                  transform: techAtiva === tech.id ? 'translateY(-2px)' : ''
                }}
              >
                <div style={{ color: techAtiva === tech.id ? 'var(--lab-blue)' : 'var(--text-muted)' }}>
                  {tech.icon}
                </div>
                <h3 style={{ marginTop: '0.5rem', fontSize: '0.95rem', color: 'var(--text-main)' }}>{tech.nome}</h3>
              </div>
            ))}
          </div>

          {/* Painel Direito: O display de leitura com fundo próprio */}
          <div className="lab-card" style={{ padding: '2rem', minHeight: '220px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            {techAtiva ? (
              <>
                <h3 style={{ color: 'var(--lab-blue)', marginBottom: '1rem', borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '0.5rem' }}>
                  {tecnologias.find(t => t.id === techAtiva)?.nome}
                </h3>
                <p style={{ color: 'var(--text-main)', lineHeight: '1.6' }}>
                  {tecnologias.find(t => t.id === techAtiva)?.desc}
                </p>
              </>
            ) : (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                <Monitor size={48} style={{ margin: '0 auto', marginBottom: '1rem', opacity: 0.3 }} />
                <p>Passe o cursor sobre um módulo para escanear a documentação técnica.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 3. A EQUIPE (Atualizada com o Efeito) */}
      <section style={{ marginBottom: '5rem' }}>
        <h2 style={{ color: 'var(--text-main)', marginBottom: '2rem', textAlign: 'center' }}>Engenharia & Desenvolvimento</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>

          {/* Card Membro 1: Bruno */}
          <div className="lab-card" style={{ padding: '2rem 1.5rem', textAlign: 'center' }}>
            <div
              className="photo-member-effect"
              style={{ backgroundImage: `url(${fotoMembro1})` }}
            />
            <h3 style={{ marginBottom: '0.5rem', color: 'var(--text-main)' }}>Bruno Muraro da Silva</h3>
            <p style={{ color: 'var(--lab-blue)', fontSize: '0.9rem', marginBottom: '1rem', fontWeight: 600 }}>Engenharia de Software (FIAP)</p>
            <p style={{ fontSize: '0.85rem', lineHeight: '1.5', color: 'var(--text-muted)' }}>
              Responsável pela modelagem de dados, arquitetura full-stack, algoritmos de fatiamento de dados no Java e integração do motor lógico.
            </p>
          </div>

          {/* Card Membro 2: Mikhael */}
          <div className="lab-card" style={{ padding: '2rem 1.5rem', textAlign: 'center' }}>
            <div
              className="photo-member-effect"
              style={{ backgroundImage: `url(${fotoMembro2})` }}
            />
            <h3 style={{ marginBottom: '0.5rem', color: 'var(--text-main)' }}>Mikhael Boromelo Duran</h3>
            <p style={{ color: 'var(--lab-blue)', fontSize: '0.9rem', marginBottom: '1rem', fontWeight: 600 }}>Engenharia de Software (FIAP)</p>
            <p style={{ fontSize: '0.85rem', lineHeight: '1.5', color: 'var(--text-muted)' }}>
              Responsável pela validação de dados clínicos, estruturação dos payloads da API e auditoria dos retornos do OpenFDA.
            </p>
          </div>

          {/* Card Membro 3: Marcelo */}
          <div className="lab-card" style={{ padding: '2rem 1.5rem', textAlign: 'center' }}>
            <div
              className="photo-member-effect"
              style={{ backgroundImage: `url(${fotoMembro3})` }}
            />
            <h3 style={{ marginBottom: '0.5rem', color: 'var(--text-main)' }}>Marcelo Checchia Pivello de Toledo</h3>
            <p style={{ color: 'var(--lab-blue)', fontSize: '0.9rem', marginBottom: '1rem', fontWeight: 600 }}>Engenharia de Software (FIAP)</p>
            <p style={{ fontSize: '0.85rem', lineHeight: '1.5', color: 'var(--text-muted)' }}>
              Responsável pela validação de dados clínicos, estruturação dos payloads da API e auditoria dos retornos do OpenFDA.
            </p>
          </div>

        </div>
      </section>

      {/* 4. FALE CONOSCO */}
      <section>
        <h2 style={{ color: 'var(--text-main)', marginBottom: '1.5rem', textAlign: 'center' }}>Transmissão de Dados</h2>

        <form
          className="lab-panel"
          onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const email = formData.get('email') as string;
            const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!regexEmail.test(email)) {
              alert('Falha na validação: O formato do e-mail é inválido. Tente algo como "nome@exemplo.com".');
              return;
            }

            alert('Transmissão inicializada com sucesso! Nossa engenharia entrará em contato.');
            e.currentTarget.reset();
          }}
          style={{ maxWidth: '700px', margin: '0 auto', padding: '3rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
        >

          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>Nome (Operador)</label>
              <input name="nome" type="text" style={{ width: '100%', padding: '0.8rem', background: '#fff', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '6px', color: 'var(--text-main)' }} placeholder="Ex: Ada Lovelace" required />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>E-mail de Contato</label>
              <input name="email" type="email" style={{ width: '100%', padding: '0.8rem', background: '#fff', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '6px', color: 'var(--text-main)' }} placeholder="ada@exemplo.com" required />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>Assunto</label>
            <select name="assunto" style={{ width: '100%', padding: '0.8rem', background: '#fff', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '6px', color: 'var(--text-main)' }} required>
              <option value="">Selecione o canal de roteamento...</option>
              <option value="duvida">Dúvida Técnica</option>
              <option value="parceria">Proposta de Parceria</option>
              <option value="bug">Reportar Anomalia (Bug)</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>Mensagem</label>
            <textarea name="mensagem" rows={5} style={{ width: '100%', padding: '0.8rem', background: '#fff', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '6px', color: 'var(--text-main)', resize: 'vertical' }} placeholder="Insira o log ou mensagem aqui..." required></textarea>
          </div>

          <button type="submit" className="btn-lab" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '1rem' }}>
            <Send size={18} /> Inicializar Transmissão
          </button>
        </form>
      </section>

    </div>
  );
}