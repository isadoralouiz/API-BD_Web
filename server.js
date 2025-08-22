import express from "express";
import dataRoutes from "./routes/router.js";

const app = express();
const PORT = process.env.PORT || 3000;

//Middleware para interpretar o JSON
app.use(express.json());

//Rota API
app.use('/', dataRoutes);

app.listen(PORT, () => {
    console.log("Servidor rodando em localHost:3000")
})