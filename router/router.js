import { Router } from 'express';
import { getAllDados } from '../controller/controller.js';

const rota = Router();

// rota para retornar os dados
rota.get('/', getAllDados);

export default rota;
