require('dotenv').config();
const express = require('express')
const mongoose = require('mongoose');
const cors = require('cors')


const app = express()
const PORT = process.env.PORT || 5000

// Middleware 
app.use(cors());
app.use(express.json());

// Connexion à MongoDB 
mongoose.connect(process.env.MONGO_URI).then(() => console.log("MongoDB connecté"))
    .catch(err => console.log(err));

// Routes 
app.use('/', require('./routes/userRoutes'));
app.use('/', require('./routes/serviceRoutes'));

app.listen(PORT, () => console.log(`Serveur démarré sur le port 
${PORT}`));