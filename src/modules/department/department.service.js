const db = require('../../config/db');

async function getDepartments() {
    try {
        const [rows] = await db.promise().query(
          "SELECT * FROM inventario.departamento ORDER BY nombre ASC;");
        return rows;
    } catch (error) {
        console.error('❌ Error al obtener departamentos en servicio:', error);
        throw error;
    }
}

async function getDepartmentById(id) {
    try {
        const [rows] = await db.promise().query(
          "SELECT * FROM inventario.departamento WHERE id = ?;",[id]);
        return rows[0] || null;
    } catch (error) {
        console.error('❌ Error al obtener departamentos en servicio:', error);
        throw error;
    }
}

async function putDepartmentById(id) {
    try {
        const [rows] = await db.promise().query(
          "UPDATE departamento SET nombre = ?, estado = ? WHERE id = ?;",[id]);
        return rows[0] || null;
    } catch (error) {
        console.error('❌ Error al obtener departamentos en servicio:', error);
        throw error;
    }
}

module.exports = { getDepartments, getDepartmentById,putDepartmentById };
