const Appointment = require('../models/Appointment');
const { isAppointmentSlotAvailable } = require('../helpers/appointmentHelper')
// Créer un rendez-vous
const createAppointment = async (req, res) => {
    try {

        // const appointmentData = req.body;
        const appointment = new Appointment(req.body);

        // Vérifier si le créneau est disponible
        // const isAvailable = await isAppointmentSlotAvailable(appointment);

        // if (!isAvailable) {
        //     return res.status(409).json({ message: "Aucun créneau disponible pour cette date et heure." });
        // }

        // const appointment = new Appointment(req.body);

        await appointment.save();
        res.status(201).json({
            success: true,
            message: "Votre rendez-vous a bien été pris en compte. Vous recevrez un email de confirmation sous peu.",
            appointment,
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Obtenir tous les rendez-vous
const getAllAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find()
            .populate('client', 'username email')
            .populate('vehicle', 'model brand')
            .populate('services', 'name category price')
            .sort({ appointmentDate: -1 });

    
        // Ajouter un champ totalEstimatedPrice pour chaque rendez-vous
        const appointmentsWithTotalPrice = appointments.map(appointment => {
            // Calculer le prix total estimé en sommant les prix des services
            const totalEstimatedPrice = appointment.services.reduce((total, service) => {
                return total + service.price;
            }, 0);

            // Ajouter totalEstimatedPrice au rendez-vous
            return {
                ...appointment.toObject(),
                totalEstimatedPrice
            };
        });

        res.status(200).json(appointmentsWithTotalPrice);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtenir les rendez-vous d'un client
const getAppointmentsByClient = async (req, res) => {
    try {
        const userId = req.query.user_id;
        const appointments = await Appointment.find({ client: userId })
            .populate('vehicle')
            .populate({
                path: 'services', // Récupère les services
                populate: {
                    path: 'pieces', // Récupère les pièces associées à chaque service
                }
            })
            .sort({ appointmentDate: -1 });

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
            .populate('vehicle')
            .populate({
                path: 'services', // Récupère les services
                populate: {
                    path: 'pieces', // Récupère les pièces associées à chaque service
                }
            })
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

        // Supprimer l'association de l'appointment avec les services (si l'appointment contient des services)
        // if (appointment.services && appointment.services.length > 0) {
        //     await Service.updateMany(
        //         { _id: { $in: appointment.services } }, // Trouve toutes les services liées au services
        //         { $pull: { appointment: appointment._id } } // Retire l'ID de l'appointment de la liste des appointments associés
        //     );
        // }

        // Supprimer le rendez-vous
        await appointment.remove();

        res.status(200).json({ message: 'Rendez-vous supprimé avec succès' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Annulé  un rendez-vous
const cancelAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findByIdAndUpdate(
            req.params.id,
            { status: "Annulé" },
            { new: true, runValidators: true }
        );

        if (!appointment) {
            return res.status(404).json({ message: 'Rendez-vous non trouvé' });
        }

        res.status(200).json(appointment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const changingStatusAppointmentByManager = async (req, res) => {
    try {
        const { status, message, userId } = req.body; // Récupère le statut, message et l'ID de l'auteur

        // Trouver le rendez-vous par ID et mettre à jour
        const appointment = await Appointment.findByIdAndUpdate(
            req.params.id,
            { 
                status: status, // Mettre à jour le statut
                $push: {  // Ajouter un message dans les notes
                    notes: {
                        author: userId,  // L'auteur du message
                        message: message  // Le message
                    }
                }
            },
            { new: true, runValidators: true }
        );

        // Si le rendez-vous n'existe pas
        if (!appointment) return res.status(404).json({ message: 'Rendez-vous non trouvé' });

        // Retourne le rendez-vous mis à jour
        res.status(200).json(appointment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    createAppointment,
    getAllAppointments,
    getAppointmentsByClient,
    getAppointmentById,
    updateAppointment,
    deleteAppointment,
    cancelAppointment,
    changingStatusAppointmentByManager
};
