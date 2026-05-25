import { useEffect, useRef, useState } from 'react';
import cytoscape from 'cytoscape';
import jsPDF from 'jspdf';
import type { GrafoDTO } from '../types/grafo';
import '../global.scss';

interface GrafoProps {
  dados: GrafoDTO;
}

interface ModalInfo {
  visivel: boolean;
  titulo: string;
  texto: string;
  corAlerta: string;
}

export function GrafoCytoscape({ dados }: GrafoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [cyInstance, setCyInstance] = useState<cytoscape.Core | null>(null);

  const [modal, setModal] = useState<ModalInfo>({
    visivel: false,
    titulo: '',
    texto: '',
    corAlerta: '#ffffff'
  });

  useEffect(() => {
    if (!containerRef.current) return;

    const conexoesExistentes = new Set();
    dados.edges.forEach(edge => {
      conexoesExistentes.add(`${edge.data.source}-${edge.data.target}`);
      conexoesExistentes.add(`${edge.data.target}-${edge.data.source}`);
    });

    const arestasSeguras: any[] = [];
    for (let i = 0; i < dados.nodes.length; i++) {
      for (let j = i + 1; j < dados.nodes.length; j++) {
        const source = String(dados.nodes[i].data.id);
        const target = String(dados.nodes[j].data.id);

        if (!conexoesExistentes.has(`${source}-${target}`)) {
          arestasSeguras.push({
            data: {
              id: `safe-${source}-${target}`,
              source: source,
              target: target,
              severidade: 'SEGURO'
            }
          });
        }
      }
    }

    const cy = cytoscape({
      container: containerRef.current,
      elements: [...dados.nodes, ...dados.edges, ...arestasSeguras],

      style: [
        {
          selector: 'node',
          style: {
            'background-color': '#ffffff',
            'border-width': 2,
            'border-color': '#e0f7fa',
            'label': 'data(label)',
            'color': '#111827',
            'text-valign': 'center',
            'text-halign': 'center',
            'font-size': '11px',
            'font-weight': 'bold',
            'width': '75px',
            'height': '75px',
            'text-wrap': 'wrap',
            'text-max-width': '70px',
            'shape': 'round-rectangle',
            'corner-radius': '8px',
            'z-index': 10
          }
        },
        {
          selector: 'edge',
          style: {
            'width': (edge: any) => edge.data('severidade') === 'SEGURO' ? 2 : 4,

            'line-color': (edge: any) => {
              const severidade = edge.data('severidade');
              if (severidade === 'GRAVE' || severidade === 'CONTRAINDICADO') return '#ff1744';
              if (severidade === 'MODERADA') return '#ff9100';
              if (severidade === 'SEGURO') return '#10b981';
              return '#b0bec5';
            },
            'curve-style': 'straight',

            'label': 'data(severidade)',
            'font-size': '10px',
            'font-weight': 'bold',

            'color': (edge: any) => {
              const severidade = edge.data('severidade');
              if (severidade === 'GRAVE') return '#ff1744';
              if (severidade === 'SEGURO') return '#10b981';
              return '#b0bec5';
            },

            'text-background-color': '#ffffff',
            'text-background-opacity': 0.95,
            'text-background-padding': '4px',
            'text-rotation': 'autorotate',
            'z-index': 1
          }
        }
      ],

      layout: {
        name: 'concentric',
        fit: true,
        padding: 50,
        minNodeSpacing: 130,
        animate: true,
        animationDuration: 500,
        concentric: function (node) {
          return node.degree();
        },
        levelWidth: function (nodes) {
          return 1;
        }
      }
    });

    setCyInstance(cy);

    cy.on('tap', 'edge', async (evt) => {
      const edge = evt.target;
      const source = edge.data('source');
      const target = edge.data('target');
      const severidade = edge.data('severidade');

      if (severidade === 'GRAVE' || severidade === 'CONTRAINDICADO' || severidade === 'MODERADA') {
        try {
          const response = await fetch(`http://localhost:8080/api/medicamentos/detalhe-risco?med1=${source}&med2=${target}`);
          const detalhe = await response.text();

          setModal({
            visivel: true,
            titulo: `Interação ${severidade}`,
            texto: detalhe,
            corAlerta: (severidade === 'GRAVE' || severidade === 'CONTRAINDICADO') ? '#ff1744' : '#ff9100'
          });
        } catch (error) {
          console.error("Erro ao buscar detalhes:", error);
        }
      }
    });

    return () => {
      cy.destroy();
    };

  }, [dados]);

  // ========================================================
  // GERADOR DE LAUDO AVANÇADO ASYNC (ESTRUTURADO EM SEÇÕES)
  // ========================================================
  const exportarLaudoParaPDF = async () => {
    if (!cyInstance) return;

    const doc = new jsPDF('p', 'mm', 'a4');
    const dataAtual = new Date().toLocaleDateString('pt-BR');
    let currentY = 20;

    // Função interna para gerenciar quebra de páginas automaticamente
    const verificarQuebraPagina = (espacoNecessario: number) => {
      if (currentY + espacoNecessario > 270) {
        doc.addPage();
        currentY = 20;
      }
    };

    // 1. CABEÇALHO CORPORATIVO
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(15, 23, 42);
    doc.text("Teia Farmacológica", 15, currentY);

    currentY += 6;
    doc.setFontSize(10);
    doc.setTextColor(0, 173, 181);
    doc.text("HEALTHTECH ANALYTICS PLATFORM", 15, currentY);

    currentY += 8;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(`Data de Emissão: ${dataAtual}`, 15, currentY);

    currentY += 6;
    doc.text("Sistema Operacional: OpenFDA Engine v2.4", 15, currentY);

    currentY += 5;
    doc.setDrawColor(0, 173, 181);
    doc.setLineWidth(0.5);
    doc.line(15, currentY, 195, currentY);

    // 2. SEÇÃO: BANDEJA DE MEDICAMENTOS ANALISADOS
    currentY += 12;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(15, 23, 42);
    doc.text("Bandeja de Medicamentos Analisados", 15, currentY);

    currentY += 8;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(0, 96, 100);

    // Lista os fármacos ativos concatenados
    const listaFarmacos = dados.nodes.map(n => String(n.data.label).toUpperCase()).join("   |   ");
    doc.text(listaFarmacos, 15, currentY);

    // 3. SEÇÃO: MATRIZ DE CRUZAMENTO DE RISCOS (TABELA)
    currentY += 14;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(15, 23, 42);
    doc.text("Matriz de Cruzamento de Riscos", 15, currentY);

    // Cabeçalho da Tabela
    currentY += 8;
    doc.setFillColor(15, 23, 42);
    doc.rect(15, currentY, 180, 8, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.text("FÁRMACO A", 18, currentY + 5.5);
    doc.text("FÁRMACO B", 80, currentY + 5.5);
    doc.text("SEVERIDADE CLÍNICA", 145, currentY + 5.5);
    currentY += 8;

    // População de todas as combinações da matriz (Riscos e Seguros)
    doc.setFont("helvetica", "normal");
    doc.setTextColor(30, 41, 59);

    for (let i = 0; i < dados.nodes.length; i++) {
      for (let j = i + 1; j < dados.nodes.length; j++) {
        verificarQuebraPagina(8);

        const medA = String(dados.nodes[i].data.id);
        const medB = String(dados.nodes[j].data.id);

        // Localiza se essa dupla possui um risco cadastrado nas edges
        const riscoEncontrado = dados.edges.find(e =>
          (e.data.source === medA && e.data.target === medB) ||
          (e.data.source === medB && e.data.target === medA)
        );

        const severidade = riscoEncontrado ? riscoEncontrado.data.severidade : "SEGURO";

        // Renderiza as linhas espaciadas
        doc.text(medA.toUpperCase(), 18, currentY + 5);
        doc.text(medB.toUpperCase(), 80, currentY + 5);

        // Define cor baseada na severidade para o texto da tabela
        if (severidade === "GRAVE" || severidade === "CONTRAINDICADO") doc.setTextColor(255, 23, 68);
        else if (severidade === "MODERADA") doc.setTextColor(255, 145, 0);
        else doc.setTextColor(16, 185, 129);

        doc.setFont("helvetica", "bold");
        doc.text(severidade, 145, currentY + 5);

        doc.setFont("helvetica", "normal");
        doc.setTextColor(30, 41, 59);

        // Linha divisória sutil entre linhas da tabela
        doc.setDrawColor(226, 232, 240);
        doc.setLineWidth(0.2);
        doc.line(15, currentY + 7, 195, currentY + 7);

        currentY += 7;
      }
    }

    // 4. MAPA VISUAL DA TEIA (FOTOGRAFIA DO CANVAS)
    currentY += 10;
    verificarQuebraPagina(95);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(15, 23, 42);
    doc.text("Mapeamento Conectivo da Teia", 15, currentY);

    const imagemGrafoBase64 = cyInstance.png({ bg: '#ffffff', scale: 3, full: true });
    doc.addImage(imagemGrafoBase64, 'PNG', 15, currentY + 5, 180, 85);
    currentY += 95;

    // 5. SEÇÃO: FUNDAMENTAÇÃO CLÍNICA DETALHADA (BUSCA DINÂMICA VIA API NO JAVA)
    currentY += 5;
    verificarQuebraPagina(20);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(15, 23, 42);
    doc.text("Fundamentação Clínica Detalhada (Minerador OpenFDA)", 15, currentY);
    currentY += 8;

    // Buscaremos os detalhes apenas das conexões que de fato possuem riscos (Edges)
    if (dados.edges.length === 0) {
      doc.setFont("helvetica", "italic");
      doc.setFontSize(10);
      doc.setTextColor(100, 116, 139);
      doc.text("Nenhuma inconformidade ou risco severo foi detectado para a bandeja atual.", 15, currentY);
      currentY += 8;
    } else {
      for (const edge of dados.edges) {
        const source = edge.data.source;
        const target = edge.data.target;
        const sev = edge.data.severidade;

        try {
          const response = await fetch(`http://localhost:8080/api/medicamentos/detalhe-risco?med1=${source}&med2=${target}&completo=true`); const textoFundamentacao = await response.text();

          const linhasTextoFormatado = doc.splitTextToSize(textoFundamentacao, 175);
          const alturaBlocoNecessaria = (linhasTextoFormatado.length * 5) + 12;

          verificarQuebraPagina(alturaBlocoNecessaria);

          doc.setDrawColor(sev === "GRAVE" || sev === "CONTRAINDICADO" ? 255 : 255, sev === "GRAVE" || sev === "CONTRAINDICADO" ? 23 : 145, sev === "GRAVE" || sev === "CONTRAINDICADO" ? 68 : 0);
          doc.setLineWidth(1);
          doc.line(15, currentY, 15, currentY + alturaBlocoNecessaria - 4);

          // Título do Bloco de Risco
          doc.setFont("helvetica", "bold");
          doc.setFontSize(10);
          doc.setTextColor(15, 23, 42);
          doc.text(`INTERAÇÃO ${sev}: ${source.toUpperCase()} x ${target.toUpperCase()}`, 18, currentY + 4);

          // Corpo do texto clínico resumido
          doc.setFont("helvetica", "normal");
          doc.setFontSize(9);
          doc.setTextColor(51, 65, 85);
          doc.text(linhasTextoFormatado, 18, currentY + 10);

          currentY += alturaBlocoNecessaria;
        } catch (error) {
          console.error("Erro ao puxar dados clínicos para o PDF:", error);
        }
      }
    }

    // 6. ADICIONA O DISCLAIMER NO RODAPÉ DA ÚLTIMA PÁGINA
    verificarQuebraPagina(25);
    currentY = Math.max(currentY, 260); // Empurra pro final da folha caso sobre espaço
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.line(15, currentY, 195, currentY);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(30, 41, 59);
    doc.text("Aviso de Isenção de Responsabilidade Clínica (Disclaimer)", 15, currentY + 5);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    const disclaimer = "Este relatório é gerado de forma automatizada por meio de algoritmos de Processamento de Linguagem Natural (NLP) que consultam dados estruturados da FDA e realizam tradução dinâmica. Os resultados possuem caráter informativo e de suporte. Nenhuma alteração terapêutica deve ser feita sem a validação do médico responsável.";
    doc.text(disclaimer, 15, currentY + 9, { maxWidth: 180 });

    // Salva o arquivo finalizado
    doc.save(`Laudo_Clinico_Teia_${dataAtual.replace(/\//g, '-')}.pdf`);
  };

  const fecharModal = () => {
    setModal({ ...modal, visivel: false });
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>

      {/* Botão de Exportação Completa */}
      <button
        onClick={exportarLaudoParaPDF}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          zIndex: 50,
          backgroundColor: '#00ADB5',
          color: '#ffffff',
          border: 'none',
          borderRadius: '8px',
          padding: '10px 16px',
          fontWeight: 'bold',
          cursor: 'pointer',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        }}
      >
        📄 Baixar Laudo Clínico Completo
      </button>

      <div ref={containerRef} style={{ width: '100%', height: '100%', backgroundColor: '#ffffff' }} />

      {/* Modal Glassmorphism */}
      {modal.visivel && (
        <div className="glass-overlay" onClick={fecharModal}>
          <div className="glass-modal" onClick={(e) => e.stopPropagation()}>
            <button className="btn-close" onClick={fecharModal}>✖</button>
            <h3 style={{ color: modal.corAlerta }}>{modal.titulo}</h3>
            <p>
              <strong>Fundamentação Clínica (OpenFDA):</strong><br /><br />
              {modal.texto}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}