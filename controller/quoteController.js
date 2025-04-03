const Quote = require('../models/Quote');

// Créer un nouvel devis
createQuote = async (req, res) => {
    try {
        const newQuote = new Quote(req.body);
        await newQuote.save();
        res.status(201).json({newQuote});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtenir tous les devis
getAllQuotes = async (req, res) => {
    try {
        const quotes = await Quote.find();
        res.status(200).json(quotes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtenir un devis par son ID
getQuoteById = async (req, res) => {
    try {
        const quote = await Quote.findById(req.params.id);
        if (!quote) {
            return res.status(404).json({ message: "Quote non trouvé" });
        }
        res.status(200).json(quote);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtenir un quote par idAppointment
const getQuoteByIdAppointment = async (req, res) => {
    try {
        const { appointmentId } = req.params;
        const quote = await Quote.findOne({ appointmentId }).populate({
            path: 'appointment',
            populate: [
                { path: 'client' },    // Peupler le client
                { path: 'vehicle' },   // Peupler le véhicule
                { path: 'services' },  // Peupler les services
                { path: 'services.pieces' } // Peupler les pièces dans les services
            ]
        });

        if (quote) {
            return res.json(quote);
        }
        return res.status(404).json({ message: "Aucun devis trouvé pour ce rendez-vous." });
    } catch (error) {
        return res.status(500).json({ message: "Erreur serveur", error });
    }
};

// Mettre à jour un devis
updateQuote = async (req, res) => {
    try {
        const quote =  await Quote.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!quote) {
            return res.status(404).json({ message: "Quote non trouvé" });
        }
        res.status(200).json(quote);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Supprimer un devis
deleteQuote = async (req, res) => {
    try {
        const deletedQuote = await Quote.findByIdAndDelete(req.params.id);
        if (!deletedQuote) {
            return res.status(404).json({ message: "Quote non trouvé" });
        }
        res.status(200).json({ message: "Quote supprimé avec succès" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createQuote,
    getAllQuotes,
    getQuoteById,
    getQuoteByIdAppointment,
    updateQuote,
    deleteQuote
};