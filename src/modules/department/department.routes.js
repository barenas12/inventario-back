
const express = require('express');
const departmentController = require('./department.controller');

const router = express.Router();

router.get('/get-departments', departmentController.getDepartments);
router.get('/get-department-by-id/:id', departmentController.getDepartmentById);
router.put('/put-department-by-id/:id', departmentController.putDepartmentById);

module.exports = router;
