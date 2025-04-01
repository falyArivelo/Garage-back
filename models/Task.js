const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    appointment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment',
        required: true
    },
    service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
        required: true
    },
    mechanic: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    scheduledDateTime: {
        type: Date,
        required: true
    },
    duration: {  // Durée en minutes
        type: Number,
        required: true
    },
    endDateTime: {  // Calcul automatique
        type: Date
    },
    status: {
        type: String,
        enum: ['En attente', 'En cours', 'Terminé', 'Annulé'],
        default: 'En attente'
    },
    isDone: {  // Terminé ou non
        type: Boolean,
        default: false
    },
    notes: [{
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        message: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }]
}, { timestamps: true });

// Calcul de `endDateTime` avant sauvegarde
taskSchema.pre('save', function(next) {
    if (this.scheduledDateTime && this.duration) {
        this.endDateTime = new Date(this.scheduledDateTime.getTime() + this.duration * 60000);
    }
    next();
});

module.exports = mongoose.model('Task', taskSchema);
