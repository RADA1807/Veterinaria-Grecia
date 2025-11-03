const express = require('express');
const cors = require('cors');
const app = express();
const dotenv = require('dotenv');
const pacientesRoutes = require('./routes/pacientes'); const propietariosRoutes = require('./routes/propietarios');


dotenv.config();

const db = require('./models/db');

const authRoutes = require("./routes/auth");
app.use(cors()); // ✅ Nuevo: habilita CORS
app.use(express.json()); // ✅ Nuevo: permite leer JSON
app.use('/api', authRoutes); // ✅ Nuevo: activa rutas de autenticación
app.use(pacientesRoutes);
app.use(propietariosRoutes);

app.get('/', (req, res) => {
  res.send('✅ API funcionando y conectada a MySQL');
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});