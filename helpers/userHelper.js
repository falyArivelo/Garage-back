const User = require("../models/User")

const countMechanics = async () => {
    try {
      const count = await User.countDocuments({ role: 'mecanicien' });
      return count;
    } catch (error) {
      console.error('Erreur lors du comptage des mécaniciens :', error);
      throw error;
    }
  };
  
  module.exports = {
    countMechanics,
  };