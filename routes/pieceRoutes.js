const express = require('express');
const router = express.Router();
const pieceController = require('../controller/pieceController');
const { verifyToken, verifyRole } = require('../middleware/auth');

// Créer une piece - uniquement pour un utilisateur avec le rôle 'manager'
router.post('/pieces', verifyToken, verifyRole(['manager']), pieceController.createPiece);

// Obtenir tous les pieces - accessible pour tout utilisateur authentifié
router.get('/pieces', verifyToken, verifyRole(['manager','mecanicien']), pieceController.getAllPieces);

// Obtenir une piece par ID - accessible pour tout utilisateur authentifié
router.get('/pieces/:id', verifyToken, verifyRole(['manager','mecanicien']), pieceController.getPieceById);

// Mettre à jour une piece - uniquement pour un utilisateur avec le rôle 'manager'
router.put('/pieces/:id', verifyToken, verifyRole(['manager']), pieceController.updatePiece);

// Supprimer une piece - uniquement pour un utilisateur avec le rôle 'manager'
router.delete('/pieces/:id', verifyToken, verifyRole(['manager']), pieceController.deletePiece);

module.exports = router;
