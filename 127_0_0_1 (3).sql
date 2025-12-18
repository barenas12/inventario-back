-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 30-09-2025 a las 22:18:34
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `inventario`
--
CREATE DATABASE IF NOT EXISTS `inventario` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `inventario`;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cat_implemento`
--

CREATE TABLE `cat_implemento` (
  `id` int(11) NOT NULL,
  `nom_implemento` varchar(100) NOT NULL,
  `categoria` enum('Equipos de Computo','Muebles') NOT NULL,
  `estado` enum('Activo','Inactivo') NOT NULL DEFAULT 'Activo'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `cat_implemento`
--

INSERT INTO `cat_implemento` (`id`, `nom_implemento`, `categoria`, `estado`) VALUES
(1, 'AIO', 'Equipos de Computo', 'Activo'),
(2, 'Aires Acondicionados Grandes', 'Muebles', 'Activo'),
(3, 'Aires Acondicionados Pequeños', 'Muebles', 'Activo'),
(4, 'AP (Access Point)', 'Equipos de Computo', 'Activo'),
(5, 'Archivadores', 'Muebles', 'Activo'),
(6, 'Bahías / Escritorios', 'Muebles', 'Activo'),
(7, 'CPU', 'Equipos de Computo', 'Activo'),
(8, 'Diadema', 'Equipos de Computo', 'Activo'),
(9, 'Disco Duro', 'Equipos de Computo', 'Activo'),
(10, 'Disco Duro Externo', 'Equipos de Computo', 'Activo'),
(11, 'Grecas', 'Muebles', 'Activo'),
(12, 'Impresora', 'Equipos de Computo', 'Activo'),
(13, 'Impresora Multifuncional', 'Equipos de Computo', 'Activo'),
(14, 'Locker', 'Muebles', 'Activo'),
(15, 'Mesas Comedor', 'Muebles', 'Activo'),
(16, 'Monitor', 'Equipos de Computo', 'Activo'),
(17, 'Mouse', 'Equipos de Computo', 'Activo'),
(18, 'Nevera', 'Muebles', 'Activo'),
(19, 'Papeleras Basura', 'Muebles', 'Activo'),
(20, 'Portatil', 'Equipos de Computo', 'Activo'),
(21, 'Rack', 'Equipos de Computo', 'Activo'),
(22, 'Servidor Isabel', 'Equipos de Computo', 'Activo'),
(23, 'Servidor Vicidial', 'Equipos de Computo', 'Activo'),
(24, 'Sillas Comedor', 'Muebles', 'Activo'),
(25, 'Silla Escritorio', 'Muebles', 'Activo'),
(26, 'Switch', 'Equipos de Computo', 'Activo'),
(27, 'Teclado', 'Equipos de Computo', 'Activo'),
(28, 'Telefono Oficina', 'Equipos de Computo', 'Activo'),
(29, 'Televisor', 'Equipos de Computo', 'Activo');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `departamento`
--

CREATE TABLE `departamento` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `estado` enum('Activo','Inactivo') NOT NULL DEFAULT 'Activo'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `departamento`
--

INSERT INTO `departamento` (`id`, `nombre`, `estado`) VALUES
(1, 'Administrativos Arcsas', 'Activo'),
(2, 'Banco W', 'Activo'),
(3, 'Comfenalco', 'Activo'),
(4, 'Coopantex', 'Activo'),
(5, 'Cooperativa Financiera de Antioquia', 'Activo'),
(6, 'Cotrafa', 'Activo'),
(7, 'Credito 365', 'Activo'),
(8, 'Doctor Peso', 'Activo'),
(9, 'Doctor Peso Propia', 'Activo'),
(10, 'Doctor Peso Propia 180', 'Activo'),
(11, 'Doctor Peso 3', 'Activo'),
(12, 'Doctor Peso Propia 4', 'Inactivo'),
(13, 'Doctor Peso Propia 5', 'Inactivo'),
(14, 'Findorse', 'Activo'),
(15, 'FlexFintech', 'Activo'),
(16, 'Fondo de Coberturas Crediticias', 'Activo'),
(17, 'Fondo Regional de Garantias del Tolima', 'Activo'),
(18, 'Grupo Tv Max', 'Activo'),
(19, 'Jamar', 'Activo'),
(20, 'Juancho Te Presta', 'Activo'),
(21, 'Progreser', 'Activo'),
(22, 'Rapicredit', 'Activo'),
(23, 'Rapiflex Preventivo', 'Activo'),
(24, 'Ya Dinero', 'Activo'),
(25, 'Leonisa', 'Activo');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `implemento`
--

CREATE TABLE `implemento` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `categoria` enum('Equipos de Computo','Muebles') NOT NULL,
  `departamento` int(3) NOT NULL,
  `condicion` varchar(100) NOT NULL,
  `pertenencia` varchar(100) NOT NULL,
  `propietario` int(100) NOT NULL,
  `responsable` int(4) NOT NULL,
  `cantidad` int(11) NOT NULL DEFAULT 1,
  `valor` int(11) NOT NULL,
  `fecha` date NOT NULL,
  `descripcion` varchar(100) DEFAULT NULL,
  `sede` enum('Bello','Cali') NOT NULL,
  `estado` enum('Activo','Inactivo') NOT NULL DEFAULT 'Activo'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `implemento`
--

INSERT INTO `implemento` (`id`, `nombre`, `categoria`, `departamento`, `condicion`, `pertenencia`, `propietario`, `responsable`, `cantidad`, `valor`, `fecha`, `descripcion`, `sede`, `estado`) VALUES
(1, 'AP (Access Point)', 'Equipos de Computo', 1, 'Nuevo', 'Propio', 1, 1, 1, 160000, '2025-09-02', 'ML-AB125', 'Bello', 'Activo'),
(1000, 'AIO', 'Equipos de Computo', 1, 'Nuevo', 'Propio', 1, 14, 1, 160000, '2025-09-10', '', 'Cali', 'Activo'),
(1001, 'AIO', 'Equipos de Computo', 1, 'Nuevo', 'Propio', 1, 0, 1, 18000, '2025-09-10', '', '', ''),
(1002, 'Grecas', 'Muebles', 1, 'Nuevo', 'Propio', 1, 4, 1, 16000, '2025-09-12', '', '', ''),
(1003, 'Impresora', 'Equipos de Computo', 2, 'Nuevo', 'Alquiler', 2, 2, 1, 16000, '2025-09-12', '', '', 'Activo'),
(1004, 'Grecas', 'Muebles', 1, 'Nuevo', 'Propio', 1, 10, 1, 10000, '2025-09-12', '', 'Bello', ''),
(1005, 'Nevera', 'Muebles', 1, 'Nuevo', 'Alquiler', 3, 2, 1, 800000, '2025-09-12', '', '', 'Activo'),
(1006, 'AIO', 'Equipos de Computo', 1, 'Nuevo', 'Alquiler', 1, 7, 1, 10000000, '2025-09-12', '', '', ''),
(1007, 'AP (Access Point)', 'Equipos de Computo', 2, 'Nuevo', 'Alquiler', 2, 0, 1, 80000, '2025-09-12', 'ML-123456', 'Cali', 'Inactivo'),
(1008, 'Aires Acondicionados Grandes', 'Muebles', 7, 'Bueno', 'Alquiler', 2, 0, 1, 150000, '2025-09-12', '', '', 'Activo'),
(1009, 'Aires Acondicionados Pequeños', 'Muebles', 1, 'Nuevo', 'Propio', 1, 0, 1, 16000, '2025-09-12', '', '', 'Activo'),
(1010, 'AIO', 'Equipos de Computo', 1, 'Regular', 'Alquiler', 2, 1, 1, 18500, '2025-09-13', '', '', 'Activo'),
(1011, 'Grecas', 'Muebles', 2, 'Nuevo', 'Propio', 2, 0, 1, 19560, '2025-09-13', '', '', ''),
(1012, 'Aires Acondicionados Pequeños', 'Muebles', 19, 'Nuevo', 'Propio', 2, 0, 1, 10000000, '2025-09-13', '', '', 'Activo'),
(1013, 'Archivadores', 'Muebles', 10, 'Nuevo', 'Propio', 2, 0, 1, 150000, '2025-09-15', '', '', 'Inactivo'),
(1014, 'Grecas', 'Muebles', 3, 'Nuevo', 'Propio', 1, 0, 1, 160025, '2025-09-15', '', '', 'Activo'),
(1015, 'Papeleras Basura', 'Muebles', 6, 'Regular', 'Propio', 1, 0, 1, 18000, '2025-09-16', 'AR-54889', 'Cali', 'Activo'),
(1016, 'Portatil', 'Equipos de Computo', 25, 'Regular', 'Alquiler', 2, 0, 1, 65000, '2025-09-15', 'ML-85941', 'Bello', 'Inactivo'),
(1017, 'Nevera', 'Muebles', 8, 'Malo', 'Alquiler', 2, 0, 1, 19000, '2025-09-19', 'Se devuelve', 'Cali', 'Activo'),
(1018, 'Mesas Comedor', 'Muebles', 12, 'Regular', 'Alquiler', 2, 0, 1, 14600, '2025-09-18', 'HOLA', 'Bello', 'Activo'),
(1019, 'Disco Duro', 'Equipos de Computo', 5, 'Regular', 'Alquiler', 2, 0, 1, 16000, '2025-09-19', 'HJ', 'Cali', 'Activo'),
(1020, 'Bahías / Escritorios', 'Muebles', 11, 'Regular', 'Alquiler', 3, 0, 1, 18500, '2025-09-18', '', 'Cali', 'Activo'),
(1021, 'Locker', 'Muebles', 8, 'Malo', 'Alquiler', 2, 0, 1, 18560, '2025-09-18', '', 'Cali', 'Activo'),
(1022, 'Servidor Vicidial', 'Equipos de Computo', 1, 'Nuevo', 'Propio', 1, 0, 1, 5260300, '2025-09-19', 'NUEVO', 'Bello', 'Activo'),
(1023, 'Papeleras Basura', 'Muebles', 1, 'Nuevo', 'Propio', 1, 0, 1, 25000, '2025-09-19', '', 'Cali', ''),
(1024, 'Mesas Comedor', 'Muebles', 11, 'Regular', 'Propio', 1, 0, 1, 95600, '2025-09-23', '', 'Cali', 'Activo'),
(1025, 'Archivadores', 'Muebles', 6, 'Bueno', 'Propio', 2, 2, 1, 180000, '2025-09-26', '', 'Cali', 'Activo'),
(1026, 'Diadema', 'Equipos de Computo', 1, 'Regular', 'Propio', 1, 20, 1, 600000, '2025-09-30', 'Está regular la espuma del lado derecho', 'Bello', 'Activo'),
(1027, 'AP (Access Point)', 'Equipos de Computo', 2, 'Regular', 'Alquiler', 1, 146, 1, 260000, '2025-09-25', 'Está regular la espuma del lado derecho', 'Cali', 'Activo'),
(1028, 'Aires Acondicionados Pequeños', 'Muebles', 4, 'Malo', 'Propio', 1, 8, 1, 170000, '2025-09-30', '', 'Bello', 'Activo');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `propietario`
--

CREATE TABLE `propietario` (
  `id` int(11) NOT NULL,
  `nombre_proveedor` varchar(100) NOT NULL,
  `estado` enum('Activo','Inactivo') NOT NULL DEFAULT 'Activo',
  `pertenencia` enum('Alquiler','Propio') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `propietario`
--

INSERT INTO `propietario` (`id`, `nombre_proveedor`, `estado`, `pertenencia`) VALUES
(1, 'ARCSAS', 'Activo', 'Propio'),
(2, 'Milenio Pc', 'Activo', 'Alquiler'),
(3, 'Flycomm', 'Activo', 'Alquiler');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `responsable`
--

CREATE TABLE `responsable` (
  `id` int(10) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `estado` enum('Activo','Inactivo') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `responsable`
--

INSERT INTO `responsable` (`id`, `nombre`, `estado`) VALUES
(1, 'Alejandra Aguirre Monsalve', 'Activo'),
(2, 'Alejandra Cañola Herrera', 'Activo'),
(3, 'Alexander Manuel Angulo Gomez', 'Activo'),
(4, 'Alexandra Layos Osorio', 'Activo'),
(5, 'Ana Cristina Rodriguez Torres', 'Activo'),
(6, 'Ana Lucia Gomez Lopez', 'Activo'),
(7, 'Angela Maria Palacio Torres', 'Activo'),
(8, 'Angelica Maria Acosta Vallejo', 'Activo'),
(9, 'Angie Ceballos Suarez', 'Activo'),
(10, 'Angie Lorena Murillo Quintero', 'Activo'),
(11, 'Angie Natalia Quintero Giraldo', 'Activo'),
(12, 'Angie Paola Barrera Gomez', 'Activo'),
(13, 'Angye Paola Barrientos Palacio', 'Activo'),
(14, 'Anyela Yisela Ortega Loaiza', 'Activo'),
(15, 'Astrid Carolina Gallego Rengifo', 'Activo'),
(16, 'BANCO W Cliente Externo', 'Activo'),
(17, 'Beatriz Eugenia Hernandez Castrillon', 'Activo'),
(18, 'Beatriz Yonaida Jaramillo Hernandez', 'Activo'),
(19, 'Bibiana Marcela Amaya Alzate', 'Activo'),
(20, 'Brayan Arenas Jaramillo', 'Activo'),
(21, 'Bryan Andres Monsalve Torres', 'Activo'),
(22, 'Camila Andrea Niño Sanchez', 'Activo'),
(23, 'Daniela Londoño Zapata', 'Activo'),
(24, 'Danny Kamilo Peñaranda Parada', 'Activo'),
(25, 'Dayana Ruiz Henao', 'Activo'),
(26, 'Deicy Yadira Garavito Salas', 'Activo'),
(27, 'Diana Marcela Solano Arias', 'Activo'),
(28, 'Eliana Maria Sierra Roman', 'Activo'),
(29, 'Erika Manuela Rua Velilla', 'Activo'),
(30, 'Esteban Zuluaga Loaiza', 'Activo'),
(31, 'Estefani Perez Rivero', 'Activo'),
(32, 'Evelyn Rincon Granda', 'Activo'),
(33, 'Francisco Javier Alarcon Riverios', 'Activo'),
(34, 'Gabriela Paternina Mendoza', 'Activo'),
(35, 'German Antonio Robayo Cossio', 'Activo'),
(36, 'Gisela Alejandra Agudelo Araque', 'Activo'),
(37, 'Giver Duban Cifuentes Fernandez', 'Activo'),
(38, 'Hayber Yesid Gutierrez Florez', 'Activo'),
(39, 'Helen Samira Vente Rivas', 'Activo'),
(40, 'Ingrid Yasmid Grajales Rios', 'Activo'),
(41, 'Ingrid Yulieth Perez Rivera', 'Activo'),
(42, 'Ivonne Tatiana Castrillon Suaza', 'Activo'),
(43, 'Jaider Gonzalez Emitola', 'Activo'),
(44, 'Jaqueline Ochoa sepulveda', 'Activo'),
(45, 'Javier Angulo', 'Activo'),
(46, 'Jeronimo Vasquez Quiroz', 'Activo'),
(47, 'Jessica Lissette Buritica Sanchez', 'Activo'),
(48, 'Jhon David Ochoa Silva', 'Activo'),
(49, 'Jhon Jairo Hoyos Villalba', 'Activo'),
(50, 'Johana Milena Sanchez Osorio', 'Activo'),
(51, 'Johanna Castrillon Valencia', 'Activo'),
(52, 'John Alexander Martinez', 'Activo'),
(53, 'John Alexis Guarin Betancur', 'Activo'),
(54, 'Johnner Andres Quintero Pelaez', 'Activo'),
(55, 'Jose Guillermo Echeverria Barrios', 'Activo'),
(56, 'Juan David Longa Ibarguen', 'Activo'),
(57, 'Juan Felipe Ruiz Muñoz', 'Activo'),
(58, 'Juan Leandro Quintero Cifuentes', 'Activo'),
(59, 'Juliana Morales Ibarra', 'Activo'),
(60, 'Kateryn David Mora', 'Activo'),
(61, 'Katherin Osorno', 'Activo'),
(62, 'Katherine Castrillon Gallego', 'Activo'),
(63, 'Katherine Gomez Velasquez', 'Activo'),
(64, 'Katheryne Henao Parra', 'Activo'),
(65, 'Kelly Johana Galvis Osorio', 'Activo'),
(66, 'Laura Andrea Sepulveda Usuga', 'Activo'),
(67, 'Laura Juliana Arango Galeano', 'Activo'),
(68, 'Leidy Bibiana Gomez Gomez', 'Activo'),
(69, 'Leidy Jhoana Torres Osorio', 'Activo'),
(70, 'Leidy Lorena Montes Trujillo', 'Activo'),
(71, 'Leidys Vanessa Badillo Zapata', 'Activo'),
(72, 'Lesly Vanessa Zapata Monsalve', 'Activo'),
(73, 'Leydis Dayana Villa Hernandez', 'Activo'),
(74, 'Lina Marcela Duarte Bedoya', 'Activo'),
(75, 'Lina Marcela Rodriguez Mejia', 'Activo'),
(76, 'Lina Marcela Serna Duque', 'Activo'),
(77, 'Liseth Rojas Sierra', 'Activo'),
(78, 'Liyani Milena Franco Puerta', 'Activo'),
(79, 'Lizeth Vanessa Ibarbo Garzon', 'Activo'),
(80, 'Lucas Tejada Garcia', 'Activo'),
(81, 'Luis Esteban Florez Albornoz', 'Activo'),
(82, 'Luisa Maria Montoya Barrera', 'Activo'),
(83, 'Madelin Mariana Alvarez Arango', 'Activo'),
(84, 'Manuela Arenas Gallo', 'Activo'),
(85, 'Maria Alejandra Ramirez Gonzalez', 'Activo'),
(86, 'Maria Alejandra Sanchez Martinez', 'Activo'),
(87, 'Maria Angelica Lujan Zuleta', 'Activo'),
(88, 'Maria Camila Castañeda Yepes', 'Activo'),
(89, 'Maria Camila Marin Sanchez', 'Activo'),
(90, 'Maria Camila Restrepo Rua', 'Activo'),
(91, 'Maria de Jesus Grondona Cantaro', 'Activo'),
(92, 'Maria del Pilar Olmos Henao', 'Activo'),
(93, 'Maria del Pilar Rodriguez Zuleta', 'Activo'),
(94, 'Maria Fernanda Mora Vizcano', 'Activo'),
(95, 'Maria Isabel Osorio Ciro', 'Activo'),
(96, 'Maria Laura Velasquez Alzate', 'Activo'),
(97, 'Maria Luzcena Lopez Arango', 'Activo'),
(98, 'Maria Natalia Muñoz Valencia', 'Activo'),
(99, 'Maria Paulina Guerra Rodriguez', 'Activo'),
(100, 'Mario Alejandro Villa Muñoz', 'Activo'),
(101, 'Marlyn Johana Palacio Giraldo', 'Activo'),
(102, 'Martha Lucia Perdomo Dizu', 'Activo'),
(103, 'Mauren Sulima Palacio', 'Activo'),
(104, 'Mayerlly Andrea Puerta Rivera', 'Activo'),
(105, 'Melisa Concha Vanegas', 'Activo'),
(106, 'Melissa Acosta Munoz', 'Activo'),
(107, 'Michael Stid Perez Pelaez', 'Activo'),
(108, 'Michelle Carolina Bonilla Murillo', 'Activo'),
(109, 'Mileydis Isabel Duran Barrios', 'Activo'),
(110, 'Nancy Yadira Monsalve Arias', 'Activo'),
(111, 'Natalia Andrea Diaz', 'Activo'),
(112, 'Natalia Cristina Garcia Gomez', 'Activo'),
(113, 'Natalia David Molina', 'Activo'),
(114, 'Nathalia Andrea Suarez Jimenez', 'Activo'),
(115, 'Neyder Yecci Ortiz Perez', 'Activo'),
(116, 'Omar Esneider Ospina Guzman', 'Activo'),
(117, 'Paola Lombana Agudelo', 'Activo'),
(118, 'Paola Andrea Gomez Ospina', 'Activo'),
(119, 'Paula Andrea Cervantes Miranda', 'Activo'),
(120, 'Paula Andrea Grajales Londoño', 'Activo'),
(121, 'Paula Andrea Padilla Perez', 'Activo'),
(122, 'Rodrigo Alberto Cardona Restrepo', 'Activo'),
(123, 'Sandra Biviana Gomez Sanchez', 'Activo'),
(124, 'Santiago Eraso Arias', 'Activo'),
(125, 'Santiago Gaviria Londono', 'Activo'),
(126, 'Santiago Valencia Hurtado', 'Activo'),
(127, 'Sara Valeria Cossio Bolivar', 'Activo'),
(128, 'Sara Yulitza Rua Farfan', 'Activo'),
(129, 'Sergio Alexander Ramirez Pulgarin', 'Activo'),
(130, 'Sergio Andres Mena Ledesma', 'Activo'),
(131, 'Sergio Danny Cuartas', 'Activo'),
(132, 'Shirley Tatiana Cataño Zuluaga', 'Activo'),
(133, 'Stefania Correa Jaramillo', 'Activo'),
(134, 'Stefania Florez Barrera', 'Activo'),
(135, 'Stephania Cardona Rodriguez', 'Activo'),
(136, 'Stephany Perez Velasquez', 'Activo'),
(137, 'Valentina Echeverri Arenas', 'Activo'),
(138, 'Valentina Franco Pulgarin', 'Activo'),
(139, 'Valentina Herrera Perez', 'Activo'),
(140, 'Valentina Lopez Ortiz', 'Activo'),
(141, 'Valentina Tamayo Campiño', 'Activo'),
(142, 'Valentina Zapata Vasquez', 'Activo'),
(143, 'Valeria Gaviria Zuluaga', 'Activo'),
(144, 'Valeria Henao Otalvaro', 'Activo'),
(145, 'Valery Parra Ruiz', 'Activo'),
(146, 'Vanesa Vargas Cañas', 'Activo'),
(147, 'Veronica Castro Rios', 'Activo'),
(148, 'Yenny Fernanda Criollo Sanchez', 'Activo'),
(149, 'Yeris Maria Romero Yanes', 'Activo'),
(150, 'Yesenia Aracelly Ramirez Valencia', 'Activo'),
(151, 'Yessica Carolina Gomez Gutierrez', 'Activo'),
(152, 'Yessica Margarita Correa Castillo', 'Activo'),
(153, 'Yessika Yuliana Montoya', 'Activo'),
(154, 'Yonattan David Garcia Munera', 'Activo'),
(155, 'Yudy Yaneth Cardona Soto', 'Activo'),
(156, 'Yuliana Osorio Castaño', 'Activo'),
(157, 'Yulieth Caterine Alvarez Mazo', 'Activo'),
(158, 'Yuri Beltran Jimenez', 'Activo'),
(159, 'Yuri Marcela Ardila Quinchia', 'Activo');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `cat_implemento`
--
ALTER TABLE `cat_implemento`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nom_implemento` (`nom_implemento`);

