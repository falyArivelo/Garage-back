const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['client', 'mecanicien', 'manager'], default: 'client' }
});

// Middleware pour hacher le mot de passe avant d'enregistrer l'utilisateur
userSchema.pre('save',async function(next){
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password,8);
})

// Méthode pour vérifier le mot de passe
userSchema.methods.isValidPassword = async function (password){
    return bcrypt.compare(password,this.password)
}

const User = mongoose.model('User',userSchema);
module.exports = User
