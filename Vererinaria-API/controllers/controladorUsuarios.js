const conexion = require("../models/db");

const deleteUsuario = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email requerido" });
    }

    const [resultado] = await conexion.query(
      "DELETE FROM usuarios WHERE email = ?",
      [email]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.status(200).json({ message: "Usuario eliminado exitosamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar usuario", error });
  }
};

module.exports = {
  deleteUsuario
};