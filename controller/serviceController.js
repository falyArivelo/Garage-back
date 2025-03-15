const Service = require('../models/Service');
const Piece = require('../models/Piece');

// Créer un nouveau service
const createService = async (req, res) => {
    try {
        const { name, category, description, price, estimatedDuration, availability, pieces, image } = req.body;

        // Vérifier si les pièces existent
        const existingPieces = await Piece.find({ _id: { $in: pieces } });
        if (existingPieces.length !== pieces.length) {
            return res.status(400).json({ error: 'Pièces invalides.' });
        }

        const newService = new Service({
            name,
            category,
            description,
            price,
            estimatedDuration,
            availability,
            pieces,
            image
        });

        await newService.save();

        res.status(201).json({ message: "Service créé avec succès", service: newService });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la création du service", error: error.message });
    }
};

// Obtenir tous les services
const getAllServices = async (req, res) => {
    try {
        const services = await Service.find().populate('pieces');// Récupère les détails des pièces
        res.status(200).json(services);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des services", error: error.message });
    }
};

// Obtenir un service par son ID
const getServiceById = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id).populate('pieces');// Récupère les détails des pièces
        if (!service) {
            return res.status(404).json({ message: "Service non trouvé" });
        }
        res.status(200).json(service);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération du service", error: error.message });
    }
};

// Mettre à jour un service
const updateService = async (req, res) => {
    try {
        const { name, category, description, price, estimatedDuration, availability, pieces, image } = req.body;

        // Vérifier si des pièces sont fournies et valides
        if (pieces) {
            const existingPieces = await Piece.find({ _id: { $in: pieces } });
            if (existingPieces.length !== pieces.length) {
                return res.status(400).json({ message: "Une ou plusieurs pièces sont invalides." });
            }
        }

        const updatedService = await Service.findByIdAndUpdate(
            req.params.id,
            { name, category, description, price, estimatedDuration, availability, pieces, image },
            { new: true }  
        ).populate('pieces');

        if (!updatedService) {
            return res.status(404).json({ message: "Service non trouvé" });
        }

        res.status(200).json({ message: "Service mis à jour avec succès", service: updatedService });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la mise à jour du service", error: error.message });
    }
};

// Supprimer un service associer a tous les pieces
const deleteService = async (req, res) => {
    try {
        // Vérifier si le service existe
        const service = await Service.findById(req.params.id);
        if (!service) {
            return res.status(404).json({ message: "Service non trouvé" });
        }

        // Supprimer l'association du service avec les pièces (si le service contient des pièces)
        if (service.pieces && service.pieces.length > 0) {
            await Piece.updateMany(
                { _id: { $in: service.pieces } }, // Trouve toutes les pièces liées au service
                { $pull: { services: service._id } } // Retire l'ID du service de la liste des services associés
            );
        }

        // Supprimer le service
        await Service.findByIdAndDelete(req.params.id);
        const deletedService = await Service.findByIdAndDelete(req.params.id);
       
        res.status(200).json({ message: "Service supprimé avec succès" });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la suppression du service", error: error.message });
    }
};

module.exports = {
    createService,
    getAllServices,
    getServiceById,
    updateService,
    deleteService
};
