import mongoose from 'mongoose';

export const generatedId = mongoose.Types.ObjectId().toHexString();
