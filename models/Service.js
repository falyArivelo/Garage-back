const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    category: {
        type: String,
        enum: ['Réparation', 'Entretien', 'Diagnostic'],
        required: true
    },
    description: {
        type: String,
    },
    price: {
        type: Number,
        required: true
    },
    estimatedDuration: {
        type: Number,
    },
    availability: {
        type: Boolean,
        default: true
    },
    pieces: [
        { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Piece',
            required: true
        }
    ],
    image: {
        type: String,
        default: null
    }
}, {
    timestamps: true
});

const Service = mongoose.model('Service', serviceSchema);

module.exports = Service;
