const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 25060, // Agregamos el puerto por si acaso
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // 🔽 ESTA ES LA PIEZA CLAVE PARA DIGITALOCEAN 🔽
  ssl: {
  ca: fs.readFileSync("ca-certificate.crt")
}

});

// Prueba de conexión mejorada
pool.getConnection((err, connection) => {
  if (err) {
    console.error('❌ Error al conectar a MySQL en DigitalOcean:', err.message);
    return;
  }
  console.log('✅ Conexión a MySQL exitosa en la nube');
  connection.release();
});

module.exports = pool.promise();