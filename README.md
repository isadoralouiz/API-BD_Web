# API usando Node Express

## Configurando o ambiente de uma API

#### 1 - Inciando o projeto e criando o `package.json`
```bash
npm init -y
```

#### 2 - Instalando o Express
```bash
npm i express
```

#### 3 - Instalando o Nodemon
```bash
npm i --save-dev nodemon
```

#### 4 - Incluir em `"scripts"` no `package.json`
```bash
"dev": "nodemon server.js"
```

#### 5 - Incluir em um `.gitignore`
```bash
node_modules/
```

## Para rodar:
```bash
npm run dev
```