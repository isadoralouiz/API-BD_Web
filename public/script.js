import { db } from "./services/Firebase.js";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc
} from "firebase/firestore";

const resultado = document.getElementById("resultado");
const salvarButton = document.getElementById("salvarButton");
const receitaIdInput = document.getElementById("receitaId");
const nomeInput = document.getElementById("nome");
const porcoesInput = document.getElementById("porcoes");
const ingredientesInput = document.getElementById("ingredientes");
const preparoInput = document.getElementById("preparo");

// Buscar receitas no Firestore
async function buscarReceitas() {
  const querySnapshot = await getDocs(collection(db, "receitas"));
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

// Listar receitas na tela
async function listarReceitas() {
  const receitas = await buscarReceitas();

  if (receitas.length > 0) {
    resultado.innerHTML = receitas
      .map(
        (receita) => `
      <div class="receita">
        <h3>${receita.nome}</h3>
        <p><strong>Id:</strong> ${receita.id}</p>
        <p><strong>Porções:</strong> ${receita.porcoes}</p>
        <p><strong>Ingredientes:</strong> ${receita.ingredientes.join(", ")}</p>
        <p><strong>Preparo:</strong> ${receita.preparo}</p>
        <button onclick="editarReceita('${receita.id}')">Editar</button>
        <button onclick="deletarReceita('${receita.id}')">Deletar</button>
      </div>
    `
      )
      .join("");
  } else {
    resultado.textContent = "Nenhuma receita encontrada.";
  }
}

// Salvar (criar ou atualizar) receita no Firestore
async function salvarReceita() {
  const id = receitaIdInput.value;
  const novaReceita = {
    nome: nomeInput.value,
    porcoes: parseInt(porcoesInput.value),
    ingredientes: ingredientesInput.value.split(",").map((i) => i.trim()),
    preparo: preparoInput.value,
  };

  if (id) {
    // Atualizar
    const receitaRef = doc(db, "receitas", id);
    await updateDoc(receitaRef, novaReceita);
  } else {
    // Criar
    await addDoc(collection(db, "receitas"), novaReceita);
  }

  listarReceitas();

  // Limpar formulário
  receitaIdInput.value = "";
  nomeInput.value = "";
  porcoesInput.value = "";
  ingredientesInput.value = "";
  preparoInput.value = "";
}

// Carregar dados para edição
async function editarReceita(id) {
  const receitas = await buscarReceitas();
  const r = receitas.find((r) => r.id === id);

  if (r) {
    receitaIdInput.value = r.id;
    nomeInput.value = r.nome;
    porcoesInput.value = r.porcoes;
    ingredientesInput.value = r.ingredientes.join(", ");
    preparoInput.value = r.preparo;
  }
}

// Deletar receita no Firestore
async function deletarReceita(id) {
  const receitaRef = doc(db, "receitas", id);
  await deleteDoc(receitaRef);
  listarReceitas();
}

salvarButton.addEventListener("click", salvarReceita);
document.addEventListener("DOMContentLoaded", listarReceitas);

// Deixar funções globais pros botões
window.deletarReceita = deletarReceita;
window.editarReceita = editarReceita;
