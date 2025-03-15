const Piece = require('../models/Piece');

// Créer une nouvelle piece
const createPiece = async (req, res) => {
    try {
        const { name, category, description, price, stock, createDate} = req.body;

        const newPiece = new Piece({
            name,
            category,
            description,
            price,
            stock,
            createDate
        });

        await newPiece.save();

        res.status(201).json({ message: "Piece créé avec succès", piece: newPiece });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la création de la piece", error: error.message });
    }
};

// Obtenir tous les pieces
const getAllPieces = async (req, res) => {
    try {
        const pieces = await Piece.find();
        res.status(200).json(pieces);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des pieces", error: error.message });
    }
};

// Obtenir une piece par son ID
const getPieceById = async (req, res) => {
    try {
        const piece = await Piece.findById(req.params.id);
        if (!piece) {
            return res.status(404).json({ message: "Piece non trouvé" });
        }
        res.status(200).json(piece);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération de la piece", error: error.message });
    }
};

// Mettre à jour une piece
const updatePiece= async (req, res) => {
    try {
        const { name, category, description, price, stock, createDate } = req.body;

        const updatedPiece = await Piece .findByIdAndUpdate(
            req.params.id,
            { name, category, description, price, stock, createDate },
            { new: true }  // Cette option retourne la piece mis à jour
        );

        if (!updatedPiece) {
            return res.status(404).json({ message: "Piece non trouvé" });
        }

        res.status(200).json({ message: "Piece mis à jour avec succès", piece: updatedPiece });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la mise à jour de la piece", error: error.message });
    }
};

// Supprimer une piece
const deletePiece = async (req, res) => {
    try {
        const deletedPiece = await Piece.findByIdAndDelete(req.params.id);
        if (!deletedPiece) {
            return res.status(404).json({ message: "Piece non trouvé" });
        }
        res.status(200).json({ message: "Piece supprimé avec succès" });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la suppression de la piece", error: error.message });
    }
};

module.exports = {
    createPiece,
    getAllPieces,
    getPieceById,
    updatePiece,
    deletePiece
};