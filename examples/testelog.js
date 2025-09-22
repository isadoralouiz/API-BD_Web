import { obterInfoSistema } from '../teste.js';

const info = obterInfoSistema();
const fs = require('fs');

fs.appendFile('log.txt', 'Informações do Sistema Operacional:\n', info, (err) => {
    if (err) throw err;
    console.log('Entrada Salva!');
})