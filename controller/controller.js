import movies from "../data/sample.data.js";

export const getAllDados = ((req, res) => {
    console.log("Função getAllDados foi chamada!");
    res.json(movies);
});
