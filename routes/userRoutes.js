const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs')
const User = require('../models/User')
const { verifyToken, verifyRole } = require('../middleware/auth');
const { createUser, updateUser, deleteUser, getAllUsers, getUserById } = require('../controller/userController');

const router = express.Router();

router.post('/signup', async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        // Vérification si l'utilisateur existe déjà
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ message: 'Cet email est déjà utilisé.' });
        }

        // Creation d'un nouvel utilisateur
        const newUser = new User({
            username,
            email,
            password,
            role,
        })

        await newUser.save()
        res.status(201).json({
            message: 'Utilisateur créé avec succès.',
            user: { username: newUser.username, email: newUser.email, role: newUser.role }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la création de l\'utilisateur.' });
    }
});

// Route pour se connecter
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).json({ message: 'Utilisateur non trouvé.' })
    }

    const isPasswordValid = await user.isValidPassword(password)
    if (!isPasswordValid) {
        return res.status(400).json({ message: 'Mot de passe invalide.' });
    }

    // Créer un JWT
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({
        username: user.username,
        email: user.email,
        role: user.role,
        token: token
    })
})

// Route pour obtenir tous les utilisateurs (accessible uniquement par les manager)
router.get('/users', verifyToken, verifyRole(['manager']), async (req, res) => {
    try {
        // Récupérer tous les utilisateurs depuis la base de données
        const users = await User.find();

        // Retourner la liste des utilisateurs
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: 'Erreur serveur', error: err });
    }
});

//Créer un utilisateur (Manager seulement)
router.post('/users', verifyToken, verifyRole(['manager']), createUser);

// Route pour récupérer un utilisateur spécifique (par ID)
router.get('/users/:id', verifyToken, verifyRole(['mecanicien', 'manager']), getUserById);


// Modifier un utilisateur (Manager seulement)
router.put('/users/:id', verifyToken, verifyRole(['manager']), updateUser);

// Supprimer un utilisateur (Manager seulement)
router.delete('/users/:id', verifyToken, verifyRole(['manager']), deleteUser);

// Route protégée accessible uniquement par un client
router.get('/client-data', verifyToken, verifyRole(['client', 'mecanicien', 'manager']), getAllUsers);

// Route protégée accessible uniquement par un manager
router.get('/manager-data', verifyToken, verifyRole(['manager']), (req, res) => {
    res.json({ message: 'Accès autorisé aux données du manager.' });
});

// Route protégée accessible uniquement par un mécanicien
router.get('/mecanicien-data', verifyToken, verifyRole(['mecanicien', 'manager']), (req, res) => {
    res.json({ message: 'Accès autorisé aux données du mécanicien.' });
});


module.exports = router;