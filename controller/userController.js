const User = require('../models/User');
const bcrypt = require('bcryptjs');
const sharp = require('sharp');

const createUser = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        if (!['mecanicien', 'client'].includes(role)) {
            return res.status(400).json({ message: 'Rôle invalide' })
        }

        const newUser = new User({
            username,
            email,
            password,
            role,
        })
        await newUser.save();

        res.status(201).json({
            message: 'Utilisateur créé avec succès',
            user: { username: newUser.username, email: newUser.email, role: newUser.role }
        });
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error });
    }
}

const updateUser = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        const { id } = req.params

        const user = await User.findOne({ id })
        if (!user) return res.status(404).json({ message: 'Utilisateur introuvable' })

        if (username) user.username = username;
        if (email) user.email = email
        if (password) user.password = await bcrypt.hash(password, 8)

        if (role && ['mecanicien', 'client'].includes(role)) user.role = role;

        await user.save();
        res.status(200).json({ message: 'Utilisateur mis à jour', user });

    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error });
    }
}

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params
        const user = await User.findByIdAndDelete(id)
        if (!user) return res.status(404).json({ message: 'Utilisateur introuvable' });

        res.status(200).json({ message: 'Utilisateur supprimé' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error });
    }
}

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error });
    }
};

const getUserById = async (req, res) => {
    try {
        const { id } = req.params
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération de l'utilisateur", error: error });
    }
}

const getClients = async (req, res) => {
    try {
        const clients = await User.find({ role: 'client' });
        res.status(200).json(clients);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const getMechanics = async (req, res) => {
    try {
        const clients = await User.find({ role: 'mecanicien' });
        res.status(200).json(clients);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Route pour l'upload de l'image
const uploadUserImage = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!req.file) {
            return res.status(400).json({ message: 'Aucune image envoyée' });
        }

        // Trouver l'utilisateur par ID
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        // Compresser l'image avec sharp
        const compressedImage = await sharp(req.file.buffer)
            .resize(800) // Taille de l'image (facultatif)
            .webp({ quality: 70 }) // Compression en WebP (facultatif, change si nécessaire)
            .toBuffer(); // Convertit l'image compressée en buffer

        // Mettre à jour l'image de l'utilisateur
        user.image = compressedImage;
        await user.save();

        res.status(200).json({ message: 'Image mise à jour avec succès', user });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Route pour récupérer l'image de l'utilisateur
const getUserImage = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId);

        if (!user || !user.image) {
            return res.status(404).json({ message: 'Image non trouvée' });
        }

        res.set('Content-Type', 'image/jpeg');
        res.send(user.image); // Envoie l'image stockée sous forme binaire
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { createUser, updateUser, deleteUser, getAllUsers, getUserById, getClients, getMechanics, uploadUserImage, getUserImage };