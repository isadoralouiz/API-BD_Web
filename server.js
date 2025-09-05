import express from "express";
import dataRoutes from "./routes/router.js";
import cors from "cors";

const servidor = express();
const PORT = process.env.PORT || 3000;

servidor.use(cors());
servidor.use(express.json());
servidor.use(express.urlencoded({ extended: true }));

servidor.use('/receitas', dataRoutes);

servidor.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
