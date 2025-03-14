const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    appointment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment',
        required: true
    },
    services: [{
        service: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Service',
            required: true
        },
        price: {
            type: Number,
            required: true
        }
    }],
    totalAmount: {
        type: Number,
        required: true
    },
    payments: [{
        amount: {
            type: Number,
            required: true
        },
        method: {
            type: String,
            enum: ['Espèces', 'Carte bancaire', 'Virement', 'Mobile Money'],
            required: true
        },
        date: {
            type: Date,
            default: Date.now
        }
    }],
    status: {
        type: String,
        enum: ['En attente', 'Payé', 'Partiellement payé', 'Annulé'],
        default: 'En attente'
    }
}, { 
    timestamps: true 
});

// Calcul du montant total payé en fonction des paiements enregistrés
invoiceSchema.virtual('amountPaid').get(function () {
    return this.payments.reduce((sum, payment) => sum + payment.amount, 0);
});

// Mise à jour automatique du statut en fonction du montant payé
invoiceSchema.pre('save', function (next) {
    const totalPaid = this.payments.reduce((sum, payment) => sum + payment.amount, 0);
    if (totalPaid >= this.totalAmount) {
        this.status = 'Payé';
    } else if (totalPaid > 0) {
        this.status = 'Partiellement payé';
    } else {
        this.status = 'En attente';
    }
    next();
});

const Invoice = mongoose.model('Invoice', invoiceSchema);

module.exports = Invoice;
