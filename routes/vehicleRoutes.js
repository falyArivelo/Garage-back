const express = require('express');
const router = express.Router();
const vehicleController = require('../controller/vehicleController');
const { verifyToken, verifyRole } = require('../middleware/auth');

router.post('/vehicles', verifyToken, verifyRole(['client']), vehicleController.createVehicle);
router.get('/vehicles', verifyToken, vehicleController.getAllVehicles);
router.get('/vehicles/:id', verifyToken, vehicleController.getVehicleById);
router.put('/vehicles/:id', verifyToken, verifyRole(['manager']), vehicleController.updateVehicle);
router.delete('/vehicles/:id', verifyToken, verifyRole(['manager']), vehicleController.deleteVehicle);

module.exports = router;
