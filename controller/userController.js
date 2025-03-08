const User = require('../models/User');
const bcrypt = require('bcryptjs');

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
        const {id} = req.params
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

const getUserById = async (req,res)=>{
    try {
        const {id} = req.params
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération de l'utilisateur", error: err });
    }
}

module.exports = { createUser, updateUser, deleteUser, getAllUsers ,getUserById};