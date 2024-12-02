import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    association: { type: mongoose.Schema.Types.ObjectId, ref: 'Association', required: true },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Message', messageSchema);
