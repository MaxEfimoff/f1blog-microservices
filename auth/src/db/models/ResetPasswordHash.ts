import mongoose from 'mongoose';

// An interface that describes the properties
// that are required to create a new User
interface ResetPasswordHashAttrs {
  expireAt?: Date;
  user: object;
}

// An interface that describes the properties
// that a User Model has
interface ResetPasswordHashModel extends mongoose.Model<ResetPasswordHashDoc> {
  build(attrs: ResetPasswordHashAttrs): ResetPasswordHashDoc;
}

// An interface that describes the properties
// that a single User Document has
interface ResetPasswordHashDoc extends mongoose.Document {
  expireAt: Date;
  user: object;
}

const ResetPasswordHashSchema = new mongoose.Schema({
  expireAt: {
    type: Date,
    default: Date.now,
    index: { expires: '1d' },
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
  },
});

// Add build method to a UserSchema
ResetPasswordHashSchema.statics.build = (attrs: ResetPasswordHashAttrs) => {
  return new ResetPasswordHash(attrs);
};

const ResetPasswordHash = mongoose.model<
  ResetPasswordHashDoc,
  ResetPasswordHashModel
>('ResetPasswordHash', ResetPasswordHashSchema);

export { ResetPasswordHash };
