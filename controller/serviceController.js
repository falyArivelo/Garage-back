const Service = require('../models/Service');

// Créer un nouveau service
const createService = async (req, res) => {
    try {
        const { name, description, price, estimatedDuration, category, availability, image } = req.body;

        const newService = new Service({
            name,
            description,
            price,
            estimatedDuration,
            category,
            availability,
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
        const services = await Service.find();
        res.status(200).json(services);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des services", error: error.message });
    }
};

// Obtenir un service par son ID
const getServiceById = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);
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
        const { name, description, price, estimatedDuration, category, availability, image } = req.body;

        const updatedService = await Service.findByIdAndUpdate(
            req.params.id,
            { name, description, price, estimatedDuration, category, availability, image },
            { new: true }  // Cette option retourne le service mis à jour
        );

        if (!updatedService) {
            return res.status(404).json({ message: "Service non trouvé" });
        }

        res.status(200).json({ message: "Service mis à jour avec succès", service: updatedService });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la mise à jour du service", error: error.message });
    }
};

// Supprimer un service
const deleteService = async (req, res) => {
    try {
        const deletedService = await Service.findByIdAndDelete(req.params.id);
        if (!deletedService) {
            return res.status(404).json({ message: "Service non trouvé" });
        }
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
