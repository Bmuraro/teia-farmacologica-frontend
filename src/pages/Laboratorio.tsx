import { useState, useEffect } from 'react';
import { GrafoCytoscape } from '../components/GrafoCytoscape';
import { interacaoService } from '../services/api';
import type { GrafoDTO } from '../types/grafo';
import { Beaker, Plus, Trash2, Activity, Search, Info } from 'lucide-react';

export function Laboratorio() {
  const [selecionados, setSelecionados] = useState<string[]>([]);
  const [termoBusca, setTermoBusca] = useState("");
  const [sugestoes, setSugestoes] = useState<string[]>([]);
  const [buscando, setBuscando] = useState(false);

  const [dadosGrafo, setDadosGrafo] = useState<GrafoDTO | null>(null);
  const [carregandoAnalise, setCarregandoAnalise] = useState(false);


  // Efeito de "Debounce" para a barra de pesquisa
  useEffect(() => {
    if (termoBusca.length < 3) {
      setSugestoes([]);
      return;
    }

    // Aguarda o usuário parar de digitar por 500ms antes de chamar o Java
    const delay = setTimeout(async () => {
      setBuscando(true);
      try {
        const resultados = await interacaoService.buscarMedicamentos(termoBusca);
        setSugestoes(resultados);
      } catch (error) {
        console.error("Erro ao buscar sugestões:", error);
      } finally {
        setBuscando(false);
      }
    }, 500);

    return () => clearTimeout(delay);
  }, [termoBusca]);

  const adicionarNaBandeja = (nome: string) => {
    if (!selecionados.includes(nome)) {
      setSelecionados([...selecionados, nome]);
    }
    setTermoBusca(""); // Limpa o campo
    setSugestoes([]);  // Fecha a lista
  };

  const removerDaBandeja = (nome: string) => {
    setSelecionados(selecionados.filter(n => n !== nome));
  };

  const processarAnalise = async () => {
    if (selecionados.length < 2) return;

    setCarregandoAnalise(true);
    try {
      const resultado = await interacaoService.buscarGrafoDeInteracoes(selecionados);
      setDadosGrafo(resultado);
    } catch (error) {
      console.error("Erro ao processar análise:", error);
      alert("Falha ao comunicar com o servidor Java.");
    } finally {
      setCarregandoAnalise(false);
    }
  };


  return (
    // 1. Layout Principal: Altura calculada para não tocar no Footer e travar o scroll da página
    <div style={{ display: 'flex', gap: '2rem', padding: '0 2rem 2rem 2rem', height: 'calc(100vh - 180px)', minHeight: '650px', position: 'relative' }}>

      {/* PAINEL LATERAL ESQUERDO: Bandeja de Análise */}
      <div className="lab-panel" style={{ width: '380px', padding: '1.5rem 2rem', display: 'flex', flexDirection: 'column', maxHeight: '100%' }}>

        {/* Cabeçalho Fixo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: 'var(--lab-blue)', flexShrink: 0 }}>
          <Beaker size={28} />
          <h2 style={{ color: 'var(--text-main)', fontSize: '1.2rem' }}>Bandeja de Análise</h2>
        </div>

        {/* Card de Informação OpenFDA Fixo */}
        <div style={{
          backgroundColor: '#f0f9ff',
          borderLeft: '4px solid var(--lab-blue)',
          padding: '1rem',
          borderRadius: '0 8px 8px 0',
          marginBottom: '1.5rem',
          flexShrink: 0
        }}>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', color: 'var(--lab-blue)', marginBottom: '0.5rem' }}>
            <Info size={16} />
            <span style={{ fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Padrão OpenFDA</span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.5', margin: 0 }}>
            O banco de dados mostrará o nome do princípio ativo do medicamentos em <strong>inglês</strong>, mas tanto a busca quanto o laudo final conta com uma ferramenta de tradução automática.
            <br /><em>Ex: Não estranhe se adicionar <strong>Paracetamol</strong> e o encontrar como: <strong>acetaminophen</strong>.</em>
          </p>
        </div>

        {/* Barra de Pesquisa Fixa */}
        <div style={{ marginBottom: '1.5rem', position: 'relative', flexShrink: 0 }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600 }}>Buscar Fármaco (Inglês)</label>
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '10px', top: '12px', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Ex: aspirin, ibuprofen..."
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
              style={{ width: '100%', padding: '0.8rem 0.8rem 0.8rem 2.5rem', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.1)', background: '#fff', color: 'var(--text-main)' }}
            />
            {buscando && <Activity size={16} className="lucide-spin" style={{ position: 'absolute', right: '10px', top: '12px', color: 'var(--lab-blue)' }} />}
          </div>

          {/* Lista Suspensa de Sugestões (Flutuante) */}
          {sugestoes.length > 0 && (
            <ul style={{
              position: 'absolute', top: '100%', left: 0, right: 0,
              background: '#fff', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '6px',
              boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', listStyle: 'none', padding: 0, margin: '4px 0 0 0',
              maxHeight: '200px', overflowY: 'auto', zIndex: 50
            }}>
              {sugestoes.map((sugestao, index) => (
                <li
                  key={index}
                  onClick={() => adicionarNaBandeja(sugestao)}
                  style={{ padding: '0.8rem 1rem', borderBottom: '1px solid rgba(0,0,0,0.05)', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{sugestao.toUpperCase()}</span>
                  <Plus size={16} color="var(--lab-blue)" />
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* ÁREA ROLÁVEL: Apenas a lista de selecionados terá scroll */}
        <div style={{ flex: 1, overflowY: 'auto', marginBottom: '1rem', paddingRight: '0.5rem' }}>
          <h3 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Ativos na Amostra ({selecionados.length})</h3>

          {selecionados.length === 0 ? (
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontStyle: 'italic', textAlign: 'center', marginTop: '2rem' }}>
              Nenhum ativo selecionado.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {selecionados.map((nome, index) => (
                <div key={index} className="lab-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.8rem 1rem' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{nome.toUpperCase()}</span>
                  <button onClick={() => removerDaBandeja(nome)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Botão de Disparo Fixo no fundo do painel */}
        <button
          className="btn-lab"
          style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', opacity: selecionados.length < 2 ? 0.5 : 1, flexShrink: 0 }}
          onClick={processarAnalise}
          disabled={selecionados.length < 2 || carregandoAnalise}
        >
          {carregandoAnalise ? <Activity size={20} className="lucide-spin" /> : <Activity size={20} />}
          {carregandoAnalise ? 'Minerando OpenFDA...' : 'Analisar Interações'}
        </button>
      </div>

      {/* VISOR PRINCIPAL DIREITO: Onde a teia é renderizada */}
      <div className="lab-panel" style={{ flex: 1, overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column', maxHeight: '100%' }}>

        {dadosGrafo ? (
          <>
            {/* Barra de Status do Visor */}
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '1rem 1.5rem', borderBottom: '1px solid rgba(0,0,0,0.05)', backgroundColor: '#fafafa', flexShrink: 0
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)', fontSize: '0.9rem', fontWeight: 600 }}>
                <Activity size={16} color="var(--lab-blue)" />
                <span>Microscópio Virtual Ativo</span>
              </div>

            </div>

            {/* Container do Gráfico Cytoscape */}
            <div style={{ flex: 1, position: 'relative' }}>
              <GrafoCytoscape dados={dadosGrafo} />
            </div>
          </>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'var(--text-muted)', flex: 1 }}>
            <Activity size={64} style={{ opacity: 0.2, marginBottom: '1rem' }} />
            <p>O visor do microscópio está inativo.</p>
            <p style={{ fontSize: '0.9rem' }}>Busque fármacos na barra lateral e inicie a mineração.</p>
          </div>
        )}
      </div>

    </div>
  );
}