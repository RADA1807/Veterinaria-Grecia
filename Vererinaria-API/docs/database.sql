-- ==========================================================
-- SCRIPT DE INSTALACIÓN: BASE DE DATOS VETERINARIA
-- AUTOR: Robert Andrade
-- FECHA: 12-02-2026
-- ==========================================================

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- --------------------------------------------------------
-- PASO 1: CREACIÓN DE TABLAS (ESTRUCTURA)
-- --------------------------------------------------------

-- Tabla: Propietarios
CREATE TABLE IF NOT EXISTS `propietarios` (
  `id` varchar(36) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `correo` varchar(100) DEFAULT NULL,
  `direccion` text DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: Pacientes
CREATE TABLE IF NOT EXISTS `pacientes` (
  `id` varchar(36) NOT NULL,
  `nombre` varchar(100) DEFAULT NULL,
  `especie` varchar(50) DEFAULT NULL,
  `raza` varchar(50) DEFAULT NULL,
  `edad` int(11) DEFAULT NULL,
  `historial_medico` text DEFAULT NULL,
  `propietario_id` varchar(36) DEFAULT NULL,
  `fecha_creacion` datetime DEFAULT current_timestamp(),
  `fecha_actualizacion` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: Tratamientos
CREATE TABLE IF NOT EXISTS `tratamientos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `paciente_id` char(36) NOT NULL,
  `tipo` varchar(100) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `fecha` date NOT NULL,
  `veterinario` varchar(100) DEFAULT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `paciente_id` (`paciente_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: Usuarios
CREATE TABLE IF NOT EXISTS `usuarios` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `telefono` varchar(20) NOT NULL,
  `password` varchar(255) NOT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_nombre` (`nombre`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- PASO 2: VOLCADO DE DATOS (RECOLECCIÓN)
-- --------------------------------------------------------

INSERT INTO `propietarios` (`id`, `nombre`, `telefono`, `correo`, `direccion`) VALUES
('7580fa0a-cc10-4777-b246-e23a8565ca3e', 'Paola Albujas', '1111111', 'paola@correo.com', 'San Jose');

INSERT INTO `pacientes` (`id`, `nombre`, `especie`, `raza`, `edad`, `historial_medico`, `propietario_id`, `fecha_creacion`, `fecha_actualizacion`) VALUES
('2576e358-dbf0-48ef-99dd-6e423041a249', 'Spirito', 'Ave', 'Loro', 3, 'Ala Izquierda rota', '7580fa0a-cc10-4777-b246-e23a8565ca3e', '2025-11-02 21:53:21', '2025-11-03 08:59:43');

-- --------------------------------------------------------
-- PASO 3: LÓGICA AVANZADA (DISPARADORES Y VISTAS)
-- --------------------------------------------------------

DELIMITER $$

CREATE TRIGGER `validar_email_insert` BEFORE INSERT ON `usuarios` FOR EACH ROW BEGIN
    IF NEW.email NOT REGEXP '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,4}$' THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Formato de email inválido';
    END IF;
    SET NEW.nombre = TRIM(NEW.nombre);
    SET NEW.email = TRIM(LOWER(NEW.email));
END$$

DELIMITER ;

CREATE OR REPLACE VIEW `vista_usuarios` AS 
SELECT `id`, `nombre`, `email`, `telefono`, 
DATE_FORMAT(`fecha_creacion`,'%d/%m/%Y %H:%i') AS `fecha_creacion_formato`
FROM `usuarios` ORDER BY `fecha_creacion` DESC;

-- --------------------------------------------------------
-- PASO 4: RELACIONES (LLAVES FORÁNEAS)
-- --------------------------------------------------------

ALTER TABLE `tratamientos`
  ADD CONSTRAINT `tratamientos_ibfk_1` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`);

COMMIT;