import mongoose from 'mongoose';

// An interface that describes the properties
// that are required to create a new User
interface ConfirmationHashAttrs {
  expireAt?: Date;
  user: object;
}

// An interface that describes the properties
// that a User Model has
interface ConfirmationHashModel extends mongoose.Model<ConfirmationHashDoc> {
  build(attrs: ConfirmationHashAttrs): ConfirmationHashDoc;
}

// An interface that describes the properties
// that a single User Document has
interface ConfirmationHashDoc extends mongoose.Document {
  expireAt: Date;
  user: object;
}

const ConfirmationHashSchema = new mongoose.Schema({
  expireAt: {
    type: Date,
    default: Date.now,
    index: { expires: '1d' },
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

// Add build method to a UserSchema
ConfirmationHashSchema.statics.build = (attrs: ConfirmationHashAttrs) => {
  return new ConfirmationHash(attrs);
};

const ConfirmationHash = mongoose.model<
  ConfirmationHashDoc,
  ConfirmationHashModel
>('ConfirmationHash', ConfirmationHashSchema);

export { ConfirmationHash };
