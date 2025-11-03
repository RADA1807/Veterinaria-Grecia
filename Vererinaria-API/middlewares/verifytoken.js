const jwt = require("jsonwebtoken");
const db = require("../models/db"); // ✅ Asegúrate de que esta ruta sea correcta

const verificarToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token no proporcionado" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;

    // 🔍 Verifica si el usuario aún existe en la base de datos
    const [results] = await db.query("SELECT * FROM usuarios WHERE email = ?", [email]);

    if (results.length === 0) {
      return res.status(401).json({ message: "Usuario no válido o eliminado" });
    }

    req.usuario = decoded;
    next();
  } catch (error) {
    console.error("❌ Error en verificación de token:", error);
    res.status(403).json({ message: "Token inválido", error });
  }
};

module.exports = verificarToken;