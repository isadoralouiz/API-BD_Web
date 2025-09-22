// ---------------- CONFIG FIREBASE ----------------
const firebaseConfig = {
  apiKey: "AIzaSyAvg2lilf_-aHrcJTbxIgNostjK0iYJPMA",
  authDomain: "api-receitas-web.firebaseapp.com",
  projectId: "api-receitas-web",
  storageBucket: "api-receitas-web.appspot.com",
  messagingSenderId: "391956411621",
  appId: "1:391956411621:web:2ae6d83b719aa560da500c",
  measurementId: "G-7HCLKZ21K8"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const API_URL = "http://localhost:3000/receitas";

// ---------------- ELEMENTOS ----------------
const resultado = document.getElementById("resultado");
const salvarButton = document.getElementById("salvarButton");
const receitaIdInput = document.getElementById("receitaId");
const nomeInput = document.getElementById("nome");
const porcoesInput = document.getElementById("porcoes");
const ingredientesInput = document.getElementById("ingredientes");
const preparoInput = document.getElementById("preparo");

// ---------------- FUNÇÕES FIRESTORE ----------------
async function listarReceitas() {
  const snapshot = await db.collection("receitas").get();

  if (snapshot.empty) {
    resultado.innerHTML = "Nenhuma receita encontrada.";
    return;
  }

  resultado.innerHTML = snapshot.docs
    .map((doc) => {
      const receita = doc.data();
      return `
        <div class="receita">
          <h3>${receita.nome}</h3>
          <p><strong>ID:</strong> ${doc.id}</p>
          <p><strong>Porções:</strong> ${receita.porcoes}</p>
          <p><strong>Ingredientes:</strong> ${receita.ingredientes.join(", ")}</p>
          <p><strong>Preparo:</strong> ${receita.preparo}</p>
          <button onclick="editarReceita('${doc.id}')">Editar</button>
          <button onclick="deletarReceita('${doc.id}')">Deletar</button>
        </div>
      `;
    })
    .join("");
}

async function salvarReceita() {
  const id = receitaIdInput.value;

  const novaReceita = {
    nome: nomeInput.value,
    porcoes: parseInt(porcoesInput.value),
    ingredientes: ingredientesInput.value.split(",").map((i) => i.trim()),
    preparo: preparoInput.value,
  };

  if (id) {
    await db.collection("receitas").doc(id).update(novaReceita);
  } else {
    await db.collection("receitas").add(novaReceita);
  }

  limparCampos();
  listarReceitas();
}

async function editarReceita(id) {
  const docSnap = await db.collection("receitas").doc(id).get();
  if (docSnap.exists) {
    const receita = docSnap.data();
    receitaIdInput.value = id;
    nomeInput.value = receita.nome;
    porcoesInput.value = receita.porcoes;
    ingredientesInput.value = receita.ingredientes.join(", ");
    preparoInput.value = receita.preparo;
  }
}

async function deletarReceita(id) {
  await db.collection("receitas").doc(id).delete();
  listarReceitas();
}

// ---------------- INTEGRAÇÃO COM API ----------------
async function buscarReceitasAPIeSalvar() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Erro ao buscar receitas da API");
    const receitas = await response.json();

    for (const receita of receitas) {
      const q = await db.collection("receitas").where("nome", "==", receita.nome).get();
      if (q.empty) {
        await db.collection("receitas").add({
          nome: receita.nome,
          porcoes: receita.porcoes,
          ingredientes: receita.ingredientes,
          preparo: receita.preparo
        });
      }
    }
  } catch (err) {
    console.error("Erro na integração API → Firestore:", err);
  }
}

// ---------------- EXPORTAR / IMPORTAR JSON ----------------
async function exportarReceitasJSON() {
  const snapshot = await db.collection("receitas").get();
  const receitas = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

  const blob = new Blob([JSON.stringify(receitas, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "receitas.json";
  a.click();
  URL.revokeObjectURL(url);
}

async function importarReceitasJSON(event) {
  const file = event.target.files[0];
  if (!file) return;

  const text = await file.text();
  const receitas = JSON.parse(text);

  for (const receita of receitas) {
    const { id, ...dados } = receita;
    await db.collection("receitas").add(dados);
  }

  listarReceitas();
}

// ---------------- AUXILIARES ----------------
function limparCampos() {
  receitaIdInput.value = "";
  nomeInput.value = "";
  porcoesInput.value = "";
  ingredientesInput.value = "";
  preparoInput.value = "";
}

// ---------------- EVENTOS ----------------
salvarButton.addEventListener("click", salvarReceita);

document.addEventListener("DOMContentLoaded", async () => {
  await buscarReceitasAPIeSalvar(); // sincroniza API → Firestore
  listarReceitas();
});

// ---------------- EXPOSE PARA HTML ----------------
window.editarReceita = editarReceita;
window.deletarReceita = deletarReceita;
window.exportarReceitasJSON = exportarReceitasJSON;
window.importarReceitasJSON = importarReceitasJSON;
