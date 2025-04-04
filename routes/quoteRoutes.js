const express = require('express');
const router = express.Router();
const quoteController = require('../controller/quoteController');
const { verifyToken, verifyRole } = require('../middleware/auth');

// Créer un quote - uniquement pour un utilisateur avec le rôle 'manager'
router.post('/quotes', verifyToken, verifyRole(['manager']), quoteController.createQuote);

// Obtenir tous les quotes - accessible pour tout utilisateur authentifié
router.get('/quotes', verifyToken, verifyRole(['manager','mecanicien']), quoteController.getAllQuotes);

// Obtenir un quote par ID - accessible pour tout utilisateur authentifié
router.get('/quotes/:id', verifyToken, verifyRole(['manager','mecanicien','client']), quoteController.getQuoteById);

// Obtenir un quote par idAppointment
router.get('/quotes/appointment/:id', verifyToken, verifyRole(['manager','mecanicien','client']), quoteController.getQuoteByIdAppointment);

// Mettre à jour un quote - uniquement pour un utilisateur avec le rôle 'manager'
router.put('/quotes/:id', verifyToken, verifyRole(['manager', 'client']), quoteController.updateQuote);

// Supprimer un quote - uniquement pour un utilisateur avec le rôle 'manager'
router.delete('/quotes/:id', verifyToken, verifyRole(['manager']), quoteController.deleteQuote);

module.exports = router;
