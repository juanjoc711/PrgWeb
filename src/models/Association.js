import mongoose from 'mongoose';

const associationSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Usuario creador
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Usuarios miembros
}, { timestamps: true });

export default mongoose.model('Association', associationSchema);
