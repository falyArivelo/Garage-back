const Piece = require('../models/Piece');

// Créer une nouvelle piece
createPiece = async (req, res) => {
    try {
        const piece = new Piece(req.body);
        await piece.save();
        res.status(201).json({piece});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtenir tous les pieces
getAllPieces = async (req, res) => {
    try {
        const pieces = await Piece.find();
        res.status(200).json(pieces);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtenir une piece par son ID
getPieceById = async (req, res) => {
    try {
        const piece = await Piece.findById(req.params.id);
        if (!piece) {
            return res.status(404).json({ message: "Piece non trouvé" });
        }
        res.status(200).json(piece);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Recherche une pièce par son nom
getPieceByName = async (req, res) => {
    try {
      const piece = await Piece.findOne({ name: req.params.name });
  
      if (!piece) {
        return res.status(404).json(null);
      }
  
      res.json(piece);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur", error });
    }
};

// Mettre à jour une piece
updatePiece= async (req, res) => {
    try {
        const piece =  await Piece.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!piece) {
            return res.status(404).json({ message: "Piece non trouvé" });
        }
        res.status(200).json(piece);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Supprimer une piece
deletePiece = async (req, res) => {
    try {
        const deletedPiece = await Piece.findByIdAndDelete(req.params.id);
        if (!deletedPiece) {
            return res.status(404).json({ message: "Piece non trouvé" });
        }
        res.status(200).json({ message: "Piece supprimé avec succès" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createPiece,
    getAllPieces,
    getPieceById,
    getPieceByName,
    updatePiece,
    deletePiece
};