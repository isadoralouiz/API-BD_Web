const API_URL = "http://localhost:3000/receitas";

const resultado = document.getElementById("resultado");
const salvarButton = document.getElementById("salvarButton");
const receitaIdInput = document.getElementById("receitaId");
const nomeInput = document.getElementById("nome");
const porcoesInput = document.getElementById("porcoes");
const ingredientesInput = document.getElementById("ingredientes");
const preparoInput = document.getElementById("preparo");

function buscarReceitas() {
  const receitas = localStorage.getItem("receitas");
  return receitas ? JSON.parse(receitas) : [];
}

async function listarReceitas() {
  const receitas = await buscarReceitas();

  if (receitas && receitas.length > 0) {
    resultado.innerHTML = receitas
      .map(
        (receita) => `
      <div class="receita">
        <h3>${receita.nome}</h3>
        <p><strong>Id:</strong> ${receita.id}</p>
        <p><strong>Porções:</strong> ${receita.porcoes}</p>
        <p><strong>Ingredientes:</strong> ${receita.ingredientes.join(", ")}</p>
        <p><strong>Preparo:</strong> ${receita.preparo}</p>
        <button onclick="editarReceita(${receita.id})">Editar</button>
        <button onclick="deletarReceita(${receita.id})">Deletar</button>
      </div>
    `
      )
      .join("");
  } else {
    resultado.textContent = "Nenhuma receita encontrada.";
  }
}

function salvarReceita() {
  const receitas = buscarReceitas();
  const id = receitaIdInput.value;
  const novaReceita = {
    id: receitas.length + 1,
    nome: nomeInput.value,
    porcoes: parseInt(porcoesInput.value),
    ingredientes: ingredientesInput.value.split(",").map(i => i.trim()),
    preparo: preparoInput.value
  };

  if (id) {
    const index = receitas.findIndex(r => r.id === parseInt(id));
    receitas[index] = novaReceita;
  } else {
    receitas.push(novaReceita);
  }

  localStorage.setItem("receitas", JSON.stringify(receitas));
  listarReceitas();
  receitaIdInput.value = "";
  nomeInput.value = "";
  porcoesInput.value = "";
  ingredientesInput.value = "";
  preparoInput.value = "";
}


function editarReceita(id) {
  const receitas = buscarReceitas();
  const r = receitas.find(r => r.id === id);

  if (r) {
    receitaIdInput.value = r.id;
    nomeInput.value = r.nome;
    porcoesInput.value = r.porcoes;
    ingredientesInput.value = r.ingredientes.join(", ");
    preparoInput.value = r.preparo;
  }
}


async function deletarReceita(id) {
  
    let receitas = JSON.parse(localStorage.getItem("receitas") || "[]");
    receitas = receitas.filter(r => r.id !== id);
    localStorage.setItem("receitas", JSON.stringify(receitas));
  
  listarReceitas();
}


salvarButton.addEventListener("click", salvarReceita);
document.addEventListener("DOMContentLoaded", listarReceitas);
window.deletarReceita = deletarReceita;
window.editarReceita = editarReceita;

