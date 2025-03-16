const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    model: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    licensePlate: {
        type: String,
        required: true,
        unique: true
    },
    color: {
        type: String
    },
    fuelType: {
        type: String,
        enum: ['Essence', 'Diesel', 'Électrique', 'Hybride'],
        required: true
    },
    mileage: {
        type: Number
    },
    status: {
        type: String,
        enum: ['Actif', 'En réparation', 'Hors service'],
        default: 'Actif'
    }
}, {
    timestamps: true
});

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

module.exports = Vehicle;
