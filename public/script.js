const firebaseConfig = {
    apiKey: "AIzaSyC7UlbL3ie9pUAtZX25TzGAatqhVV24ftU",
    authDomain: "moviesapi-900ba.firebaseapp.com",
    projectId: "moviesapi-900ba",
    storageBucket: "moviesapi-900ba.firebasestorage.app",
    messagingSenderId: "575521996720",
    appId: "1:575521996720:web:58d3819f9f4e18449b6075",
    measurementId: "G-95GGJQDDH9"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

async function carregarMovies() {
    try {
        const container = document.getElementById('movies');
        container.innerHTML = '';

        const response = await fetch('/api/movies');
        const moviesFromAPI = await response.json();

        const snapshot = await db.collection("movies").get();
        const moviesFirebase = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        const allMovies = [...moviesFromAPI, ...moviesFirebase];

        allMovies.forEach((movie, index) => {
            const div = document.createElement('div');
            div.classList.add('movie-card');
            div.innerHTML = `
                <h2>Filme ${index + 1}</h2>
                <p><strong>Título:</strong> ${movie.titulo}</p>
                <p><strong>Ano:</strong> ${movie.ano}</p>
                <p><strong>Diretor:</strong> ${movie.diretor}</p>
                <p><strong>Nota (Rotten Tomatoes):</strong> ${movie.nota}</p>
                <p><strong>Gênero:</strong> ${movie.genero}</p>
            `;
            container.appendChild(div);
        });

    } catch(error) {
        console.error('Erro ao carregar dados:', error);
        document.getElementById('movies').innerText = 'Erro ao carregar dados da API.';
    }
}
  
carregarMovies();

document.getElementById('button').addEventListener('click', () => {
    const formContainer = document.getElementById('form-container');
    formContainer.innerHTML = `
        <h2>Adicionar Filme</h2>
        <form id="movie-form">
            <input type="text" name="titulo" placeholder="Título" required><br>
            <input type="text" name="ano" placeholder="Ano" required><br>
            <input type="text" name="diretor" placeholder="Diretor" required><br>
            <input type="text" name="nota" placeholder="Nota (Rotten Tomatoes)" required><br>
            <input type="text" name="genero" placeholder="Gênero" required><br>
            <button type="submit">Salvar</button>
        </form>
    `;

    document.getElementById('movie-form').addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const data = {
            titulo: formData.get('titulo'),
            ano: formData.get('ano'),
            diretor: formData.get('diretor'),
            nota: formData.get('nota'),
            genero: formData.get('genero'),
        };

        try {
            await db.collection("movies").add(data);
            alert("Filme adicionado com sucesso!");
            e.target.reset();
            carregarMovies();
            document.getElementById('form-container').innerHTML = '';
        } catch (error) {
            console.error("Erro ao adicionar filme:", error);
            alert("Erro ao salvar no Firebase.");
        }
    });
});