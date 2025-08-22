import sampleDados from "../data/sampleDados.js";

const sd = sampleDados;

//função para usar a API
async function buscarDadosPessoais() {
    try {
      const response = await fetch('http://localhost:3000'); //o link da API - que está na LocalHost
      if (!response.ok) {
        throw new Error(`Erro: ${response.status}`);
      }
      const dados = await response.json(); //converte os dados da API em JSON
      return dados; // retorna os dados pessoais
    } catch (error) {
      console.error('Erro ao buscar dados pessoais:', error);
      return null;
    }
  }

  buscarDadosPessoais().then(dados => {
    if (dados) {
      const resultado = document.getElementById('resultado');
      resultado.innerHTML = `
        <p><strong>Nome:</strong> ${dados.nome}</p>
        <p><strong>Idade:</strong> ${dados.idade}</p>
        <p><strong>Profissão:</strong> ${dados.profissao}</p>
  
      `;
    } else {
      resultado.textContent = 'Erro ao carregar os dados.';
    }
  });
  
  