const nodemailer = require("nodemailer");

// Fonction pour envoyer un email
const sendEmail = async (req, res) => {
    const { to, subject, text } = req.body; // Récupérer les données du frontend
    try {
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587, // Port SMTP pour STARTTLS
            secure: false, // STARTTLS
            auth: {
                user: "randrianarisonnancy05@gmail.com", // Remplace par ton email
                pass: "hakz jhcv dxmg dzpe", // Remplacer par mdp application sur google
            },

            tls: {
                rejectUnauthorized: false, // Désactive la vérification du certificat
            },
        });

        let info = await transporter.sendMail({
            from: '"Carcare" <randrianarisonnancy05@gmail.com>',
            to, // Email du destinataire
            subject,
            text, // Contenu du mail en texte brut
            html: `<p>${text}</p>`, // Optionnel : format HTML
        });

        console.log("Email envoyé : ", info.messageId);
        res.status(200).json({ message: "Email envoyé avec succès !" });
    } catch (error) {
        console.error("Erreur complète :", error); // Afficher l'erreur complète
        res.status(500).json({ message: "Échec de l'envoi de l'email", error: error.message });
    }
}

module.exports = { sendEmail };