const express = require('express');
const router = express.Router();
const db = require('../models/db');
const { v4: uuidv4 } = require('uuid');

// 🐾 Obtener todos los pacientes (con filtro por propietario opcional)
router.get('/', async (req, res) => {
  const { propietario_id } = req.query;

  try {
    const query = propietario_id
      ? 'SELECT * FROM pacientes WHERE propietario_id = ?'
      : 'SELECT * FROM pacientes';

    const [rows] = propietario_id
      ? await db.query(query, [propietario_id])
      : await db.query(query);

    res.status(200).json(rows);
  } catch (err) {
    console.error('❌ Error al obtener pacientes:', err);
    res.status(500).json({ error: 'Error al obtener pacientes' });
  }
});

// 🔍 Obtener un paciente por ID
router.get('/:id', async (req, res) => {
  try {
    let { id } = req.params;
    id = id?.trim();

    if (!id || id.length !== 36) {
      console.warn('⚠️ ID inválido después de limpieza:', id);
      return res.status(400).json({ error: 'ID inválido' });
    }

    console.log('🧩 ID recibido en backend:', id);
    const [rows] = await db.query('SELECT * FROM pacientes WHERE id = ?', [id]);
    console.log('📦 Resultado de la consulta:', rows);

    if (!rows || rows.length === 0) {
      console.warn('⚠️ Paciente no encontrado en la base de datos');
      return res.status(404).json({ error: 'Paciente no encontrado' });
    }

    res.status(200).json(rows[0]);
  } catch (err) {
    console.error('❌ Error al obtener paciente por ID:', err);
    res.status(500).json({ error: 'Error al obtener paciente' });
  }
});

// 🐶 Registrar un nuevo paciente
router.post('/', async (req, res) => {
  const { nombre, especie, raza, edad, historial_medico, propietario_id } = req.body;

  if (!nombre || !especie || !raza || !edad || !historial_medico || !propietario_id) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  try {
    const [existe] = await db.query(
      'SELECT id FROM pacientes WHERE nombre = ? AND propietario_id = ?',
      [nombre, propietario_id]
    );

    if (existe.length > 0) {
      return res.status(400).json({ error: 'Ya existe un paciente con ese nombre para este propietario' });
    }
  } catch (err) {
    console.error('❌ Error al verificar duplicado:', err);
    return res.status(500).json({ error: 'Error al verificar duplicado' });
  }

  const id = uuidv4();

  try {
    const query = `
      INSERT INTO pacientes (
        id, nombre, especie, raza, edad, historial_medico, propietario_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    await db.query(query, [
      id, nombre, especie, raza, edad, historial_medico, propietario_id
    ]);

    res.status(201).json({ message: 'Paciente registrado exitosamente', pacienteId: id });
  } catch (err) {
    console.error('❌ Error al registrar paciente:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// 🩺 Actualizar paciente existente
router.put('/:id', async (req, res) => {
  const { nombre, especie, raza, edad, historial_medico, propietario_id } = req.body;
  const { id } = req.params;

  if (!nombre || !especie || !raza || !edad || !historial_medico || !propietario_id) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  try {
    const query = `
      UPDATE pacientes SET
        nombre = ?,
        especie = ?,
        raza = ?,
        edad = ?,
        historial_medico = ?,
        propietario_id = ?,
        fecha_actualizacion = NOW()
      WHERE id = ?
    `;

    const [result] = await db.query(query, [
      nombre, especie, raza, edad, historial_medico, propietario_id, id
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Paciente no encontrado' });
    }

    res.status(200).json({ message: 'Paciente actualizado correctamente' });
  } catch (err) {
    console.error('❌ Error al actualizar paciente:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// 🗑️ Eliminar paciente y condicionalmente su propietario
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [[paciente]] = await db.query('SELECT propietario_id FROM pacientes WHERE id = ?', [id]);

    if (!paciente) {
      return res.status(404).json({ error: 'Paciente no encontrado' });
    }

    const propietarioId = paciente.propietario_id;

    await db.query('DELETE FROM pacientes WHERE id = ?', [id]);

    const [[{ count }]] = await db.query(
      'SELECT COUNT(*) AS count FROM pacientes WHERE propietario_id = ?',
      [propietarioId]
    );

    if (count === 0) {
      await db.query('DELETE FROM propietarios WHERE id = ?', [propietarioId]);
      console.log('🧹 Propietario eliminado porque no tenía más mascotas');
    }

    res.json({ message: 'Paciente eliminado correctamente' });
  } catch (err) {
    console.error('❌ Error al eliminar paciente:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
