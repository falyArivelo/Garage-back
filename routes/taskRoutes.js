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

module.exports = router;
