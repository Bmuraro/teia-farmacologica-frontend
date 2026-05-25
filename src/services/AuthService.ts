export const AuthService = {
  // Simula o Cadastro
  cadastrar: (nome: string, email: string, senha: string) => {
    const novoUsuario = { id: Date.now(), nome, email, senha };
    // Salva no "banco de dados" do navegador
    localStorage.setItem(`user_${email}`, JSON.stringify(novoUsuario));
    return novoUsuario;
  },

  // Simula o Login
  login: (email: string, senha: string) => {
    const userString = localStorage.getItem(`user_${email}`);
    if (!userString) throw new Error("Usuário não encontrado.");

    const user = JSON.parse(userString);
    if (user.senha !== senha) throw new Error("Senha incorreta.");

    // Marca a sessão como ativa
    localStorage.setItem('sessao_ativa', JSON.stringify(user));
    return user;
  },

  // Verifica se tem alguém logado agora
  getUsuarioLogado: () => {
    const sessao = localStorage.getItem('sessao_ativa');
    return sessao ? JSON.parse(sessao) : null;
  },

  // Simula o Logout
  logout: () => {
    localStorage.removeItem('sessao_ativa');
  }
};