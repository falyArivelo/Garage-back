const Task = require('../models/Task');
const Appointment = require('../models/Appointment');
const User = require('../models/User');
const Service = require('../models/Service');

// 📌 Créer une nouvelle tâche
const createTask = async (req, res) => {
    try {
        const { appointmentId, serviceId, mechanicId, scheduledDateTime, duration } = req.body;

        // Vérifier si l'appointment existe
        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) return res.status(404).json({ message: "Appointment non trouvé" });

        // Vérifier si le service existe
        const service = await Service.findById(serviceId);
        if (!service) return res.status(404).json({ message: "Service non trouvé" });

        // Vérifier si le mécanicien existe et a le bon rôle
        const mechanic = await User.findById(mechanicId);
        if (!mechanic || mechanic.role !== 'mecanicien') {
            return res.status(400).json({ message: "Mécanicien non trouvé ou rôle invalide" });
        }

        // Calculer l'heure de fin
        const endDateTime = new Date(new Date(scheduledDateTime).getTime() + duration * 60000);

        // Créer la tâche
        const newTask = new Task({
            appointment: appointmentId,
            service: serviceId,
            mechanic: mechanicId,
            scheduledDateTime,
            duration,
            endDateTime,
            status: 'En attente',
            isDone: false
        });

        await newTask.save();

        // Ajouter la tâche à l'appointment
        appointment.tasks.push(newTask._id);
        await appointment.save();

        res.status(201).json({ message: "Tâche créée avec succès", newTask });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 📌 Récupérer toutes les tâches
const getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find().populate('appointment service mechanic');
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 📌 Récupérer une tâche par ID
const getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id).populate('appointment service mechanic');
        if (!task) return res.status(404).json({ message: "Tâche non trouvée" });

        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 📌 Mettre à jour une tâche
const updateTask = async (req, res) => {
    try {
        const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

        if (!updatedTask) return res.status(404).json({ message: "Tâche non trouvée" });

        res.status(200).json(updatedTask);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 📌 Marquer une tâche comme terminée
const markTaskAsDone = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) return res.status(404).json({ message: "Tâche non trouvée" });

        task.isDone = true;
        task.status = 'Terminé';

        await task.save();

        res.status(200).json({ message: "Tâche terminée avec succès", task });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 📌 Supprimer une tâche
const deleteTask = async (req, res) => {
    try {
        const deletedTask = await Task.findByIdAndDelete(req.params.id);

        if (!deletedTask) return res.status(404).json({ message: "Tâche non trouvée" });

        res.status(200).json({ message: "Tâche supprimée avec succès" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Exporter les fonctions
module.exports = {
    createTask,
    getAllTasks,
    getTaskById,
    updateTask,
    markTaskAsDone,
    deleteTask
};
