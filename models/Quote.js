const mongoose = require('mongoose');

const quoteSchema = new mongoose.Schema({
    appointment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment',
        required: true
    },
    frais: {
        type: Number,
    },
    total: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['En attente', 'Validé', 'Annulé'],
        default: 'En attente'
    },
    validUntil: {
        type: Date,
        required: true
    }
}, { timestamps: true });

const Quote = mongoose.model('Quote', quoteSchema);

module.exports = Quote;
