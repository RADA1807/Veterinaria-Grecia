const express = require('express');
const router = express.Router();
const db = require('../models/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// 📥 Ruta para registrar usuarios
router.post('/register', async (req, res) => {
  console.log('📥 Datos recibidos en /register:', req.body);

  const { nombre, email, telefono, password } = req.body;

  if (!nombre || !email || !telefono || !password) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = `
      INSERT INTO usuarios (nombre, email, telefono, password, fecha_creacion, fecha_actualizacion)
      VALUES (?, ?, ?, ?, NOW(), NOW())
    `;

    const [result] = await db.query(query, [nombre, email, telefono, hashedPassword]);
    console.log('✅ Resultado del INSERT:', result);
    res.status(200).json({ message: 'Usuario registrado exitosamente' });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      console.warn('⚠️ Correo duplicado detectado:', email);
      return res.status(409).json({ error: 'El correo ya está registrado' });
    }

    console.error('❌ Error interno en /register:', error);
    res.status(500).json({ error: 'Error interno del servidor' });

  }
});

// 🔐 Ruta para login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña son obligatorios' });
  }

  try {
    const [results] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);

    if (results.length === 0) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }

    const user = results[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

   res.status(200).json({
  message: 'Login exitoso',
  token,
  nombre: user.nombre,
  email: user.email,
  telefono: user.telefono
});
  } catch (err) {
    console.error('❌ Error en login:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// ✏️ Ruta protegida para actualizar nombre, teléfono y correo
router.put('/update', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const currentEmail = decoded.email;

    const { nombre, email, telefono } = req.body;

    if (!nombre || !email || !telefono) {
      return res.status(400).json({ error: 'Nombre, teléfono y email son obligatorios' });
    }

    console.log('📦 Datos recibidos:', { nombre, email, telefono, currentEmail });

    const [result] = await db.query(
      `UPDATE usuarios SET nombre = ?, email = ?, telefono = ?, fecha_actualizacion = CURRENT_TIMESTAMP WHERE email = ?`,
      [nombre, email, telefono, currentEmail]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.status(200).json({
      message: 'Usuario actualizado exitosamente',
      nombre,
      email,
      telefono
    });
  } catch (err) {
    console.error('❌ Error al actualizar usuario:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});
// ✅ Ruta para eliminar usuario por email 
const verificarToken = require('../middlewares/verifytoken');

router.delete('/delete', verificarToken, async (req, res) => {
  const { email } = req.body;

  // Validación básica
  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'El campo email es obligatorio y debe ser válido' });
  }

  try {
    // Eliminar usuario por email
    const [result] = await db.query(
      'DELETE FROM usuarios WHERE email = ?',
      [email]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // ✅ Limpieza de cookies si usás sesiones
    res.clearCookie('token'); // Solo si usás cookies para el token

    // ✅ Eliminación exitosa
    return res.status(200).json({ message: 'Usuario eliminado correctamente' });
  } catch (err) {
    console.error('❌ Error al eliminar usuario:', err);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
});

//✏️ Ruta para logout de usuario
router.post('/logout', verificarToken, (req, res) => {
  // Aquí podrías invalidar el token si usas una lista negra
  res.status(200).json({ message: 'Logout exitoso' });
});
module.exports = router;