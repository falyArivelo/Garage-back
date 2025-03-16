const express = require('express');
const router = express.Router();
const vehicleController = require('../controller/vehicleController');
const { verifyToken, verifyRole } = require('../middleware/auth');

router.get('/vehicles', verifyToken, verifyRole(['manager','mecanicien']),vehicleController.getAllVehicles);
router.get('/vehicle/:id', verifyToken, vehicleController.getVehicleById);

// CLIENT 
router.get('/vehicles/me', verifyToken,verifyRole(['client']), vehicleController.getAllVehiclesMe);
router.post('/vehicles', verifyToken, verifyRole(['client']),vehicleController.createVehicle);
router.put('/vehicle/:id', verifyToken, verifyRole(['client']), vehicleController.updateVehicle);
router.delete('/vehicle/:id', vehicleController.deleteVehicle);

module.exports = router;

