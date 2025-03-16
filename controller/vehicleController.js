const Vehicle = require('../models/Vehicle');

// Ajouter un véhicule
const createVehicle = async (req, res) => {
    try {
        const vehicle = new Vehicle(req.body);
        await vehicle.save();
        res.status(201).json(vehicle);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Obtenir tous les véhicules
const getAllVehicles = async (req, res) => {
    try {
        const vehicles = await Vehicle.find().populate('owner', 'username email');

        // Ajouter le champ progress en fonction du status
        const vehiclesWithProgress = vehicles.map(vehicle => {
            return {
                ...vehicle.toObject(), // convertir le document Mongoose en objet JS
                progress: getProgressFromStatus(vehicle.status)
            };
        });

        res.status(200).json(vehiclesWithProgress);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Vehicle ME
const getAllVehiclesMe = async (req, res) => {
    try {
        const userId = req.query.user_id;

        const vehicles = await Vehicle.find({ owner: userId });

        // Ajouter le champ progress en fonction du status
        const vehiclesWithProgress = vehicles.map(vehicle => {
            return {
                ...vehicle.toObject(), // convertir le document Mongoose en objet JS
                progress: getProgressFromStatus(vehicle.status)
            };
        });

        res.status(200).json(vehiclesWithProgress);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtenir un véhicule par son ID
const getVehicleById = async (req, res) => {
    try {
        const vehicle = await Vehicle.findById(req.params.id).populate('owner', 'username email');
        if (!vehicle) return res.status(404).json({ message: 'Véhicule non trouvé' });
        res.status(200).json(vehicle);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Mettre à jour un véhicule
const updateVehicle = async (req, res) => {
    try {
        const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!vehicle) return res.status(404).json({ message: 'Véhicule non trouvé' });
        res.status(200).json(vehicle);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Supprimer un véhicule
const deleteVehicle = async (req, res) => {
    try {
        const vehicle = await Vehicle.findByIdAndDelete(req.params.id);
        if (!vehicle) return res.status(404).json({ message: 'Véhicule non trouvé' });
        res.status(200).json({ message: 'Véhicule supprimé avec succès' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

function getProgressFromStatus(status) {
    switch (status) {
        case 'Actif':
            return 'primary';
        case 'En réparation':
            return 'secondary';
        case 'Hors service':
            return 'error';
        default:
            return 'neutral'; // valeur par défaut
    }
}


module.exports = { createVehicle, getAllVehicles, getAllVehiclesMe, getAllVehiclesMe, getVehicleById, updateVehicle, deleteVehicle };
