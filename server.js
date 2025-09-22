import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dataRoutes from './router/router.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); // para processar JSON no corpo das requisições
app.use('/receitas', dataRoutes); // rota da API
app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
    console.log("Servidor rodando em localhost:3000");
});