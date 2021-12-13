import * as mongoose from 'mongoose';

export const generatedId = new mongoose.Types.ObjectId().toString();
