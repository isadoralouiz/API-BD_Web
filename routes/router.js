import { Router } from "express";
import { getAllDados } from "../controllers/controller.js";
import { criarReceita } from "../controllers/controller.js";
import { updateReceita } from "../controllers/controller.js";
import { deleteReceita } from "../controllers/controller.js";

const rota = Router();

//Rota para retornar os dados 
rota.get('/', getAllDados);
rota.post('/', criarReceita);
rota.put('/:id', updateReceita)
rota.delete('/:id', deleteReceita);

export default rota; 