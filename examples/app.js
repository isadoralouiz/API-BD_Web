import { obterInfoSistema } from './teste.js';

/*const calc = require('./calculadora') // usando o módulo
const calc2 = require('./calculadora2')

console.log("\n...::: Calculadora :::...\n")
console.log("Soma =", calc.soma(10, 5));
console.log("Multiplicação =", calc.multiplicar(10, 5));
console.log("Subtração =", calc2.subtrair(10, 5));
console.log("Divisão =", calc2.dividir(10, 5), "\n");*/

const info = obterInfoSistema();

console.log("\nInformações do Sistema Operacional:\n")
console.table(info);