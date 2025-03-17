const express = require('express');
const router = express.Router();
const appointmentController = require('../controller/appointmentController');
const { verifyToken, verifyRole } = require('../middleware/auth');

// Créer un rendez-vous - uniquement pour un utilisateur avec le rôle 'manager'
router.post('/appointments', appointmentController.createAppointment);

// Obtenir tous les rendez-vous - accessible pour tout utilisateur authentifié
router.get('/appointments', verifyToken, appointmentController.getAllAppointments);

// Obtenir les rendez-vous d'un client - accessible pour tout utilisateur authentifié
router.get('/appointments/client/:clientId', verifyToken,verifyRole(['client']), appointmentController.getAppointmentsByClient);

// Obtenir un rendez-vous par ID - accessible pour tout utilisateur authentifié
router.get('/appointments/:id', verifyToken, appointmentController.getAppointmentById);

// Mettre à jour un rendez-vous - uniquement pour un utilisateur avec le rôle 'manager'
router.put('/appointments/:id', verifyToken, verifyRole(['manager']), appointmentController.updateAppointment);

// Supprimer un rendez-vous - uniquement pour un utilisateur avec le rôle 'manager'
router.delete('/appointments/:id', verifyToken, verifyRole(['manager']), appointmentController.deleteAppointment);

module.exports = router;
