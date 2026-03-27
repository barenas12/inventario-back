// src/modules/auth/auth.controller.js
const deparmentService = require('./department.service');

async function getDepartments(req, res) {
  try {
    const departments = await deparmentService.getDepartments();
    res.json(departments);
  } catch (error) {
    console.error('❌ Error al obtener departamentos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

async function getDepartments(req, res) {
  try {
    const departments = await deparmentService.getDepartments();
    res.json(departments);
  } catch (error) {
    console.error('❌ Error al obtener departamentos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

async function getDepartmentById(req, res) {
  try {
    const department = await deparmentService.getDepartmentById(req.params.id);
    if (!department) {
      return res.status(404).json({ error: 'Departamento no encontrado' });
    }
    res.json(department);
  } catch (error) {
    console.error('❌ Error al obtener departamento:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

async function putDepartmentById(req, res) {
  try {
    const department = await deparmentService.putDepartmentById(req.params.id, req.body);
    if (!department) {
      return res.status(404).json({ error: 'Departamento no encontrado' });
    }
    res.json(department);
  } catch (error) {
    console.error('❌ Error al obtener departamento:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}


module.exports = { getDepartments, getDepartmentById, putDepartmentById };
