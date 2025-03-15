const mongoose = require('mongoose');

const pieceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    category: {
        type: String,
        enum: ['Moteur', 'Système de freinage', 'Electrique et Electronique', 'Echappement'],
        required: true
    },
    description: {
        type: String,
    },
    price: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    createDate: {
        type: Date,
        required: true
    }
})

const Piece = mongoose.model('Piece', pieceSchema);

module.exports = Piece;