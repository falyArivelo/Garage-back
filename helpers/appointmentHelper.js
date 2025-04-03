const Service = require('../models/Service'); // importe ton modèle Service
const Appointment = require('../models/Appointment');
const { countMechanics } = require('../helpers/userHelper')

const isAppointmentSlotAvailable = async (appointment) => {
    try {
        // 1. Récupérer la durée totale des services
        const services = await Service.find({ _id: { $in: appointment.services } });
        const totalDuration = services.reduce((sum, s) => sum + s.duration, 0); // durée en minutes

        const startDate = new Date("2025-04-10T10:00:00.000Z");
        const endDate = new Date(startDate.getTime() + totalDuration * 60000);

        // 2. Récupérer les RDVs qui se chevauchent avec ce créneau
        const overlappingAppointments = await Appointment.find({
            appointmentDate: {
                $lt: endDate, // commence avant la fin du nouveau rdv
            },
            $expr: {
                $gt: [
                    { $add: ['$appointmentDate', { $multiply: [totalDuration, 60000] }] },
                    startDate,
                ],
            },
            // status: { $in: ['Confirmé', 'En cours'] } // ne prendre que les RDVs actifs
        });

        
        const totalMechanics = countMechanics();
        // 3. Vérifier si moins de 4 RDVs en même temps
        return overlappingAppointments.length < totalMechanics;

    } catch (error) {
        console.error('Erreur lors de la vérification de créneau :', error);
        return false;
    }
};

module.exports = {
    isAppointmentSlotAvailable
};