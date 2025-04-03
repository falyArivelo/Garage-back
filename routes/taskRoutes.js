const express = require('express');
const router = express.Router();
const taskController = require('../controller/taskController');
const { verifyToken, verifyRole } = require('../middleware/auth');

//  Créer une tâche - accessible uniquement au 'manager'
router.post('/tasks', verifyToken, verifyRole(['manager']), taskController.createTask);

//  Obtenir toutes les tâches - accessible aux 'manager' et 'mecanicien'
router.get('/tasks', verifyToken, verifyRole(['manager', 'mecanicien']), taskController.getAllTasks);

// Obtenir une tâche par ID - accessible aux 'manager' et 'mecanicien'
router.get('/tasks/:id', verifyToken, verifyRole(['manager', 'mecanicien']), taskController.getTaskById);

//  Mettre à jour une tâche - uniquement pour un 'manager'
router.put('/tasks/:id', verifyToken, verifyRole(['manager']), taskController.updateTask);

//  Marquer une tâche comme terminée - accessible aux 'manager' et 'mecanicien'
router.put('/tasks/:id/complete', verifyToken, verifyRole(['manager', 'mecanicien']), taskController.markTaskAsDone);

//  Supprimer une tâche - uniquement pour un 'manager'
router.delete('/tasks/:id', verifyToken, verifyRole(['manager']), taskController.deleteTask);

// Route pour obtenir les tâches liées à un appointment
router.get('/tasks/appointments/:appointmentId', taskController.getTasksForAppointment);

//task d'un mecanicien
router.get('/tasks/mechanic/:mechanicId', verifyToken, verifyRole(['manager','mecanicien']), taskController.getTasksByMechanic);
// mettre a jour status et ajouter note
router.put('/tasks/:id/updateStatus', verifyToken, taskController.updateTaskStatus);

module.exports = router;
