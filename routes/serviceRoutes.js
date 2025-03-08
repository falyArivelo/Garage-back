const express = require('express');
const router = express.Router();
const serviceController = require('../controller/serviceController');
const { verifyToken, verifyRole } = require('../middleware/auth');

// Créer un service - uniquement pour un utilisateur avec le rôle 'manager'
router.post('/services', verifyToken, verifyRole(['manager']), serviceController.createService);

// Obtenir tous les services - accessible pour tout utilisateur authentifié
router.get('/services', verifyToken, serviceController.getAllServices);

// Obtenir un service par ID - accessible pour tout utilisateur authentifié
router.get('/services/:id', verifyToken, serviceController.getServiceById);

// Mettre à jour un service - uniquement pour un utilisateur avec le rôle 'manager'
router.put('/services/:id', verifyToken, verifyRole(['manager']), serviceController.updateService);

// Supprimer un service - uniquement pour un utilisateur avec le rôle 'manager'
router.delete('/services/:id', verifyToken, verifyRole(['manager']), serviceController.deleteService);

module.exports = router;
