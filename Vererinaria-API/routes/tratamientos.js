const express = require('express');
const router = express.Router();
const db = require('../models/db'); // conexión a MySQL
const verifyToken = require('../middlewares/verifytoken'); // middleware JWT

// 📥 Crear tratamiento
router.post('/', verifyToken, async (req, res) => {
  const { paciente_id, tipo, descripcion, fecha, veterinario } = req.body;

  if (!paciente_id || !tipo || !fecha) {
    return res.status(400).json({ error: 'Paciente, tipo y fecha son obligatorios' });
  }

  try {
    const [result] = await db.query(
      `INSERT INTO tratamientos (paciente_id, tipo, descripcion, fecha, veterinario)
       VALUES (?, ?, ?, ?, ?)`,
      [paciente_id, tipo, descripcion, fecha, veterinario]
    );

    res.status(201).json({ message: 'Tratamiento registrado exitosamente', id: result.insertId });
  } catch (err) {
    console.error('❌ Error al registrar tratamiento:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// 📋 Obtener todos los tratamientos (con filtro opcional por paciente)
router.get('/', verifyToken, async (req, res) => {
  const { paciente_id } = req.query;

  try {
    const query = paciente_id
      ? 'SELECT * FROM tratamientos WHERE paciente_id = ?'
      : 'SELECT * FROM tratamientos';

    const [rows] = paciente_id
      ? await db.query(query, [paciente_id])
      : await db.query(query);

    res.status(200).json(rows);
  } catch (err) {
    console.error('❌ Error al obtener tratamientos:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// 🔍 Obtener tratamiento por ID
router.get('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query('SELECT * FROM tratamientos WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Tratamiento no encontrado' });
    }

    res.status(200).json(rows[0]);
  } catch (err) {
    console.error('❌ Error al obtener tratamiento:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// ✏️ Actualizar tratamiento
router.put('/:id', verifyToken, async (req, res) => {
  const { tipo, descripcion, fecha, veterinario } = req.body;
  const { id } = req.params;

  if (!tipo || !fecha) {
    return res.status(400).json({ error: 'Tipo y fecha son obligatorios' });
  }

  try {
    const [result] = await db.query(
      `UPDATE tratamientos SET tipo = ?, descripcion = ?, fecha = ?, veterinario = ?, fecha_actualizacion = NOW()
       WHERE id = ?`,
      [tipo, descripcion, fecha, veterinario, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Tratamiento no encontrado' });
    }

    res.status(200).json({ message: 'Tratamiento actualizado correctamente' });
  } catch (err) {
    console.error('❌ Error al actualizar tratamiento:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// 🗑️ Eliminar tratamiento
router.delete('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query('DELETE FROM tratamientos WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Tratamiento no encontrado' });
    }

    res.json({ message: 'Tratamiento eliminado correctamente' });
  } catch (err) {
    console.error('❌ Error al eliminar tratamiento:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