--
-- Indices de la tabla `departamento`
--
ALTER TABLE `departamento`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `implemento`
--
ALTER TABLE `implemento`
  ADD PRIMARY KEY (`id`),
  ADD KEY `departamento` (`departamento`);

--
-- Indices de la tabla `propietario`
--
ALTER TABLE `propietario`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `responsable`
--
ALTER TABLE `responsable`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `cat_implemento`
--
ALTER TABLE `cat_implemento`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT de la tabla `departamento`
--
ALTER TABLE `departamento`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=50;

--
-- AUTO_INCREMENT de la tabla `implemento`
--
ALTER TABLE `implemento`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1029;

--
-- AUTO_INCREMENT de la tabla `propietario`
--
ALTER TABLE `propietario`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `responsable`
--
ALTER TABLE `responsable`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=160;
--
-- Base de datos: `phpmyadmin`
--
CREATE DATABASE IF NOT EXISTS `phpmyadmin` DEFAULT CHARACTER SET utf8 COLLATE utf8_bin;
USE `phpmyadmin`;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pma__bookmark`
--

CREATE TABLE `pma__bookmark` (
  `id` int(10) UNSIGNED NOT NULL,
  `dbase` varchar(255) NOT NULL DEFAULT '',
  `user` varchar(255) NOT NULL DEFAULT '',
  `label` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '',
  `query` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Bookmarks';

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pma__central_columns`
--

