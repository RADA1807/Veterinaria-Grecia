const express = require('express');
const router = express.Router();
const db = require('../models/db');
const { v4: uuidv4 } = require('uuid');

// 🧑‍🌾 Registrar un nuevo propietario
router.post('/', async (req, res) => {
  const { nombre, telefono, correo, direccion } = req.body;

  if (!nombre) {
    return res.status(400).json({ error: 'El nombre del propietario es obligatorio' });
  }

  try {
    if (correo) {
      const [existe] = await db.query(
        'SELECT id FROM propietarios WHERE nombre = ? AND correo = ?',
        [nombre, correo]
      );

      if (existe.length > 0) {
        console.log('ℹ️ Propietario ya existe con ID:', existe[0].id);
        return res.status(200).json({ propietarioId: existe[0].id });
      }
    }

    const id = uuidv4();

    const query = `
      INSERT INTO propietarios (
        id, nombre, telefono, correo, direccion
      ) VALUES (?, ?, ?, ?, ?)
    `;

    await db.query(query, [
      id,
      nombre,
      telefono?.trim() || null,
      correo?.trim() || null,
      direccion?.trim() || null
    ]);

    console.log('✅ Propietario registrado con ID:', id);
    res.status(201).json({ message: 'Propietario registrado exitosamente', propietarioId: id });
  } catch (err) {
    console.error('❌ Error al registrar propietario:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// 🔍 Obtener propietario por ID (con sus mascotas)
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const query = `
      SELECT 
        p.id, p.nombre, p.telefono, p.correo, p.direccion,
        COUNT(pa.id) AS cantidad_pacientes,
        GROUP_CONCAT(pa.nombre SEPARATOR ', ') AS nombres_mascotas
      FROM propietarios p
      LEFT JOIN pacientes pa ON pa.propietario_id = p.id
      WHERE p.id = ?
      GROUP BY p.id
    `;

    const [rows] = await db.query(query, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Propietario no encontrado' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error('❌ Error al obtener propietario:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// 📋 Obtener propietarios con filtros, paginación, cantidad de pacientes y nombres de mascotas
router.get('/', async (req, res) => {
  const { nombre, limit = 10, offset = 0 } = req.query;

  try {
    let query = `
      SELECT 
        p.id, p.nombre, p.telefono, p.correo, p.direccion,
        COUNT(pa.id) AS cantidad_pacientes,
        GROUP_CONCAT(pa.nombre SEPARATOR ', ') AS nombres_mascotas
      FROM propietarios p
      LEFT JOIN pacientes pa ON pa.propietario_id = p.id
    `;
    const params = [];

    if (nombre) {
      query += ' WHERE p.nombre LIKE ?';
      params.push(`%${nombre}%`);
    }

    query += ' GROUP BY p.id ORDER BY p.nombre ASC LIMIT ? OFFSET ?';
    params.push(Number(limit), Number(offset));

    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error('❌ Error al obtener propietarios:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
