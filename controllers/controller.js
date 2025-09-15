import sampleDados from "../data/sampleDados.js";

export const getAllDados = (req, res) =>{
    console.log("Função getDados foi chamada!")
    res.json(sampleDados);
    
};

export const criarReceita = (req, res) => {
    const { nome, porcoes, ingredientes, preparo } = req.body;

    if (!nome || !porcoes || !ingredientes || !preparo) {
        return res.status(400).json({ error: "Todos os campos são obrigatórios" });
    }

    const novaReceita = {
        id: sampleDados.length + 1, // simples ID incremental
        nome,
        porcoes,
        ingredientes,
        preparo
    };

    sampleDados.push(novaReceita); // adiciona no array

    res.status(201).json(novaReceita);
};

export const updateReceita = (req, res) => {
    const id = parseInt(req.params.id);
    const { nome, porcoes, ingredientes, preparo } = req.body;
  
    const index = sampleDados.findIndex(r => r.id === id);
    if (index === -1) {
      return res.status(404).json({ error: "Receita não encontrada" });
    }
  
    sampleDados[index] = {
      id,
      nome,
      porcoes,
      ingredientes,
      preparo
    };
  
    res.json(sampleDados[index]);
  };

export const deleteReceita = (req, res) => {
  const id = parseInt(req.params.id); // pega o id da URL
  const index = sampleDados.findIndex(r => r.id === id); // encontra o índice da receita

  if (index === -1) {
    return res.status(404).json({ error: "Receita não encontrada" }); // se não achar
  }

  sampleDados.splice(index, 1); // remove a receita do array

  res.json({ message: "Receita deletada com sucesso" });
};
