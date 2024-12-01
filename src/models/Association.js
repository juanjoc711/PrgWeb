const mongoose = require('mongoose');

const associationSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Usuario creador
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Usuarios miembros
}, { timestamps: true });

module.exports = mongoose.model('Association', associationSchema);
