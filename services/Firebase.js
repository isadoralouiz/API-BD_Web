import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js"; 

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
const analytics = getAnalytics(app);

async function listarReceitas() {
  try {
    const querySnapshot = await getDocs(collection(db, "receita"));
    querySnapshot.forEach((doc) => {
      console.log(doc.id, "=>", doc.data());
    });
  } catch (error) {
    console.error("Erro ao acessar a coleção:", error);
  }
}

// 6. Executar
listarReceitas();

export const db = getFirestore(app);
