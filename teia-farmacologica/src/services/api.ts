import axios from 'axios';

// Lê a URL da Vercel (quando estiver em produção) ou usa o seu Railway direto
const BASE_URL = import.meta.env.VITE_BASE_URL || 'https://teia-farmacologica-backend-production.up.railway.app';

export const api = axios.create({
    baseURL: BASE_URL
});

export const interacaoService = {
  buscarGrafoDeInteracoes: async (ativosNomes: string[]) => {
    const query = ativosNomes.join(',');
    const response = await fetch(`${BASE_URL}/interacoes?ativosNomes=${query}`);
    if (!response.ok) throw new Error('Falha ao buscar interações');
    return response.json();
  },

  buscarMedicamentos: async (termo: string) => {
    const response = await fetch(`${BASE_URL}/medicamentos/buscar?termo=${termo}`);
    if (!response.ok) throw new Error('Falha ao buscar medicamentos');
    return response.json();
  }
};