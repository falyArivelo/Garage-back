const jwt = require('jsonwebtoken');

// Verification validité le JWT Token
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(403).json({ message: 'Accès refusé. Aucun token fourni.' })
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Token invalide' });

        }
        req.userId = decoded.id;
        req.role = decoded.role;
        next();
    })
}

// Fonction pour vérifier les rôles (middleware)
const verifyRole = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.role)) {
            return res.status(403).json({ message: 'Accès interdit. Vous n\'avez pas les droits nécessaires.' })
        }
        next()
    }
}

module.exports = { verifyToken, verifyRole };
