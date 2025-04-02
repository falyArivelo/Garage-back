// Fonction pour générer le message d'email
const generateTaskEmailMessage = (appointment, service, mechanic, scheduledDateTime, endDateTime) => {
    const clientName = appointment.client.username;  // Nom du client
    const vehicleBrand = appointment.vehicle.brand;  // Marque du véhicule
    const vehicleModel = appointment.vehicle.model;  // Modèle du véhicule
    const serviceName = service.name;  // Nom du service

    // Calculer la date de fin
    const appointmentEndDate = new Date(endDateTime);

    // Construire le message à envoyer au mécanicien
    const statusMessage = `
        <p>Bonjour ${mechanic.username},</p>
        <p>Vous avez été assigné à une nouvelle tâche pour le rendez-vous avec le client <strong>${clientName}</strong>.</p>
        <p><strong>Détails de la tâche :</strong></p>
        <ul>
            <li><strong>Véhicule :</strong> ${vehicleBrand} ${vehicleModel}</li>
            <li><strong>Service :</strong> ${serviceName}</li>
            <li><strong>Date de début :</strong> ${new Date(scheduledDateTime).toLocaleString()}</li>
            <li><strong>Date de fin estimée :</strong> ${appointmentEndDate.toLocaleString()}</li>
        </ul>
        <p>Merci de vous occuper de cette tâche avec diligence.</p>
    `;
    
    return statusMessage;
};