const Appointment = require('../models/Appointment');

// Créer un rendez-vous
const createAppointment = async (req, res) => {
    try {
        const appointment = new Appointment(req.body);
        await appointment.save();
        res.status(201).json(appointment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Obtenir tous les rendez-vous
const getAllAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find().populate('client', 'username email').populate('vehicle', 'model brand');
        res.status(200).json(appointments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtenir les rendez-vous d'un client
const getAppointmentsByClient = async (req, res) => {
    try {
        const { clientId } = req.params;
        const appointments = await Appointment.find({ client: clientId }).populate('vehicle', 'model brand');
        if (!appointments) return res.status(404).json({ message: 'Aucun rendez-vous trouvé pour ce client' });
        res.status(200).json(appointments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtenir un rendez-vous par son ID
const getAppointmentById = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id)
            .populate('client', 'username email')
            .populate('vehicle', 'model brand')
            .populate('services', 'name description')
            .populate('invoice', 'amount status');
        if (!appointment) return res.status(404).json({ message: 'Rendez-vous non trouvé' });
        res.status(200).json(appointment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Mettre à jour un rendez-vous
const updateAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!appointment) return res.status(404).json({ message: 'Rendez-vous non trouvé' });
        res.status(200).json(appointment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Supprimer un rendez-vous
const deleteAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findByIdAndDelete(req.params.id);
        if (!appointment) return res.status(404).json({ message: 'Rendez-vous non trouvé' });
        res.status(200).json({ message: 'Rendez-vous supprimé avec succès' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createAppointment,
    getAllAppointments,
    getAppointmentsByClient,
    getAppointmentById,
    updateAppointment,
    deleteAppointment
};
