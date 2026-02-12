// 1. Importar dependencias
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const app = express();
dotenv.config();

// 2. Importar conexión a la base de datos
const db = require('./models/db');

// 3. Importar middleware
const verifyToken = require('./middlewares/verifytoken');

// 4. Importar rutas
const authRoutes = require('./routes/auth');
const pacientesRoutes = require('./routes/pacientes');
const propietariosRoutes = require('./routes/propietarios');
const tratamientosRoutes = require('./routes/tratamientos');

// 5. Middlewares globales
app.use(cors({
  origin: "*", // 👈 habilita tu frontend Next.js
  credentials: true
}));
app.use(express.json());

// 6. Usar rutas con prefijo /api
app.use('/api', authRoutes);                               // rutas de autenticación
app.use('/api/pacientes', verifyToken, pacientesRoutes);   // rutas de pacientes
app.use('/api/propietarios', verifyToken, propietariosRoutes); // rutas de propietarios
app.use('/api/tratamientos', verifyToken, tratamientosRoutes); // rutas de tratamientos

// 7. Ruta base para probar que el servidor funciona
app.get('/', (req, res) => {
  res.json({ message: '✅ API funcionando y conectada a MySQL' });
});

// 8. Ruta de prueba para Vercel
app.get('/api', (req, res) => {
  res.json({ message: '✅ API funcionando en Vercel desde /api' });
});

// 9. Exportar la app (Vercel la usará como handler)
module.exports = app;
