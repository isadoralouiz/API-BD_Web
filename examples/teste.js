import os from 'os'; // biblioteca nativa do Node, obtém informações de SO

export function obterInfoSistema() {
    return{
        sistema: os.type(),
        plataforma: os.platform(),
        arquitetura: os.arch(),
        homeDir: os.homedir(),
        tempoAtivo: (os.uptime() / 60).toFixed(2) + ' min',
        qntdCPUs: os.cpus().length,
        qntdMemoria: os.totalmem(),
        user: os.userInfo().username
};
}