CREATE TABLE `pma__central_columns` (
  `db_name` varchar(64) NOT NULL,
  `col_name` varchar(64) NOT NULL,
  `col_type` varchar(64) NOT NULL,
  `col_length` text DEFAULT NULL,
  `col_collation` varchar(64) NOT NULL,
  `col_isNull` tinyint(1) NOT NULL,
  `col_extra` varchar(255) DEFAULT '',
  `col_default` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Central list of columns';

--
-- Volcado de datos para la tabla `pma__central_columns`
--

INSERT INTO `pma__central_columns` (`db_name`, `col_name`, `col_type`, `col_length`, `col_collation`, `col_isNull`, `col_extra`, `col_default`) VALUES
('inventario', 'id_implemento', 'varchar', '10', 'utf8mb4_general_ci', 0, ',', '');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pma__column_info`
--

CREATE TABLE `pma__column_info` (
  `id` int(5) UNSIGNED NOT NULL,
  `db_name` varchar(64) NOT NULL DEFAULT '',
  `table_name` varchar(64) NOT NULL DEFAULT '',
  `column_name` varchar(64) NOT NULL DEFAULT '',
  `comment` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '',
  `mimetype` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '',
  `transformation` varchar(255) NOT NULL DEFAULT '',
  `transformation_options` varchar(255) NOT NULL DEFAULT '',
  `input_transformation` varchar(255) NOT NULL DEFAULT '',
  `input_transformation_options` varchar(255) NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Column information for phpMyAdmin';

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pma__designer_settings`
--

CREATE TABLE `pma__designer_settings` (
  `username` varchar(64) NOT NULL,
  `settings_data` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Settings related to Designer';

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pma__export_templates`
--

CREATE TABLE `pma__export_templates` (
  `id` int(5) UNSIGNED NOT NULL,
  `username` varchar(64) NOT NULL,
  `export_type` varchar(10) NOT NULL,
  `template_name` varchar(64) NOT NULL,
  `template_data` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Saved export templates';

--
-- Volcado de datos para la tabla `pma__export_templates`
--

INSERT INTO `pma__export_templates` (`id`, `username`, `export_type`, `template_name`, `template_data`) VALUES
(1, 'root', 'server', 'inventario_1', '{\"quick_or_custom\":\"quick\",\"what\":\"sql\",\"db_select[]\":[\"inventario\",\"phpmyadmin\",\"test\"],\"aliases_new\":\"\",\"output_format\":\"sendit\",\"filename_template\":\"@SERVER@\",\"remember_template\":\"on\",\"charset\":\"utf-8\",\"compression\":\"none\",\"maxsize\":\"\",\"codegen_structure_or_data\":\"data\",\"codegen_format\":\"0\",\"csv_separator\":\",\",\"csv_enclosed\":\"\\\"\",\"csv_escaped\":\"\\\"\",\"csv_terminated\":\"AUTO\",\"csv_null\":\"NULL\",\"csv_columns\":\"something\",\"csv_structure_or_data\":\"data\",\"excel_null\":\"NULL\",\"excel_columns\":\"something\",\"excel_edition\":\"win\",\"excel_structure_or_data\":\"data\",\"json_structure_or_data\":\"data\",\"json_unicode\":\"something\",\"latex_caption\":\"something\",\"latex_structure_or_data\":\"structure_and_data\",\"latex_structure_caption\":\"Estructura de la tabla @TABLE@\",\"latex_structure_continued_caption\":\"Estructura de la tabla @TABLE@ (continúa)\",\"latex_structure_label\":\"tab:@TABLE@-structure\",\"latex_relation\":\"something\",\"latex_comments\":\"something\",\"latex_mime\":\"something\",\"latex_columns\":\"something\",\"latex_data_caption\":\"Contenido de la tabla @TABLE@\",\"latex_data_continued_caption\":\"Contenido de la tabla @TABLE@ (continúa)\",\"latex_data_label\":\"tab:@TABLE@-data\",\"latex_null\":\"\\\\textit{NULL}\",\"mediawiki_structure_or_data\":\"data\",\"mediawiki_caption\":\"something\",\"mediawiki_headers\":\"something\",\"htmlword_structure_or_data\":\"structure_and_data\",\"htmlword_null\":\"NULL\",\"ods_null\":\"NULL\",\"ods_structure_or_data\":\"data\",\"odt_structure_or_data\":\"structure_and_data\",\"odt_relation\":\"something\",\"odt_comments\":\"something\",\"odt_mime\":\"something\",\"odt_columns\":\"something\",\"odt_null\":\"NULL\",\"pdf_report_title\":\"\",\"pdf_structure_or_data\":\"data\",\"phparray_structure_or_data\":\"data\",\"sql_include_comments\":\"something\",\"sql_header_comment\":\"\",\"sql_use_transaction\":\"something\",\"sql_compatibility\":\"NONE\",\"sql_structure_or_data\":\"structure_and_data\",\"sql_create_table\":\"something\",\"sql_auto_increment\":\"something\",\"sql_create_view\":\"something\",\"sql_create_trigger\":\"something\",\"sql_backquotes\":\"something\",\"sql_type\":\"INSERT\",\"sql_insert_syntax\":\"both\",\"sql_max_query_size\":\"50000\",\"sql_hex_for_binary\":\"something\",\"sql_utc_time\":\"something\",\"texytext_structure_or_data\":\"structure_and_data\",\"texytext_null\":\"NULL\",\"yaml_structure_or_data\":\"data\",\"\":null,\"as_separate_files\":null,\"csv_removeCRLF\":null,\"excel_removeCRLF\":null,\"json_pretty_print\":null,\"htmlword_columns\":null,\"ods_columns\":null,\"sql_dates\":null,\"sql_relation\":null,\"sql_mime\":null,\"sql_disable_fk\":null,\"sql_views_as_tables\":null,\"sql_metadata\":null,\"sql_drop_database\":null,\"sql_drop_table\":null,\"sql_if_not_exists\":null,\"sql_simple_view_export\":null,\"sql_view_current_user\":null,\"sql_or_replace_view\":null,\"sql_procedure_function\":null,\"sql_truncate\":null,\"sql_delayed\":null,\"sql_ignore\":null,\"texytext_columns\":null}'),
(2, 'root', 'server', 'BD_INVENTARIO', '{\"quick_or_custom\":\"quick\",\"what\":\"sql\",\"db_select[]\":[\"inventario\",\"phpmyadmin\",\"test\"],\"aliases_new\":\"\",\"output_format\":\"sendit\",\"filename_template\":\"@SERVER@\",\"remember_template\":\"on\",\"charset\":\"utf-8\",\"compression\":\"none\",\"maxsize\":\"\",\"codegen_structure_or_data\":\"data\",\"codegen_format\":\"0\",\"csv_separator\":\",\",\"csv_enclosed\":\"\\\"\",\"csv_escaped\":\"\\\"\",\"csv_terminated\":\"AUTO\",\"csv_null\":\"NULL\",\"csv_columns\":\"something\",\"csv_structure_or_data\":\"data\",\"excel_null\":\"NULL\",\"excel_columns\":\"something\",\"excel_edition\":\"win\",\"excel_structure_or_data\":\"data\",\"json_structure_or_data\":\"data\",\"json_unicode\":\"something\",\"latex_caption\":\"something\",\"latex_structure_or_data\":\"structure_and_data\",\"latex_structure_caption\":\"Estructura de la tabla @TABLE@\",\"latex_structure_continued_caption\":\"Estructura de la tabla @TABLE@ (continúa)\",\"latex_structure_label\":\"tab:@TABLE@-structure\",\"latex_relation\":\"something\",\"latex_comments\":\"something\",\"latex_mime\":\"something\",\"latex_columns\":\"something\",\"latex_data_caption\":\"Contenido de la tabla @TABLE@\",\"latex_data_continued_caption\":\"Contenido de la tabla @TABLE@ (continúa)\",\"latex_data_label\":\"tab:@TABLE@-data\",\"latex_null\":\"\\\\textit{NULL}\",\"mediawiki_structure_or_data\":\"data\",\"mediawiki_caption\":\"something\",\"mediawiki_headers\":\"something\",\"htmlword_structure_or_data\":\"structure_and_data\",\"htmlword_null\":\"NULL\",\"ods_null\":\"NULL\",\"ods_structure_or_data\":\"data\",\"odt_structure_or_data\":\"structure_and_data\",\"odt_relation\":\"something\",\"odt_comments\":\"something\",\"odt_mime\":\"something\",\"odt_columns\":\"something\",\"odt_null\":\"NULL\",\"pdf_report_title\":\"\",\"pdf_structure_or_data\":\"data\",\"phparray_structure_or_data\":\"data\",\"sql_include_comments\":\"something\",\"sql_header_comment\":\"\",\"sql_use_transaction\":\"something\",\"sql_compatibility\":\"NONE\",\"sql_structure_or_data\":\"structure_and_data\",\"sql_create_table\":\"something\",\"sql_auto_increment\":\"something\",\"sql_create_view\":\"something\",\"sql_create_trigger\":\"something\",\"sql_backquotes\":\"something\",\"sql_type\":\"INSERT\",\"sql_insert_syntax\":\"both\",\"sql_max_query_size\":\"50000\",\"sql_hex_for_binary\":\"something\",\"sql_utc_time\":\"something\",\"texytext_structure_or_data\":\"structure_and_data\",\"texytext_null\":\"NULL\",\"yaml_structure_or_data\":\"data\",\"\":null,\"as_separate_files\":null,\"csv_removeCRLF\":null,\"excel_removeCRLF\":null,\"json_pretty_print\":null,\"htmlword_columns\":null,\"ods_columns\":null,\"sql_dates\":null,\"sql_relation\":null,\"sql_mime\":null,\"sql_disable_fk\":null,\"sql_views_as_tables\":null,\"sql_metadata\":null,\"sql_drop_database\":null,\"sql_drop_table\":null,\"sql_if_not_exists\":null,\"sql_simple_view_export\":null,\"sql_view_current_user\":null,\"sql_or_replace_view\":null,\"sql_procedure_function\":null,\"sql_truncate\":null,\"sql_delayed\":null,\"sql_ignore\":null,\"texytext_columns\":null}');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pma__favorite`
--

CREATE TABLE `pma__favorite` (
  `username` varchar(64) NOT NULL,
  `tables` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Favorite tables';

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pma__history`
--

CREATE TABLE `pma__history` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `username` varchar(64) NOT NULL DEFAULT '',
  `db` varchar(64) NOT NULL DEFAULT '',
  `table` varchar(64) NOT NULL DEFAULT '',
  `timevalue` timestamp NOT NULL DEFAULT current_timestamp(),
  `sqlquery` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='SQL history for phpMyAdmin';

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pma__navigationhiding`
--

CREATE TABLE `pma__navigationhiding` (
  `username` varchar(64) NOT NULL,
  `item_name` varchar(64) NOT NULL,
  `item_type` varchar(64) NOT NULL,
  `db_name` varchar(64) NOT NULL,
  `table_name` varchar(64) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Hidden items of navigation tree';

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pma__pdf_pages`
--

CREATE TABLE `pma__pdf_pages` (
  `db_name` varchar(64) NOT NULL DEFAULT '',
  `page_nr` int(10) UNSIGNED NOT NULL,
  `page_descr` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='PDF relation pages for phpMyAdmin';

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pma__recent`
--

CREATE TABLE `pma__recent` (
  `username` varchar(64) NOT NULL,
  `tables` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Recently accessed tables';

--
-- Volcado de datos para la tabla `pma__recent`
--

INSERT INTO `pma__recent` (`username`, `tables`) VALUES
('root', '[{\"db\":\"inventario\",\"table\":\"implemento\"},{\"db\":\"inventario\",\"table\":\"departamento\"},{\"db\":\"inventario\",\"table\":\"responsable\"},{\"db\":\"login\",\"table\":\"users\"},{\"db\":\"inventario\",\"table\":\"propietario\"},{\"db\":\"inventario\",\"table\":\"cat_implemento\"}]');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pma__relation`
--

CREATE TABLE `pma__relation` (
  `master_db` varchar(64) NOT NULL DEFAULT '',
  `master_table` varchar(64) NOT NULL DEFAULT '',
  `master_field` varchar(64) NOT NULL DEFAULT '',
  `foreign_db` varchar(64) NOT NULL DEFAULT '',
  `foreign_table` varchar(64) NOT NULL DEFAULT '',
  `foreign_field` varchar(64) NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Relation table';

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pma__savedsearches`
--

CREATE TABLE `pma__savedsearches` (
  `id` int(5) UNSIGNED NOT NULL,
  `username` varchar(64) NOT NULL DEFAULT '',
  `db_name` varchar(64) NOT NULL DEFAULT '',
  `search_name` varchar(64) NOT NULL DEFAULT '',
  `search_data` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Saved searches';

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pma__table_coords`
--

CREATE TABLE `pma__table_coords` (
  `db_name` varchar(64) NOT NULL DEFAULT '',
  `table_name` varchar(64) NOT NULL DEFAULT '',
  `pdf_page_number` int(11) NOT NULL DEFAULT 0,
  `x` float UNSIGNED NOT NULL DEFAULT 0,
  `y` float UNSIGNED NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Table coordinates for phpMyAdmin PDF output';

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pma__table_info`
--

CREATE TABLE `pma__table_info` (
  `db_name` varchar(64) NOT NULL DEFAULT '',
  `table_name` varchar(64) NOT NULL DEFAULT '',
  `display_field` varchar(64) NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Table information for phpMyAdmin';

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pma__table_uiprefs`
--

CREATE TABLE `pma__table_uiprefs` (
  `username` varchar(64) NOT NULL,
  `db_name` varchar(64) NOT NULL,
  `table_name` varchar(64) NOT NULL,
  `prefs` text NOT NULL,
  `last_update` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Tables'' UI preferences';

--
-- Volcado de datos para la tabla `pma__table_uiprefs`
--

INSERT INTO `pma__table_uiprefs` (`username`, `db_name`, `table_name`, `prefs`, `last_update`) VALUES
('root', 'inventario', 'implemento', '[]', '2025-08-21 19:30:01');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pma__tracking`
--

CREATE TABLE `pma__tracking` (
  `db_name` varchar(64) NOT NULL,
  `table_name` varchar(64) NOT NULL,
  `version` int(10) UNSIGNED NOT NULL,
  `date_created` datetime NOT NULL,
  `date_updated` datetime NOT NULL,
  `schema_snapshot` text NOT NULL,
  `schema_sql` text DEFAULT NULL,
  `data_sql` longtext DEFAULT NULL,
  `tracking` set('UPDATE','REPLACE','INSERT','DELETE','TRUNCATE','CREATE DATABASE','ALTER DATABASE','DROP DATABASE','CREATE TABLE','ALTER TABLE','RENAME TABLE','DROP TABLE','CREATE INDEX','DROP INDEX','CREATE VIEW','ALTER VIEW','DROP VIEW') DEFAULT NULL,
  `tracking_active` int(1) UNSIGNED NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Database changes tracking for phpMyAdmin';

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pma__userconfig`
--

CREATE TABLE `pma__userconfig` (
  `username` varchar(64) NOT NULL,
  `timevalue` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `config_data` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='User preferences storage for phpMyAdmin';

--
-- Volcado de datos para la tabla `pma__userconfig`
--

INSERT INTO `pma__userconfig` (`username`, `timevalue`, `config_data`) VALUES
('root', '2025-09-30 20:18:21', '{\"Console\\/Mode\":\"collapse\",\"lang\":\"es\",\"Console\\/Height\":97.98599999999999,\"ThemeDefault\":\"pmahomme\"}');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pma__usergroups`
--

CREATE TABLE `pma__usergroups` (
  `usergroup` varchar(64) NOT NULL,
  `tab` varchar(64) NOT NULL,
  `allowed` enum('Y','N') NOT NULL DEFAULT 'N'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='User groups with configured menu items';

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pma__users`
--

CREATE TABLE `pma__users` (
  `username` varchar(64) NOT NULL,
  `usergroup` varchar(64) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Users and their assignments to user groups';

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `pma__bookmark`
--
ALTER TABLE `pma__bookmark`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `pma__central_columns`
--
ALTER TABLE `pma__central_columns`
  ADD PRIMARY KEY (`db_name`,`col_name`);

--
-- Indices de la tabla `pma__column_info`
--
ALTER TABLE `pma__column_info`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `db_name` (`db_name`,`table_name`,`column_name`);

--
-- Indices de la tabla `pma__designer_settings`
--
ALTER TABLE `pma__designer_settings`
  ADD PRIMARY KEY (`username`);

--
-- Indices de la tabla `pma__export_templates`
--
ALTER TABLE `pma__export_templates`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `u_user_type_template` (`username`,`export_type`,`template_name`);

--
-- Indices de la tabla `pma__favorite`
--
ALTER TABLE `pma__favorite`
  ADD PRIMARY KEY (`username`);

--
-- Indices de la tabla `pma__history`
--
ALTER TABLE `pma__history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `username` (`username`,`db`,`table`,`timevalue`);

--
-- Indices de la tabla `pma__navigationhiding`
--
ALTER TABLE `pma__navigationhiding`
  ADD PRIMARY KEY (`username`,`item_name`,`item_type`,`db_name`,`table_name`);

--
-- Indices de la tabla `pma__pdf_pages`
--
ALTER TABLE `pma__pdf_pages`
  ADD PRIMARY KEY (`page_nr`),
  ADD KEY `db_name` (`db_name`);

--
-- Indices de la tabla `pma__recent`
--
ALTER TABLE `pma__recent`
  ADD PRIMARY KEY (`username`);

--
-- Indices de la tabla `pma__relation`
--
ALTER TABLE `pma__relation`
  ADD PRIMARY KEY (`master_db`,`master_table`,`master_field`),
  ADD KEY `foreign_field` (`foreign_db`,`foreign_table`);

--
-- Indices de la tabla `pma__savedsearches`
--
ALTER TABLE `pma__savedsearches`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `u_savedsearches_username_dbname` (`username`,`db_name`,`search_name`);

--
-- Indices de la tabla `pma__table_coords`
--
ALTER TABLE `pma__table_coords`
  ADD PRIMARY KEY (`db_name`,`table_name`,`pdf_page_number`);

--
-- Indices de la tabla `pma__table_info`
--
ALTER TABLE `pma__table_info`
  ADD PRIMARY KEY (`db_name`,`table_name`);

--
-- Indices de la tabla `pma__table_uiprefs`
--
ALTER TABLE `pma__table_uiprefs`
  ADD PRIMARY KEY (`username`,`db_name`,`table_name`);

--
-- Indices de la tabla `pma__tracking`
--
ALTER TABLE `pma__tracking`
  ADD PRIMARY KEY (`db_name`,`table_name`,`version`);

--
-- Indices de la tabla `pma__userconfig`
--
ALTER TABLE `pma__userconfig`
  ADD PRIMARY KEY (`username`);

--
-- Indices de la tabla `pma__usergroups`
--
ALTER TABLE `pma__usergroups`
  ADD PRIMARY KEY (`usergroup`,`tab`,`allowed`);

--
-- Indices de la tabla `pma__users`
--
ALTER TABLE `pma__users`
  ADD PRIMARY KEY (`username`,`usergroup`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `pma__bookmark`
--
ALTER TABLE `pma__bookmark`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `pma__column_info`
--
ALTER TABLE `pma__column_info`
  MODIFY `id` int(5) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `pma__export_templates`
--
ALTER TABLE `pma__export_templates`
  MODIFY `id` int(5) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `pma__history`
--
ALTER TABLE `pma__history`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `pma__pdf_pages`
--
ALTER TABLE `pma__pdf_pages`
  MODIFY `page_nr` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `pma__savedsearches`
--
ALTER TABLE `pma__savedsearches`
  MODIFY `id` int(5) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- Base de datos: `test`
--
CREATE DATABASE IF NOT EXISTS `test` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `test`;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
