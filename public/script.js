const firebaseConfig = {
    apiKey: "AIzaSyAvg2lilf_-aHrcJTbxIgNostjK0iYJPMA",
    authDomain: "api-receitas-web.firebaseapp.com",
    projectId: "api-receitas-web",
    storageBucket: "api-receitas-web.firebasestorage.app",
    messagingSenderId: "391956411621",
    appId: "1:391956411621:web:2ae6d83b719aa560da500c",
    measurementId: "G-7HCLKZ21K8"
  };
  
  const app = initializeApp(firebaseConfig);
  const db = firebase.firestore();
  const API_URL = "http://localhost:3000/receitas";

  const resultado = document.getElementById("resultado");
  const salvarButton = document.getElementById("salvarButton");
  const receitaIdInput = document.getElementById("receitaId");
  const nomeInput = document.getElementById("nome");
  const porcoesInput = document.getElementById("porcoes");
  const ingredientesInput = document.getElementById("ingredientes");
  const preparoInput = document.getElementById("preparo");
  
  // --------------------- BUSCAR RECEITAS ---------------------
  
  async function buscarReceitasAPI() {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Erro ao buscar receitas da API");
      const receitas = await response.json();
  
      const receitasComId = receitas.map((r) => ({ ...r, id: "api-" + r.id }));
  
      // Salvar no Firestore apenas se não existir
      for (const receita of receitasComId) {
        const q = query(
          collection(db, "receitas"),
          where("nome", "==", receita.nome)
        );
        const snapshot = await getDocs(q);
        if (snapshot.empty) {
          const { id, ...dados } = receita;
          await addDoc(collection(db, "receitas"), dados);
        }
      }
  
      return receitasComId;
    } catch (error) {
      console.error(error);
      return [];
    }
  }
  
  
  async function buscarReceitasFirestore() {
    const snapshot = await getDocs(collection(db, "receitas"));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
  
  // --------------------- LISTAR RECEITAS ---------------------
  async function listarReceitas() {
    const receitasAPI = await buscarReceitasAPI();
    const receitasFirestore = await buscarReceitasFirestore();
    const receitasLocal = buscarReceitasLocal();
  
    const receitas = [...receitasAPI, ...receitasFirestore, ...receitasLocal];
  
    if (receitas.length > 0) {
      resultado.innerHTML = receitas
        .map(
          (receita) => `
          <div class="receita">
            <h3>${receita.nome}</h3>
            <p><strong>Id:</strong> ${receita.id}</p>
            <p><strong>Porções:</strong> ${receita.porcoes}</p>
            <p><strong>Ingredientes:</strong> ${receita.ingredientes.join(
              ", "
            )}</p>
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
  
  // --------------------- SALVAR RECEITA ---------------------
  
  async function salvarReceita() {
    const id = receitaIdInput.value;
  
    const novaReceita = {
      nome: nomeInput.value,
      porcoes: parseInt(porcoesInput.value),
      ingredientes: ingredientesInput.value.split(",").map((i) => i.trim()),
      preparo: preparoInput.value,
    };
  
    if (id && !id.toString().startsWith("api-")) {
      // Atualizar receita existente no Firestore
      const docRef = doc(db, "receitas", id);
      await updateDoc(docRef, novaReceita);
    } else {
      // Criar nova receita no Firestore
      await addDoc(collection(db, "receitas"), novaReceita);
    }
  
    listarReceitas();
    limparCampos();
  }
  
  // --------------------- EDITAR RECEITA ---------------------
  
  async function editarReceita(id) {
    if (id.toString().startsWith("api-")) {
      const response = await fetch(`${API_URL}/${id.replace("api-", "")}`);
      const receita = await response.json();
      preencherFormulario(receita, "api-" + receita.id);
    } else {
      const docRef = doc(db, "receitas", id);
      const receitaSnap = await getDoc(docRef);
      if (receitaSnap.exists()) {
        preencherFormulario(receitaSnap.data(), receitaSnap.id);
      } else {
        alert("Receita não encontrada no Firestore.");
      }
    }
  }
  
  // --------------------- DELETAR RECEITA ---------------------
  
  async function deletarReceita(id) {
    if (id.toString().startsWith("api-")) {
      await fetch(`${API_URL}/${id.replace("api-", "")}`, { method: "DELETE" });
    } else {
      await deleteDoc(doc(db, "receitas", id));
    }
    listarReceitas();
  }
  // --------------------- LIMPAR CAMPOS ---------------------
  
  function limparCampos() {
    receitaIdInput.value = "";
    nomeInput.value = "";
    porcoesInput.value = "";
    ingredientesInput.value = "";
    preparoInput.value = "";
  }
  
  // --------------------- EVENTOS ---------------------
  
  salvarButton.addEventListener("click", salvarReceita);
  document.addEventListener("DOMContentLoaded", listarReceitas);
  window.deletarReceita = deletarReceita;
  window.editarReceita = editarReceita;